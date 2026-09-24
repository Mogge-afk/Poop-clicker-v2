import React, { useState, useRef, useEffect, useMemo } from 'react';
import { fmt, fmtPps } from '../utils/calc';
import { soundManager } from '../utils/audio';
import { Flame, Star, Zap, Trophy, Sparkles } from 'lucide-react';
import { SkinGraphic } from './SkinGraphic';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
  isCrit?: boolean;
}

interface ClickZoneProps {
  score: number;
  totalClicks: number;
  pps: number;
  clickGain: number;
  prestigeMult: number;
  prestigeLevel: number;
  activeSkinId: string;
  activeSkinEmoji?: string;
  frenzyActive: boolean;
  frenzySecondsLeft: number;
  onManualClick: (e?: React.MouseEvent | KeyboardEvent) => { gained: number; isCrit: boolean };
  onCheatDetected: () => void;
  cheatActive: boolean;
  hotSauceBought?: boolean;
  plungerBought?: boolean;
  language?: Language;
  onMeterBonus?: (bonusPoints: number) => void;
}

// Milestone targets for Poop-o-Meter
const CLICK_MILESTONES = [
  50, 100, 200, 350, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 25000, 50000,
];

export const ClickZone: React.FC<ClickZoneProps> = ({
  score,
  totalClicks,
  pps,
  clickGain,
  prestigeMult,
  prestigeLevel,
  activeSkinId,
  frenzyActive,
  frenzySecondsLeft,
  onManualClick,
  onCheatDetected,
  cheatActive,
  hotSauceBought = false,
  plungerBought = false,
  language = 'sv',
  onMeterBonus,
}) => {
  const t = TRANSLATIONS[language];
  const [floatingTexts, setFloatingTexts] = useState<FloatingNumber[]>([]);
  const [isPressing, setIsPressing] = useState(false);
  const clickTimesRef = useRef<number[]>([]);
  const floatIdRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Poop-o-Meter Calculation
  const { currentMilestone, prevMilestone, progressPct, clicksLeft } = useMemo(() => {
    let target = CLICK_MILESTONES[CLICK_MILESTONES.length - 1];
    let prev = 0;

    for (let i = 0; i < CLICK_MILESTONES.length; i++) {
      if (totalClicks < CLICK_MILESTONES[i]) {
        target = CLICK_MILESTONES[i];
        prev = i > 0 ? CLICK_MILESTONES[i - 1] : 0;
        break;
      }
    }

    const range = Math.max(1, target - prev);
    const progress = Math.min(100, Math.max(0, ((totalClicks - prev) / range) * 100));
    const left = Math.max(0, target - totalClicks);

    return {
      currentMilestone: target,
      prevMilestone: prev,
      progressPct: progress,
      clicksLeft: left,
    };
  }, [totalClicks]);

  // Track milestone completion celebrations
  const lastReachedRef = useRef<number>(0);
  useEffect(() => {
    // Check if player just reached or passed a milestone
    CLICK_MILESTONES.forEach(m => {
      if (totalClicks >= m && lastReachedRef.current < m) {
        lastReachedRef.current = m;
        soundManager.playMilestone();
        // Give milestone bonus: e.g. 5x clickGain or 15s of PPS
        const bonus = Math.max(clickGain * 15, pps * 10, 250);
        if (onMeterBonus) {
          onMeterBonus(bonus);
        }
      }
    });
  }, [totalClicks, clickGain, pps, onMeterBonus]);

  // Keyboard shortcut: Spacebar to click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        checkCheat();
        setIsPressing(true);
        const res = onManualClick(e);
        soundManager.playClick();

        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          spawnFloatingText(
            rect.left + rect.width / 2 + (Math.random() * 40 - 20),
            rect.top + rect.height / 2 + (Math.random() * 40 - 20),
            res?.gained ?? clickGain,
            res?.isCrit
          );
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPressing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [clickGain, onManualClick]);

  const checkCheat = () => {
    const now = Date.now();
    clickTimesRef.current.push(now);
    if (clickTimesRef.current.length > 25) {
      clickTimesRef.current.shift();
    }
    if (clickTimesRef.current.length >= 10) {
      let fastCount = 0;
      for (let i = clickTimesRef.current.length - 1; i >= clickTimesRef.current.length - 9; i--) {
        if (clickTimesRef.current[i] - clickTimesRef.current[i - 1] < 55) {
          fastCount++;
        }
      }
      if (fastCount >= 8) {
        onCheatDetected();
      }
    }
  };

  const spawnFloatingText = (x: number, y: number, value: number, isCrit: boolean = false) => {
    const id = ++floatIdRef.current;
    setFloatingTexts(prev => [...prev.slice(-15), { id, x, y, value, isCrit }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 850);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    checkCheat();
    const res = onManualClick(e);
    soundManager.playClick();
    spawnFloatingText(e.clientX, e.clientY, res?.gained ?? clickGain, res?.isCrit);
  };

  return (
    <div className="w-full flex flex-col items-center py-3 select-none relative">
      {/* Frenzy Indicator Banner */}
      {frenzyActive && (
        <div className="w-full max-w-sm mb-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#853e0d] via-[#b86111] to-[#853e0d] border border-[#e29e34] shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-white font-bold text-xs tracking-wide">
            <Flame className="w-4 h-4 text-[#ffd700]" />
            <span>{t.frenzyActive}</span>
          </div>
          <span className="text-xs font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded">
            {frenzySecondsLeft}s
          </span>
        </div>
      )}

      {/* Cheat detection warning */}
      {cheatActive && (
        <div className="w-full max-w-sm mb-3 p-2 rounded-lg bg-[#450e0e] border border-[#d63434] text-[#ff8080] text-xs font-bold text-center animate-bounce">
          {t.cheatDetected}
        </div>
      )}

      {/* Main Score Display */}
      <div className="text-center">
        <div className="text-3xl sm:text-4xl font-extrabold text-[#f5e6c8] tracking-tight tabular-nums font-display">
          {fmt(score)}{' '}
          <span className="text-lg sm:text-xl font-medium text-[#c9a775]">
            {t.pointsName}
          </span>
        </div>

        {/* Passive income / PPS */}
        <div className="text-sm font-medium text-[#b09068] mt-0.5 flex items-center justify-center gap-1.5 tabular-nums">
          <Zap className="w-3.5 h-3.5 text-[#e29e34]" />
          <span>{fmtPps(pps)} {t.perSecond}</span>
          {prestigeLevel > 0 && (
            <>
              <span className="text-[#5e4326]">·</span>
              <span className="text-[#a6d854] flex items-center gap-0.5 text-xs font-semibold">
                <Star className="w-3 h-3 fill-current" /> {prestigeMult}x
              </span>
            </>
          )}
        </div>
      </div>

      {/* Big Clickable Mascot */}
      <div className="relative my-3 flex items-center justify-center">
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          aria-label={t.title}
          style={{ touchAction: 'manipulation' }}
          className={`relative p-2 rounded-full cursor-pointer focus:outline-none transition-transform duration-75 select-none ${
            isPressing ? 'scale-90' : 'hover:scale-105 active:scale-90'
          }`}
        >
          <SkinGraphic
            skinId={activeSkinId}
            isPressing={isPressing}
            className="w-36 h-36 sm:w-44 sm:h-44"
            showAura={true}
          />
        </button>

        {/* Outer subtle glow circle */}
        <div className="absolute inset-0 rounded-full bg-[#e29e34]/5 -z-10 pointer-events-none blur-xl" />
      </div>

      {/* Click value hint */}
      <div className="text-xs text-[#8a6e4d] font-medium flex items-center gap-1.5 flex-wrap justify-center mb-3">
        <span>+{fmt(clickGain)} {t.perClick}</span>
        {plungerBought && (
          <span className="text-[10px] bg-[#613b14] text-[#ffd699] px-1.5 py-0.5 rounded font-mono font-bold">
            🪠 +2% PPS
          </span>
        )}
        {hotSauceBought && (
          <span className="text-[10px] bg-[#611414] text-[#ff9999] px-1.5 py-0.5 rounded font-mono font-bold">
            🌶️ 10% CRIT
          </span>
        )}
        <span className="text-[10px] text-[#6d5438]">{t.spaceHint}</span>
      </div>

      {/* ======================================================== */}
      {/* POOP-O-METER: Engaging Click Progress Milestone Bar      */}
      {/* ======================================================== */}
      <div className="w-full max-w-sm px-3 py-2 rounded-xl bg-[#1e1309] border border-[#3d2713] shadow-inner space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#ffd880]">
            <Trophy className="w-3.5 h-3.5 text-[#e29e34]" />
            <span>{t.meterTitle}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3d2713] text-[#c9a775] font-mono">
              {totalClicks} {language === 'sv' ? 'klick' : 'clicks'}
            </span>
          </div>

          <div className="text-[11px] text-[#b09068] font-mono">
            {clicksLeft === 0 ? (
              <span className="text-[#86efac] font-bold animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ffd700]" /> {t.meterReward}
              </span>
            ) : (
              <span>
                <strong className="text-[#f5e6c8]">{clicksLeft}</strong> {t.meterClicks}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3 bg-[#110b06] rounded-full overflow-hidden p-0.5 border border-[#4d3215] relative">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#10b981] transition-all duration-150 relative shadow-sm"
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Sub-label showing current segment */}
        <div className="flex items-center justify-between text-[10px] text-[#786146] font-mono">
          <span>{prevMilestone}</span>
          <span className="text-[#a88a65] font-semibold">
            {Math.round(progressPct)}% — {t.meterNext}: {currentMilestone}
          </span>
          <span>{currentMilestone}</span>
        </div>
      </div>

      {/* Floating Score Numbers */}
      {floatingTexts.map(f => (
        <div
          key={f.id}
          style={{ left: f.x - 24, top: f.y - 20 }}
          className={`fixed pointer-events-none z-50 font-extrabold animate-[floatUp_0.85s_ease-out_forwards] ${
            f.isCrit
              ? 'text-base sm:text-lg text-[#ff4444] scale-125 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] font-black'
              : 'text-sm text-[#95e050] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
          }`}
        >
          {f.isCrit ? '💥 ' : ''}+{fmt(f.value)}
        </div>
      ))}
    </div>
  );
};
