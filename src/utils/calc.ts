import { COST_SCALE, GENERATORS, MILESTONES, BuyMode, GeneratorDef, GeneratorState } from '../types/game';

const SUFFIXES = [
  '', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg',
];

export function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '0';
  if (Math.abs(n) < 1000) {
    if (Math.abs(n) < 10 && n % 1 !== 0) return n.toFixed(1);
    return Math.floor(n).toLocaleString('sv-SE');
  }
  const tier = Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), SUFFIXES.length - 1);
  const scaled = n / Math.pow(1000, tier);
  return scaled.toFixed(2) + ' ' + SUFFIXES[tier];
}

export function fmtPps(n: number): string {
  if (n < 10) return n.toFixed(1);
  return fmt(n);
}

export function milestoneMultiplier(count: number): number {
  let mult = 1;
  for (const m of MILESTONES) {
    if (count >= m) mult *= 2;
    else break;
  }
  return mult;
}

export function nextMilestone(count: number): number | null {
  for (const m of MILESTONES) {
    if (count < m) return m;
  }
  return null;
}

export function effectivePps(def: GeneratorDef, count: number): number {
  return def.basePps * milestoneMultiplier(count);
}

export function calcBuyAmount(score: number, currentCost: number, count: number, mode: BuyMode, discountMult: number = 1): number {
  const discountedCost = Math.max(1, Math.floor(currentCost * discountMult));
  if (mode === 1) return 1;
  if (mode === 10) return 10;
  if (mode === 25) return 25;
  if (mode === 100) return 100;
  if (mode === 'next') {
    const next = nextMilestone(count);
    if (!next) return 1;
    return Math.max(next - count, 1);
  }
  if (mode === 'max') {
    let s = score;
    let cnt = 0;
    let cost = discountedCost;
    while (s >= cost && cnt < 1000) {
      s -= cost;
      cost = Math.ceil(cost * COST_SCALE);
      cnt++;
    }
    return Math.max(cnt, 0);
  }
  return 1;
}

export function calcBuyCost(baseCost: number, amount: number, discountMult: number = 1): number {
  if (amount <= 0) return 0;
  let total = 0;
  let cost = Math.max(1, Math.floor(baseCost * discountMult));
  for (let i = 0; i < amount; i++) {
    total += cost;
    cost = Math.ceil(cost * COST_SCALE);
  }
  return total;
}

export function calcNewCostAfterBuy(baseCost: number, amount: number): number {
  let cost = baseCost;
  for (let i = 0; i < amount; i++) {
    cost = Math.ceil(cost * COST_SCALE);
  }
  return cost;
}

export function calculateBasePps(gens: GeneratorState[]): number {
  return gens.reduce((sum, g) => {
    const def = GENERATORS.find(x => x.id === g.id);
    if (!def) return sum;
    return sum + g.count * effectivePps(def, g.count);
  }, 0);
}

export function calculateTotalPps(
  gens: GeneratorState[],
  prestigeMult: number,
  achievementBonusPct: number,
  frenzyMult: number = 1,
  passiveBonusPct: number = 0
): number {
  const base = calculateBasePps(gens);
  const achMultiplier = 1 + (achievementBonusPct / 100);
  const passiveMultiplier = 1 + (passiveBonusPct / 100);
  return base * prestigeMult * achMultiplier * passiveMultiplier * frenzyMult;
}
