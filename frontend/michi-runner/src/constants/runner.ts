import type { Dilemma, GameMode } from "../types/game";

export const GAME_DURATION_S = 60;
export const DILEMMA_INTERVAL_MS = 8000;
export const BG_SPEED = 2.5;
export const CITY_DURATION_S = 12;

export const CITIES = [
  {
    index: 0,
    name: "QUITO",
    emoji: "🏔️",
    altitude: "2850m",
    color: "#60a5fa",
    fact: {
      primaria: "¡Quito está muy alto en las montañas!",
      secundaria: "Quito es la capital más alta del mundo",
    },
  },
  {
    index: 1,
    name: "GUAYAQUIL",
    emoji: "🌊",
    altitude: "4m",
    color: "#fb923c",
    fact: {
      primaria: "¡Guayaquil tiene el río más grande!",
      secundaria: "Puerto principal de comercio del Ecuador",
    },
  },
  {
    index: 2,
    name: "CUENCA",
    emoji: "🏛️",
    altitude: "2560m",
    color: "#4ade80",
    fact: {
      primaria: "¡Cuenca tiene catedrales muy bonitas!",
      secundaria: "Patrimonio Cultural de la Humanidad",
    },
  },
  {
    index: 3,
    name: "SALINAS",
    emoji: "🏖️",
    altitude: "2m",
    color: "#fde047",
    fact: {
      primaria: "¡En Salinas hay playa y olas!",
      secundaria: "Principal balneario del Ecuador",
    },
  },
  {
    index: 4,
    name: "OTAVALO",
    emoji: "🌺",
    altitude: "2530m",
    color: "#a78bfa",
    fact: {
      primaria: "¡En Otavalo venden artesanías de colores!",
      secundaria: "Mercado artesanal más famoso de Sudamérica",
    },
  },
] as const;

export const MODE_CONFIG = {
  primaria: {
    label: "Primaria",
    emoji: "🐣",
    ages: "6 a 11 años",
    initialBalance: 10,
    balanceUnit: "🪙",
    accentColor: "#4ade80",
  },
  secundaria: {
    label: "Secundaria",
    emoji: "🎒",
    ages: "12 a 17 años",
    initialBalance: 500,
    balanceUnit: "$",
    accentColor: "#60a5fa",
  },
} as const;

export const MICHI_LEVELS = {
  primaria: [
    { level: 1 as const, min: 0, max: 4, emoji: "😿", label: "Michi sin merienda" },
    { level: 2 as const, min: 5, max: 9, emoji: "🐱", label: "Michi Feliz" },
    { level: 3 as const, min: 10, max: 999, emoji: "😸", label: "Michi con Alcancía" },
  ],
  secundaria: [
    { level: 1 as const, min: 0, max: 399, emoji: "😿", label: "Michi Callejero" },
    { level: 2 as const, min: 400, max: 799, emoji: "🐱", label: "Michi Estudiante" },
    { level: 3 as const, min: 800, max: 9999, emoji: "😸", label: "Michi Emprendedor" },
  ],
} as const;

