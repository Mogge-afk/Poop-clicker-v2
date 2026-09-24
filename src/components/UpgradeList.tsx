import React, { useMemo } from 'react';
import { GeneratorDef, GeneratorState, BuyMode, SortMode, LAX_COST, PRESTIGE_COST, PRESTIGE_UNLOCK } from '../types/game';
import { UpgradeItem } from './UpgradeItem';
import { fmt, effectivePps } from '../utils/calc';
import { Sparkles, ArrowUpDown, Star, Pill } from 'lucide-react';

interface UpgradeListProps {
  generators: GeneratorDef[];
  generatorStates: GeneratorState[];
  score: number;
  totalEver: number;
  totalPps: number;
  buyMode: BuyMode;
  onSetBuyMode: (mode: BuyMode) => void;
  sortMode: SortMode;
  onSetSortMode: (mode: SortMode) => void;
  onBuyUpgrade: (id: string, amount: number, cost: number) => void;
  laxUsed: boolean;
  onUseLax: () => void;
  prestigeLevel: number;
  onPrestige: () => void;
}

export const UpgradeList: React.FC<UpgradeListProps> = ({
  generators,
  generatorStates,
  score,
  totalEver,
  totalPps,
  buyMode,
  onSetBuyMode,
  sortMode,
  onSetSortMode,
  onBuyUpgrade,
  laxUsed,
  onUseLax,
  prestigeLevel,
  onPrestige,
}) => {
  // Sorted list of generators
  const sortedGens = useMemo(() => {
    const list = generators.map(def => {
      const state = generatorStates.find(s => s.id === def.id) || { id: def.id, count: 0, cost: def.baseCost };
      const currentEffPps = effectivePps(def, state.count);
      const roi = currentEffPps / Math.max(state.cost, 1);
      return { def, state, roi };
    });

    if (sortMode === 'price') {
      list.sort((a, b) => a.state.cost - b.state.cost);
    } else if (sortMode === 'expensive') {
      list.sort((a, b) => b.state.cost - a.state.cost);
    } else if (sortMode === 'roi') {
      list.sort((a, b) => b.roi - a.roi);
    }
    return list;
  }, [generators, generatorStates, sortMode]);

  const canAffordLax = score >= LAX_COST && !laxUsed;
  const canPrestige = score >= PRESTIGE_COST;
  const showPrestige = totalEver >= PRESTIGE_UNLOCK;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Buy Mode Selector Bar */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-[#1c1209] border border-[#3d2713]">
        {( [1, 10, 25, 'next', 'max'] as BuyMode[] ).map(mode => {
          const label = mode === 'next' ? 'Nästa' : mode === 'max' ? 'MAX' : `${mode}x`;
          const isActive = buyMode === mode;
          return (
            <button
              key={String(mode)}
              onClick={() => onSetBuyMode(mode)}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#3b2713] text-[#f5e6c8] border border-[#6b4722] shadow-sm'
                  : 'text-[#967954] hover:text-[#f5e6c8] hover:bg-[#25180c]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Sort Mode Selector */}
      <div className="flex items-center justify-between text-xs text-[#a0825c] px-1">
        <span className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wider text-[#856743]">
          <ArrowUpDown className="w-3 h-3" /> Sortering
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSetSortMode('default')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              sortMode === 'default' ? 'bg-[#382413] text-[#f5e6c8] font-bold' : 'hover:text-[#f5e6c8]'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => onSetSortMode('price')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              sortMode === 'price' ? 'bg-[#382413] text-[#f5e6c8] font-bold' : 'hover:text-[#f5e6c8]'
            }`}
          >
            Billigast
          </button>
          <button
            onClick={() => onSetSortMode('expensive')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              sortMode === 'expensive' ? 'bg-[#382413] text-[#f5e6c8] font-bold' : 'hover:text-[#f5e6c8]'
            }`}
          >
            Dyrast
          </button>
          <button
            onClick={() => onSetSortMode('roi')}
            title="Bäst avkastning per spenderad poäng"
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              sortMode === 'roi' ? 'bg-[#382413] text-[#a6d854] font-bold' : 'hover:text-[#f5e6c8]'
            }`}
          >
            Bäst ROI
          </button>
        </div>
      </div>

      {/* Upgrades Container - Persistent React Nodes! */}
      <div className="flex flex-col gap-2">
        {sortedGens.map(({ def, state }) => (
          <UpgradeItem
            key={def.id}
            def={def}
            state={state}
            score={score}
            totalPps={totalPps}
            buyMode={buyMode}
            onBuy={onBuyUpgrade}
          />
        ))}

        {/* Laxermedel Power-Up Card */}
        <button
          onClick={onUseLax}
          disabled={!canAffordLax}
          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all select-none cursor-pointer ${
            laxUsed
              ? 'bg-[#181109]/40 border-[#382310]/30 opacity-40 cursor-not-allowed'
              : canAffordLax
              ? 'bg-[#382412] hover:bg-[#472e18] border-[#a0682c] text-[#f5e6c8] shadow-md'
              : 'bg-[#21160b] border-[#422912] opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label="laxermedel">💊</span>
            <div className="text-left">
              <div className="font-bold text-sm text-[#ffbc6b] flex items-center gap-1.5">
                <span>Laxermedel Chock</span>
                <span className="text-[10px] bg-[#613b14] text-[#ffd699] px-1.5 py-0.2 rounded font-mono uppercase">
                  Engångs
                </span>
              </div>
              <div className="text-xs text-[#b8956e]">
                {laxUsed ? 'Redan förbrukat i denna runda' : 'Öka nuvarande poäng med 5x direkt!'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#e29e34] tabular-nums">
              {laxUsed ? 'ANVÄNT' : `${fmt(LAX_COST)} sp`}
            </div>
            {!laxUsed && (
              <div className="text-[10px] text-[#8f7454]">
                Krävs: 10k sp
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Prestige Button Banner */}
      {showPrestige && (
        <div className="mt-2 pt-2 border-t border-[#3d2713]/60">
          <button
            onClick={onPrestige}
            disabled={!canPrestige}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              canPrestige
                ? 'bg-gradient-to-r from-[#597818] via-[#6f961e] to-[#597818] hover:from-[#6b911c] hover:to-[#6b911c] text-white shadow-lg border border-[#89bd24] active:scale-[0.99]'
                : 'bg-[#202910] text-[#708a3d] border border-[#38481a] opacity-60 cursor-not-allowed'
            }`}
          >
            <Star className="w-4 h-4 fill-current text-[#ffd700]" />
            <span>
              Prestige till Nivå {prestigeLevel + 1} (x{prestigeLevel + 2} mult)
            </span>
            <span className="font-mono text-xs opacity-90">
              — {fmt(PRESTIGE_COST)} sp
            </span>
          </button>
          <div className="text-[11px] text-center text-[#8a7252] mt-1.5">
            Nollställer uppgraderingar men behåller {300} startpoäng & ger permanent produktionsboost!
          </div>
        </div>
      )}
    </div>
  );
};
