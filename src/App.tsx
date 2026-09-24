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
  BOOST_COSTS,
  getPrestigeCost,
  getPrestigeStartingKeep,
  getPrestigeMultiplier,
  LAX_COST,
} from './types/game';
import {
  calculateBasePps,
  calculateTotalPps,
  calcNewCostAfterBuy,
  calcBuyCost,
  fmt,
  milestoneMultiplier,
} from './utils/calc';
import { soundManager } from './utils/audio';
import { Language, TRANSLATIONS } from './utils/i18n';

import { Header } from './components/Header';
import { ClickZone } from './components/ClickZone';
import { UpgradeList } from './components/UpgradeList';
import { GoldenPoop } from './components/GoldenPoop';
import { StatsModal } from './components/StatsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SkinsModal } from './components/SkinsModal';
import { SettingsModal } from './components/SettingsModal';
import { OfflineEarningsModal } from './components/OfflineEarningsModal';
import { DailyChallenges, DailyChallengesState } from './components/DailyChallenges';
import { getTodayDateString, generateDailyChallenges, checkStreak } from './utils/dailyQuests';

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

  // Boost States
  const [coffeeBought, setCoffeeBought] = useState<boolean>(false);
  const [hotSauceBought, setHotSauceBought] = useState<boolean>(false);
  const [softTpBought, setSoftTpBought] = useState<boolean>(false);
  const [plungerBought, setPlungerBought] = useState<boolean>(false);
  const [goldenCornBought, setGoldenCornBought] = useState<boolean>(false);
  const [fiberBoostBought, setFiberBoostBought] = useState<boolean>(false);

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
    'stats' | 'achievements' | 'skins' | 'settings' | 'daily' | null
  >(null);

  // Language state: Swedish ('sv') vs English ('en')
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('poop_clicker_lang');
      if (saved === 'sv' || saved === 'en') return saved;
      // Check browser language
      const browserLang = navigator.language?.toLowerCase() || '';
      return browserLang.startsWith('sv') ? 'sv' : 'en';
    } catch {
      return 'sv';
    }
  });

  const handleToggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next: Language = prev === 'sv' ? 'en' : 'sv';
      try {
        localStorage.setItem('poop_clicker_lang', next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('poop_clicker_lang', lang);
    } catch {
      // ignore
    }
  }, []);

  // Theme state: dark (standard / nattläge) vs light (dagläge)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('poop_clicker_theme');
      return saved ? saved === 'dark' : true; // Nattläge som standard
    } catch {
      return true;
    }
  });

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('poop_clicker_theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('theme-light');
      document.body.style.backgroundColor = '#120d07';
      document.body.style.color = '#f5e6c8';
    } else {
      document.body.classList.add('theme-light');
      document.body.style.backgroundColor = '#faf7f2';
      document.body.style.color = '#2b1b0e';
    }
  }, [isDarkMode]);

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

  // Daily Challenges State
  const [dailyState, setDailyState] = useState<DailyChallengesState>(() => {
    const todayStr = getTodayDateString();
    try {
      const savedRaw = localStorage.getItem('poop_clicker_daily_v1');
      if (savedRaw) {
        const parsed: DailyChallengesState = JSON.parse(savedRaw);
        if (parsed.date === todayStr) {
          return parsed;
        } else {
          // New day! Advance or check streak
          const newStreak = checkStreak(parsed.lastCompletedDate, parsed.streak || 1, todayStr);
          return {
            date: todayStr,
            challenges: generateDailyChallenges(todayStr, 10),
            allClaimedBonusCollected: false,
            streak: newStreak,
            lastCompletedDate: parsed.lastCompletedDate,
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      date: todayStr,
      challenges: generateDailyChallenges(todayStr, 10),
      allClaimedBonusCollected: false,
      streak: 1,
    };
  });

  // Save daily state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('poop_clicker_daily_v1', JSON.stringify(dailyState));
    } catch {
      // ignore
    }
  }, [dailyState]);

  // Achievement bonus %
  const achievementBonusPct = useMemo(() => {
    return ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id)).reduce(
      (sum, a) => sum + a.bonusPpsPct,
      0
    );
  }, [unlockedAchievements]);

  // Passive bonus % from boosts (Coffee: +25%, Fiber Boost: +15%)
  const passiveBonusPct = useMemo(() => {
    let bonus = 0;
    if (coffeeBought) bonus += 25;
    if (fiberBoostBought) bonus += 15;
    return bonus;
  }, [coffeeBought, fiberBoostBought]);

  // Total PPS calculation
  const totalPps = useMemo(() => {
    return calculateTotalPps(
      gens,
      prestigeMult,
      achievementBonusPct,
      frenzyActive ? 7 : 1,
      passiveBonusPct
    );
  }, [gens, prestigeMult, achievementBonusPct, frenzyActive, passiveBonusPct]);

  // Base Click gain calculation
  const baseClickGain = useMemo(() => {
    let base = 1 * prestigeMult;
    if (plungerBought) {
      base += Math.max(1, Math.floor(totalPps * 0.02));
    }
    return base * (frenzyActive ? 7 : 1);
  }, [prestigeMult, plungerBought, totalPps, frenzyActive]);

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

        // Boosts
        setCoffeeBought(Boolean(data.coffeeBought));
        setHotSauceBought(Boolean(data.hotSauceBought));
        setSoftTpBought(Boolean(data.softTpBought));
        setPlungerBought(Boolean(data.plungerBought));
        setGoldenCornBought(Boolean(data.goldenCornBought));
        setFiberBoostBought(Boolean(data.fiberBoostBought));

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

        if (data.language === 'sv' || data.language === 'en') {
          setLanguage(data.language);
        }

        // Calculate AFK Offline Income
        if (data.lastSavedTime) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - data.lastSavedTime) / 1000);
          if (elapsedSeconds > 15) {
            // Calculate base income rate with saved generators
            const baseGens = Array.isArray(data.gens) ? data.gens : [];
            const boostPct = (data.coffeeBought ? 25 : 0) + (data.fiberBoostBought ? 15 : 0);
            const baseRate =
              calculateBasePps(baseGens) *
              (data.prestigeMult || 1) *
              (1 + boostPct / 100);
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
    coffeeBought,
    hotSauceBought,
    softTpBought,
    plungerBought,
    goldenCornBought,
    fiberBoostBought,
  ]);

  // Achievement Check
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
      coffeeBought,
      hotSauceBought,
      softTpBought,
      plungerBought,
      goldenCornBought,
      fiberBoostBought,
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
      coffeeBought,
      hotSauceBought,
      softTpBought,
      plungerBought,
      goldenCornBought,
      fiberBoostBought,
      language,
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
    coffeeBought,
    hotSauceBought,
    softTpBought,
    plungerBought,
    goldenCornBought,
    fiberBoostBought,
  ]);

  // Helper to increment daily challenge progress
  const updateDailyProgress = useCallback((type: 'clicks' | 'buildings' | 'golden' | 'crits', amount: number = 1) => {
    setDailyState(prev => {
      let anyChanged = false;
      const updated = prev.challenges.map(ch => {
        if (ch.type === type && !ch.completed) {
          const nextVal = ch.current + amount;
          const completed = nextVal >= ch.target;
          anyChanged = true;
          if (completed && !ch.completed) {
            soundManager.playMilestone();
            const msg = language === 'sv'
              ? `🌟 DAGLIG UTMANING KLAR: "${ch.titleSv}"! Hämta din belöning i Uppdrag!`
              : `🌟 DAILY CHALLENGE COMPLETED: "${ch.titleEn}"! Claim your reward in Quests!`;
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 4000);
          }
          return {
            ...ch,
            current: nextVal,
            completed,
          };
        }
        return ch;
      });
      return anyChanged ? { ...prev, challenges: updated } : prev;
    });
  }, [language]);

  const handleManualClick = useCallback((): { gained: number; isCrit: boolean } => {
    let gained = baseClickGain;
    let isCrit = false;

    // Hot Sauce: 10% chance for 5x critical hit
    if (hotSauceBought && Math.random() < 0.1) {
      isCrit = true;
      gained *= 5;
    }

    setScore(prev => prev + gained);
    setTotalEver(prev => prev + gained);
    setTotalClicks(prev => prev + 1);

    // Update Daily Quests progress
    updateDailyProgress('clicks', 1);
    if (isCrit) {
      updateDailyProgress('crits', 1);
    }

    return { gained, isCrit };
  }, [baseClickGain, hotSauceBought, updateDailyProgress]);

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

      // Update Daily Quests progress
      updateDailyProgress('buildings', amount);
    },
    [score, updateDailyProgress]
  );

  // 1. Laxative Boost
  const handleUseLax = useCallback(() => {
    if (laxUsed || score < BOOST_COSTS.lax) return;
    const bonus = score * 4;
    setScore(prev => prev + bonus);
    setTotalEver(prev => prev + bonus);
    setLaxUsed(true);
    soundManager.playPrestige();
    setToastMessage('💊 LAXERMEDEL KICKADE IN! Du fick 5x din totala skitbank direkt!');
    setTimeout(() => setToastMessage(null), 4000);
  }, [laxUsed, score]);

  // 2. Coffee Boost
  const handleBuyCoffee = useCallback(() => {
    if (coffeeBought || score < BOOST_COSTS.coffee) return;
    setScore(prev => prev - BOOST_COSTS.coffee);
    setCoffeeBought(true);
    soundManager.playMilestone();
    setToastMessage('☕ MORGONKAFFE INTILLAT! +25% snabbare passiv produktion i denna runda!');
    setTimeout(() => setToastMessage(null), 4000);
  }, [coffeeBought, score]);

  // 3. Hot Sauce Boost
  const handleBuyHotSauce = useCallback(() => {
    if (hotSauceBought || score < BOOST_COSTS.hotSauce) return;
    setScore(prev => prev - BOOST_COSTS.hotSauce);
    setHotSauceBought(true);
    soundManager.playMilestone();
    setToastMessage('🌶️ STARK JALAPEÑO AKTIVERAD! 10% chans för 5x kritiska klick!');
    setTimeout(() => setToastMessage(null), 4000);
  }, [hotSauceBought, score]);

  // 4. Soft TP Discount Boost
  const handleBuySoftTp = useCallback(() => {
    if (softTpBought || score < BOOST_COSTS.softTp) return;
    setScore(prev => prev - BOOST_COSTS.softTp);
    setSoftTpBought(true);
    soundManager.playMilestone();
    setToastMessage('🧼 DUBBELLAGERS TOAPAPPER! 10% rabatt på alla byggnader i denna runda!');
    setTimeout(() => setToastMessage(null), 4000);
  }, [softTpBought, score]);

  // 5. Plunger PPS Click Boost
  const handleBuyPlunger = useCallback(() => {
    if (plungerBought || score < BOOST_COSTS.plunger) return;
    setScore(prev => prev - BOOST_COSTS.plunger);
    setPlungerBought(true);
    soundManager.playMilestone();
    setToastMessage('🪠 TURBO-VASKRENSARE MONTERAD! Manuella klick ger nu +2% av din totala PPS!');
    setTimeout(() => setToastMessage(null), 4000);
  }, [plungerBought, score]);

  // 6. Golden Corn Event Boost
  const handleBuyGoldenCorn = useCallback(() => {
    if (goldenCornBought || score < BOOST_COSTS.goldenCorn) return;
    setScore(prev => prev - BOOST_COSTS.goldenCorn);
    setGoldenCornBought(true);
    soundManager.playMilestone();
    setToastMessage('🌽 GYLLENE MAJSKORN AKTIVT! Gyllene händelser dyker upp dubbelt så ofta!');
    setTimeout(() => setToastMessage(null), 4000);
  }, [goldenCornBought, score]);

  // 7. PERMANENT Fiber-Boost (Persists through Prestige)
  const handleBuyFiberBoost = useCallback(() => {
    if (fiberBoostBought || score < BOOST_COSTS.fiberBoost) return;
    setScore(prev => prev - BOOST_COSTS.fiberBoost);
    setFiberBoostBought(true);
    soundManager.playMilestone();
    setToastMessage('🌾 PERMANENT FIBER-BOOST KÖPT! +15% passiv produktion FÖR ALLTID (behålls även efter spolning)!');
    setTimeout(() => setToastMessage(null), 5000);
  }, [fiberBoostBought, score]);

  // Prestige Flush Toilet
  const handlePrestige = useCallback(() => {
    const requiredCost = getPrestigeCost(prestigeLevel);
    if (score < requiredCost) return;
    const nextLevel = prestigeLevel + 1;
    const nextMult = getPrestigeMultiplier(nextLevel);
    const keepScore = getPrestigeStartingKeep(prestigeLevel);

    setPrestigeLevel(nextLevel);
    setPrestigeMult(nextMult);
    setScore(keepScore);
    setTotalEver(0);

    // Reset round-specific boosts (Lax, Coffee, Hot Sauce, Soft TP, Plunger, Golden Corn)
    setLaxUsed(false);
    setCoffeeBought(false);
    setHotSauceBought(false);
    setSoftTpBought(false);
    setPlungerBought(false);
    setGoldenCornBought(false);
    // Note: fiberBoostBought is PERMANENT and NOT reset!

    setGens(GENERATORS.map(g => ({ id: g.id, count: 0, cost: g.baseCost })));
    soundManager.playPrestige();
    handleSave();
    setToastMessage(
      `🚽 SLURP! Du spolade toaletten & nådde Prestige Nivå ${nextLevel}! Permanent ${nextMult}x produktion!${
        fiberBoostBought ? ' (Permanent Fiber-Boost +15% bevarad!)' : ''
      }`
    );
    setTimeout(() => setToastMessage(null), 4500);
  }, [score, prestigeLevel, fiberBoostBought, handleSave]);

  const handleGoldenCollect = useCallback(
    (type: 'frenzy' | 'instant_points') => {
      if (type === 'frenzy') {
        const frenzyDuration = goldenCornBought ? 20 : 15;
        setFrenzySecondsLeft(frenzyDuration);
        setToastMessage(`🔥 7x BAJS-RUSCH AKTIVERAD I ${frenzyDuration} SEKUNDER! Klicka som en galning!`);
      } else {
        // Instant points: 15% of bank or at least 3 minutes of PPS
        const minReward = Math.max(totalPps * (goldenCornBought ? 240 : 180), 500);
        const reward = Math.max(score * 0.15, minReward);
        setScore(prev => prev + reward);
        setTotalEver(prev => prev + reward);
        setToastMessage(`💰 Gyllene tur! Du fick +${fmt(reward)} skitpoäng!`);
      }
      // Update Daily Quests progress
      updateDailyProgress('golden', 1);
      setTimeout(() => setToastMessage(null), 4000);
    },
    [score, totalPps, goldenCornBought, updateDailyProgress]
  );

  // Claim single daily challenge reward
  const handleClaimChallengeReward = useCallback((challengeId: string) => {
    setDailyState(prev => {
      let rewardGiven = false;
      const updated = prev.challenges.map(ch => {
        if (ch.id === challengeId && ch.completed && !ch.claimed) {
          rewardGiven = true;
          // Apply reward
          if (ch.rewardType === 'points') {
            const streakMult = prev.streak >= 3 ? 1.5 : 1;
            const finalVal = Math.round(ch.rewardValue * streakMult);
            setScore(s => s + finalVal);
            setTotalEver(t => t + finalVal);
            const msg = language === 'sv'
              ? `🎁 BELÖNING HÄMTAD: +${fmt(finalVal)} skitpoäng! ${prev.streak >= 3 ? '(1.5x Streak-bonus!)' : ''}`
              : `🎁 REWARD CLAIMED: +${fmt(finalVal)} poop points! ${prev.streak >= 3 ? '(1.5x Streak bonus!)' : ''}`;
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 4000);
          } else if (ch.rewardType === 'buff_frenzy') {
            setFrenzySecondsLeft(ch.rewardValue);
            const msg = language === 'sv'
              ? `🔥 UTMANINGS-BONUS: 7x BAJS-RUSCH i ${ch.rewardValue} sekunder!`
              : `🔥 QUEST REWARD: 7x POOP FRENZY for ${ch.rewardValue} seconds!`;
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 4000);
          }
          return { ...ch, claimed: true };
        }
        return ch;
      });

      if (!rewardGiven) return prev;
      return { ...prev, challenges: updated };
    });
  }, [language]);

  // Claim Master's Chest (3/3 completed)
  const handleClaimAllBonus = useCallback(() => {
    setDailyState(prev => {
      if (prev.allClaimedBonusCollected) return prev;
      // Unleash 60 seconds Frenzy + huge score bonus based on current PPS
      const bonusPts = Math.max(totalPps * 300, 5000);
      setScore(s => s + bonusPts);
      setTotalEver(t => t + bonusPts);
      setFrenzySecondsLeft(60);

      const todayStr = getTodayDateString();
      const msg = language === 'sv'
        ? `👑 DUMP-MÄSTARE! Dagens kista öppnad: +${fmt(bonusPts)} poäng & 60s Bajs-rusch!`
        : `👑 QUEST MASTER! Daily chest opened: +${fmt(bonusPts)} points & 60s Poop Frenzy!`;
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 5000);

      return {
        ...prev,
        allClaimedBonusCollected: true,
        lastCompletedDate: todayStr,
      };
    });
  }, [totalPps, language]);

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

    if (cheatTimerRef.current) {
      window.clearTimeout(cheatTimerRef.current);
    }

    cheatTimerRef.current = window.setTimeout(() => {
      setCheatActive(false);
      setSplashes([]);
    }, 4500);
  }, [cheatActive]);

  const handleHardReset = useCallback(() => {
    try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(LEGACY_SAVE_KEY);
    } catch {
      // ignore
    }
    setScore(0);
    setTotalEver(0);
    setTotalClicks(0);
    setPrestigeMult(1);
    setPrestigeLevel(0);
    setLaxUsed(false);
    setCoffeeBought(false);
    setHotSauceBought(false);
    setSoftTpBought(false);
    setPlungerBought(false);
    setGoldenCornBought(false);
    setFiberBoostBought(false);
    setTotalPlayTimeSeconds(0);
    setGens(GENERATORS.map(g => ({ id: g.id, count: 0, cost: g.baseCost })));
    setUnlockedAchievements([]);
    setActiveSkin('default');
    setUnlockedSkins(['default']);
    setActiveModal(null);
    setToastMessage('🗑️ Spelet har nollställts helt!');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

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
      coffeeBought,
      hotSauceBought,
      softTpBought,
      plungerBought,
      goldenCornBought,
      fiberBoostBought,
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
    coffeeBought,
    hotSauceBought,
    softTpBought,
    plungerBought,
    goldenCornBought,
    fiberBoostBought,
  ]);

  const handleImportSave = useCallback((encoded: string): boolean => {
    try {
      const decoded = decodeURIComponent(escape(atob(encoded)));
      const data = JSON.parse(decoded);
      if (typeof data.score !== 'number') return false;

      setScore(Number(data.score) || 0);
      setTotalEver(Number(data.totalEver) || 0);
      setTotalClicks(Number(data.totalClicks) || 0);
      setPrestigeMult(Number(data.prestigeMult) || 1);
      setPrestigeLevel(Number(data.prestigeLevel) || 0);
      setLaxUsed(Boolean(data.laxUsed));
      setCoffeeBought(Boolean(data.coffeeBought));
      setHotSauceBought(Boolean(data.hotSauceBought));
      setSoftTpBought(Boolean(data.softTpBought));
      setPlungerBought(Boolean(data.plungerBought));
      setGoldenCornBought(Boolean(data.goldenCornBought));
      setFiberBoostBought(Boolean(data.fiberBoostBought));
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
      if (data.activeSkin) setActiveSkin(data.activeSkin);
      if (Array.isArray(data.unlockedSkins)) setUnlockedSkins(data.unlockedSkins);

      handleSave();
      setToastMessage('✅ Sparfil har lästs in och sparats!');
      setTimeout(() => setToastMessage(null), 3000);
      return true;
    } catch {
      return false;
    }
  }, [handleSave]);

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col items-center transition-colors duration-200 ${
        isDarkMode ? 'bg-[#120d07] text-[#f5e6c8]' : 'theme-light bg-[#faf7f2] text-[#2b1b0e]'
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-3 z-50 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2c1d0f] to-[#452a11] border border-[#e29e34] shadow-2xl text-xs sm:text-sm font-bold text-[#ffd880] flex items-center gap-2 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Two-row Responsive Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        musicEnabled={musicEnabled}
        onToggleMusic={handleToggleMusic}
        onOpenStats={() => setActiveModal('stats')}
        onOpenAchievements={() => setActiveModal('achievements')}
        onOpenSkins={() => setActiveModal('skins')}
        onOpenDaily={() => setActiveModal('daily')}
        onOpenSettings={() => setActiveModal('settings')}
        achievementCount={unlockedAchievements.length}
        totalAchievements={ACHIEVEMENTS.length}
        unclaimedDailyCount={dailyState.challenges.filter(c => c.completed && !c.claimed).length}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Game Container */}
      <main className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 flex flex-col gap-4">
        {/* Clickable Zone with Mascot, Score and Passive income */}
        <ClickZone
          score={score}
          totalClicks={totalClicks}
          pps={totalPps}
          clickGain={baseClickGain}
          prestigeMult={prestigeMult}
          prestigeLevel={prestigeLevel}
          activeSkinId={activeSkin}
          activeSkinEmoji={activeSkinEmoji}
          frenzyActive={frenzyActive}
          frenzySecondsLeft={frenzySecondsLeft}
          onManualClick={handleManualClick}
          onCheatDetected={handleCheatDetected}
          cheatActive={cheatActive}
          hotSauceBought={hotSauceBought}
          plungerBought={plungerBought}
          language={language}
          onMeterBonus={(bonus) => {
            setScore(prev => prev + bonus);
            setTotalEver(prev => prev + bonus);
            const msg = language === 'sv'
              ? `🎯 POOP-O-METER MILSTOLPE NÅDD! Du belönades med +${fmt(bonus)} skitpoäng!`
              : `🎯 POOP-O-METER MILESTONE REACHED! Rewarded with +${fmt(bonus)} poop points!`;
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 4000);
          }}
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
          // Boosts
          laxUsed={laxUsed}
          onUseLax={handleUseLax}
          coffeeBought={coffeeBought}
          onBuyCoffee={handleBuyCoffee}
          hotSauceBought={hotSauceBought}
          onBuyHotSauce={handleBuyHotSauce}
          softTpBought={softTpBought}
          onBuySoftTp={handleBuySoftTp}
          plungerBought={plungerBought}
          onBuyPlunger={handleBuyPlunger}
          goldenCornBought={goldenCornBought}
          onBuyGoldenCorn={handleBuyGoldenCorn}
          fiberBoostBought={fiberBoostBought}
          onBuyFiberBoost={handleBuyFiberBoost}
          // Prestige
          prestigeLevel={prestigeLevel}
          onPrestige={handlePrestige}
          language={language}
        />
      </main>

      {/* Random Floating Golden Poop Event */}
      <GoldenPoop
        onCollect={handleGoldenCollect}
        goldenCornBought={goldenCornBought}
      />

      {/* Humorous Autoclicker Splat Overlay */}
      {splashes.map(s => (
        <div
          key={s.id}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}px`,
          }}
          className="fixed pointer-events-none z-50 select-none animate-[splashIn_0.3s_ease-out_forwards]"
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
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        language={language}
        onSetLanguage={handleSetLanguage}
      />

      <OfflineEarningsModal
        isOpen={offlineEarnings.show}
        points={offlineEarnings.points}
        secondsAway={offlineEarnings.seconds}
        onClaim={() => setOfflineEarnings(prev => ({ ...prev, show: false }))}
      />

      {/* Daily Challenges (Dagliga Utmaningar) Modal */}
      <DailyChallenges
        isOpen={activeModal === 'daily'}
        onClose={() => setActiveModal(null)}
        challengesState={dailyState}
        onClaimReward={handleClaimChallengeReward}
        onClaimAllBonus={handleClaimAllBonus}
        language={language}
      />
    </div>
  );
}
