import React from 'react';
import { X, BarChart2, Clock, Zap, MousePointer, Award, Trophy } from 'lucide-react';
import { GeneratorDef, GeneratorState } from '../types/game';
import { fmt, fmtPps, effectivePps } from '../utils/calc';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalEver: number;
  totalClicks: number;
  totalPlayTimeSeconds: number;
  prestigeLevel: number;
  prestigeMult: number;
  totalPps: number;
  generators: GeneratorDef[];
  generatorStates: GeneratorState[];
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  score,
  totalEver,
  totalClicks,
  totalPlayTimeSeconds,
  prestigeLevel,
  prestigeMult,
  totalPps,
  generators,
  generatorStates,
  unlockedAchievementsCount,
  totalAchievementsCount,
}) => {
  if (!isOpen) return null;

  const hours = Math.floor(totalPlayTimeSeconds / 3600);
  const minutes = Math.floor((totalPlayTimeSeconds % 3600) / 60);
  const seconds = totalPlayTimeSeconds % 60;
  const timeStr = `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#1d130a] border border-[#54381b] rounded-2xl p-5 shadow-2xl text-[#f5e6c8] flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3d2713]">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#e29e34]" />
            <h2 className="text-lg font-bold">Spelstatistik</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="p-1 rounded-lg text-[#9e7d55] hover:text-[#f5e6c8] hover:bg-[#2d1c0e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#28190d] border border-[#4a2e15]">
              <div className="text-[#a6865c] flex items-center gap-1 mb-0.5">
                <Trophy className="w-3.5 h-3.5 text-[#e29e34]" />
                <span>Totalt intjänat</span>
              </div>
              <div className="text-sm font-bold font-mono text-[#f5e6c8]">
                {fmt(totalEver)} sp
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#28190d] border border-[#4a2e15]">
              <div className="text-[#a6865c] flex items-center gap-1 mb-0.5">
                <MousePointer className="w-3.5 h-3.5 text-[#a6d854]" />
                <span>Manuella klick</span>
              </div>
              <div className="text-sm font-bold font-mono text-[#f5e6c8]">
                {totalClicks.toLocaleString('sv-SE')} st
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#28190d] border border-[#4a2e15]">
              <div className="text-[#a6865c] flex items-center gap-1 mb-0.5">
                <Clock className="w-3.5 h-3.5 text-[#6eb8f7]" />
                <span>Aktiv speltid</span>
              </div>
              <div className="text-sm font-bold font-mono text-[#f5e6c8]">
                {timeStr}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#28190d] border border-[#4a2e15]">
              <div className="text-[#a6865c] flex items-center gap-1 mb-0.5">
                <Award className="w-3.5 h-3.5 text-[#e0a824]" />
                <span>Prestige & Multi</span>
              </div>
              <div className="text-sm font-bold font-mono text-[#f5e6c8]">
                Nivå {prestigeLevel} (x{prestigeMult})
              </div>
            </div>
          </div>

          {/* Achievement Summary */}
          <div className="p-2.5 rounded-xl bg-[#28190d] border border-[#4a2e15] flex items-center justify-between text-xs">
            <span className="text-[#b5956d]">Upplåsta prestationer:</span>
            <span className="font-bold text-[#e29e34] font-mono">
              {unlockedAchievementsCount} av {totalAchievementsCount}
            </span>
          </div>

          {/* Generator Income Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9c7b52] mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#e29e34]" /> Produktionsfördelning (PPS)
            </h3>
            <div className="space-y-1.5 text-xs">
              {generators.map(def => {
                const state = generatorStates.find(s => s.id === def.id) || { id: def.id, count: 0, cost: def.baseCost };
                const itemTotalPps = state.count * effectivePps(def, state.count);
                const sharePct = totalPps > 0 ? Math.round((itemTotalPps / totalPps) * 100) : 0;

                return (
                  <div key={def.id} className="p-2 rounded-lg bg-[#24170c] border border-[#3e2712]">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>{def.emoji}</span>
                        <span>{def.name}</span>
                        <span className="text-[#876a47] font-mono text-[11px]">({state.count} st)</span>
                      </div>
                      <div className="font-mono text-[#f5e6c8] font-semibold">
                        {fmtPps(itemTotalPps)} sp/s ({sharePct}%)
                      </div>
                    </div>
                    <div className="w-full h-1 bg-[#36210f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#a6d854] rounded-full"
                        style={{ width: `${sharePct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#3d2713] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#362312] hover:bg-[#4a3019] text-[#f5e6c8] font-bold text-xs transition-colors cursor-pointer"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};
