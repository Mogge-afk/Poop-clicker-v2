import React, { useState } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Save,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Volume2,
  Music,
  Play,
  Share2,
  GitBranch,
  Copy,
  Moon,
  Sun,
} from 'lucide-react';
import { soundManager, SoundTheme } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  soundTheme: SoundTheme;
  onSetSoundTheme: (theme: SoundTheme) => void;
  soundVolume: number;
  onSetSoundVolume: (vol: number) => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  musicVolume: number;
  onSetMusicVolume: (vol: number) => void;
  onManualSave: () => void;
  onExportSave: () => string;
  onImportSave: (saveCode: string) => boolean;
  onHardReset: () => void;
  lastSavedSecondsAgo: number;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  soundTheme,
  onSetSoundTheme,
  soundVolume,
  onSetSoundVolume,
  musicEnabled,
  onToggleMusic,
  musicVolume,
  onSetMusicVolume,
  onManualSave,
  onExportSave,
  onImportSave,
  onHardReset,
  lastSavedSecondsAgo,
  isDarkMode = true,
  onToggleTheme,
}) => {
  const [copiedSave, setCopiedSave] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleCopyExport = () => {
    const code = onExportSave();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedSave(true);
      setTimeout(() => setCopiedSave(false), 2500);
    });
  };

  const handleCopyShareLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleApplyImport = () => {
    if (!importCode.trim()) return;
    const ok = onImportSave(importCode.trim());
    if (ok) {
      setImportStatus('Sparfil laddades framgångsrikt!');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1200);
    } else {
      setImportStatus('Felaktig sparfilskod. Kontrollera koden.');
    }
  };

  const handleTestSound = () => {
    soundManager.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#1d130a] border border-[#54381b] rounded-2xl p-5 shadow-2xl text-[#f5e6c8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3d2713]">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#e29e34]" />
            <h2 className="text-lg font-bold">Inställningar, Ljud & Dela</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="p-1 rounded-lg text-[#9e7d55] hover:text-[#f5e6c8] hover:bg-[#2d1c0e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1">
          {/* Background Theme Music Controls */}
          <div className="p-3.5 rounded-xl bg-[#24170c] border border-[#4d3215] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#ffd700]" />
                <span className="text-sm font-semibold text-[#f5e6c8]">Bakgrundsmusik (Themeloop)</span>
              </div>
              <button
                onClick={onToggleMusic}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  musicEnabled
                    ? 'bg-[#3b2b10] text-[#ffd700] border border-[#c48d28]'
                    : 'bg-[#3d2713] text-[#8f7454] border border-[#54381b]'
                }`}
              >
                {musicEnabled ? 'SPELAR' : 'PAUSAD'}
              </button>
            </div>

            {musicEnabled && (
              <div className="space-y-1 pt-1 border-t border-[#382310]">
                <div className="flex justify-between text-xs text-[#a6865c]">
                  <span>Musikvolym</span>
                  <span className="font-mono text-[#f5e6c8]">{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={e => onSetMusicVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#ffd700] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Sound Effects Pack */}
          <div className="p-3.5 rounded-xl bg-[#24170c] border border-[#4d3215] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#a6d854]" />
                <span className="text-sm font-semibold text-[#f5e6c8]">Ljudeffekter (SFX)</span>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-[#3b5912] text-[#c0f06a] border border-[#5e8c1e]'
                    : 'bg-[#3d2713] text-[#8f7454] border border-[#54381b]'
                }`}
              >
                {soundEnabled ? 'PÅ' : 'AV'}
              </button>
            </div>

            {soundEnabled && (
              <>
                {/* Volume Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#a6865c]">
                    <span>Effektvolym</span>
                    <span className="font-mono text-[#f5e6c8]">{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={e => onSetSoundVolume(parseFloat(e.target.value))}
                    className="w-full accent-[#e29e34] cursor-pointer"
                  />
                </div>

                {/* Sound theme / profil */}
                <div className="space-y-1.5 pt-1 border-t border-[#382310]">
                  <div className="flex items-center justify-between text-xs text-[#a6865c]">
                    <span>Klick-ljudtema:</span>
                    <button
                      onClick={handleTestSound}
                      className="text-[10px] text-[#e29e34] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> Provlyssna
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'fart', label: '💨 Squelch/Fis' },
                      { id: 'pop', label: '🫧 Bubbel Pop' },
                      { id: 'retro', label: '👾 8-Bit Retro' },
                    ].map(themeItem => (
                      <button
                        key={themeItem.id}
                        onClick={() => {
                          onSetSoundTheme(themeItem.id as SoundTheme);
                          soundManager.theme = themeItem.id as SoundTheme;
                          soundManager.playClick();
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          soundTheme === themeItem.id
                            ? 'bg-[#3b2713] text-[#ffd880] border-[#a0682c]'
                            : 'bg-[#1a1107] text-[#8c704f] border-[#382310] hover:text-[#f5e6c8]'
                        }`}
                      >
                        {themeItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#3b2411] text-xs">
              <span className="text-[#a6865c]">
                Autosparar (senast för {lastSavedSecondsAgo}s sen)
              </span>
              <button
                onClick={onManualSave}
                className="px-2.5 py-1 rounded-lg bg-[#3b2713] hover:bg-[#4d3319] text-[#f5e6c8] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Save className="w-3 h-3 text-[#a6d854]" /> Spara nu
              </button>
            </div>
          </div>

          {/* Utseende & Tema (Dag/Natt) */}
          {onToggleTheme && (
            <div className="p-3.5 rounded-xl bg-[#24170c] border border-[#4d3215] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#f5e6c8] flex items-center gap-1.5">
                  {isDarkMode ? <Moon className="w-4 h-4 text-[#ffd700]" /> : <Sun className="w-4 h-4 text-[#e29e34]" />}
                  Färgtema (Dag / Natt)
                </span>
                <span className="text-[11px] text-[#8a7252]">
                  {isDarkMode ? 'Nattläge aktivt (standard)' : 'Dagläge aktivt'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { if (!isDarkMode) onToggleTheme(); }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#3b2713] text-[#ffd880] border-[#c48d28] shadow-sm'
                      : 'bg-[#181008] text-[#8c704f] border-[#382310] hover:text-[#f5e6c8]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>🌙 Nattläge (Standard)</span>
                </button>
                <button
                  onClick={() => { if (isDarkMode) onToggleTheme(); }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !isDarkMode
                      ? 'bg-[#3b2713] text-[#ffd880] border-[#c48d28] shadow-sm'
                      : 'bg-[#181008] text-[#8c704f] border-[#382310] hover:text-[#f5e6c8]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>☀️ Dagläge (Ljust)</span>
                </button>
              </div>
            </div>
          )}

          {/* Share with Friends */}
          <div className="p-3.5 rounded-xl bg-[#24170c] border border-[#4d3215] space-y-2">
            <div className="text-sm font-bold text-[#f5e6c8] flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-[#6eb8f7]" /> Dela spelet med vänner
            </div>
            <p className="text-xs text-[#a3855e]">
              Skicka länken direkt så kan vem som helst spela i sin webbläsare på dator eller mobil:
            </p>
            <button
              onClick={handleCopyShareLink}
              className="w-full py-2.5 px-3 rounded-lg bg-[#273847] hover:bg-[#344b5f] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#a6d854]" />
                  <span>Spellänk kopierad till urklipp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopiera spellänk</span>
                </>
              )}
            </button>
          </div>

          {/* GitHub Integration Info */}
          <div className="p-3.5 rounded-xl bg-[#24170c] border border-[#4d3215] space-y-2">
            <div className="text-sm font-bold text-[#f5e6c8] flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-[#e2ba34]" /> Publicera till GitHub
            </div>
            <p className="text-xs text-[#a3855e] leading-relaxed">
              I Google AI Studio klickar du högst upp i menyraden på <span className="font-semibold text-[#f5e6c8]">"Export" / "GitHub"</span> för att automatiskt skapa ett nytt repository på ditt GitHub-konto med alla filer.
            </p>
          </div>

          {/* Export & Backup */}
          <div className="p-3.5 rounded-xl bg-[#24170c] border border-[#4d3215] space-y-2">
            <div className="text-sm font-bold text-[#f5e6c8] flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#e29e34]" /> Exportera sparfil
            </div>
            <p className="text-xs text-[#a3855e]">
              Kopiera koden nedan för att flytta dina poäng till en annan dator eller mobil.
            </p>
            <button
              onClick={handleCopyExport}
              className="w-full py-2 px-3 rounded-lg bg-[#382412] hover:bg-[#4a3018] text-[#f5e6c8] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSave ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#a6d854]" />
                  <span>Kopierad till urklipp!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#e29e34]" />
                  <span>Kopiera sparfilskod</span>
                </>
              )}
            </button>
          </div>

          {/* Import */}
          <div className="p-3.5 rounded-xl bg-[#24170c] border border-[#4d3215] space-y-2">
            <div className="text-sm font-bold text-[#f5e6c8] flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#6eb8f7]" /> Importera sparfil
            </div>
            <textarea
              value={importCode}
              onChange={e => setImportCode(e.target.value)}
              placeholder="Klistra in din sparfilskod här..."
              rows={2}
              className="w-full p-2 rounded-lg bg-[#140c06] border border-[#422912] text-xs font-mono text-[#f5e6c8] placeholder:text-[#6e5336] focus:outline-none focus:border-[#e29e34]"
            />
            {importStatus && (
              <div className="text-xs text-[#e29e34] font-medium">
                {importStatus}
              </div>
            )}
            <button
              onClick={handleApplyImport}
              disabled={!importCode.trim()}
              className="w-full py-2 px-3 rounded-lg bg-[#273847] hover:bg-[#344b5f] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#6eb8f7]" /> Ladda sparfil
            </button>
          </div>

          {/* Reset Progress */}
          <div className="p-3.5 rounded-xl bg-[#2e1313]/60 border border-[#5c2424] space-y-2">
            <div className="text-sm font-bold text-[#f77b7b] flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-[#f77b7b]" /> Radera data & Börja om
            </div>
            <p className="text-xs text-[#b88080]">
              Detta raderar all din sparade progress permanent från webbläsaren.
            </p>
            {confirmReset ? (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-[#ffadad] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#ff4d4d]" />
                  Är du 100% säker? Detta kan inte ångras!
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onHardReset();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#992222] hover:bg-[#b82a2a] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Ja, radera allt
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#3b2713] text-[#f5e6c8] font-bold text-xs transition-colors cursor-pointer"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="py-1.5 px-3 rounded-lg bg-[#4a1818] hover:bg-[#632020] text-[#ff9999] font-bold text-xs transition-colors cursor-pointer"
              >
                Rensa sparfil
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#3d2713] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#362312] hover:bg-[#4a3019] text-[#f5e6c8] font-bold text-xs transition-colors cursor-pointer"
          >
            Klar
          </button>
        </div>
      </div>
    </div>
  );
};
