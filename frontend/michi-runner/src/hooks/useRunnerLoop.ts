import { useCallback, useEffect, useRef, useState } from "react";
import {
  BG_SPEED,
  QUITO_PLACES,
  PLACE_DURATION_S,
  DILEMMAS,
  getComboConfig,
  DILEMMA_INTERVAL_MS,
  GAME_DURATION_S,
  getMichiLevel,
  MODE_CONFIG,
  NPC_START_SCREEN_X,
  NPC_ARRIVE_SCREEN_X,
  NPC_TRIGGER_SCROLL,
  CITY_TRANSITION_FADE_MS,
  CITY_TRANSITION_FLASH_MS,
  CITY_TRANSITION_DONE_MS,
} from "../constants/runner";
import type {
  Choice,
  Dilemma,
  FeedbackType,
  FinishGameParams,
  FloatingNumber,
  GameMode,
  GamePhase,
  GameType,
  JoinRoomError,
  LeaderboardEntry,
  LeaderboardFilter,
  MichiReaction,
  PlayerState,
  RoomState,
  RunnerState,
} from "../types/game";

const JOIN_ROOM_ERRORS: readonly JoinRoomError[] = [
  "room_not_found",
  "room_full",
  "room_finished",
  "room_playing",
  "unknown_error",
];

function parseJoinRoomError(err: unknown): JoinRoomError {
  if (err instanceof Error && (JOIN_ROOM_ERRORS as readonly string[]).includes(err.message)) {
    return err.message as JoinRoomError;
  }
  return "unknown_error";
}

const INITIAL_STATE: RunnerState = {
  phase: "intro",
  mode: null,
  gameType: null,
  roomId: null,
  roomCode: "",
  playerName: "",
  countdownValue: null,
  balance: 0,
  happiness: 50,
  bgOffset: 0,
  currentDilemma: null,
  dilemmaIndex: 0,
  choicesMade: [],
  rival: null,
  michiLevel: 1,
  waitingForRival: false,
  rivalDisconnected: false,
  waitingTimeout: false,
  disconnectReason: null,
  lobbyError: null,
  feedback: null,
  floatingNumbers: [],
  michiReaction: "run",
  cityIndex: 0,
  cityProgress: 0,
  showCityArrival: false,
  rivalLastSeen: null,
  isRivalActive: false,
  rivalLastChoiceGood: null,
  showRivalUpdate: false,
  isTransitioning: false,
  transitionPhase: null,
  nextCityIndex: null,
  comboCount: 0,
  showComboAlert: false,
  comboBonus: 0,
  dilemmaTimeLeft: 10,
  dilemmaTimedOut: false,
  showLevelUp: false,
  showLevelDown: false,
  previousMichiLevel: 1,
  isTransformingMichi: false,
  leaderboard: [],
  leaderboardLoading: false,
  leaderboardError: null,
  leaderboardFilter: "all",
  showHistory: false,
  npcX: NPC_START_SCREEN_X,
  npcVisible: false,
  npcApproachProgress: 0,
};

const GOOD_CHOICE_IDS = [
  "save",
  "invest",
  "smart",
  "plan",
  "hustle",
  "work",
  "honest",
] as const;

type UpdateMyStateFn = (playerId: string, patch: Partial<PlayerState>) => Promise<void>;

type FinishGameFn = (params: FinishGameParams) => Promise<void>;

type ResetScoreSavedFn = () => void;

type CreateSingleRoomFn = (
  mode: GameMode,
  playerName: string,
) => Promise<{ roomId: string; playerId: string }>;

type MarkReadyFn = (playerId: string, roomId: string) => Promise<RoomState | null>;

type SubscribeToGameStartFn = (
  roomId: string,
  onGameStart: (startsAt: string) => void,
) => () => void;

type SendPingFn = (playerId: string) => Promise<void>;

type CheckRivalPingFn = (rival: PlayerState) => boolean;

type JoinRoomFn = (
  code: string,
  playerName: string,
) => Promise<{ roomId: string; playerId: string }>;

type SubscribeToRoomFn = (
  roomId: string,
  playerId: string,
  onRivalUpdate: (p: PlayerState) => void,
  onSubscribed?: () => void,
) => () => void;

type GetRivalInitialStateFn = (
  roomId: string,
  myPlayerId: string,
) => Promise<PlayerState | null>;

type FetchLeaderboardFn = (
  mode: GameMode,
  gameType?: GameType,
) => Promise<LeaderboardEntry[]>;

