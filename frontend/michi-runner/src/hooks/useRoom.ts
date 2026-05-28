import { useCallback, useRef } from "react";
import { MODE_CONFIG } from "../constants/runner";
import { supabase } from "../lib/supabase";
import type {
  FinishGameParams,
  GameMode,
  GameType,
  LeaderboardEntry,
  PlayerState,
  RoomState,
} from "../types/game";

interface DbPlayerRow {
  id: string;
  room_id: string;
  player_name: string;
  balance: number;
  happiness: number;
  choices: string[];
  is_ready: boolean;
  finished_at: string | null;
  last_ping: string;
}

function toPlayerState(row: DbPlayerRow): PlayerState {
  return {
    id: row.id,
    room_id: row.room_id,
    player_name: row.player_name,
    balance: row.balance,
    happiness: row.happiness,
    choices: row.choices ?? [],
    is_ready: row.is_ready,
    finished_at: row.finished_at,
    last_ping: row.last_ping,
  };
}

function generateRoomCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

interface DbRoomRow {
  id: string;
  code: string | null;
  mode: string;
  status: string;
  players_ready: number;
  game_starts_at: string | null;
  created_at: string;
}

function toRoomState(row: DbRoomRow): RoomState {
  return {
    id: row.id,
    code: row.code,
    mode: row.mode as GameMode,
    status: row.status as RoomState["status"],
    players_ready: row.players_ready,
    game_starts_at: row.game_starts_at,
    created_at: row.created_at,
  };
}

