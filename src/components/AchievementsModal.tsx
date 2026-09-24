import React from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  unlockedIds: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  unlockedIds,
}) => {
  if (!isOpen) return null;

  const totalBonusPct = achievements
    .filter(a => unlockedIds.includes(a.id))
    .reduce((sum, a) => sum + a.bonusPpsPct, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#1d130a] border border-[#54381b] rounded-2xl p-5 shadow-2xl text-[#f5e6c8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3d2713]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#e29e34]" />
            <h2 className="text-lg font-bold">Framsteg & Prestationer</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="p-1 rounded-lg text-[#9e7d55] hover:text-[#f5e6c8] hover:bg-[#2d1c0e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bonus Bar */}
        <div className="mt-3 p-3 rounded-xl bg-[#2b1c0e] border border-[#5c3c1a] flex items-center justify-between text-xs">
          <div>
            <div className="text-[#a8875a]">Total permanent produktionsbonus:</div>
            <div className="text-sm font-bold text-[#a6d854] font-mono">
              +{totalBonusPct}% mer sp/sek
            </div>
          </div>
          <div className="text-right text-[#a8875a]">
            {unlockedIds.length} / {achievements.length} klara
          </div>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto py-3 space-y-2 pr-1">
          {achievements.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                  isUnlocked
                    ? 'bg-[#24170c] border-[#5e3e1c]'
                    : 'bg-[#181008]/60 border-[#382310]/40 opacity-55'
                }`}
              >
                <div className="text-2xl select-none shrink-0 p-1 rounded-lg bg-[#2e1c0d] border border-[#4d3215]">
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-[#f5e6c8] truncate">
                      {ach.title}
                    </h3>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-[#a6d854] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Klar
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#7d6143] flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Låst
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a3835a] mt-0.5">
                    {ach.desc}
                  </p>
                  <div className="text-[11px] font-semibold text-[#e29e34] mt-1 font-mono">
                    Belöning: +{ach.bonusPpsPct}% permanent PPS
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
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
