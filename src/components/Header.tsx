import React from 'react';
import { Volume2, VolumeX, Music, BarChart2, Award, Sparkles, Settings as SettingsIcon } from 'lucide-react';

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
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between border-b border-[#3d2915]/60">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#f5e6c8] flex items-center gap-1.5 font-display">
          Poop <span className="text-[#e29e34]">Clicker</span>
          <span className="text-2xl select-none" role="img" aria-label="bajs">💩</span>
        </h1>
        <span className="text-[11px] font-semibold tracking-wider text-[#a07f50] uppercase px-1.5 py-0.5 rounded bg-[#25180c] border border-[#4d3215]">
          Deluxe
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={onOpenStats}
          title="Statistik"
          aria-label="Statistik"
          className="p-2 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer"
        >
          <BarChart2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAchievements}
          title="Framsteg & Prestationer"
          aria-label="Framsteg & Prestationer"
          className="relative p-2 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer"
        >
          <Award className="w-4 h-4" />
          {achievementCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#e29e34] text-[#120d07] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {achievementCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSkins}
          title="Skins & Hattar"
          aria-label="Skins & Hattar"
          className="p-2 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#e2ba34]" />
        </button>

        {/* Background Music Loop Toggle */}
        <button
          onClick={onToggleMusic}
          title={musicEnabled ? 'Bakgrundsmusik: På (klicka för att pausa)' : 'Bakgrundsmusik: Av (klicka för att starta melodin)'}
          aria-label={musicEnabled ? 'Pausa bakgrundsmusik' : 'Starta bakgrundsmusik'}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            musicEnabled
              ? 'bg-[#3b2b10] text-[#ffd700] border-[#c48d28] shadow-[0_0_8px_rgba(255,215,0,0.25)]'
              : 'bg-[#25180c] hover:bg-[#382413] text-[#786146] hover:text-[#c9a775] border-[#4d3215]'
          }`}
        >
          <Music className={`w-4 h-4 ${musicEnabled ? 'animate-bounce' : ''}`} />
        </button>

        {/* SFX Mute/Unmute */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Ljudeffekter: På' : 'Ljudeffekter: Av'}
          aria-label={soundEnabled ? 'Stäng av ljudeffekter' : 'Slå på ljudeffekter'}
          className="p-2 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#8bd14a]" /> : <VolumeX className="w-4 h-4 text-[#856c4d]" />}
        </button>

        <button
          onClick={onOpenSettings}
          title="Inställningar & Spara"
          aria-label="Inställningar"
          className="p-2 rounded-lg bg-[#25180c] hover:bg-[#382413] text-[#c9a775] hover:text-[#f5e6c8] border border-[#4d3215] transition-colors cursor-pointer"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
