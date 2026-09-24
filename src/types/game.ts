export interface GeneratorDef {
  id: string;
  emoji: string;
  name: string;
  baseCost: number;
  basePps: number;
  description: string;
  flavor: string;
}

export interface GeneratorState {
  id: string;
  count: number;
  cost: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  bonusPpsPct: number; // e.g. 2 means +2% permanent pps
  condition: (game: GameSaveData) => boolean;
}

export interface GameSaveData {
  score: number;
  totalEver: number;
  totalClicks: number;
  prestigeMult: number;
  prestigeLevel: number;
  laxUsed: boolean;
  gens: GeneratorState[];
  unlockedAchievements: string[];
  activeSkin: string;
  unlockedSkins: string[];
  lastSavedTime: number;
  totalPlayTimeSeconds: number;
  // Boosts & Power-ups
  coffeeBought?: boolean; // +25% passiv produktion (Morgonkaffe)
  hotSauceBought?: boolean; // 10% chans för 5x kritiska klick (Stark Jalapeño)
  softTpBought?: boolean; // 10% rabatt på alla byggnader (Dubbellagers Toapapper)
  plungerBought?: boolean; // Klick ger +2% av nuvarande PPS (Turbo-Vaskrensare)
  goldenCornBought?: boolean; // Gyllene händelser dubbelt så ofta & +5s längre (Gyllene Majskorn)
  fiberBoostBought?: boolean; // Permanent +15% passiv produktion (Permanent Fiber-Boost)
}

export interface Skin {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  unlockReq: string;
  isUnlocked: (game: GameSaveData) => boolean;
}

export type BuyMode = 1 | 10 | 25 | 100 | 'next' | 'max';
export type SortMode = 'default' | 'price' | 'expensive' | 'roi';

export const COST_SCALE = 1.15;
export const PRESTIGE_BASE_COST = 10000;
export const LAX_COST = 10000;

// Boost Upgrade Costs
export const BOOST_COSTS = {
  lax: 10000,
  coffee: 15000, // Morgonkaffe (+25% passiv PPS)
  hotSauce: 35000, // Stark Jalapeño (10% chans för 5x crit klick)
  softTp: 50000, // Dubbellagers Toapapper (10% rabatt på byggnader)
  plunger: 100000, // Turbo-Vaskrensare (+2% av PPS till klickkraft)
  goldenCorn: 250000, // Gyllene Majskorn (2x gyllene spawn & +5s tid)
  fiberBoost: 500000, // Permanent Fiber-Boost (+15% passiv produktion permanent)
};

export const MILESTONES = [25, 50, 75, 100, 125, 150, 175, 200, 250, 300];

/** Progressive cost for next prestige level: Level 0 -> 10k, Level 1 -> 40k, Level 2 -> 160k, Level 3 -> 650k... */
export function getPrestigeCost(level: number): number {
  return Math.floor(PRESTIGE_BASE_COST * Math.pow(4, level));
}

/** Progressive starting points kept after flush: Level 0 -> 300, Level 1 -> 800, Level 2 -> 2000, Level 3 -> 5000... */
export function getPrestigeStartingKeep(level: number): number {
  return Math.floor(300 * Math.pow(2.2, level));
}

/** Permanent multiplier for next prestige level */
export function getPrestigeMultiplier(level: number): number {
  return level + 1;
}

export const GENERATORS: GeneratorDef[] = [
  { id: 'bean', emoji: '🫘', name: 'Bönglas', baseCost: 10, basePps: 1, description: 'Rik på fibrer och gaser.', flavor: 'Början på all god matsmältning.' },
  { id: 'toilet', emoji: '🚽', name: 'Toalett', baseCost: 100, basePps: 5, description: 'Porslinstronen för snabb avlastning.', flavor: 'Spolar automatiskt med dubbel kraft.' },
  { id: 'factory', emoji: '🏭', name: 'Skitfabrik', baseCost: 500, basePps: 20, description: 'Storskalig industriell framställning.', flavor: 'Löpande band dygnet runt.' },
  { id: 'enema', emoji: '💉', name: 'Lavemang', baseCost: 2000, basePps: 80, description: 'Klinisk precision och maximalt flöde.', flavor: 'När inget annat biter.' },
  { id: 'mine', emoji: '⛏️', name: 'Bajsgruva', baseCost: 8000, basePps: 300, description: 'Djupborrning efter forntida lager.', flavor: 'Gruvarbetarna bär gasmask.' },
  { id: 'fossil', emoji: '🦕', name: 'Bajsfossiler', baseCost: 50000, basePps: 1000, description: 'Koprolit från juraperioden.', flavor: 'Museikvalitet med enorm avkastning.' },
  { id: 'reactor', emoji: '☢️', name: 'Bajsreaktor', baseCost: 250000, basePps: 5000, description: 'Kärnklyvning av organiskt avfall.', flavor: 'Glödande grön termisk energi.' },
  { id: 'blackhole', emoji: '🕳️', name: 'Skit-Singularitet', baseCost: 1500000, basePps: 25000, description: 'Ett svart hål av ren fekal massa.', flavor: 'Tid och rum böjs runt toaletten.' },
];