export function useRoom() {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const gameStartChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const scoresSavedRef = useRef(false);

  const createSingleRoom = useCallback(async (mode: GameMode, playerName: string) => {
    const initialBalance = MODE_CONFIG[mode].initialBalance;

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ mode, game_type: "single", status: "playing", code: null })
      .select("id")
      .single();

    if (roomError || !room) {
      throw new Error(roomError?.message ?? "No se pudo crear la partida");
    }

    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        room_id: room.id,
        player_name: playerName,
        balance: initialBalance,
        happiness: 50,
        choices: [],
        is_ready: false,
      })
      .select("id")
      .single();

    if (playerError || !player) {
      throw new Error(playerError?.message ?? "No se pudo crear el jugador");
    }

    return { roomId: room.id as string, playerId: player.id as string };
  }, []);

  const createRoom = useCallback(async (mode: GameMode, playerName: string) => {
    const code = generateRoomCode();
    const initialBalance = MODE_CONFIG[mode].initialBalance;

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ code, mode, game_type: "multi", status: "waiting" })
      .select("id")
      .single();

    if (roomError || !room) {
      throw new Error(roomError?.message ?? "No se pudo crear la sala");
    }

    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        room_id: room.id,
        player_name: playerName,
        balance: initialBalance,
        happiness: 50,
        choices: [],
        is_ready: false,
      })
      .select("id")
      .single();

    if (playerError || !player) {
      throw new Error(playerError?.message ?? "No se pudo crear el jugador");
    }

    return { roomCode: code, playerId: player.id as string, roomId: room.id as string };
  }, []);

  const joinRoom = useCallback(
    async (code: string, playerName: string): Promise<{ roomId: string; playerId: string }> => {
      const normalizedCode = code.trim().toUpperCase();
      if (normalizedCode.length !== 4 || !/^\d{4}$/.test(normalizedCode)) {
        throw new Error("room_not_found");
      }

      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", normalizedCode)
        .single();

      if (roomError || !room) {
        throw new Error("room_not_found");
      }

      if (room.status === "finished") {
        throw new Error("room_finished");
      }

      if (room.status === "playing") {
        throw new Error("room_playing");
      }

      const { count, error: countError } = await supabase
        .from("players")
        .select("id", { count: "exact", head: true })
        .eq("room_id", room.id);

      if (countError) {
        throw new Error("unknown_error");
      }

      if ((count ?? 0) >= 2) {
        throw new Error("room_full");
      }

      const mode = room.mode as GameMode;
      const initialBalance = MODE_CONFIG[mode].initialBalance;

      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({
          room_id: room.id,
          player_name: playerName.trim() || "Jugador 2",
          balance: initialBalance,
          happiness: 50,
          choices: [],
          is_ready: false,
          last_ping: new Date().toISOString(),
        })
        .select()
        .single();

      if (playerError || !player) {
        throw new Error("unknown_error");
      }

      return {
        roomId: room.id as string,
        playerId: player.id as string,
      };
    },
    [],
  );

  const subscribeToRoom = useCallback(
    (
      roomId: string,
      playerId: string,
      onRivalUpdate: (p: PlayerState) => void,
      onSubscribed?: () => void,
    ) => {
      const channelName = `rival:${roomId}`;

      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "players",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            const row = payload.new as DbPlayerRow;
            if (row.id === playerId) {
              return;
            }
            onRivalUpdate(toPlayerState(row));
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            onSubscribed?.();
          }
          if (status === "CHANNEL_ERROR") {
            console.error("Realtime channel error:", channelName);
          }
          if (status === "TIMED_OUT") {
            console.warn("Realtime channel timed out:", channelName);
          }
        });

      channelRef.current = channel;

      return () => {
        void supabase.removeChannel(channel);
        channelRef.current = null;
      };
    },
    [],
  );

  const getRivalInitialState = useCallback(
    async (roomId: string, myPlayerId: string): Promise<PlayerState | null> => {
      const { data } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomId)
        .neq("id", myPlayerId)
        .single();

      if (!data) {
        return null;
      }
      return toPlayerState(data as DbPlayerRow);
    },
    [],
  );

  const fetchRival = useCallback(async (roomId: string, myPlayerId: string) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", roomId)
      .neq("id", myPlayerId)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return toPlayerState(data as DbPlayerRow);
  }, []);

  const updateMyState = useCallback(async (playerId: string, patch: Partial<PlayerState>) => {
    const { error } = await supabase.from("players").update(patch).eq("id", playerId);
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const finishGame = useCallback(async (params: FinishGameParams): Promise<void> => {
    if (scoresSavedRef.current) {
      return;
    }
    scoresSavedRef.current = true;

    await supabase
      .from("players")
      .update({ finished_at: new Date().toISOString() })
      .eq("id", params.playerId);

    if (params.gameType === "single") {
      await supabase.from("rooms").update({ status: "finished" }).eq("id", params.roomId);
    } else {
      const { data: players } = await supabase
        .from("players")
        .select("finished_at")
        .eq("room_id", params.roomId);

      const allFinished = players?.every((p) => p.finished_at !== null) ?? false;

      if (allFinished) {
        await supabase.from("rooms").update({ status: "finished" }).eq("id", params.roomId);
      }
    }

    const { error } = await supabase.rpc("save_final_score", {
      p_player_name: params.playerName,
      p_mode: params.mode,
      p_game_type: params.gameType,
      p_final_balance: params.finalBalance,
      p_michi_level: params.michiLevel,
      p_choices: params.choices,
    });

    if (error) {
      console.error("Error saving score:", error);
    }
  }, []);

  const resetScoreSaved = useCallback(() => {
    scoresSavedRef.current = false;
  }, []);

  const markReady = useCallback(async (playerId: string, roomId: string): Promise<RoomState | null> => {
    const { error: playerError } = await supabase
      .from("players")
      .update({ is_ready: true })
      .eq("id", playerId);

    if (playerError) {
      throw new Error(playerError.message);
    }

    const { data: roomRow, error: fetchError } = await supabase
      .from("rooms")
      .select("players_ready")
      .eq("id", roomId)
      .single();

    if (fetchError || !roomRow) {
      throw new Error(fetchError?.message ?? "Sala no encontrada");
    }

    const nextReady = (roomRow.players_ready ?? 0) + 1;

    const { error: incError } = await supabase
      .from("rooms")
      .update({ players_ready: nextReady })
      .eq("id", roomId);

    if (incError) {
      throw new Error(incError.message);
    }

    if (nextReady >= 2) {
      const gameStartsAt = new Date(Date.now() + 4000).toISOString();

      const { error: startError } = await supabase
        .from("rooms")
        .update({ game_starts_at: gameStartsAt, status: "playing" })
        .eq("id", roomId);

      if (startError) {
        throw new Error(startError.message);
      }

      const { data: updated, error: selectError } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (selectError || !updated) {
        return null;
      }

      return toRoomState(updated as DbRoomRow);
    }

    const { data: current, error: selectError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (selectError || !current) {
      return null;
    }

    return toRoomState(current as DbRoomRow);
  }, []);

  const subscribeToGameStart = useCallback(
    (roomId: string, onGameStart: (startsAt: string) => void) => {
      const channel = supabase
        .channel(`room-start:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "rooms",
            filter: `id=eq.${roomId}`,
          },
          (payload) => {
            const room = toRoomState(payload.new as DbRoomRow);
            if (room.game_starts_at && room.status === "playing") {
              onGameStart(room.game_starts_at);
            }
          },
        )
        .subscribe();

      gameStartChannelRef.current = channel;

      return () => {
        void supabase.removeChannel(channel);
        gameStartChannelRef.current = null;
      };
    },
    [],
  );

  const sendPing = useCallback(async (playerId: string) => {
    const { error } = await supabase
      .from("players")
      .update({ last_ping: new Date().toISOString() })
      .eq("id", playerId);

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  interface LeaderboardRow {
    rank: number;
    player_name: string;
    final_balance: number;
    michi_level: number;
    good_choices: number;
    total_choices: number;
    game_type: string;
    played_at: string;
  }

  const fetchLeaderboard = useCallback(
    async (mode: GameMode, gameType?: GameType): Promise<LeaderboardEntry[]> => {
      const { data, error } = await supabase.rpc("get_leaderboard", {
        p_mode: mode,
        p_game_type: gameType ?? null,
        p_limit: 5,
      });

      if (error) {
        console.error("Leaderboard error:", error);
        throw new Error(error.message);
      }

      const rows = (data ?? []) as LeaderboardRow[];
      return rows.map((row) => ({
        rank: Number(row.rank),
        player_name: row.player_name,
        final_balance: row.final_balance,
        michi_level: row.michi_level as 1 | 2 | 3,
        good_choices: row.good_choices,
        total_choices: row.total_choices,
        game_type: row.game_type as GameType,
        played_at: row.played_at,
      }));
    },
    [],
  );

  const checkRivalPing = useCallback((rival: PlayerState): boolean => {
    const lastPing = new Date(rival.last_ping).getTime();
    const now = Date.now();
    const diffSeconds = (now - lastPing) / 1000;
    return diffSeconds > 10;
  }, []);

  return {
    createSingleRoom,
    createRoom,
    joinRoom,
    subscribeToRoom,
    getRivalInitialState,
    updateMyState,
    fetchRival,
    finishGame,
    resetScoreSaved,
    markReady,
    subscribeToGameStart,
    sendPing,
    checkRivalPing,
    fetchLeaderboard,
  };
}
