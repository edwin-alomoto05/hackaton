import { useEffect, useRef, useState } from "react";
import { QUITO_PLACES, getMichiInfo, MODE_CONFIG } from "../constants/runner";
import type { Choice, GameMode, GameType, PlayerState } from "../types/game";

interface HUDProps {
  balance: number;
  happiness: number;
  michiLevel: 1 | 2 | 3;
  michiEmoji: string;
  timeLeft: number;
  mode: GameMode;
  balanceUnit: string;
  gameType: GameType;
  cityIndex: number;
  cityProgress: number;
  rival: PlayerState | null;
  isRivalActive: boolean;
  myBalance: number;
  comboCount: number;
  choices: Choice[];
  showHistory: boolean;
  onToggleHistory: () => void;
}

export function HUD({
  balance,
  happiness,
  michiLevel,
  michiEmoji,
  timeLeft,
  mode,
  balanceUnit,
  gameType,
  cityIndex,
  cityProgress,
  rival,
  isRivalActive,
  myBalance,
  comboCount,
  choices,
  showHistory,
  onToggleHistory,
}: HUDProps) {
  const safeIndex =
    ((cityIndex % QUITO_PLACES.length) + QUITO_PLACES.length) % QUITO_PLACES.length;
  const currentCity = QUITO_PLACES[safeIndex];
  const nextCity = QUITO_PLACES[(safeIndex + 1) % QUITO_PLACES.length];
  const initial = MODE_CONFIG[mode].initialBalance;
  const balancePositive = balance > initial;
  const balanceNegative = balance < initial;
  const barColor = balance >= initial ? "#4ade80" : "#f87171";
  const maxBalance = Math.max(initial * 2, 1);
  const barPct = Math.min(100, Math.max(0, (balance / maxBalance) * 100));
  const michiLabel = getMichiInfo(mode, michiLevel).label;
  const hearts = Math.floor(happiness / 20);

  const prevBalanceRef = useRef(balance);
  const [trailBalance, setTrailBalance] = useState(balance);
  const [balancePulse, setBalancePulse] = useState(false);

  useEffect(() => {
    if (balance !== prevBalanceRef.current) {
      setBalancePulse(true);
      const t = window.setTimeout(() => setBalancePulse(false), 500);
      if (balance < prevBalanceRef.current) {
        setTrailBalance(prevBalanceRef.current);
        const timer = window.setTimeout(() => setTrailBalance(balance), 800);
        prevBalanceRef.current = balance;
        return () => {
          window.clearTimeout(timer);
          window.clearTimeout(t);
        };
      }
      prevBalanceRef.current = balance;
      return () => window.clearTimeout(t);
    }
    setTrailBalance(balance);
    prevBalanceRef.current = balance;
  }, [balance]);

  const trailPct = Math.min(100, Math.max(0, (trailBalance / maxBalance) * 100));
  const isDamaged = balance < trailBalance;
  const urgentTimer = timeLeft <= 10;
  const criticalTimer = timeLeft <= 5;

  const comboTier =
    comboCount >= 4 ? "max" : comboCount === 3 ? "high" : comboCount >= 2 ? "mid" : "none";

  const rivalDiff = (rival?.balance ?? 0) - myBalance;

  return (
    <div
      className={`hud-premium${criticalTimer ? " hud-premium--critical" : urgentTimer ? " hud-premium--urgent" : ""}${comboCount >= 2 ? " hud-premium--combo" : ""}`}
    >
      <div className="hud-premium-glow-bar" style={{ background: currentCity.color }} />

      <div className="hud-premium-main">
        <div className="hud-panel hud-panel--balance">
          <div className="hud-panel-label">
            {michiEmoji} {michiLabel}
          </div>
          <div
            className={`hud-balance-value${balancePositive ? " hud-balance-value--up" : balanceNegative ? " hud-balance-value--down" : ""}${balancePulse ? " hud-balance-value--pulse" : ""}`}
          >
            <span className="hud-balance-unit">{balanceUnit}</span>
            {balance}
          </div>
          <div className="hud-bar-track">
            {isDamaged && <div className="hud-bar-trail" style={{ width: `${trailPct}%` }} />}
            <div className="hud-bar-fill" style={{ width: `${barPct}%`, background: barColor }} />
          </div>
          <div className="hud-hearts" aria-label={`Felicidad ${happiness}%`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < hearts ? "hud-heart hud-heart--full" : "hud-heart"}>
                {i < hearts ? "❤️" : "🤍"}
              </span>
            ))}
          </div>
        </div>

        <div className="hud-panel hud-panel--center">
          <div
            className={`hud-timer-ring${criticalTimer ? " hud-timer-ring--critical" : urgentTimer ? " hud-timer-ring--urgent" : ""}`}
          >
            <span className={`hud-timer-value${criticalTimer ? " blink" : ""}`}>{timeLeft}</span>
            <span className="hud-timer-label">SEG</span>
          </div>

          {comboCount >= 2 && (
            <div className={`hud-combo-badge hud-combo-badge--${comboTier}`}>
              <span className="hud-combo-icon">
                {comboCount >= 4 ? "MAX" : comboCount === 3 ? "++" : "+"}
              </span>
              <span className="hud-combo-mult">x{comboCount}</span>
            </div>
          )}

          <button
            type="button"
            className={`hud-history-btn${showHistory ? " hud-history-btn--active" : ""}`}
            onClick={onToggleHistory}
          >
            📋 {choices.length}
          </button>
        </div>

        {gameType === "single" ? (
          <div className="hud-panel hud-panel--solo">
            <span className="hud-panel-label">SOLO</span>
            <span className="hud-solo-emoji">🐱</span>
            <span className="hud-solo-msg">¡Tú puedes!</span>
          </div>
        ) : (
          <div className="hud-panel hud-panel--rival">
            <div className="hud-rival-header">
              <span className={`hud-rival-dot${isRivalActive ? " hud-rival-dot--live" : ""}`} />
              <span className="hud-rival-name">{rival?.player_name ?? "RIVAL"}</span>
            </div>
            <div className="hud-rival-balance">
              {balanceUnit}
              {rival?.balance ?? "---"}
            </div>
            <div
              className={`hud-rival-diff${rivalDiff > 0 ? " hud-rival-diff--behind" : rivalDiff < 0 ? " hud-rival-diff--ahead" : ""}`}
            >
              {rivalDiff > 0
                ? `▲ +${rivalDiff} rival`
                : rivalDiff < 0
                  ? `▼ ${rivalDiff} tú ganas`
                  : "= EMPATE"}
            </div>
            <div className="hud-rival-happy-track">
              <div className="hud-rival-happy-fill" style={{ width: `${rival?.happiness ?? 50}%` }} />
            </div>
            <span className="hud-rival-happy-label">FELICIDAD RIVAL</span>
          </div>
        )}
      </div>

      <div className="hud-premium-route">
        <div className="hud-route-city hud-route-city--current">
          <span className="hud-route-emoji">{currentCity.emoji}</span>
          <span className="hud-route-name" style={{ color: currentCity.color }}>
            {currentCity.name}
          </span>
        </div>
        <div className="hud-route-track">
          <div
            className="hud-route-fill"
            style={{ width: `${cityProgress}%`, background: currentCity.color }}
          />
          <div
            className="hud-route-michi"
            style={{ left: `${cityProgress}%`, borderColor: currentCity.color }}
          />
        </div>
        <div className="hud-route-city hud-route-city--next">
          <span className="hud-route-emoji">{nextCity.emoji}</span>
          <span className="hud-route-name">{nextCity.name}</span>
        </div>
      </div>

      {showHistory && choices.length > 0 && (
        <div className="hud-history-panel">
          <div className="hud-history-title">ÚLTIMAS DECISIONES:</div>
          {choices
            .slice(-3)
            .reverse()
            .map((c, i) => (
              <div
                key={`${c.id}-${i}`}
                className={`hud-history-row${c.isGood ? " hud-history-row--good" : " hud-history-row--bad"}`}
              >
                <span className="hud-history-emoji">{c.emoji}</span>
                <span className="hud-history-label">{c.label}</span>
                <span className="hud-history-delta">
                  {c.delta >= 0 ? "+" : ""}
                  {balanceUnit}
                  {c.delta}
                </span>
                {c.wasTimeout && <span title="Sin tiempo">⏰</span>}
              </div>
            ))}
          {choices.length > 3 && (
            <div className="hud-history-more">+{choices.length - 3} decisiones más</div>
          )}
        </div>
      )}

      {showHistory && choices.length === 0 && (
        <div className="hud-history-empty">AÚN NO HAY DECISIONES</div>
      )}
    </div>
  );
}
