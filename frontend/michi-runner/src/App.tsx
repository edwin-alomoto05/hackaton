import { useCallback, useEffect, useState } from "react";
import { ComboAlert } from "./components/ComboAlert";
import { LevelChangeBanner } from "./components/LevelChangeBanner";
import { CityArrivalBanner } from "./components/CityArrivalBanner";
import { CityTransition } from "./components/CityTransition";
import { CountdownScreen } from "./components/CountdownScreen";
import { DisconnectedScreen } from "./components/DisconnectedScreen";
import { DilemmaModal } from "./components/DilemmaModal";
import { FloatingNumbers } from "./components/FloatingNumber";
import { RivalUpdate } from "./components/RivalUpdate";
import { ScreenFlash } from "./components/ScreenFlash";
import { EndScreen } from "./components/EndScreen";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { GameTypeSelectScreen } from "./components/GameTypeSelectScreen";
import { HUD } from "./components/HUD";
import { IntroScreen } from "./components/IntroScreen";
import { LobbyScreen } from "./components/LobbyScreen";
import { MichiSprite } from "./components/MichiSprite";
import { NpcCharacter } from "./components/NpcCharacter";
import { ModeSelectScreen } from "./components/ModeSelectScreen";
import { ScrollingBackground } from "./components/ScrollingBackground";
import { getMichiInfo, MODE_CONFIG } from "./constants/runner";
import { useRoom } from "./hooks/useRoom";
import { useRunnerLoop } from "./hooks/useRunnerLoop";

