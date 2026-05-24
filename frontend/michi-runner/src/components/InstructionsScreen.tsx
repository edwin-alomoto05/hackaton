import { useState } from "react";
import type { GameMode, GameType } from "../types/game";

interface InstructionsScreenProps {
  mode: GameMode;
  gameType: GameType;
  onReady: () => void;
}

const STARS = [
  { top: "5%", left: "5%", s: "0.3vmin", d: "0s" },
  { top: "10%", left: "20%", s: "0.4vmin", d: "-0.5s" },
  { top: "7%", left: "50%", s: "0.25vmin", d: "-1s" },
  { top: "15%", left: "75%", s: "0.35vmin", d: "-1.5s" },
  { top: "80%", left: "10%", s: "0.3vmin", d: "-0.3s" },
  { top: "85%", left: "85%", s: "0.4vmin", d: "-0.8s" },
];

export default function InstructionsScreen({
  mode,
  gameType,
  onReady,
}: InstructionsScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const steps = [
    {
      emoji: "🏃",
      title: "BENI CORRE",
      desc:
        mode === "primaria"
          ? "Beni corre por las calles de Quito automáticamente. ¡Tú tomas las decisiones!"
          : "Beni corre por Quito. El fondo se mueve solo. Tu trabajo es tomar buenas decisiones financieras.",
      color: "#4ade80",
      detail:
        mode === "primaria"
          ? "El juego dura 60 segundos"
          : "El juego dura 60 segundos. Cada decisión afecta tu balance.",
    },
    {
      emoji: "👨",
      title: "EL PERSONAJE TE DETIENE",
      desc:
        mode === "primaria"
          ? "¡Un personaje aparece en el camino! Beni se para y debes elegir qué hacer con tu dinero."
          : "Un NPC aparece con una situación financiera. El juego se pausa y debes decidir.",
      color: "#fde047",
      detail:
        mode === "primaria"
          ? "Tienes 10 segundos para elegir"
          : "Tienes 10 segundos para decidir. Si no eliges, se aplica la peor opción.",
    },
    {
      emoji: "✅",
      title: "ELIGE LA MEJOR OPCIÓN",
      desc:
        mode === "primaria"
          ? "Elige la opción que cuide tu dinero. ¡Las buenas decisiones hacen crecer tu alcancía!"
          : "Analiza las opciones. Las buenas decisiones aumentan tu balance. Las malas lo reducen.",
      color: "#60a5fa",
      detail:
        mode === "primaria"
          ? "Verde = bueno para tu alcancía 🐷\nRojo = malo para tu alcancía 💸"
          : "Verde = buena decisión financiera\nRojo = mala decisión financiera",
    },
    {
      emoji: gameType === "multi" ? "⚔️" : "🏆",
      title: gameType === "multi" ? "VERSUS" : "¡GANA!",
      desc:
        gameType === "multi"
          ? "Compites contra otro jugador en tiempo real. Gana quien termine con más dinero."
          : mode === "primaria"
            ? "¡Acumula la mayor cantidad de moneditas posible en 60 segundos!"
            : "Acumula el mayor balance posible. ¡Cada buena decisión cuenta!",
      color: "#a78bfa",
      detail:
        gameType === "multi"
          ? "Puedes ver el balance de tu rival en el HUD superior derecho"
          : "Tu nivel de Michi sube con buenas decisiones: 😿 → 🐱 → 😸",
    },
  ];

  const step = steps[currentStep];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.s,
            height: s.s,
            background: "#fff",
            animation: `starTwinkleFast 1.5s steps(2) ${s.d} infinite`,
          }}
        />
      ))}

      <div
        className="px-card"
        style={{
          width: "min(90vw, 560px)",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#1a1a2e",
            borderBottom: "0.4vmin solid #fde047",
            padding: "2vmin 3vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.8vmin",
              color: "#fde047",
            }}
          >
            CÓMO JUGAR
          </div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1vmin",
              color: "#94a3b8",
            }}
          >
            {currentStep + 1}/{totalSteps}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.8vmin",
            padding: "1.5vmin 3vmin",
            background: "#09090b",
            justifyContent: "center",
            borderBottom: "0.3vmin solid #27272a",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                width: i === currentStep ? "4vmin" : "1.5vmin",
                height: "1.5vmin",
                background:
                  i === currentStep ? s.color : i < currentStep ? "#4ade80" : "#27272a",
                border: "0.2vmin solid #000",
                transition: "width 0.2s steps(4)",
              }}
            />
          ))}
        </div>

        <div
          key={currentStep}
          style={{
            padding: "3vmin",
            background: "#1a1a2e",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2vmin",
            animation: "rowReveal 0.3s steps(4) forwards",
          }}
        >
          <div
            style={{
              fontSize: "8vmin",
              animation: "countPop 0.4s steps(8) forwards",
            }}
          >
            {step.emoji}
          </div>

          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "2vmin",
              color: step.color,
              textAlign: "center",
              textShadow: "0.2vmin 0.2vmin 0 #000",
            }}
          >
            {step.title}
          </div>

          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.2vmin",
              color: "#f1f5f9",
              textAlign: "center",
              lineHeight: 2,
              maxWidth: "80%",
            }}
          >
            {step.desc}
          </div>

          <div
            style={{
              background: "#09090b",
              border: `0.3vmin solid ${step.color}44`,
              padding: "1.2vmin 2vmin",
              width: "100%",
            }}
          >
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1vmin",
                color: "#94a3b8",
                textAlign: "center",
                lineHeight: 2,
                whiteSpace: "pre-line",
              }}
            >
              {step.detail}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1.5vmin",
            padding: "2vmin 3vmin",
            background: "#0f0f1a",
            borderTop: "0.3vmin solid #27272a",
            justifyContent: "space-between",
          }}
        >
          {currentStep > 0 ? (
            <button
              type="button"
              className="px-btn"
              onClick={() => setCurrentStep((s) => s - 1)}
              style={{
                background: "transparent",
                color: "#94a3b8",
                border: "0.3vmin solid #27272a",
                boxShadow: "0.3vmin 0.3vmin 0 #000",
                fontSize: "1.2vmin",
                padding: "1vmin 2vmin",
              }}
            >
              ← ATRÁS
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              className="px-btn"
              onClick={() => setCurrentStep((s) => s + 1)}
              style={{
                fontSize: "1.2vmin",
                padding: "1vmin 2.5vmin",
              }}
            >
              SIGUIENTE →
            </button>
          ) : (
            <button
              type="button"
              className="px-btn"
              onClick={onReady}
              style={{
                fontSize: "1.4vmin",
                padding: "1.2vmin 3vmin",
                background: "#4ade80",
                animation: "btnAttention 1.5s steps(4) infinite",
              }}
            >
              ▶ ¡EMPEZAR!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