export const DILEMMAS: Record<GameMode, Dilemma[]> = {
  primaria: [
    {
      id: 1,
      question: "¡Tu abuelita te dio $5! 🎂",
      left: { id: "save", label: "Guardar en alcancía", emoji: "🐷", delta: 3, happinessDelta: 5, isGood: true },
      right: { id: "spend", label: "Comprar dulces", emoji: "🍬", delta: -2, happinessDelta: 10, isGood: false },
    },
    {
      id: 2,
      question: "Quieres un juguete caro 🧸",
      left: { id: "save", label: "Ahorrar varios días", emoji: "📅", delta: 4, happinessDelta: 8, isGood: true },
      right: { id: "debt", label: "Pedir a mamá", emoji: "😬", delta: -3, happinessDelta: 5, isGood: false },
    },
    {
      id: 3,
      question: "Tu amigo vende monedas mágicas 🪄",
      left: { id: "smart", label: "¡Eso es trampa!", emoji: "🚫", delta: 1, happinessDelta: 5, isGood: true },
      right: { id: "scam", label: "¡Las compro todas!", emoji: "😵", delta: -5, happinessDelta: -10, isGood: false },
    },
    {
      id: 4,
      question: "¿Qué haces con tu merienda? 🥪",
      left: { id: "save", label: "Llevo de casa", emoji: "🥪", delta: 2, happinessDelta: 5, isGood: true },
      right: { id: "spend", label: "Compro en la tienda", emoji: "🍟", delta: -2, happinessDelta: 8, isGood: false },
    },
    {
      id: 5,
      question: "Encontraste $2 en el piso 💵",
      left: { id: "honest", label: "Entrego al profesor", emoji: "🎒", delta: 3, happinessDelta: 10, isGood: true },
      right: { id: "spend", label: "Me lo gasto", emoji: "🏪", delta: -1, happinessDelta: 5, isGood: false },
    },
  ],
  secundaria: [
    {
      id: 1,
      question: "¡Te llegó la mesada! 💵",
      left: { id: "save", label: "Ahorrar el 30%", emoji: "🐖", delta: 80, happinessDelta: 8, isGood: true },
      right: { id: "spend", label: "Gastar en ropa", emoji: "👟", delta: -80, happinessDelta: 15, isGood: false },
    },
    {
      id: 2,
      question: "Influencer vende inversión segura 📱",
      left: { id: "smart", label: "Investigo primero", emoji: "📖", delta: 10, happinessDelta: 5, isGood: true },
      right: { id: "scam", label: "Envío mis ahorros", emoji: "🎰", delta: -150, happinessDelta: -20, isGood: false },
    },
    {
      id: 3,
      question: "Tus amigos van al concierto 🎵",
      left: { id: "plan", label: "Ahorré para esto", emoji: "✅", delta: 0, happinessDelta: 20, isGood: true },
      right: { id: "debt", label: "Pido dinero prestado", emoji: "💳", delta: -100, happinessDelta: 10, isGood: false },
    },
    {
      id: 4,
      question: "Tienes talento para diseño 🎨",
      left: { id: "hustle", label: "Vendo stickers online", emoji: "🎨", delta: 60, happinessDelta: 15, isGood: true },
      right: { id: "wait", label: "Espero que me paguen", emoji: "😴", delta: -10, happinessDelta: -5, isGood: false },
    },
    {
      id: 5,
      question: "El arriendo subió inesperado 🏠",
      left: { id: "work", label: "Busco trabajo parcial", emoji: "💪", delta: 40, happinessDelta: 5, isGood: true },
      right: { id: "quit", label: "Dejo de ahorrar", emoji: "😟", delta: -80, happinessDelta: -15, isGood: false },
    },
  ],
};

export const END_MESSAGES: Record<GameMode, Record<1 | 2 | 3, string>> = {
  primaria: {
    1: "¡Sigue practicando! Ahorrar es como regar una plantita 🌱",
    2: "¡Muy bien! Tu alcancía está creciendo 🐷",
    3: "¡Eres un crack! ¡El Michi está orgulloso! 🏆",
  },
  secundaria: {
    1: "Cada error es una lección. ¡La próxima lo harás mejor! 💡",
    2: "¡Buen trabajo! Tus decisiones construyen tu futuro 📈",
    3: "¡Increíble! Cada buena decisión hoy es libertad mañana 🚀",
  },
};

export const STAR_POSITIONS: ReadonlyArray<{ top: string; left: string }> = [
  { top: "6%", left: "8%" },
  { top: "12%", left: "22%" },
  { top: "4%", left: "45%" },
  { top: "18%", left: "68%" },
  { top: "8%", left: "88%" },
  { top: "28%", left: "15%" },
  { top: "32%", left: "52%" },
  { top: "24%", left: "78%" },
  { top: "42%", left: "5%" },
  { top: "38%", left: "35%" },
  { top: "45%", left: "92%" },
  { top: "52%", left: "62%" },
];

export function getMichiLevel(mode: GameMode, balance: number): 1 | 2 | 3 {
  const levels = MICHI_LEVELS[mode];
  for (const entry of levels) {
    if (balance >= entry.min && balance <= entry.max) {
      return entry.level;
    }
  }
  return 3;
}

export function getMichiInfo(mode: GameMode, level: 1 | 2 | 3) {
  return MICHI_LEVELS[mode][level - 1];
}

export const FINANCIAL_CONCEPTS: Record<
  string,
  {
    concept: string;
    explanation: { primaria: string; secundaria: string };
    tip: string;
  }
