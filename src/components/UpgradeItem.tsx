import React, { useMemo } from 'react';
import { GeneratorDef, GeneratorState, BuyMode, MILESTONES } from '../types/game';
import { fmt, fmtPps, milestoneMultiplier, effectivePps, nextMilestone, calcBuyAmount, calcBuyCost } from '../utils/calc';

interface UpgradeItemProps {
  def: GeneratorDef;
  state: GeneratorState;
  score: number;
  totalPps: number;
  buyMode: BuyMode;
  onBuy: (id: string, amount: number, cost: number) => void;
}

export const UpgradeItem: React.FC<UpgradeItemProps> = React.memo(({
  def,
  state,
  score,
  totalPps,
  buyMode,
  onBuy,
}) => {
  const count = state.count;
  const cost = state.cost;

  // Calculate buy amount and cost based on mode
  const amount = useMemo(() => calcBuyAmount(score, cost, count, buyMode), [score, cost, count, buyMode]);
  const totalCost = useMemo(() => calcBuyCost(cost, amount), [cost, amount]);
  const canAfford = score >= totalCost && amount > 0;

  const currentPps = effectivePps(def, count);
  const totalItemPps = currentPps * count;
  const ppsShare = totalPps > 0 ? Math.round((totalItemPps / totalPps) * 100) : 0;
  const mult = milestoneMultiplier(count);

  // Time remaining until affordable
  const timeToAffordSeconds = useMemo(() => {
    if (canAfford || totalPps <= 0) return null;
    const diff = totalCost - score;
    return Math.ceil(diff / totalPps);
  }, [canAfford, totalCost, score, totalPps]);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canAfford) return;
    onBuy(def.id, amount, totalCost);
  };

  // Milestone Progress Calculation
  const nextM = nextMilestone(count) ?? 200;
  const currentTierIndex = MILESTONES.findIndex(m => count < m);
  const prevMilestone = currentTierIndex > 0 ? MILESTONES[currentTierIndex - 1] : 0;
  const tierProgress = nextM > prevMilestone ? Math.min(100, Math.max(0, Math.round(((count - prevMilestone) / (nextM - prevMilestone)) * 100))) : 100;

  const amountLabel = useMemo(() => {
    if (buyMode === 'max') return amount > 0 ? `MAX (${amount})` : 'MAX (0)';
    if (buyMode === 'next') return `Nästa (${amount})`;
    return `${amount}x`;
  }, [buyMode, amount]);

  return (
    <button
      onClick={handleBuyClick}
      disabled={!canAfford}
      className={`group w-full p-3 rounded-xl border text-left flex flex-col gap-2 transition-all duration-150 select-none relative overflow-hidden cursor-pointer ${
        canAfford
          ? 'bg-[#22160b] hover:bg-[#2c1c0e] active:scale-[0.99] border-[#5a3a19] shadow-sm hover:border-[#855927]'
          : 'bg-[#181109]/70 border-[#382310]/50 opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Top row: Name, emoji, count, cost */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl select-none" role="img" aria-label={def.name}>
            {def.emoji}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[#f5e6c8] text-sm tracking-tight truncate">
                {def.name}
              </span>
              {mult > 1 && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#334b12] text-[#a6d854] border border-[#527a1c]">
                  x{mult}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#a8875a] flex items-center gap-1.5">
              <span>+{fmtPps(effectivePps(def, count))} sp/st</span>
              {ppsShare > 0 && (
                <>
                  <span className="text-[#5a4023]">·</span>
                  <span className="text-[#96be57] font-medium">{ppsShare}% av total</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Count and Price */}
        <div className="text-right shrink-0 pl-2">
          <div className="text-xs font-bold text-[#e0bb7d] tabular-nums">
            {count} st
          </div>
          <div className="text-[11px] font-semibold text-[#e29e34] tabular-nums flex items-center justify-end gap-1">
            <span className="text-[9px] text-[#a8875a] uppercase font-mono px-1 py-0.2 bg-[#2d1e10] rounded border border-[#4d3215]">
              {amountLabel}
            </span>
            <span>{fmt(totalCost)} sp</span>
          </div>
          {timeToAffordSeconds !== null && (
            <div className="text-[10px] text-[#7a6042] font-mono">
              om {timeToAffordSeconds < 60 ? `${timeToAffordSeconds}s` : `${Math.ceil(timeToAffordSeconds / 60)}m`}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Progress Bar to Next Milestone */}
      <div className="w-full flex items-center gap-2 pt-0.5">
        <div className="flex-1 h-1.5 rounded-full bg-[#362311] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#95c942] to-[#bbf05b] transition-all duration-300"
            style={{ width: `${tierProgress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-[#8a6e4e] shrink-0 tabular-nums">
          {count} / {nextM}
        </span>
      </div>
    </button>
  );
});
