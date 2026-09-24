import React from 'react';
import {
  GeneratorDef,
  GeneratorState,
  BuyMode,
  SortMode,
  BOOST_COSTS,
  getPrestigeCost,
  getPrestigeStartingKeep,
  getPrestigeMultiplier,
} from '../types/game';
import { UpgradeItem } from './UpgradeItem';
import { fmt, effectivePps } from '../utils/calc';
import { ArrowUpDown, Star, Sparkles, Check, Zap } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';

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
  // Boost states
  laxUsed: boolean;
  onUseLax: () => void;
  coffeeBought: boolean;
  onBuyCoffee: () => void;
  hotSauceBought: boolean;
  onBuyHotSauce: () => void;
  softTpBought: boolean;
  onBuySoftTp: () => void;
  plungerBought: boolean;
  onBuyPlunger: () => void;
  goldenCornBought: boolean;
  onBuyGoldenCorn: () => void;
  fiberBoostBought: boolean;
  onBuyFiberBoost: () => void;
  // Prestige
  prestigeLevel: number;
  onPrestige: () => void;
  language?: Language;
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
  coffeeBought,
  onBuyCoffee,
  hotSauceBought,
  onBuyHotSauce,
  softTpBought,
  onBuySoftTp,
  plungerBought,
  onBuyPlunger,
  goldenCornBought,
  onBuyGoldenCorn,
  fiberBoostBought,
  onBuyFiberBoost,
  prestigeLevel,
  onPrestige,
  language = 'sv',
}) => {
  const t = TRANSLATIONS[language];

  // Sorted list of generators
  const sortedGens = React.useMemo(() => {
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

  const discountMultiplier = softTpBought ? 0.9 : 1;
  const currentPrestigeCost = getPrestigeCost(prestigeLevel);
  const nextMultiplier = getPrestigeMultiplier(prestigeLevel + 1);
  const startingKeep = getPrestigeStartingKeep(prestigeLevel);
  const canPrestige = score >= currentPrestigeCost;
  const showPrestige = totalEver >= Math.min(currentPrestigeCost * 0.7, 10000) || prestigeLevel > 0;

  // Boost definition cards with translated strings
  const boostItems = [
    {
      id: 'lax',
      name: t.boosts.laxTitle,
      tag: t.boosts.laxTag,
      emoji: '💊',
      desc: t.boosts.laxDesc,
      cost: BOOST_COSTS.lax,
      bought: laxUsed,
      canBuy: score >= BOOST_COSTS.lax && !laxUsed,
      onBuy: onUseLax,
    },
    {
      id: 'coffee',
      name: t.boosts.coffeeTitle,
      tag: t.boosts.coffeeTag,
      emoji: '☕',
      desc: t.boosts.coffeeDesc,
      cost: BOOST_COSTS.coffee,
      bought: coffeeBought,
      canBuy: score >= BOOST_COSTS.coffee && !coffeeBought,
      onBuy: onBuyCoffee,
    },
    {
      id: 'hotSauce',
      name: t.boosts.hotSauceTitle,
      tag: t.boosts.hotSauceTag,
      emoji: '🌶️',
      desc: t.boosts.hotSauceDesc,
      cost: BOOST_COSTS.hotSauce,
      bought: hotSauceBought,
      canBuy: score >= BOOST_COSTS.hotSauce && !hotSauceBought,
      onBuy: onBuyHotSauce,
    },
    {
      id: 'softTp',
      name: t.boosts.softTpTitle,
      tag: t.boosts.softTpTag,
      emoji: '🧼',
      desc: t.boosts.softTpDesc,
      cost: BOOST_COSTS.softTp,
      bought: softTpBought,
      canBuy: score >= BOOST_COSTS.softTp && !softTpBought,
      onBuy: onBuySoftTp,
    },
    {
      id: 'plunger',
      name: t.boosts.plungerTitle,
      tag: t.boosts.plungerTag,
      emoji: '🪠',
      desc: t.boosts.plungerDesc,
      cost: BOOST_COSTS.plunger,
      bought: plungerBought,
      canBuy: score >= BOOST_COSTS.plunger && !plungerBought,
      onBuy: onBuyPlunger,
    },
    {
      id: 'goldenCorn',
      name: t.boosts.goldenCornTitle,
      tag: t.boosts.goldenCornTag,
      emoji: '🌽',
      desc: t.boosts.goldenCornDesc,
      cost: BOOST_COSTS.goldenCorn,
      bought: goldenCornBought,
      canBuy: score >= BOOST_COSTS.goldenCorn && !goldenCornBought,
      onBuy: onBuyGoldenCorn,
    },
    {
      id: 'fiberBoost',
      name: t.boosts.fiberTitle,
      tag: t.boosts.fiberTag,
      emoji: '🌾',
      desc: t.boosts.fiberDesc,
      cost: BOOST_COSTS.fiberBoost,
      bought: fiberBoostBought,
      canBuy: score >= BOOST_COSTS.fiberBoost && !fiberBoostBought,
      onBuy: onBuyFiberBoost,
      isPermanent: true,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Buy Mode Selector Bar */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-[#1c1209] border border-[#3d2713]">
        {( [1, 10, 25, 'next', 'max'] as BuyMode[] ).map(mode => {
          const label = mode === 'next' ? t.nextMilestone : mode === 'max' ? 'MAX' : `${mode}x`;
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
          <Sparkles className="w-3 h-3 text-[#e29e34]" />
          {t.storeTitle}
          {softTpBought && (
            <span className="text-[10px] bg-[#14532d] text-[#86efac] px-1.5 py-0.2 rounded font-mono ml-1 font-bold">
              -10% {language === 'sv' ? 'rabatt' : 'off'}
            </span>
          )}
        </span>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3 text-[#6e5436]" />
          <select
            value={sortMode}
            onChange={e => onSetSortMode(e.target.value as SortMode)}
            aria-label="Sortera uppgraderingar"
            className="bg-[#21160b] text-[#c9a775] text-xs font-semibold rounded-lg px-2 py-1 border border-[#422912] focus:outline-none cursor-pointer"
          >
            <option value="default">{t.sortDefault}</option>
            <option value="price">{t.sortPrice}</option>
            <option value="expensive">{t.sortExpensive}</option>
            <option value="roi">{t.sortRoi}</option>
          </select>
        </div>
      </div>

      {/* Generator Items List */}
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
            discountMult={discountMultiplier}
          />
        ))}
      </div>

      {/* Specialty Boosts & Power-ups Section */}
      <div className="mt-2 pt-2 border-t border-[#3d2713]/60 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#ffd700]">
            <Zap className="w-3.5 h-3.5 text-[#ffd700]" />
            {t.specialBoostsTitle}
          </span>
          <span className="text-[10px] text-[#8a7252]">{t.oneTimePurchase}</span>
        </div>

        {boostItems.map(b => (
          <button
            key={b.id}
            onClick={b.onBuy}
            disabled={!b.canBuy}
            className={`w-full p-2.5 sm:p-3 rounded-xl border flex items-center justify-between transition-all select-none cursor-pointer text-left ${
              b.bought
                ? 'bg-[#181109]/40 border-[#382310]/30 opacity-50 cursor-not-allowed'
                : b.canBuy
                ? b.isPermanent
                  ? 'bg-gradient-to-r from-[#3d2b0e] via-[#4a3410] to-[#3d2b0e] hover:from-[#5c4013] hover:to-[#5c4013] border-[#ffd700] text-[#f5e6c8] shadow-md'
                  : 'bg-[#2b1c0e] hover:bg-[#382412] border-[#a0682c] text-[#f5e6c8] shadow-md'
                : 'bg-[#1e1309] border-[#382310] opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl shrink-0 select-none">{b.emoji}</span>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#ffbc6b] flex items-center gap-1.5 flex-wrap">
                  <span className="truncate">{b.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                      b.isPermanent
                        ? 'bg-[#ffd700] text-[#120d07]'
                        : 'bg-[#613b14] text-[#ffd699]'
                    }`}
                  >
                    {b.tag}
                  </span>
                </div>
                <div className="text-[11px] text-[#b8956e] line-clamp-2">
                  {b.bought ? t.boughtActive : b.desc}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 ml-2">
              <div
                className={`text-xs font-bold tabular-nums flex items-center justify-end gap-1 ${
                  b.bought ? 'text-[#8bd14a]' : 'text-[#ffd700]'
                }`}
              >
                {b.bought ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.boughtActive}</span>
                  </>
                ) : (
                  `${fmt(b.cost)} ${language === 'sv' ? 'sp' : 'pp'}`
                )}
              </div>
              {!b.bought && (
                <div className="text-[10px] text-[#8f7454]">
                  {b.canBuy ? t.buyNow : `${t.required}: ${fmt(b.cost)}`}
                </div>
              )}
            </div>
          </button>
        ))}
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
              {t.prestigeButton} {prestigeLevel + 1} ({nextMultiplier}x mult)
            </span>
            <span className="font-mono text-xs opacity-90">
              — {fmt(currentPrestigeCost)} {language === 'sv' ? 'sp' : 'pp'}
            </span>
          </button>
          <div className="text-[11px] text-center text-[#8a7252] mt-1.5">
            {t.prestigeDesc}
          </div>
        </div>
      )}
    </div>
  );
};
