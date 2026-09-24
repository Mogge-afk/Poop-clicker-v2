import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  GENERATORS,
  ACHIEVEMENTS,
  SKINS,
  GeneratorDef,
  GeneratorState,
  BuyMode,
  SortMode,
  GameSaveData,
  PRESTIGE_COST,
  PRESTIGE_KEEP,
  LAX_COST,
} from './types/game';
import {
  calculateBasePps,
  calculateTotalPps,
  calcNewCostAfterBuy,
  fmt,
  milestoneMultiplier,
} from './utils/calc';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { ClickZone } from './components/ClickZone';
import { UpgradeList } from './components/UpgradeList';
import { GoldenPoop } from './components/GoldenPoop';
import { StatsModal } from './components/StatsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SkinsModal } from './components/SkinsModal';
import { SettingsModal } from './components/SettingsModal';
import { OfflineEarningsModal } from './components/OfflineEarningsModal';

const SAVE_KEY = 'poop_clicker_save_v2';
const LEGACY_SAVE_KEY = 'poop_clicker_save';

interface SplashItem {
  id: number;
  left: number;
  top: number;
  size: number;
}

export default function App() {
  // Game Core States
  const [score, setScore] = useState<number>(0);
  const [totalEver, setTotalEver] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [prestigeMult, setPrestigeMult] = useState<number>(1);
  const [prestigeLevel, setPrestigeLevel] = useState<number>(0);
  const [laxUsed, setLaxUsed] = useState<boolean>(false);
  const [totalPlayTimeSeconds, setTotalPlayTimeSeconds] = useState<number>(0);

  // Generators state
  const [gens, setGens] = useState<GeneratorState[]>(() =>
    GENERATORS.map(g => ({ id: g.id, count: 0, cost: g.baseCost }))
  );

  // Customization & Achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [activeSkin, setActiveSkin] = useState<string>('default');
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(['default']);

  // UI Modes
  const [buyMode, setBuyMode] = useState<BuyMode>(1);
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundTheme, setSoundTheme] = useState<'fart' | 'retro' | 'pop'>('fart');
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.3);

  // Modals
  const [activeModal, setActiveModal] = useState<
    'stats' | 'achievements' | 'skins' | 'settings' | null
  >(null);

  // Offline earnings modal
  const [offlineEarnings, setOfflineEarnings] = useState<{
    show: boolean;
    points: number;
    seconds: number;
  }>({ show: false, points: 0, seconds: 0 });

  // Golden Poop / Frenzy event
  const [frenzySecondsLeft, setFrenzySecondsLeft] = useState<number>(0);
  const frenzyActive = frenzySecondsLeft > 0;

  // Autoclicker detection
  const [cheatActive, setCheatActive] = useState<boolean>(false);
  const [splashes, setSplashes] = useState<SplashItem[]>([]);
  const cheatTimerRef = useRef<number | null>(null);

  // Last save tracking
  const [lastSavedTime, setLastSavedTime] = useState<number>(Date.now());
  const [secondsSinceLastSave, setSecondsSinceLastSave] = useState<number>(0);

  // Toast notification for newly unlocked achievement
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Achievement bonus %
  const achievementBonusPct = useMemo(() => {
    return ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id)).reduce(
      (sum, a) => sum + a.bonusPpsPct,
      0
    );
  }, [unlockedAchievements]);

  // Total PPS calculation
  const totalPps = useMemo(() => {
    return calculateTotalPps(
      gens,
      prestigeMult,
      achievementBonusPct,
      frenzyActive ? 7 : 1
    );
  }, [gens, prestigeMult, achievementBonusPct, frenzyActive]);

  // Click gain calculation
  const clickGain = useMemo(() => {
    return 1 * prestigeMult * (frenzyActive ? 7 : 1);
  }, [prestigeMult, frenzyActive]);

  // Current active skin emoji
  const activeSkinEmoji = useMemo(() => {
    const s = SKINS.find(x => x.id === activeSkin);
    return s ? s.emoji : '💩';
  }, [activeSkin]);

  // ==========================================
  // LOAD SAVE ON MOUNT
  // ==========================================
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setScore(Number(data.score) || 0);
        setTotalEver(Number(data.totalEver) || 0);
        setTotalClicks(Number(data.totalClicks) || 0);
        setPrestigeMult(Number(data.prestigeMult) || 1);
        setPrestigeLevel(Number(data.prestigeLevel) || 0);
        setLaxUsed(Boolean(data.laxUsed));
        setTotalPlayTimeSeconds(Number(data.totalPlayTimeSeconds) || 0);

        if (Array.isArray(data.gens)) {
          setGens(prev =>
            prev.map(g => {
              const saved = data.gens.find((x: GeneratorState) => x.id === g.id);
              if (saved) {
                return {
                  id: g.id,
                  count: Number(saved.count) || 0,
                  cost: Number(saved.cost) || g.cost,
                };
              }
              return g;
            })
          );
        }

        if (Array.isArray(data.unlockedAchievements)) {
          setUnlockedAchievements(data.unlockedAchievements);
        }

        if (data.activeSkin) {
          setActiveSkin(data.activeSkin);
        }

        if (Array.isArray(data.unlockedSkins)) {
          setUnlockedSkins(data.unlockedSkins);
        }

        // Calculate AFK Offline Income
        if (data.lastSavedTime) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - data.lastSavedTime) / 1000);
          if (elapsedSeconds > 15) {
            // Calculate base income rate with saved generators
            const baseGens = Array.isArray(data.gens) ? data.gens : [];
            const baseRate = calculateBasePps(baseGens) * (data.prestigeMult || 1);
            // Cap offline progress at 8 hours (28800s)
            const cappedSeconds = Math.min(elapsedSeconds, 28800);
            const offlineGained = Math.floor(baseRate * cappedSeconds);

            if (offlineGained > 0) {
              setScore(prev => prev + offlineGained);
              setTotalEver(prev => prev + offlineGained);
              setOfflineEarnings({
                show: true,
                points: offlineGained,
                seconds: elapsedSeconds,
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Kunde inte ladda sparad data:', e);
    }
  }, []);

  // Sync sound manager enabled, volume, and theme state
  useEffect(() => {
    soundManager.enabled = soundEnabled;
    soundManager.volume = soundVolume;
    soundManager.theme = soundTheme;
    soundManager.setMusicVolume(musicVolume);
    if (musicEnabled) {
      soundManager.startMusic();
    } else {
      soundManager.stopMusic();
    }
  }, [soundEnabled, soundVolume, soundTheme, musicEnabled, musicVolume]);

  const handleToggleMusic = useCallback(() => {
    setMusicEnabled(prev => {
      const next = !prev;
      if (next) soundManager.startMusic();
      else soundManager.stopMusic();
      return next;
    });
  }, []);

  // ==========================================
  // TICK LOOPS
  // ==========================================

  // Fast tick loop for Passive income (100ms)
  // Notice: this updates numeric state smoothly and DOES NOT recreate DOM elements!
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (totalPps > 0) {
        const gain = totalPps / 10;
        setScore(prev => prev + gain);
        setTotalEver(prev => prev + gain);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [totalPps]);

  // Second tick loop: Play time, Frenzy countdown, seconds since save
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTotalPlayTimeSeconds(prev => prev + 1);

      setFrenzySecondsLeft(prev => (prev > 0 ? prev - 1 : 0));

      setSecondsSinceLastSave(Math.floor((Date.now() - lastSavedTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [lastSavedTime]);

  // Autosave loop (every 10 seconds)
  useEffect(() => {
    const saveInterval = window.setInterval(() => {
      handleSave();
    }, 10000);

    const handleBeforeUnload = () => {
      handleSave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

  // Achievement and Skin unlock check loop
  useEffect(() => {
    const currentSaveData: GameSaveData = {
      score,
      totalEver,
      totalClicks,
      prestigeMult,
      prestigeLevel,
      laxUsed,
      gens,
      unlockedAchievements,
      activeSkin,
      unlockedSkins,
      lastSavedTime,
      totalPlayTimeSeconds,
    };

    // Check Achievements
    ACHIEVEMENTS.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id) && ach.condition(currentSaveData)) {
        setUnlockedAchievements(prev => [...prev, ach.id]);
        soundManager.playMilestone();
        setToastMessage(`🏆 Ny prestation: "${ach.title}" (+${ach.bonusPpsPct}% PPS)`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    });

    // Check Skins
    SKINS.forEach(skin => {
      if (!unlockedSkins.includes(skin.id) && skin.isUnlocked(currentSaveData)) {
        setUnlockedSkins(prev => [...prev, skin.id]);
        setToastMessage(`✨ Nytt skin upplåst: "${skin.name}"!`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    });
  }, [score, totalEver, totalClicks, prestigeLevel, gens, laxUsed]);

  // ==========================================
  // ACTIONS
  // ==========================================

  const handleSave = useCallback(() => {
    const data: GameSaveData = {
      score,
      totalEver,
      totalClicks,
      prestigeMult,
      prestigeLevel,
      laxUsed,
      gens,
      unlockedAchievements,
      activeSkin,
      unlockedSkins,
      lastSavedTime: Date.now(),
      totalPlayTimeSeconds,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      setLastSavedTime(Date.now());
      setSecondsSinceLastSave(0);
    } catch (e) {
      console.error('Kunde inte spara spel:', e);
    }
  }, [
    score,
    totalEver,
    totalClicks,
    prestigeMult,
    prestigeLevel,
    laxUsed,
    gens,
    unlockedAchievements,
    activeSkin,
    unlockedSkins,
    totalPlayTimeSeconds,
  ]);

  const handleManualClick = useCallback(() => {
    setScore(prev => prev + clickGain);
    setTotalEver(prev => prev + clickGain);
    setTotalClicks(prev => prev + 1);
  }, [clickGain]);

  const handleBuyUpgrade = useCallback(
    (id: string, amount: number, totalCost: number) => {
      if (amount <= 0 || score < totalCost) return;

      setScore(prev => Math.max(0, prev - totalCost));
      setGens(prev =>
        prev.map(g => {
          if (g.id !== id) return g;
          const nextCount = g.count + amount;
          const nextCost = calcNewCostAfterBuy(g.cost, amount);

          // Check if passed a milestone for celebration sound
          const oldMult = milestoneMultiplier(g.count);
          const newMult = milestoneMultiplier(nextCount);
          if (newMult > oldMult) {
            soundManager.playMilestone();
          } else {
            soundManager.playBuy();
          }

          return { ...g, count: nextCount, cost: nextCost };
        })
      );
    },
    [score]
  );

  const handleUseLax = useCallback(() => {
    if (laxUsed || score < LAX_COST) return;
    const bonus = score * 4;
    setScore(prev => prev + bonus);
    setTotalEver(prev => prev + bonus);
    setLaxUsed(true);
    soundManager.playPrestige();
  }, [laxUsed, score]);

  const handlePrestige = useCallback(() => {
    if (score < PRESTIGE_COST) return;
    const nextLevel = prestigeLevel + 1;
    const nextMult = nextLevel + 1;

    setPrestigeLevel(nextLevel);
    setPrestigeMult(nextMult);
    setScore(PRESTIGE_KEEP);
    setTotalEver(0);
    setLaxUsed(false);
    setGens(GENERATORS.map(g => ({ id: g.id, count: 0, cost: g.baseCost })));
    soundManager.playPrestige();
    handleSave();
  }, [score, prestigeLevel, handleSave]);

  const handleGoldenCollect = useCallback(
    (type: 'frenzy' | 'instant_points') => {
      if (type === 'frenzy') {
        setFrenzySecondsLeft(15);
        setToastMessage('🔥 7x BAJS-RUSCH AKTIVERAD I 15 SEKUNDER! Klicka som en galning!');
      } else {
        // Instant points: 15% of bank or at least 3 minutes of PPS
        const minReward = Math.max(totalPps * 180, 500);
        const reward = Math.max(score * 0.15, minReward);
        setScore(prev => prev + reward);
        setTotalEver(prev => prev + reward);
        setToastMessage(`💰 Gyllene tur! Du fick +${fmt(reward)} skitpoäng!`);
      }
      setTimeout(() => setToastMessage(null), 4000);
    },
    [score, totalPps]
  );

  const handleCheatDetected = useCallback(() => {
    if (cheatActive) return;
    setCheatActive(true);
    soundManager.playCheatAlarm();

    // Spawn 10 humorous splash elements
    const newSplashes: SplashItem[] = [
      [10, 10], [80, 10], [10, 45], [80, 45], [45, 25],
      [20, 75], [75, 75], [50, 55], [30, 20], [65, 30]
    ].map(([l, t], idx) => ({
      id: idx,
      left: l,
      top: t,
      size: 24 + Math.random() * 26,
    }));

    setSplashes(newSplashes);

    if (cheatTimerRef.current) clearTimeout(cheatTimerRef.current);
    cheatTimerRef.current = window.setTimeout(() => {
      setCheatActive(false);
      setSplashes([]);
    }, 4500);
  }, [cheatActive]);

  const handleExportSave = useCallback(() => {
    const data: GameSaveData = {
      score,
      totalEver,
      totalClicks,
      prestigeMult,
      prestigeLevel,
      laxUsed,
      gens,
      unlockedAchievements,
      activeSkin,
      unlockedSkins,
      lastSavedTime: Date.now(),
      totalPlayTimeSeconds,
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }, [
    score,
    totalEver,
    totalClicks,
    prestigeMult,
    prestigeLevel,
    laxUsed,
    gens,
    unlockedAchievements,
    activeSkin,
    unlockedSkins,
    totalPlayTimeSeconds,
  ]);

  const handleImportSave = useCallback((saveCode: string): boolean => {
    try {
      const decoded = decodeURIComponent(escape(atob(saveCode)));
      const data = JSON.parse(decoded);
      if (typeof data.score !== 'number') return false;

      setScore(data.score || 0);
      setTotalEver(data.totalEver || 0);
      setTotalClicks(data.totalClicks || 0);
      setPrestigeMult(data.prestigeMult || 1);
      setPrestigeLevel(data.prestigeLevel || 0);
      setLaxUsed(Boolean(data.laxUsed));
      setTotalPlayTimeSeconds(data.totalPlayTimeSeconds || 0);

      if (Array.isArray(data.gens)) {
        setGens(data.gens);
      }
      if (Array.isArray(data.unlockedAchievements)) {
        setUnlockedAchievements(data.unlockedAchievements);
      }
      if (data.activeSkin) {
        setActiveSkin(data.activeSkin);
      }
      if (Array.isArray(data.unlockedSkins)) {
        setUnlockedSkins(data.unlockedSkins);
      }
      handleSave();
      return true;
    } catch {
      return false;
    }
  }, [handleSave]);

  const handleHardReset = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(LEGACY_SAVE_KEY);
    setScore(0);
    setTotalEver(0);
    setTotalClicks(0);
    setPrestigeMult(1);
    setPrestigeLevel(0);
    setLaxUsed(false);
    setTotalPlayTimeSeconds(0);
    setGens(GENERATORS.map(g => ({ id: g.id, count: 0, cost: g.baseCost })));
    setUnlockedAchievements([]);
    setActiveSkin('default');
    setUnlockedSkins(['default']);
    setFrenzySecondsLeft(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#120d07] text-[#f5e6c8] flex flex-col items-center">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-3 z-50 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2c1d0f] to-[#452a11] border border-[#e29e34] shadow-2xl text-xs sm:text-sm font-bold text-[#ffd880] flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        musicEnabled={musicEnabled}
        onToggleMusic={handleToggleMusic}
        onOpenStats={() => setActiveModal('stats')}
        onOpenAchievements={() => setActiveModal('achievements')}
        onOpenSkins={() => setActiveModal('skins')}
        onOpenSettings={() => setActiveModal('settings')}
        achievementCount={unlockedAchievements.length}
        totalAchievements={ACHIEVEMENTS.length}
      />

      {/* Main Game Container */}
      <main className="w-full max-w-lg px-4 pb-12 flex flex-col items-center">
        {/* Clickable Zone with Mascot, Score and Passive income */}
        <ClickZone
          score={score}
          pps={totalPps}
          clickGain={clickGain}
          prestigeMult={prestigeMult}
          prestigeLevel={prestigeLevel}
          activeSkinEmoji={activeSkinEmoji}
          frenzyActive={frenzyActive}
          frenzySecondsLeft={frenzySecondsLeft}
          onManualClick={handleManualClick}
          onCheatDetected={handleCheatDetected}
          cheatActive={cheatActive}
        />

        {/* Upgrades & Powerups Section (Persistent React List) */}
        <UpgradeList
          generators={GENERATORS}
          generatorStates={gens}
          score={score}
          totalEver={totalEver}
          totalPps={totalPps}
          buyMode={buyMode}
          onSetBuyMode={setBuyMode}
          sortMode={sortMode}
          onSetSortMode={setSortMode}
          onBuyUpgrade={handleBuyUpgrade}
          laxUsed={laxUsed}
          onUseLax={handleUseLax}
          prestigeLevel={prestigeLevel}
          onPrestige={handlePrestige}
        />
      </main>

      {/* Random Floating Golden Poop Event */}
      <GoldenPoop onCollect={handleGoldenCollect} />

      {/* Humorous Autoclicker Splat Overlay */}
      {splashes.map(s => (
        <div
          key={s.id}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}px`,
          }}
          className="fixed pointer-events-none z-40 select-none animate-[splashIn_0.3s_ease-out_forwards]"
        >
          💩
        </div>
      ))}

      {/* Modals */}
      <StatsModal
        isOpen={activeModal === 'stats'}
        onClose={() => setActiveModal(null)}
        score={score}
        totalEver={totalEver}
        totalClicks={totalClicks}
        totalPlayTimeSeconds={totalPlayTimeSeconds}
        prestigeLevel={prestigeLevel}
        prestigeMult={prestigeMult}
        totalPps={totalPps}
        generators={GENERATORS}
        generatorStates={gens}
        unlockedAchievementsCount={unlockedAchievements.length}
        totalAchievementsCount={ACHIEVEMENTS.length}
      />

      <AchievementsModal
        isOpen={activeModal === 'achievements'}
        onClose={() => setActiveModal(null)}
        achievements={ACHIEVEMENTS}
        unlockedIds={unlockedAchievements}
      />

      <SkinsModal
        isOpen={activeModal === 'skins'}
        onClose={() => setActiveModal(null)}
        skins={SKINS}
        activeSkinId={activeSkin}
        unlockedSkinIds={unlockedSkins}
        onSelectSkin={setActiveSkin}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        soundTheme={soundTheme}
        onSetSoundTheme={setSoundTheme}
        soundVolume={soundVolume}
        onSetSoundVolume={setSoundVolume}
        musicEnabled={musicEnabled}
        onToggleMusic={handleToggleMusic}
        musicVolume={musicVolume}
        onSetMusicVolume={setMusicVolume}
        onManualSave={handleSave}
        onExportSave={handleExportSave}
        onImportSave={handleImportSave}
        onHardReset={handleHardReset}
        lastSavedSecondsAgo={secondsSinceLastSave}
      />

      <OfflineEarningsModal
        isOpen={offlineEarnings.show}
        points={offlineEarnings.points}
        secondsAway={offlineEarnings.seconds}
        onClaim={() => setOfflineEarnings(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
