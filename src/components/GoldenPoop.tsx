import React, { useEffect, useState, useRef } from 'react';
import { soundManager } from '../utils/audio';

interface GoldenPoopProps {
  onCollect: (type: 'frenzy' | 'instant_points') => void;
}

interface GoldenInstance {
  id: number;
  topPct: number;
  direction: 'left-to-right' | 'right-to-left';
  emoji: string;
}

export const GoldenPoop: React.FC<GoldenPoopProps> = ({ onCollect }) => {
  const [activeInstance, setActiveInstance] = useState<GoldenInstance | null>(null);
  const nextSpawnTimeoutRef = useRef<number | null>(null);

  const scheduleNextSpawn = () => {
    // Spawn between 35 and 80 seconds
    const delay = 35000 + Math.random() * 45000;
    nextSpawnTimeoutRef.current = window.setTimeout(() => {
      spawnGolden();
    }, delay);
  };

  const spawnGolden = () => {
    const emojis = ['✨💩✨', '🧻⭐', '👑💩', '🌟💩🌟'];
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const topPct = 15 + Math.random() * 65;
    const direction = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';

    setActiveInstance({
      id: Date.now(),
      topPct,
      direction,
      emoji: selectedEmoji,
    });

    // Despawn after 8.5 seconds if missed
    setTimeout(() => {
      setActiveInstance(prev => {
        if (prev) {
          scheduleNextSpawn();
          return null;
        }
        return null;
      });
    }, 8500);
  };

  useEffect(() => {
    // First spawn after 20 seconds
    const initialTimer = window.setTimeout(() => {
      spawnGolden();
    }, 20000);

    return () => {
      window.clearTimeout(initialTimer);
      if (nextSpawnTimeoutRef.current) {
        window.clearTimeout(nextSpawnTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeInstance) return;

    soundManager.playGolden();
    const isFrenzy = Math.random() > 0.45;
    onCollect(isFrenzy ? 'frenzy' : 'instant_points');
    setActiveInstance(null);
    scheduleNextSpawn();
  };

  if (!activeInstance) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Klicka på gyllene händelse!"
      style={{
        top: `${activeInstance.topPct}%`,
        animation: `${
          activeInstance.direction === 'left-to-right' ? 'flyAcrossRight' : 'flyAcrossLeft'
        } 8.5s linear forwards`,
      }}
      className="fixed z-50 p-2 cursor-pointer bg-amber-500/20 hover:bg-amber-400/40 border border-yellow-300 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.8)] backdrop-blur-xs transition-transform active:scale-90 select-none animate-bounce"
    >
      <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_8px_#ffd700]">
        {activeInstance.emoji}
      </span>
    </button>
  );
};