export default function App() {
  const {
    createSingleRoom,
    createRoom,
    joinRoom,
    subscribeToRoom,
    getRivalInitialState,
    updateMyState,
    finishGame,
    resetScoreSaved,
    markReady,
    subscribeToGameStart,
    sendPing,
    checkRivalPing,
    fetchLeaderboard,
  } = useRoom();

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [createRoomError, setCreateRoomError] = useState<string | null>(null);

  const handlePlayerIdChange = useCallback((id: string) => {
    setPlayerId(id);
  }, []);

  const {
    state,
    timeLeft,
    setPhase,
    selectMode,
    selectGameType,
    setLobbyInfo,
    clearLobbyError,
    attemptJoinRoom,
    makeChoice,
    cancelDilemmaTimer,
    setupRivalSubscription,
    goToLeaderboard,
    filterLeaderboard,
    toggleHistory,
    restart,
    handleDisconnection,
    handleDisconnectedRetry,
  } = useRunnerLoop(
    updateMyState,
    finishGame,
    resetScoreSaved,
    createSingleRoom,
    markReady,
    subscribeToGameStart,
    subscribeToRoom,
    getRivalInitialState,
    fetchLeaderboard,
    sendPing,
    checkRivalPing,
    joinRoom,
    playerId,
    handlePlayerIdChange,
  );

  useEffect(() => {
    if (state.rivalDisconnected) {
      handleDisconnection();
    }
  }, [state.rivalDisconnected, handleDisconnection]);

  useEffect(() => {
    if (state.waitingTimeout) {
      handleDisconnection();
    }
  }, [state.waitingTimeout, handleDisconnection]);

  const handleCreateRoom = useCallback(async () => {
    if (!state.mode) return;
    setCreateRoomError(null);
    clearLobbyError();
    try {
      const { roomCode, playerId: pid, roomId: rid } = await createRoom(state.mode, "JUGADOR 1");
      setPlayerId(pid);
      setLobbyInfo(roomCode, "JUGADOR 1", rid, "waiting");
      setupRivalSubscription(rid, pid);
    } catch (e) {
      setCreateRoomError(e instanceof Error ? e.message : "Error al crear sala");
    }
  }, [state.mode, createRoom, setLobbyInfo, setupRivalSubscription, clearLobbyError]);

  const handleJoinRoom = useCallback(
    async (code: string, playerName: string) => {
      const result = await attemptJoinRoom(code, playerName);
      if (!result) return;

      const normalizedCode = code.trim().replace(/\D/g, "").slice(0, 4);
      const name = playerName.trim() || "Jugador 2";
      setPlayerId(result.playerId);
      setLobbyInfo(normalizedCode, name, result.roomId, "waiting");
      setupRivalSubscription(result.roomId, result.playerId);
    },
    [attemptJoinRoom, setLobbyInfo, setupRivalSubscription],
  );

  const handleRestart = useCallback(() => {
    setPlayerId(null);
    setCreateRoomError(null);
    restart();
  }, [restart]);

  const handleSelectGameType = useCallback(
    (type: Parameters<typeof selectGameType>[0]) => {
      void selectGameType(type);
    },
    [selectGameType],
  );

  const mode = state.mode;
  const gameType = state.gameType;
  const michiInfo = mode ? getMichiInfo(mode, state.michiLevel) : null;

  const inGameCanvas =
    state.phase === "running" ||
    state.phase === "decision" ||
    state.phase === "countdown" ||
    state.waitingForRival;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {state.phase === "intro" && (
        <IntroScreen onStart={() => setPhase("mode_select")} />
      )}

      {state.phase === "mode_select" && <ModeSelectScreen onSelect={selectMode} />}

      {state.phase === "game_type_select" && mode && (
        <GameTypeSelectScreen mode={mode} onSelect={handleSelectGameType} />
      )}

      {(state.phase === "lobby" || state.phase === "waiting") && mode && gameType === "multi" && (
        <LobbyScreen
          mode={mode}
          roomCode={state.roomCode}
          isWaiting={state.phase === "waiting"}
          rivalJoined={!!state.rival}
          lobbyError={state.lobbyError}
          onClearError={clearLobbyError}
          onCreateRoom={() => void handleCreateRoom()}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {createRoomError && (state.phase === "lobby" || state.phase === "waiting") && (
        <p
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#f87171",
            fontSize: 8,
            fontFamily: '"Press Start 2P", monospace',
            zIndex: 100,
          }}
        >
          {createRoomError}
        </p>
      )}

      {inGameCanvas && mode && gameType && michiInfo && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <ScrollingBackground
            offset={state.bgOffset}
            isPaused={
              state.phase === "decision" ||
              state.phase === "countdown" ||
              state.isTransitioning
            }
            mode={mode}
            cityIndex={state.cityIndex}
            isTransitioning={state.isTransitioning}
            transitionPhase={state.transitionPhase}
          />
          {(state.phase === "running" || state.phase === "decision") && (
            <CityTransition
              transitionPhase={state.transitionPhase}
              currentCityIndex={state.cityIndex}
              nextCityIndex={state.nextCityIndex}
              mode={mode}
            />
          )}
          {(state.phase === "running" || state.phase === "decision") && (
            <CityArrivalBanner
              isVisible={state.showCityArrival}
              cityIndex={state.cityIndex}
              mode={mode}
            />
          )}
          <div
            style={{
              opacity: state.transitionPhase === "flash" ? 0 : 1,
              transition: "opacity 0.2s ease",
              position: "absolute",
              inset: 0,
              pointerEvents: state.transitionPhase === "flash" ? "none" : "auto",
            }}
          >
            {gameType === "multi" && state.showRivalUpdate && state.rival && (
              <RivalUpdate
                rivalName={state.rival.player_name}
                lastChoice={
                  state.rival.choices[state.rival.choices.length - 1] ?? null
                }
                isGood={state.rivalLastChoiceGood}
              />
            )}
            {(state.phase === "running" || state.phase === "decision") && (
              <>
                <NpcCharacter cityIndex={state.cityIndex} bgOffset={state.bgOffset} slot={0} />
                <NpcCharacter cityIndex={state.cityIndex} bgOffset={state.bgOffset} slot={1} />
              </>
            )}
            {state.phase !== "countdown" && (
              <div style={{ position: "absolute", bottom: "15%", left: "15%", zIndex: 4 }}>
                <MichiSprite
                  emoji={michiInfo.emoji}
                  isRunning={state.phase === "running" && !state.waitingForRival}
                  level={state.michiLevel}
                  reaction={state.michiReaction}
                  mode={mode}
                  isTransforming={state.isTransformingMichi}
                  showLevelUp={state.showLevelUp}
                  showLevelDown={state.showLevelDown}
                  previousLevel={state.previousMichiLevel}
                />
              </div>
            )}
            {state.phase === "decision" &&
              state.currentDilemma &&
              !state.waitingForRival && (
                <DilemmaModal
                  dilemma={state.currentDilemma}
                  onChoice={(c) => void makeChoice(c)}
                  onChoiceIntent={cancelDilemmaTimer}
                  mode={mode}
                  dilemmaTimeLeft={state.dilemmaTimeLeft}
                  dilemmaTimedOut={state.dilemmaTimedOut}
                />
              )}
            <ScreenFlash feedback={state.feedback} />
            <FloatingNumbers items={state.floatingNumbers} />
            {(state.phase === "running" || state.phase === "decision") && (
              <ComboAlert
                isVisible={state.showComboAlert}
                comboCount={state.comboCount}
                comboBonus={state.comboBonus}
                mode={mode}
                balanceUnit={MODE_CONFIG[mode].balanceUnit}
              />
            )}
            {(state.phase === "running" || state.phase === "decision") && (
              <LevelChangeBanner
                showLevelUp={state.showLevelUp}
                showLevelDown={state.showLevelDown}
                newLevel={state.michiLevel}
                mode={mode}
              />
            )}
          </div>
          {state.phase === "countdown" && (
            <CountdownScreen
              value={state.countdownValue}
              gameType={gameType}
              rivalName={state.rival?.player_name}
              playerName={state.playerName || "TÚ"}
              mode={mode}
              michiLevel={state.michiLevel}
            />
          )}
          {state.phase !== "countdown" && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 6 }}>
              <HUD
                balance={state.balance}
                happiness={state.happiness}
                michiLevel={state.michiLevel}
                michiEmoji={michiInfo.emoji}
                timeLeft={timeLeft}
                mode={mode}
                balanceUnit={MODE_CONFIG[mode].balanceUnit}
                gameType={gameType}
                cityIndex={state.cityIndex}
                cityProgress={state.cityProgress}
                rival={state.rival}
                isRivalActive={state.isRivalActive}
                myBalance={state.balance}
                comboCount={state.comboCount}
                choices={state.choicesMade}
                showHistory={state.showHistory}
                onToggleHistory={toggleHistory}
              />
            </div>
          )}
          {state.waitingForRival && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                gap: 16,
              }}
            >
              <div className="spinner" />
              <p className="blink" style={{ color: "#fde047", fontSize: 10, margin: 0 }}>
                Esperando rival... 🐱
              </p>
            </div>
          )}
        </div>
      )}

      {state.phase === "end" && gameType && (
        <EndScreen
          state={state}
          rival={state.rival}
          gameType={gameType}
          onRestart={handleRestart}
          onViewLeaderboard={goToLeaderboard}
        />
      )}

      {state.phase === "leaderboard" && (
        <LeaderboardScreen
          entries={state.leaderboard}
          loading={state.leaderboardLoading}
          error={state.leaderboardError}
          mode={state.mode ?? "secundaria"}
          filter={state.leaderboardFilter}
          myPlayerName={state.playerName}
          myFinalBalance={state.balance}
          onFilterChange={filterLeaderboard}
          onPlayAgain={handleRestart}
          onBack={() => setPhase("end")}
        />
      )}

      {state.phase === "disconnected" && state.disconnectReason && (
        <DisconnectedScreen
          reason={state.disconnectReason}
          rivalName={state.rival?.player_name}
          onRetry={handleDisconnectedRetry}
          onExit={handleRestart}
        />
      )}
    </div>
  );
}
