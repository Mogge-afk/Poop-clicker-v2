import React, { useState, useRef, useEffect } from 'react';
import { fmt, fmtPps } from '../utils/calc';
import { soundManager } from '../utils/audio';
import { Flame, Star, Zap } from 'lucide-react';

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface SplashPoop {
  id: number;
  left: number;
  top: number;
  size: number;
}

interface ClickZoneProps {
  score: number;
  pps: number;
  clickGain: number;
  prestigeMult: number;
  prestigeLevel: number;
  activeSkinEmoji: string;
  frenzyActive: boolean;
  frenzySecondsLeft: number;
  onManualClick: (e?: React.MouseEvent | KeyboardEvent) => void;
  onCheatDetected: () => void;
  cheatActive: boolean;
}

export const ClickZone: React.FC<ClickZoneProps> = ({
  score,
  pps,
  clickGain,
  prestigeMult,
  prestigeLevel,
  activeSkinEmoji,
  frenzyActive,
  frenzySecondsLeft,
  onManualClick,
  onCheatDetected,
  cheatActive,
}) => {
  const [floatingTexts, setFloatingTexts] = useState<FloatingNumber[]>([]);
  const [isPressing, setIsPressing] = useState(false);
  const clickTimesRef = useRef<number[]>([]);
  const floatIdRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Keyboard shortcut: Spacebar to click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        checkCheat();
        setIsPressing(true);
        onManualClick(e);
        soundManager.playClick();
        
        // spawn float number near center
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          spawnFloatingText(
            rect.left + rect.width / 2 + (Math.random() * 40 - 20),
            rect.top + rect.height / 2 + (Math.random() * 40 - 20),
            clickGain
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

  const spawnFloatingText = (x: number, y: number, value: number) => {
    const id = ++floatIdRef.current;
    setFloatingTexts(prev => [...prev.slice(-15), { id, x, y, value }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 850);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    checkCheat();
    onManualClick(e);
    soundManager.playClick();
    spawnFloatingText(e.clientX, e.clientY, clickGain);
  };

  return (
    <div className="w-full flex flex-col items-center py-4 select-none relative">
      {/* Frenzy Indicator Banner */}
      {frenzyActive && (
        <div className="w-full max-w-sm mb-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#853e0d] via-[#b86111] to-[#853e0d] border border-[#e29e34] shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-white font-bold text-xs tracking-wide">
            <Flame className="w-4 h-4 text-[#ffd700]" />
            <span>BAJS-RUSCH AKTIV! (7x)</span>
          </div>
          <span className="text-xs font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded">
            {frenzySecondsLeft}s
          </span>
        </div>
      )}

      {/* Cheat detection warning */}
      {cheatActive && (
        <div className="w-full max-w-sm mb-3 p-2 rounded-lg bg-[#450e0e] border border-[#d63434] text-[#ff8080] text-xs font-bold text-center animate-bounce">
          🚨 Autoclicker detekterad! Skiten sprider sig över skärmen!
        </div>
      )}

      {/* Main Score Display */}
      <div className="text-center">
        <div className="text-3xl sm:text-4xl font-extrabold text-[#f5e6c8] tracking-tight tabular-nums font-display">
          {fmt(score)}{' '}
          <span className="text-lg sm:text-xl font-medium text-[#c9a775]">
            skitpoäng
          </span>
        </div>

        {/* Passive income / PPS */}
        <div className="text-sm font-medium text-[#b09068] mt-0.5 flex items-center justify-center gap-1.5 tabular-nums">
          <Zap className="w-3.5 h-3.5 text-[#e29e34]" />
          <span>{fmtPps(pps)} sp/sek</span>
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
      <div className="relative my-4 flex items-center justify-center">
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          aria-label="Klicka på bajsen för poäng"
          style={{ touchAction: 'manipulation' }}
          className={`relative text-7xl sm:text-8xl p-5 rounded-full cursor-pointer focus:outline-none transition-transform duration-75 select-none ${
            isPressing ? 'scale-85 -rotate-3' : 'hover:scale-105 active:scale-85'
          } filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]`}
        >
          {activeSkinEmoji}
        </button>

        {/* Outer subtle glow circle */}
        <div className="absolute inset-0 rounded-full bg-[#e29e34]/5 -z-10 pointer-events-none blur-xl" />
      </div>

      {/* Click value hint */}
      <div className="text-xs text-[#8a6e4d] font-medium flex items-center gap-1">
        <span>+{fmt(clickGain)} sp per klick</span>
        <span className="text-[10px] text-[#6d5438]">(Tips: Tryck Mellanslag)</span>
      </div>

      {/* Floating Score Numbers */}
      {floatingTexts.map(f => (
        <div
          key={f.id}
          style={{ left: f.x - 24, top: f.y - 20 }}
          className="fixed pointer-events-none z-50 text-sm font-extrabold text-[#95e050] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-[floatUp_0.85s_ease-out_forwards]"
        >
          +{fmt(f.value)}
        </div>
      ))}
    </div>
  );
};