export function useRunnerLoop(
  updateMyState: UpdateMyStateFn,
  finishGame: FinishGameFn,
  resetScoreSaved: ResetScoreSavedFn,
  createSingleRoom: CreateSingleRoomFn,
  markReady: MarkReadyFn,
  subscribeToGameStart: SubscribeToGameStartFn,
  subscribeToRoom: SubscribeToRoomFn,
  getRivalInitialState: GetRivalInitialStateFn,
  fetchLeaderboard: FetchLeaderboardFn,
  sendPing: SendPingFn,
  checkRivalPing: CheckRivalPingFn,
  joinRoom: JoinRoomFn,
  playerId: string | null,
  onPlayerIdChange: (id: string) => void,
) {
  const [state, setState] = useState<RunnerState>(INITIAL_STATE);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);

  const stateRef = useRef(state);
  const bgOffsetRef = useRef(0);
  const phaseRef = useRef<GamePhase>("intro");
  const dilemmaIndexRef = useRef(0);
  const balanceRef = useRef(0);
  const happinessRef = useRef(50);
  const modeRef = useRef<GameMode | null>(null);
  const gameTypeRef = useRef<GameType | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const playerNameRef = useRef("");
  const michiLevelRef = useRef<1 | 2 | 3>(1);
  const choicesMadeRef = useRef<Choice[]>([]);
  const choicesIdsRef = useRef<string[]>([]);
  const localFinishedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const dilemmaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const gameStartCleanupRef = useRef<(() => void) | null>(null);
  const multiSyncStartedRef = useRef(false);
  const countdownStartedRef = useRef(false);
  const gameStartedRef = useRef(false);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rivalCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rivalRef = useRef<PlayerState | null>(null);
  const disconnectHandledRef = useRef(false);
  const floatingIdRef = useRef(0);
  const choiceFeedbackTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cityIndexRef = useRef(0);
  const elapsedInCityRef = useRef(0);
  const lastCityTickRef = useRef(Date.now());
  const cityArrivalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rivalSubCleanupRef = useRef<(() => void) | null>(null);
  const rivalLastSeenRef = useRef<number | null>(null);
  const isRivalActiveRef = useRef(false);
  const rivalChoiceCountRef = useRef(0);
  const rivalUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioningRef = useRef(false);
  const transitionTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const comboCountRef = useRef(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dilemmaCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dilemmaSecondsRef = useRef(10);
  const currentDilemmaRef = useRef<Dilemma | null>(null);
  const dilemmaPlayerChoseRef = useRef(false);
  const dilemmaTimeoutPendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const makeChoiceRef = useRef<(choice: Choice) => Promise<void>>(async () => {});
  const startDilemmaTimerRef = useRef<() => void>(() => {});
  const previousLevelRef = useRef<1 | 2 | 3>(1);
  const levelTransformTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const npcXRef = useRef(NPC_START_SCREEN_X);
  const npcVisibleRef = useRef(false);
  const npcSpawnOffsetRef = useRef(0);
  const npcArrivedRef = useRef(false);
  const pendingDilemmaRef = useRef<Dilemma | null>(null);
  const michiReactionRef = useRef<MichiReaction>("run");
  const npcApproachProgressRef = useRef(0);
  const npcArrivalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = state;
    phaseRef.current = state.phase;
    modeRef.current = state.mode;
    gameTypeRef.current = state.gameType;
    roomIdRef.current = state.roomId;
    playerNameRef.current = state.playerName;
    michiLevelRef.current = state.michiLevel;
    choicesMadeRef.current = state.choicesMade;
    balanceRef.current = state.balance;
    happinessRef.current = state.happiness;
    dilemmaIndexRef.current = state.dilemmaIndex;
    choicesIdsRef.current = state.choicesMade.map((c) => c.id);
    michiReactionRef.current = state.michiReaction;
  }, [state]);

  useEffect(() => {
    playerIdRef.current = playerId;
  }, [playerId]);

  const clearCountdownTimers = useCallback(() => {
    countdownTimersRef.current.forEach((t) => clearTimeout(t));
    countdownTimersRef.current = [];
  }, []);

  const clearChoiceFeedbackTimers = useCallback(() => {
    choiceFeedbackTimersRef.current.forEach((t) => clearTimeout(t));
    choiceFeedbackTimersRef.current = [];
  }, []);

  const clearLevelTransformTimer = useCallback(() => {
    if (levelTransformTimerRef.current !== null) {
      clearTimeout(levelTransformTimerRef.current);
      levelTransformTimerRef.current = null;
    }
  }, []);

  const clearDilemmaCountdown = useCallback(() => {
    if (dilemmaCountdownRef.current !== null) {
      clearInterval(dilemmaCountdownRef.current);
      dilemmaCountdownRef.current = null;
    }
    if (dilemmaTimeoutPendingRef.current !== null) {
      clearTimeout(dilemmaTimeoutPendingRef.current);
      dilemmaTimeoutPendingRef.current = null;
    }
  }, []);

  const clearComboTimer = useCallback(() => {
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }
  }, []);

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((t) => clearTimeout(t));
    transitionTimersRef.current = [];
  }, []);

  const clearRivalUpdateTimer = useCallback(() => {
    if (rivalUpdateTimerRef.current !== null) {
      clearTimeout(rivalUpdateTimerRef.current);
      rivalUpdateTimerRef.current = null;
    }
  }, []);

  const teardownRivalSubscription = useCallback(() => {
    if (rivalSubCleanupRef.current !== null) {
      rivalSubCleanupRef.current();
      rivalSubCleanupRef.current = null;
    }
  }, []);

  const clearCityArrivalTimer = useCallback(() => {
    if (cityArrivalTimerRef.current !== null) {
      clearTimeout(cityArrivalTimerRef.current);
      cityArrivalTimerRef.current = null;
    }
  }, []);

  const showCityArrivalBanner = useCallback(() => {
    clearCityArrivalTimer();
    setState((prev) => ({ ...prev, showCityArrival: true }));
    cityArrivalTimerRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, showCityArrival: false }));
      cityArrivalTimerRef.current = null;
    }, 2500);
  }, [clearCityArrivalTimer]);

  const clearNpcArrivalTimer = useCallback(() => {
    if (npcArrivalTimerRef.current !== null) {
      clearTimeout(npcArrivalTimerRef.current);
      npcArrivalTimerRef.current = null;
    }
  }, []);

  const clearNpcEncounter = useCallback(() => {
    clearNpcArrivalTimer();
    npcVisibleRef.current = false;
    npcArrivedRef.current = false;
    pendingDilemmaRef.current = null;
    npcApproachProgressRef.current = 0;
    npcXRef.current = NPC_START_SCREEN_X;
    setState((prev) => ({
      ...prev,
      npcVisible: false,
      npcApproachProgress: 0,
      npcX: NPC_START_SCREEN_X,
    }));
  }, [clearNpcArrivalTimer]);

  const isNpcEncounterActive = useCallback(() => {
    return (
      npcVisibleRef.current ||
      npcArrivedRef.current ||
      phaseRef.current === "decision" ||
      pendingDilemmaRef.current !== null
    );
  }, []);

  const startCityTransition = useCallback(
    (nextCity: number) => {
      clearTransitionTimers();
      clearCityArrivalTimer();
      clearNpcEncounter();

      setState((prev) => ({
        ...prev,
        transitionPhase: "fadeOut",
      }));

      const t1 = setTimeout(() => {
        cityIndexRef.current = nextCity;
        setState((prev) => ({
          ...prev,
          transitionPhase: "flash",
          cityIndex: nextCity,
          cityProgress: 0,
          showCityArrival: true,
        }));
      }, CITY_TRANSITION_FADE_MS);

      const t2 = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          transitionPhase: "fadeIn",
          showCityArrival: false,
        }));
      }, CITY_TRANSITION_FLASH_MS);

      const t3 = setTimeout(() => {
        isTransitioningRef.current = false;
        setState((prev) => ({
          ...prev,
          transitionPhase: null,
          isTransitioning: false,
          nextCityIndex: null,
        }));
      }, CITY_TRANSITION_DONE_MS);

      transitionTimersRef.current = [t1, t2, t3];
    },
    [clearTransitionTimers, clearCityArrivalTimer, clearNpcEncounter],
  );

  const clearConnectionTimers = useCallback(() => {
    if (pingIntervalRef.current !== null) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (rivalCheckIntervalRef.current !== null) {
      clearInterval(rivalCheckIntervalRef.current);
      rivalCheckIntervalRef.current = null;
    }
    if (waitingTimerRef.current !== null) {
      clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
  }, []);

  const clearWaitingTimer = useCallback(() => {
    if (waitingTimerRef.current !== null) {
      clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
    setState((prev) => ({ ...prev, waitingTimeout: false }));
  }, []);

  const clearTimers = useCallback(() => {
    clearChoiceFeedbackTimers();
    clearComboTimer();
    clearLevelTransformTimer();
    clearNpcArrivalTimer();
    clearDilemmaCountdown();
    clearTransitionTimers();
    clearCityArrivalTimer();
    if (dilemmaIntervalRef.current !== null) {
      clearInterval(dilemmaIntervalRef.current);
      dilemmaIntervalRef.current = null;
    }
    if (endTimeoutRef.current !== null) {
      clearTimeout(endTimeoutRef.current);
      endTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [
    clearChoiceFeedbackTimers,
    clearComboTimer,
    clearLevelTransformTimer,
    clearNpcArrivalTimer,
    clearDilemmaCountdown,
    clearTransitionTimers,
    clearCityArrivalTimer,
  ]);

  const goToEnd = useCallback(() => {
    phaseRef.current = "end";
    setState((prev) => ({
      ...prev,
      phase: "end",
      currentDilemma: null,
      waitingForRival: false,
      countdownValue: null,
    }));
  }, []);

  const tryFinishMultiEnd = useCallback(
    (rival: PlayerState | null) => {
      if (!localFinishedRef.current || gameTypeRef.current !== "multi") return;
      if (rival?.finished_at) {
        goToEnd();
      }
    },
    [goToEnd],
  );

  const cancelDilemmaTimer = useCallback(() => {
    dilemmaPlayerChoseRef.current = true;
    clearDilemmaCountdown();
    setState((prev) => ({
      ...prev,
      dilemmaTimeLeft: 10,
      dilemmaTimedOut: false,
    }));
  }, [clearDilemmaCountdown]);

  const spawnNpcEncounter = useCallback(() => {
    if (npcVisibleRef.current) return;
    if (phaseRef.current !== "running") return;
    if (isTransitioningRef.current) return;
    if (isNpcEncounterActive()) return;

    const mode = modeRef.current ?? "secundaria";
    const dilemmas = DILEMMAS[mode];
    const idx = dilemmaIndexRef.current % dilemmas.length;
    const dilemma = dilemmas[idx];
    if (!dilemma) return;

    pendingDilemmaRef.current = dilemma;
    npcSpawnOffsetRef.current = bgOffsetRef.current;
    npcArrivedRef.current = false;
    npcVisibleRef.current = true;
    npcXRef.current = NPC_START_SCREEN_X;
    npcApproachProgressRef.current = 0;

    setState((prev) => ({
      ...prev,
      npcX: NPC_START_SCREEN_X,
      npcVisible: true,
      npcApproachProgress: 0,
    }));
  }, [isNpcEncounterActive]);

  const npcScreenXFromProgress = useCallback((progress: number) => {
    const t = Math.min(1, Math.max(0, progress));
    return (
      NPC_START_SCREEN_X +
      (NPC_ARRIVE_SCREEN_X - NPC_START_SCREEN_X) * t
    );
  }, []);

  const persistFinishGame = useCallback(async () => {
    const pid = playerIdRef.current;
    const rid = roomIdRef.current;
    const mode = modeRef.current;
    const gameType = gameTypeRef.current;

    if (!pid || !rid || !mode || !gameType) {
      return;
    }

    const level = getMichiLevel(mode, balanceRef.current);
    michiLevelRef.current = level;

    await finishGame({
      playerId: pid,
      roomId: rid,
      gameType,
      mode,
      playerName: playerNameRef.current || "Jugador",
      finalBalance: balanceRef.current,
      michiLevel: level,
      choices: choicesMadeRef.current.map((c) => c.id),
    });
  }, [finishGame]);

  const handleGameTimerEnd = useCallback(async () => {
    clearTimers();

    phaseRef.current = "end";
    setState((prev) => ({
      ...prev,
      phase: "end",
      currentDilemma: null,
      waitingForRival: false,
      countdownValue: null,
    }));

    if (!playerIdRef.current) {
      return;
    }

    localFinishedRef.current = true;
    await persistFinishGame();
  }, [clearTimers, persistFinishGame]);

  const startRafLoop = useCallback(() => {
    const tick = () => {
      if (
        (phaseRef.current === "running" || phaseRef.current === "countdown") &&
        !isTransitioningRef.current
      ) {
        bgOffsetRef.current += BG_SPEED;
        setState((prev) => ({ ...prev, bgOffset: bgOffsetRef.current }));
      }

      if (
        npcVisibleRef.current &&
        !npcArrivedRef.current &&
        phaseRef.current === "running"
      ) {
        const scrolled = bgOffsetRef.current - npcSpawnOffsetRef.current;
        const progress = Math.min(1, scrolled / NPC_TRIGGER_SCROLL);
        const nextX = npcScreenXFromProgress(progress);

        if (
          progress !== npcApproachProgressRef.current ||
          nextX !== npcXRef.current
        ) {
          npcApproachProgressRef.current = progress;
          npcXRef.current = nextX;
          setState((prev) => ({
            ...prev,
            npcApproachProgress: progress,
            npcX: nextX,
          }));
        }

        if (
          scrolled >= NPC_TRIGGER_SCROLL * 0.7 &&
          michiReactionRef.current !== "curious"
        ) {
          michiReactionRef.current = "curious";
          setState((prev) => ({ ...prev, michiReaction: "curious" }));
        }

        if (scrolled >= NPC_TRIGGER_SCROLL) {
          npcArrivedRef.current = true;
          phaseRef.current = "decision";

          clearNpcArrivalTimer();
          npcArrivalTimerRef.current = setTimeout(() => {
            npcArrivalTimerRef.current = null;
            const pending = pendingDilemmaRef.current;
            if (!pending) return;

            npcVisibleRef.current = false;
            pendingDilemmaRef.current = null;
            currentDilemmaRef.current = pending;
            lastCityTickRef.current = Date.now();

            setState((prev) => ({
              ...prev,
              npcVisible: false,
              npcApproachProgress: 1,
              npcX: NPC_ARRIVE_SCREEN_X,
              currentDilemma: pending,
              phase: "decision",
            }));
            startDilemmaTimerRef.current();
          }, 400);
        }
      }

      if (rivalLastSeenRef.current !== null) {
        const msSinceUpdate = Date.now() - rivalLastSeenRef.current;
        const active = msSinceUpdate < 8000;
        if (active !== isRivalActiveRef.current) {
          isRivalActiveRef.current = active;
          setState((prev) => ({ ...prev, isRivalActive: active }));
        }
      }

      if (phaseRef.current === "running" && !isTransitioningRef.current) {
        const now = Date.now();
        const delta = now - lastCityTickRef.current;
        lastCityTickRef.current = now;
        const encounterActive = isNpcEncounterActive();

        if (!encounterActive) {
          elapsedInCityRef.current += delta / 1000;
        }

        const progress = Math.min(
          100,
          (elapsedInCityRef.current / PLACE_DURATION_S) * 100,
        );
        const roundedProgress = Math.round(progress);

        if (
          elapsedInCityRef.current >= PLACE_DURATION_S &&
          !encounterActive
        ) {
          const nextCity = (cityIndexRef.current + 1) % QUITO_PLACES.length;
          elapsedInCityRef.current = 0;
          isTransitioningRef.current = true;
          setState((prev) => ({
            ...prev,
            isTransitioning: true,
            nextCityIndex: nextCity,
            cityProgress: 0,
          }));
          startCityTransition(nextCity);
        } else {
          setState((prev) => ({ ...prev, cityProgress: roundedProgress }));
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [startCityTransition, clearNpcArrivalTimer, npcScreenXFromProgress, isNpcEncounterActive]);

  const startCountdownRaf = useCallback(() => {
    if (rafRef.current === null) {
      startRafLoop();
    }
  }, [startRafLoop]);

  const startGame = useCallback(() => {
    if (rafRef.current !== null && gameStartedRef.current) {
      return;
    }

    if (gameTypeRef.current === "multi" && phaseRef.current !== "running") {
      return;
    }

    gameStartedRef.current = true;

    clearTimers();
    clearWaitingTimer();
    resetScoreSaved();
    localFinishedRef.current = false;
    setTimeLeft(GAME_DURATION_S);
    dilemmaIndexRef.current = 0;
    bgOffsetRef.current = 0;
    cityIndexRef.current = 0;
    elapsedInCityRef.current = 0;
    lastCityTickRef.current = Date.now();

    setState((prev) => ({
      ...prev,
      bgOffset: 0,
      dilemmaIndex: 0,
      currentDilemma: null,
      waitingForRival: false,
      countdownValue: null,
      cityIndex: 0,
      cityProgress: 0,
      showCityArrival: false,
      npcX: NPC_START_SCREEN_X,
      npcVisible: false,
      npcApproachProgress: 0,
    }));

    npcXRef.current = NPC_START_SCREEN_X;
    npcVisibleRef.current = false;
    npcArrivedRef.current = false;
    npcSpawnOffsetRef.current = 0;
    pendingDilemmaRef.current = null;
    npcApproachProgressRef.current = 0;
    michiReactionRef.current = "run";

    startRafLoop();
    showCityArrivalBanner();

    dilemmaIntervalRef.current = setInterval(() => {
      spawnNpcEncounter();
    }, DILEMMA_INTERVAL_MS);

    endTimeoutRef.current = setTimeout(() => {
      void handleGameTimerEnd();
    }, GAME_DURATION_S * 1000);

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    if (gameTypeRef.current === "multi" && playerId) {
      void sendPing(playerId);

      pingIntervalRef.current = setInterval(() => {
        if (playerId) {
          void sendPing(playerId);
        }
      }, 5000);

      rivalCheckIntervalRef.current = setInterval(() => {
        if (rivalRef.current) {
          const isOffline = checkRivalPing(rivalRef.current);
          if (isOffline) {
            setState((prev) => ({ ...prev, rivalDisconnected: true }));
            if (rivalCheckIntervalRef.current !== null) {
              clearInterval(rivalCheckIntervalRef.current);
              rivalCheckIntervalRef.current = null;
            }
          }
        }
      }, 5000);
    }
  }, [
    clearTimers,
    clearWaitingTimer,
    resetScoreSaved,
    handleGameTimerEnd,
    spawnNpcEncounter,
    startRafLoop,
    showCityArrivalBanner,
    sendPing,
    checkRivalPing,
    playerId,
  ]);

  const beginCountdown = useCallback(
    (startsAt: string) => {
      if (countdownStartedRef.current) return;
      countdownStartedRef.current = true;

      clearCountdownTimers();

      const msUntilStart = new Date(startsAt).getTime() - Date.now();
      const base = Math.max(0, msUntilStart);

      phaseRef.current = "countdown";
      setState((prev) => ({
        ...prev,
        phase: "countdown",
        countdownValue: 3,
      }));
      startCountdownRaf();

      const t3 = setTimeout(() => setState((prev) => ({ ...prev, countdownValue: 3 })), Math.max(0, base - 3000));
      const t2 = setTimeout(() => setState((prev) => ({ ...prev, countdownValue: 2 })), Math.max(0, base - 2000));
      const t1 = setTimeout(() => setState((prev) => ({ ...prev, countdownValue: 1 })), Math.max(0, base - 1000));
      const tGo = setTimeout(
        () => setState((prev) => ({ ...prev, countdownValue: null })),
        Math.max(0, base),
      );
      const tStart = setTimeout(() => {
        phaseRef.current = "running";
        setState((prev) => ({ ...prev, phase: "running" }));
        startGame();
      }, Math.max(0, base + 500));

      countdownTimersRef.current = [t3, t2, t1, tGo, tStart];
    },
    [clearCountdownTimers, startCountdownRaf, startGame],
  );

  const beginCountdownLocal = useCallback(() => {
    clearCountdownTimers();

    phaseRef.current = "countdown";
    setState((prev) => ({
      ...prev,
      phase: "countdown",
      countdownValue: 3,
    }));
    startCountdownRaf();

    const t3 = setTimeout(() => setState((prev) => ({ ...prev, countdownValue: 3 })), 0);
    const t2 = setTimeout(() => setState((prev) => ({ ...prev, countdownValue: 2 })), 1000);
    const t1 = setTimeout(() => setState((prev) => ({ ...prev, countdownValue: 1 })), 2000);
    const tGo = setTimeout(() => setState((prev) => ({ ...prev, countdownValue: null })), 3000);
    const tStart = setTimeout(() => {
      phaseRef.current = "running";
      setState((prev) => ({ ...prev, phase: "running" }));
      startGame();
    }, 3500);

    countdownTimersRef.current = [t3, t2, t1, tGo, tStart];
  }, [clearCountdownTimers, startCountdownRaf, startGame]);

  useEffect(() => {
    const rid = state.roomId;
    const gt = state.gameType;

    if (state.phase !== "waiting" || gt !== "multi" || !playerId || !rid) {
      if (state.phase !== "waiting") {
        multiSyncStartedRef.current = false;
      }
      return;
    }

    if (multiSyncStartedRef.current) return;
    multiSyncStartedRef.current = true;

    let active = true;

    void (async () => {
      try {
        const room = await markReady(playerId, rid);
        if (!active) return;

        gameStartCleanupRef.current = subscribeToGameStart(rid, (startsAt) => {
          beginCountdown(startsAt);
        });

        if (room?.game_starts_at && room.status === "playing") {
          beginCountdown(room.game_starts_at);
        }
      } catch {
        multiSyncStartedRef.current = false;
      }
    })();

    return () => {
      active = false;
      if (gameStartCleanupRef.current) {
        gameStartCleanupRef.current();
        gameStartCleanupRef.current = null;
      }
      clearCountdownTimers();
    };
  }, [
    state.phase,
    state.gameType,
    state.roomId,
    playerId,
    markReady,
    subscribeToGameStart,
    beginCountdown,
    clearCountdownTimers,
  ]);

  useEffect(() => {
    if (state.phase !== "waiting" || state.gameType !== "multi") {
      return;
    }

    waitingTimerRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, waitingTimeout: true }));
    }, 30000);

    return () => {
      if (waitingTimerRef.current !== null) {
        clearTimeout(waitingTimerRef.current);
        waitingTimerRef.current = null;
      }
    };
  }, [state.phase, state.gameType]);

  const savePartialProgress = useCallback(async () => {
    await persistFinishGame();
  }, [persistFinishGame]);

  const handleDisconnection = useCallback(() => {
    if (disconnectHandledRef.current || phaseRef.current === "disconnected") {
      return;
    }
    disconnectHandledRef.current = true;

    const wasInGame =
      phaseRef.current === "running" ||
      phaseRef.current === "decision" ||
      phaseRef.current === "countdown" ||
      stateRef.current.waitingForRival;

    const disconnectReason = stateRef.current.waitingTimeout
      ? "waiting_timeout"
      : "rival_left";

    clearConnectionTimers();
    clearTimers();
    clearCountdownTimers();

    phaseRef.current = "disconnected";
    setState((prev) => ({
      ...prev,
      phase: "disconnected",
      currentDilemma: null,
      countdownValue: null,
      waitingForRival: false,
      rivalDisconnected: false,
      waitingTimeout: false,
      disconnectReason,
    }));

    if (wasInGame && playerId) {
      void savePartialProgress();
    }
  }, [clearConnectionTimers, clearTimers, clearCountdownTimers, savePartialProgress, playerId]);

  useEffect(() => {
    return () => {
      clearTimers();
      clearCountdownTimers();
      clearConnectionTimers();
      if (gameStartCleanupRef.current) {
        gameStartCleanupRef.current();
        gameStartCleanupRef.current = null;
      }
    };
  }, [clearTimers, clearCountdownTimers, clearConnectionTimers]);

  const setPhase = useCallback((phase: GamePhase) => {
    phaseRef.current = phase;
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const selectMode = useCallback((mode: GameMode) => {
    const initialBalance = MODE_CONFIG[mode].initialBalance;
    balanceRef.current = initialBalance;
    modeRef.current = mode;
    setState((prev) => ({
      ...prev,
      mode,
      balance: initialBalance,
      michiLevel: getMichiLevel(mode, initialBalance),
      phase: "game_type_select",
    }));
    phaseRef.current = "game_type_select";
  }, []);

  const selectGameType = useCallback(
    async (type: GameType) => {
      const mode = modeRef.current;
      if (!mode) return;

      gameTypeRef.current = type;
      setState((prev) => ({ ...prev, gameType: type }));

      if (type === "single") {
        const name = stateRef.current.playerName || "JUGADOR";
        try {
          const { roomId, playerId: pid } = await createSingleRoom(mode, name);
          roomIdRef.current = roomId;
          playerIdRef.current = pid;
          playerNameRef.current = name;
          onPlayerIdChange(pid);
          setState((prev) => ({
            ...prev,
            gameType: type,
            roomId,
            playerName: name,
          }));
          beginCountdownLocal();
        } catch {
          setState((prev) => ({ ...prev, gameType: null }));
          gameTypeRef.current = null;
        }
        return;
      }

      setState((prev) => ({ ...prev, gameType: type, phase: "lobby" }));
      phaseRef.current = "lobby";
    },
    [createSingleRoom, onPlayerIdChange, beginCountdownLocal],
  );

  const setLobbyInfo = useCallback(
    (roomCode: string, playerName: string, roomId: string, phase: GamePhase = "waiting") => {
      roomIdRef.current = roomId;
      playerNameRef.current = playerName;
      phaseRef.current = phase;
      setState((prev) => ({ ...prev, roomCode, playerName, roomId, phase }));
    },
    [],
  );

  const clearLobbyError = useCallback(() => {
    setState((prev) => ({ ...prev, lobbyError: null }));
  }, []);

  const attemptJoinRoom = useCallback(
    async (code: string, playerName: string) => {
      try {
        const result = await joinRoom(code, playerName);
        setState((prev) => ({ ...prev, lobbyError: null }));
        return result;
      } catch (err) {
        const msg = parseJoinRoomError(err);
        setState((prev) => ({ ...prev, lobbyError: msg }));
        return null;
      }
    },
    [joinRoom],
  );

  const handleLevelChange = useCallback(
    (oldLevel: 1 | 2 | 3, newLevel: 1 | 2 | 3) => {
      if (oldLevel === newLevel) return;

      const isLevelUp = newLevel > oldLevel;
      previousLevelRef.current = oldLevel;

      setState((prev) => ({
        ...prev,
        previousMichiLevel: oldLevel,
        isTransformingMichi: true,
        showLevelUp: isLevelUp,
        showLevelDown: !isLevelUp,
      }));

      clearLevelTransformTimer();
      levelTransformTimerRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          showLevelUp: false,
          showLevelDown: false,
          isTransformingMichi: false,
        }));
        levelTransformTimerRef.current = null;
      }, 2000);
    },
    [clearLevelTransformTimer],
  );

  const makeChoice = useCallback(
    async (choice: Choice) => {
      const mode = modeRef.current;
      if (!mode) return;
      if (phaseRef.current !== "decision") return;

      npcVisibleRef.current = false;
      npcArrivedRef.current = false;
      npcSpawnOffsetRef.current = 0;
      michiReactionRef.current = "run";
      npcApproachProgressRef.current = 0;
      pendingDilemmaRef.current = null;

      clearDilemmaCountdown();
      dilemmaPlayerChoseRef.current = true;
      setState((prev) => ({
        ...prev,
        dilemmaTimeLeft: 10,
        dilemmaTimedOut: false,
        npcVisible: false,
        npcApproachProgress: 0,
      }));

      clearChoiceFeedbackTimers();

      let newBalance = Math.max(0, balanceRef.current + choice.delta);
      const newHappiness = Math.min(
        100,
        Math.max(0, happinessRef.current + choice.happinessDelta),
      );

      let comboBonus = 0;
      let newComboCount = 0;

      if (choice.isGood) {
        newComboCount = comboCountRef.current + 1;
        comboCountRef.current = newComboCount;
        const comboConf = getComboConfig(newComboCount);
        if (comboConf !== null) {
          comboBonus = comboConf.bonus[mode];
          newBalance = Math.max(0, newBalance + comboBonus);
        }
      } else {
        comboCountRef.current = 0;
        newComboCount = 0;
        clearComboTimer();
      }

      const oldLevel = michiLevelRef.current;
      const newLevel = getMichiLevel(mode, newBalance);
      if (newLevel !== oldLevel) {
        handleLevelChange(oldLevel, newLevel);
      }
      const feedbackType: FeedbackType = choice.isGood ? "good" : "bad";
      const floatId = floatingIdRef.current++;
      const floatNum: FloatingNumber = {
        id: floatId,
        value: choice.delta + comboBonus,
        x: 25,
        y: 60,
      };
      const newReaction: MichiReaction = choice.isGood ? "celebrate" : "sad";

      balanceRef.current = newBalance;
      happinessRef.current = newHappiness;
      michiLevelRef.current = newLevel;
      choicesMadeRef.current = [...choicesMadeRef.current, choice];
      choicesIdsRef.current = [...choicesIdsRef.current, choice.id];
      currentDilemmaRef.current = null;

      const showCombo = choice.isGood && newComboCount >= 2;

      setState((prev) => ({
        ...prev,
        balance: newBalance,
        happiness: newHappiness,
        michiLevel: newLevel,
        choicesMade: [...prev.choicesMade, choice],
        feedback: feedbackType,
        floatingNumbers: [...prev.floatingNumbers, floatNum],
        michiReaction: newReaction,
        currentDilemma: null,
        dilemmaTimeLeft: 10,
        dilemmaTimedOut: false,
        comboCount: newComboCount,
        comboBonus: showCombo ? comboBonus : 0,
        showComboAlert: showCombo,
      }));

      if (showCombo) {
        clearComboTimer();
        comboTimerRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, showComboAlert: false }));
          comboTimerRef.current = null;
        }, 2000);
      }

      const pid = playerIdRef.current;
      if (pid) {
        await updateMyState(pid, {
          balance: newBalance,
          happiness: newHappiness,
          choices: choicesIdsRef.current,
        });
      }

      const t1 = setTimeout(() => {
        setState((prev) => ({ ...prev, feedback: null }));
      }, 600);

      const t2 = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          floatingNumbers: prev.floatingNumbers.filter((n) => n.id !== floatId),
        }));
      }, 1200);

      const t3 = setTimeout(() => {
        lastCityTickRef.current = Date.now();
        phaseRef.current = "running";
        dilemmaIndexRef.current += 1;
        michiReactionRef.current = "run";
        setState((prev) => ({
          ...prev,
          michiReaction: "run",
          phase: "running",
          dilemmaIndex: dilemmaIndexRef.current,
        }));
      }, 1000);

      choiceFeedbackTimersRef.current = [t1, t2, t3];
    },
    [
      updateMyState,
      clearChoiceFeedbackTimers,
      clearComboTimer,
      clearDilemmaCountdown,
      handleLevelChange,
    ],
  );

  makeChoiceRef.current = makeChoice;

  const handleDilemmaTimeout = useCallback(() => {
    if (dilemmaPlayerChoseRef.current) return;
    if (!currentDilemmaRef.current) return;
    if (phaseRef.current !== "decision") return;

    const dilemma = currentDilemmaRef.current;
    const worstBase =
      dilemma.left.delta <= dilemma.right.delta ? dilemma.left : dilemma.right;
    const worstChoice: Choice = { ...worstBase, wasTimeout: true };

    setState((prev) => ({ ...prev, dilemmaTimedOut: true }));

    dilemmaTimeoutPendingRef.current = setTimeout(() => {
      dilemmaTimeoutPendingRef.current = null;
      void makeChoiceRef.current(worstChoice);
      setState((prev) => ({ ...prev, dilemmaTimedOut: false }));
    }, 800);
  }, []);

  const startDilemmaTimer = useCallback(() => {
    clearDilemmaCountdown();
    dilemmaPlayerChoseRef.current = false;
    dilemmaSecondsRef.current = 10;
    setState((prev) => ({
      ...prev,
      dilemmaTimeLeft: 10,
      dilemmaTimedOut: false,
    }));

    dilemmaCountdownRef.current = setInterval(() => {
      dilemmaSecondsRef.current -= 1;
      setState((prev) => ({
        ...prev,
        dilemmaTimeLeft: dilemmaSecondsRef.current,
      }));

      if (dilemmaSecondsRef.current <= 0) {
        if (dilemmaCountdownRef.current !== null) {
          clearInterval(dilemmaCountdownRef.current);
          dilemmaCountdownRef.current = null;
        }
        handleDilemmaTimeout();
      }
    }, 1000);
  }, [clearDilemmaCountdown, handleDilemmaTimeout]);

  startDilemmaTimerRef.current = startDilemmaTimer;

  const handleRivalUpdate = useCallback(
    (rivalState: PlayerState) => {
      rivalRef.current = rivalState;
      clearWaitingTimer();
      tryFinishMultiEnd(rivalState);

      const now = Date.now();
      rivalLastSeenRef.current = now;
      isRivalActiveRef.current = true;

      const newChoiceCount = rivalState.choices?.length ?? 0;
      let choicePatch: {
        rivalLastChoiceGood?: boolean | null;
        showRivalUpdate?: boolean;
      } = {};

      if (newChoiceCount > rivalChoiceCountRef.current) {
        rivalChoiceCountRef.current = newChoiceCount;
        const lastChoiceId = rivalState.choices[newChoiceCount - 1];
        const wasGood = (GOOD_CHOICE_IDS as readonly string[]).includes(lastChoiceId);

        clearRivalUpdateTimer();
        choicePatch = {
          rivalLastChoiceGood: wasGood,
          showRivalUpdate: true,
        };
        rivalUpdateTimerRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, showRivalUpdate: false }));
          rivalUpdateTimerRef.current = null;
        }, 2000);
      }

      setState((prev) => ({
        ...prev,
        rival: rivalState,
        rivalLastSeen: now,
        isRivalActive: true,
        ...choicePatch,
      }));
    },
    [tryFinishMultiEnd, clearWaitingTimer, clearRivalUpdateTimer],
  );

  const setupRivalSubscription = useCallback(
    (roomId: string, myPlayerId: string) => {
      if (gameTypeRef.current !== "multi") {
        return;
      }

      teardownRivalSubscription();
      rivalChoiceCountRef.current = 0;
      rivalLastSeenRef.current = null;
      isRivalActiveRef.current = false;

      const cleanup = subscribeToRoom(
        roomId,
        myPlayerId,
        handleRivalUpdate,
        () => {
          void getRivalInitialState(roomId, myPlayerId).then((rival) => {
            if (rival) {
              rivalChoiceCountRef.current = rival.choices?.length ?? 0;
              handleRivalUpdate(rival);
            }
          });
        },
      );
      rivalSubCleanupRef.current = cleanup;
    },
    [
      subscribeToRoom,
      getRivalInitialState,
      handleRivalUpdate,
      teardownRivalSubscription,
    ],
  );

  useEffect(() => {
    return () => {
      teardownRivalSubscription();
      clearRivalUpdateTimer();
      clearTransitionTimers();
      clearComboTimer();
      clearDilemmaCountdown();
      clearLevelTransformTimer();
    };
  }, [
    teardownRivalSubscription,
    clearRivalUpdateTimer,
    clearTransitionTimers,
    clearComboTimer,
    clearDilemmaCountdown,
    clearLevelTransformTimer,
  ]);

  const restart = useCallback(() => {
    clearTimers();
    clearChoiceFeedbackTimers();
    clearRivalUpdateTimer();
    clearTransitionTimers();
    clearComboTimer();
    clearDilemmaCountdown();
    clearLevelTransformTimer();
    comboCountRef.current = 0;
    isTransitioningRef.current = false;
    teardownRivalSubscription();
    clearCountdownTimers();
    clearConnectionTimers();
    resetScoreSaved();
    if (gameStartCleanupRef.current) {
      gameStartCleanupRef.current();
      gameStartCleanupRef.current = null;
    }
    bgOffsetRef.current = 0;
    phaseRef.current = "intro";
    dilemmaIndexRef.current = 0;
    balanceRef.current = 0;
    happinessRef.current = 50;
    modeRef.current = null;
    gameTypeRef.current = null;
    roomIdRef.current = null;
    choicesIdsRef.current = [];
    localFinishedRef.current = false;
    multiSyncStartedRef.current = false;
    countdownStartedRef.current = false;
    gameStartedRef.current = false;
    disconnectHandledRef.current = false;
    rivalRef.current = null;
    playerIdRef.current = null;
    playerNameRef.current = "";
    choicesMadeRef.current = [];
    setTimeLeft(GAME_DURATION_S);
    setState(INITIAL_STATE);
  }, [
    clearTimers,
    clearChoiceFeedbackTimers,
    clearRivalUpdateTimer,
    clearTransitionTimers,
    clearComboTimer,
    teardownRivalSubscription,
    clearCountdownTimers,
    clearConnectionTimers,
    resetScoreSaved,
  ]);

  const loadLeaderboard = useCallback(
    (filter: LeaderboardFilter) => {
      const mode = modeRef.current ?? "secundaria";
      const gameType = filter === "all" ? undefined : filter;

      setState((prev) => ({
        ...prev,
        leaderboardLoading: true,
        leaderboardError: null,
        leaderboardFilter: filter,
      }));

      return fetchLeaderboard(mode, gameType)
        .then((entries) => {
          setState((prev) => ({
            ...prev,
            leaderboard: entries,
            leaderboardLoading: false,
          }));
        })
        .catch(() => {
          setState((prev) => ({
            ...prev,
            leaderboardError: "No se pudo cargar el ranking",
            leaderboardLoading: false,
          }));
        });
    },
    [fetchLeaderboard],
  );

  const goToLeaderboard = useCallback(() => {
    phaseRef.current = "leaderboard";
    setState((prev) => ({ ...prev, phase: "leaderboard" }));
    void loadLeaderboard("all");
  }, [loadLeaderboard]);

  const filterLeaderboard = useCallback(
    (filter: LeaderboardFilter) => {
      void loadLeaderboard(filter);
    },
    [loadLeaderboard],
  );

  const toggleHistory = useCallback(() => {
    setState((prev) => ({ ...prev, showHistory: !prev.showHistory }));
  }, []);

  const handleDisconnectedRetry = useCallback(() => {
    disconnectHandledRef.current = false;
    clearConnectionTimers();
    clearTimers();
    clearChoiceFeedbackTimers();
    clearCountdownTimers();

    if (stateRef.current.disconnectReason === "waiting_timeout" && modeRef.current) {
      setState((prev) => ({
        ...prev,
        waitingTimeout: false,
        rivalDisconnected: false,
        disconnectReason: null,
        rival: null,
      }));
      rivalRef.current = null;
      void selectGameType("single");
      return;
    }

    restart();
  }, [
    clearConnectionTimers,
    clearTimers,
    clearChoiceFeedbackTimers,
    clearCountdownTimers,
    selectGameType,
    restart,
  ]);

  return {
    state,
    timeLeft,
    setPhase,
    selectMode,
    selectGameType,
    setLobbyInfo,
    clearLobbyError,
    attemptJoinRoom,
    startGame,
    makeChoice,
    setupRivalSubscription,
    cancelDilemmaTimer,
    goToLeaderboard,
    filterLeaderboard,
    toggleHistory,
    restart,
    tryFinishMultiEnd,
    handleDisconnection,
    handleDisconnectedRetry,
  };
}
