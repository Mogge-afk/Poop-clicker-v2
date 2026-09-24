import React from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  BarChart2,
  Award,
  Sparkles,
  Settings as SettingsIcon,
  Moon,
  Sun,
} from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenSkins: () => void;
  onOpenSettings: () => void;
  achievementCount: number;
  totalAchievements: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  musicEnabled,
  onToggleMusic,
  onOpenStats,
  onOpenAchievements,
  onOpenSkins,
  onOpenSettings,
  achievementCount,
  totalAchievements,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="w-full max-w-lg mx-auto px-3 sm:px-4 pt-3 pb-2.5 flex flex-col gap-2.5 border-b border-[#3d2915]/60 transition-colors">
      {/* Rad 1: Rubrik i två nivåer + Dag/Natt-växlare */}
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          {/* Rad 1: Poop Clicker */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#f5e6c8] leading-tight font-display flex items-center gap-1.5 truncate">
            Poop <span className="text-[#e29e34]">Clicker</span>
          </h1>
          {/* Rad 2: ...Deluxe 💩 */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-[#ffd700] uppercase font-display drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              ...Deluxe
            </span>
            <span className="text-sm select-none" role="img" aria-label="bajs">💩</span>
            <span className="text-[10px] font-semibold text-[#8a7252] ml-0.5">v2.0</span>
          </div>
        </div>

        {/* Dag- och Nattläge-knapp (Standard är nattläge) */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Växla till Dagläge (Ljust tema)' : 'Växla till Nattläge (Mörkt tema - standard)'}
          aria-label={isDarkMode ? 'Aktivera dagläge' : 'Aktivera nattläge'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
            isDarkMode
              ? 'bg-[#25180c] hover:bg-[#382413] text-[#f5e6c8] border-[#4d3215] hover:border-[#ffd700]/50'
              : 'bg-[#ede4d5] hover:bg-[#dfd3c0] text-[#2b1b0c] border-[#cfc1ac] hover:border-[#b45309]/50'
          }`}
        >
          {isDarkMode ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#ffd700] fill-[#ffd700]/20" />
              <span className="text-[11px] sm:text-xs">Natt</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#e29e34] fill-[#e29e34]/30" />
              <span className="text-[11px] sm:text-xs">Dag</span>
            </>
          )}
        </button>
      </div>

      {/* Rad 2: Övriga informationer & Ljudinställningar (Kompakt mobilanpassad meny) */}
      <div className="w-full flex items-center justify-between gap-1.5 p-1.5 rounded-xl bg-[#1c1209]/80 border border-[#3d2915]/70 backdrop-blur-xs">
        {/* Vänster: Ljudinställningar */}
        <div className="flex items-center gap-1">
          {/* SFX Ljudeffekter */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Ljudeffekter: På (klicka för att stänga av)' : 'Ljudeffekter: Av (klicka för att slå på)'}
            aria-label={soundEnabled ? 'Stäng av ljudeffekter' : 'Slå på ljudeffekter'}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#25180c] hover:bg-[#382413] text-[#c9a775] border-[#4d3215]'
                : 'bg-[#181008] text-[#6b553e] border-[#332010]'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#8bd14a]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#856c4d]" />
            )}
            <span className="text-[11px] hidden xs:inline">Ljud</span>
          </button>

          {/* Bakgrundsmusik loop */}
          <button
            onClick={onToggleMusic}
            title={musicEnabled ? 'Bakgrundsmusik: På (klicka för att pausa)' : 'Bakgrundsmusik: Av (klicka för att starta melodin)'}
            aria-label={musicEnabled ? 'Pausa bakgrundsmusik' : 'Starta bakgrundsmusik'}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-[#3b2b10] text-[#ffd700] border-[#c48d28] shadow-[0_0_8px_rgba(255,215,0,0.2)]'
                : 'bg-[#25180c] hover:bg-[#382413] text-[#786146] hover:text-[#c9a775] border-[#4d3215]'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'animate-bounce text-[#ffd700]' : ''}`} />
            <span className="text-[11px] hidden xs:inline">Musik</span>
          </button>
        </div>

        {/* Höger: Spelmenyer (Statistik, Prestationer, Skins, Inställningar) */}
        <div className="flex items-center gap-1">
          {/* Statistik */}
          <button
            onClick={onOpenStats}
            title="Statistik"
            aria-label="Statistik"
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer flex items-center gap-1"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Stats</span>
          </button>

          {/* Prestationer */}
          <button
            onClick={onOpenAchievements}
            title="Prestationer & Utmaningar"
            aria-label="Prestationer & Utmaningar"
            className="relative p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-[#e2ba34]" />
            <span className="text-[11px] hidden sm:inline">Framsteg</span>
            {achievementCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e29e34] text-[#120d07] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {achievementCount}
              </span>
            )}
          </button>

          {/* Skins */}
          <button
            onClick={onOpenSkins}
            title="Skins & Utseenden"
            aria-label="Skins & Utseenden"
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e2ba34]" />
            <span className="text-[11px] hidden sm:inline">Skins</span>
          </button>

          {/* Inställningar */}
          <button
            onClick={onOpenSettings}
            title="Inställningar & Backup"
            aria-label="Inställningar & Backup"
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