> = {
  save: {
    concept: "AHORRO",
    explanation: {
      primaria: "Guardar dinero para usarlo después",
      secundaria: "Reservar parte de los ingresos para metas futuras",
    },
    tip: "💡 Regla del 30%: ahorra al menos el 30% de lo que ganas",
  },
  invest: {
    concept: "INVERSIÓN",
    explanation: {
      primaria: "Poner el dinero a trabajar para ganar más",
      secundaria: "Colocar capital en activos que generan rendimiento",
    },
    tip: "💡 Diversifica: no pongas todos los huevos en una canasta",
  },
  smart: {
    concept: "EDUCACIÓN FINANCIERA",
    explanation: {
      primaria: "Aprender antes de tomar decisiones con dinero",
      secundaria: "Investigar antes de comprometer capital",
    },
    tip: "💡 Información = poder: nunca inviertas en lo que no entiendes",
  },
  plan: {
    concept: "PLANIFICACIÓN",
    explanation: {
      primaria: "Pensar antes de gastar el dinero",
      secundaria: "Presupuestar gastos con anticipación",
    },
    tip: "💡 Un presupuesto mensual evita el 80% de los problemas financieros",
  },
  hustle: {
    concept: "EMPRENDIMIENTO",
    explanation: {
      primaria: "Crear tu propio negocio para ganar dinero",
      secundaria: "Generar ingresos adicionales con tus habilidades",
    },
    tip: "💡 Múltiples fuentes de ingreso = mayor estabilidad financiera",
  },
  work: {
    concept: "INGRESO ACTIVO",
    explanation: {
      primaria: "Trabajar para ganar dinero",
      secundaria: "Incrementar ingresos para cubrir gastos inesperados",
    },
    tip: "💡 Aumentar ingresos es tan importante como reducir gastos",
  },
  honest: {
    concept: "INTEGRIDAD",
    explanation: {
      primaria: "Ser honesto siempre vale la pena",
      secundaria: "La reputación financiera se construye con honestidad",
    },
    tip: "💡 La confianza es el activo más valioso en finanzas",
  },
  spend: {
    concept: "GASTO IMPULSIVO",
    explanation: {
      primaria: "Gastar sin pensar reduce tus ahorros",
      secundaria: "Los gastos hormiga destruyen el patrimonio a largo plazo",
    },
    tip: "⚠️ Espera 24 horas antes de comprar algo no planeado",
  },
  debt: {
    concept: "DEUDA",
    explanation: {
      primaria: "Pedir prestado significa pagar más después",
      secundaria: "La deuda mal gestionada consume ingresos futuros",
    },
    tip: "⚠️ Solo endeúdate por activos que generan valor",
  },
  scam: {
    concept: "ESTAFA",
    explanation: {
      primaria: "Hay personas que quieren robarte el dinero",
      secundaria: "Los esquemas Ponzi prometen mucho y dan nada",
    },
    tip: "🚨 Si suena demasiado bueno para ser verdad, es mentira",
  },
  wait: {
    concept: "PROCRASTINACIÓN",
    explanation: {
      primaria: "Esperar demasiado hace perder oportunidades",
      secundaria: "El tiempo es el activo más valioso en finanzas",
    },
    tip: "⚠️ El costo de oportunidad es real: actuar tarde también cuesta",
  },
};

export const COMBO_CONFIG = [
  {
    minCombo: 2,
    maxCombo: 2,
    label: "COMBO x2",
    fires: "🔥",
    bonus: {
      primaria: 2,
      secundaria: 20,
    },
    color: "#fb923c",
  },
  {
    minCombo: 3,
    maxCombo: 3,
    label: "COMBO x3",
    fires: "🔥🔥",
    bonus: {
      primaria: 4,
      secundaria: 40,
    },
    color: "#f87171",
  },
  {
    minCombo: 4,
    maxCombo: 999,
    label: "COMBO MAX",
    fires: "🔥🔥🔥",
    bonus: {
      primaria: 6,
      secundaria: 60,
    },
    color: "#fde047",
  },
] as const;

export function getComboConfig(combo: number) {
  return (
    COMBO_CONFIG.find((c) => combo >= c.minCombo && combo <= c.maxCombo) ?? null
  );
}
