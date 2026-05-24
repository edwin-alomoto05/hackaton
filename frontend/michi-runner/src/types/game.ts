export type GameMode = "primaria" | "secundaria";
export type GameType = "single" | "multi";

export interface FinishGameParams {
  playerId: string;
  roomId: string;
  gameType: GameType;
  mode: GameMode;
  playerName: string;
  finalBalance: number;
  michiLevel: 1 | 2 | 3;
  choices: string[];
}

export type JoinRoomError =
  | "room_not_found"
  | "room_full"
  | "room_finished"
  | "room_playing"
  | "unknown_error";

export type GamePhase =
  | "intro"
  | "mode_select"
  | "game_type_select"
  | "lobby"
  | "waiting"
  | "countdown"
  | "running"
  | "decision"
  | "end"
  | "leaderboard"
  | "disconnected";

export type LeaderboardFilter = "all" | "single" | "multi";

export interface LeaderboardEntry {
  rank: number;
  player_name: string;
  final_balance: number;
  michi_level: 1 | 2 | 3;
  good_choices: number;
  total_choices: number;
  game_type: GameType;
  played_at: string;
}

export interface Choice {
  id: string;
  label: string;
  emoji: string;
  delta: number;
  happinessDelta: number;
  isGood: boolean;
  wasTimeout?: boolean;
}

export interface Dilemma {
  id: number;
  question: string;
  left: Choice;
  right: Choice;
}

export type FeedbackType = "good" | "bad" | null;

export interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
}

export type MichiReaction = "run" | "celebrate" | "sad" | "curious";

export type TransitionPhase = "fadeOut" | "flash" | "fadeIn" | null;

export interface PlayerState {
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

export interface RoomState {
  id: string;
  code: string | null;
  mode: GameMode;
  status: "waiting" | "playing" | "finished";
  players_ready: number;
  game_starts_at: string | null;
  created_at: string;
}

export interface RunnerState {
  phase: GamePhase;
  mode: GameMode | null;
  gameType: GameType | null;
  roomId: string | null;
  roomCode: string;
  playerName: string;
  countdownValue: number | null;
  waitingForRival: boolean;
  rivalDisconnected: boolean;
  waitingTimeout: boolean;
  disconnectReason: "waiting_timeout" | "rival_left" | null;
  balance: number;
  happiness: number;
  bgOffset: number;
  currentDilemma: Dilemma | null;
  dilemmaIndex: number;
  choicesMade: Choice[];
  rival: PlayerState | null;
  michiLevel: 1 | 2 | 3;
  lobbyError: JoinRoomError | null;
  feedback: FeedbackType;
  floatingNumbers: FloatingNumber[];
  michiReaction: MichiReaction;
  cityIndex: number;
  cityProgress: number;
  showCityArrival: boolean;
  rivalLastSeen: number | null;
  isRivalActive: boolean;
  rivalLastChoiceGood: boolean | null;
  showRivalUpdate: boolean;
  isTransitioning: boolean;
  transitionPhase: TransitionPhase;
  nextCityIndex: number | null;
  comboCount: number;
  showComboAlert: boolean;
  comboBonus: number;
  dilemmaTimeLeft: number;
  dilemmaTimedOut: boolean;
  showLevelUp: boolean;
  showLevelDown: boolean;
  previousMichiLevel: 1 | 2 | 3;
  isTransformingMichi: boolean;
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;
  leaderboardError: string | null;
  leaderboardFilter: LeaderboardFilter;
  showHistory: boolean;
  npcX: number;
  npcVisible: boolean;
  npcApproachProgress: number;
}