export const SKINS: Skin[] = [
  {
    id: 'default',
    name: 'Klassisk Skit',
    emoji: '💩',
    desc: 'Originalet som startade allt.',
    unlockReq: 'Upplåst från start',
    isUnlocked: () => true,
  },
  {
    id: 'golden',
    name: 'Gyllene Bajs',
    emoji: '👑💩',
    desc: 'Skiner som 24 karats ren rikedom.',
    unlockReq: 'Nå 100 000 totala skitpoäng',
    isUnlocked: (g) => g.totalEver >= 100000,
  },
  {
    id: 'tp',
    name: 'Mjuk Toarulle',
    emoji: '🧻',
    desc: '3-lagers extra skonsam lyx.',
    unlockReq: 'Gör minst 500 klick',
    isUnlocked: (g) => g.totalClicks >= 500,
  },
  {
    id: 'rainbow',
    name: 'Enhörnings-magi',
    emoji: '🦄✨',
    desc: 'Doftar sött och sprider glitter.',
    unlockReq: 'Gör din första Prestige',
    isUnlocked: (g) => g.prestigeLevel >= 1,
  },
  {
    id: 'radioactive',
    name: 'Toxisk Mutant',
    emoji: '☣️💩',
    desc: 'Lyser i mörkret och muterar snabbare.',
    unlockReq: 'Äg minst 1 Bajsreaktor',
    isUnlocked: (g) => (g.gens.find(x => x.id === 'reactor')?.count ?? 0) >= 1,
  },
  {
    id: 'cyber',
    name: 'Cyber-Robo 3000',
    emoji: '🤖💩',
    desc: 'Titanplattor, neonblått cybervisir och AI-kylning.',
    unlockReq: 'Nå minst Prestige Nivå 2',
    isUnlocked: (g) => g.prestigeLevel >= 2,
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_click',
    title: 'Första nöden',
    desc: 'Gör ditt allra första klick.',
    icon: '👆',
    bonusPpsPct: 1,
    condition: (g) => g.totalClicks >= 1,
  },
  {
    id: 'click_100',
    title: 'Kramp i fingret',
    desc: 'Klicka 100 gånger manuellt.',
    icon: '⚡',
    bonusPpsPct: 2,
    condition: (g) => g.totalClicks >= 100,
  },
  {
    id: 'click_1000',
    title: 'Klick-maskin',
    desc: 'Klicka 1 000 gånger manuellt.',
    icon: '🔥',
    bonusPpsPct: 5,
    condition: (g) => g.totalClicks >= 1000,
  },
  {
    id: 'beans_25',
    title: 'Gasexplosion',
    desc: 'Äg 25 bönglas.',
    icon: '🫘',
    bonusPpsPct: 2,
    condition: (g) => (g.gens.find(x => x.id === 'bean')?.count ?? 0) >= 25,
  },
  {
    id: 'toilet_25',
    title: 'Spolmästaren',
    desc: 'Äg 25 toaletter.',
    icon: '🚽',
    bonusPpsPct: 3,
    condition: (g) => (g.gens.find(x => x.id === 'toilet')?.count ?? 0) >= 25,
  },
  {
    id: 'score_10k',
    title: 'Första Tio-tusen',
    desc: 'Generera totalt 10 000 skitpoäng.',
    icon: '💰',
    bonusPpsPct: 3,
    condition: (g) => g.totalEver >= 10000,
  },
  {
    id: 'score_1m',
    title: 'Skitmiljonär',
    desc: 'Nå 1 miljon totalt intjänade skitpoäng!',
    icon: '💎',
    bonusPpsPct: 10,
    condition: (g) => g.totalEver >= 1000000,
  },
  {
    id: 'prestige_1',
    title: 'Reinkarnation',
    desc: 'Gör en Prestige och starta om starkare.',
    icon: '⭐',
    bonusPpsPct: 15,
    condition: (g) => g.prestigeLevel >= 1,
  },
  {
    id: 'lax_taken',
    title: 'Akut explosion',
    desc: 'Använd laxermedel för 5x poängchock.',
    icon: '💊',
    bonusPpsPct: 3,
    condition: (g) => g.laxUsed,
  },
];
