import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Gift,
  Award,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { fmt } from '../utils/calc';
import { soundManager } from '../utils/audio';
import { Language } from '../utils/i18n';

export type ChallengeType = 'clicks' | 'buildings' | 'golden' | 'score_bank' | 'crits';

export interface DailyChallenge {
  id: string;
  type: ChallengeType;
  titleSv: string;
  titleEn: string;
  descSv: string;
  descEn: string;
  icon: string;
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  rewardType: 'points' | 'buff_frenzy' | 'buff_speed';
  rewardValue: number; // e.g. points amount or seconds of buff
  rewardLabelSv: string;
  rewardLabelEn: string;
}

export interface DailyChallengesState {
  date: string; // YYYY-MM-DD
  challenges: DailyChallenge[];
  allClaimedBonusCollected: boolean;
  streak: number;
  lastCompletedDate?: string;
}

interface DailyChallengesProps {
  isOpen: boolean;
  onClose: () => void;
  challengesState: DailyChallengesState;
  onClaimReward: (challengeId: string) => void;
  onClaimAllBonus: () => void;
  language: Language;
}

export const DailyChallenges: React.FC<DailyChallengesProps> = ({
  isOpen,
  onClose,
  challengesState,
  onClaimReward,
  onClaimAllBonus,
  language = 'sv',
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  // Calculate time remaining until midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const { challenges, allClaimedBonusCollected, streak } = challengesState;
  const completedCount = challenges.filter(c => c.completed).length;
  const allCompleted = completedCount === challenges.length && challenges.length > 0;
  const totalCount = challenges.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div className="w-full max-w-md bg-[#191108] border border-[#4d3215] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-[#24170c] border-b border-[#3b2411] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3d2713] flex items-center justify-center border border-[#6b4722] text-[#ffd700]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#f5e6c8] font-display flex items-center gap-1.5">
                {language === 'sv' ? 'Dagliga Utmaningar' : 'Daily Challenges'}
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#3d2713] text-[#e2ba34] font-mono border border-[#5c3a1c]">
                  {completedCount}/{totalCount}
                </span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-[#a8875a]">
                <Clock className="w-3 h-3 text-[#e29e34]" />
                <span>
                  {language === 'sv' ? 'Nya uppdrag om:' : 'Resets in:'}{' '}
                  <strong className="text-[#ffd880] font-mono">{timeLeft}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Stäng"
            className="p-1.5 rounded-lg bg-[#2d1d0e] hover:bg-[#3d2713] text-[#a8875a] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-3 sm:p-4 space-y-3 overflow-y-auto">
          {/* Daily Streak & Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-[#2c1a0c] via-[#3a2310] to-[#2c1a0c] border border-[#5a3a19] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#180f07] border border-[#e29e34]/40 flex items-center justify-center shadow-inner">
                <Flame className="w-5 h-5 text-[#f97316] animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#f5e6c8] flex items-center gap-1">
                  <span>{language === 'sv' ? 'Dags-svit (Streak):' : 'Daily Streak:'}</span>
                  <span className="text-[#ffd700] font-black">{streak} {language === 'sv' ? 'dagar' : 'days'}</span>
                </div>
                <div className="text-[10px] text-[#a8875a]">
                  {streak >= 3
                    ? (language === 'sv' ? '🔥 1.5x bonusbelöningar aktiva!' : '🔥 1.5x bonus rewards active!')
                    : (language === 'sv' ? 'Slutför uppdrag dagligen för större bonusar!' : 'Complete quests daily for bigger rewards!')}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#4d3215] text-[#ffd880]">
                {challengesState.date}
              </span>
            </div>
          </div>

          {/* Three Daily Quests Cards */}
          <div className="space-y-2.5">
            {challenges.map(ch => {
              const progress = Math.min(100, Math.round((ch.current / ch.target) * 100));
              const title = language === 'sv' ? ch.titleSv : ch.titleEn;
              const desc = language === 'sv' ? ch.descSv : ch.descEn;
              const rewardLabel = language === 'sv' ? ch.rewardLabelSv : ch.rewardLabelEn;

              return (
                <div
                  key={ch.id}
                  className={`p-3 rounded-xl border transition-all ${
                    ch.claimed
                      ? 'bg-[#1a1108]/60 border-[#382310]/50 opacity-75'
                      : ch.completed
                      ? 'bg-gradient-to-r from-[#2c200c] to-[#382710] border-[#ffd700] shadow-md'
                      : 'bg-[#20140a] border-[#422912]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-2xl select-none shrink-0 mt-0.5">{ch.icon}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-[#f5e6c8] flex items-center gap-1.5 flex-wrap">
                          <span>{title}</span>
                          {ch.claimed && (
                            <span className="text-[9px] bg-[#14532d] text-[#86efac] px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {language === 'sv' ? 'HÄMTAD' : 'CLAIMED'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#a8875a] mt-0.5">{desc}</div>
                      </div>
                    </div>

                    {/* Claim Button / Status */}
                    <div className="shrink-0">
                      {ch.claimed ? (
                        <div className="text-[10px] text-[#715437] font-semibold flex items-center gap-1 px-2 py-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8bd14a]" />
                        </div>
                      ) : ch.completed ? (
                        <button
                          onClick={() => {
                            soundManager.playMilestone();
                            onClaimReward(ch.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#eab308] to-[#ca8a04] hover:from-[#facc15] hover:to-[#eab308] text-[#1a1108] text-xs font-black shadow-md flex items-center gap-1 transition-all cursor-pointer animate-pulse"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>{language === 'sv' ? 'Hämta' : 'Claim'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-[#8a7252] bg-[#180f07] px-2 py-1 rounded border border-[#3b2411]">
                          {ch.current} / {ch.target}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar & Reward summary */}
                  <div className="mt-2.5 space-y-1">
                    <div className="w-full h-2 rounded-full bg-[#110b06] overflow-hidden border border-[#382310]">
                      <div
                        style={{ width: `${progress}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          ch.completed
                            ? 'bg-gradient-to-r from-[#10b981] to-[#34d399]'
                            : 'bg-gradient-to-r from-[#d97706] to-[#f59e0b]'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#8a7252] font-mono">
                      <span>{progress}%</span>
                      <span className="text-[#ffd880] font-semibold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#ffd700]" />
                        {rewardLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grand Completion Chest (when all 3 are finished) */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              allClaimedBonusCollected
                ? 'bg-[#181109]/40 border-[#382310]/40 opacity-70'
                : allCompleted
                ? 'bg-gradient-to-r from-[#3b2b0e] via-[#4d3611] to-[#3b2b0e] border-[#ffd700] shadow-lg animate-pulse'
                : 'bg-[#181109] border-[#382310] opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl select-none">👑</span>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#ffd700] flex items-center gap-1.5">
                    <span>{language === 'sv' ? 'Dagens Mästarkista (3/3)' : "Daily Master's Chest (3/3)"}</span>
                    {allClaimedBonusCollected && (
                      <span className="text-[9px] bg-[#14532d] text-[#86efac] px-1.5 py-0.2 rounded font-mono font-bold">
                        {language === 'sv' ? 'ÖPPNAD' : 'OPENED'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#b8956e]">
                    {language === 'sv'
                      ? 'Klarar du alla 3 uppdrag låser du upp 60s Bajs-rusch & superbonus!'
                      : 'Complete all 3 quests to unleash 60s Poop Frenzy & super bonus!'}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {allClaimedBonusCollected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#8bd14a]" />
                ) : allCompleted ? (
                  <button
                    onClick={() => {
                      soundManager.playMilestone();
                      onClaimAllBonus();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f59e0b] to-[#ffd700] hover:from-[#ffe033] hover:to-[#ffe033] text-[#120d07] text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer animate-bounce"
                  >
                    <Gift className="w-4 h-4 fill-current" />
                    <span>{language === 'sv' ? 'Öppna Kista!' : 'Open Chest!'}</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono font-bold text-[#8a7252]">
                    {completedCount}/3
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#20140a] border-t border-[#3b2411] flex items-center justify-between text-xs text-[#8a7252]">
          <span>{language === 'sv' ? 'Uppdragen nollställs varje natt kl 00:00' : 'Quests reset every midnight at 00:00'}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-[#2d1d0e] hover:bg-[#3d2713] text-[#f5e6c8] font-bold text-xs transition-colors cursor-pointer"
          >
            {language === 'sv' ? 'Stäng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
