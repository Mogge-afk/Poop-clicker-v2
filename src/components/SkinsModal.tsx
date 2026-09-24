import React from 'react';
import { X, Sparkles, Check, Lock } from 'lucide-react';
import { Skin } from '../types/game';
import { SkinGraphic } from './SkinGraphic';

interface SkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skins: Skin[];
  activeSkinId: string;
  unlockedSkinIds: string[];
  onSelectSkin: (id: string) => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  isOpen,
  onClose,
  skins,
  activeSkinId,
  unlockedSkinIds,
  onSelectSkin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#1d130a] border border-[#54381b] rounded-2xl p-5 shadow-2xl text-[#f5e6c8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3d2713]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e2ba34]" />
            <h2 className="text-lg font-bold">Skins & Utseenden</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="p-1 rounded-lg text-[#9e7d55] hover:text-[#f5e6c8] hover:bg-[#2d1c0e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#a88960] mt-2 mb-3">
          Välj hur din klick-bajs ska se ut. Nya skins låses upp genom dina prestationer i spelet!
        </p>

        {/* Skins List */}
        <div className="overflow-y-auto space-y-2.5 pr-1">
          {skins.map(skin => {
            const isUnlocked = unlockedSkinIds.includes(skin.id);
            const isActive = activeSkinId === skin.id;

            return (
              <div
                key={skin.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  isActive
                    ? 'bg-[#3b2713] border-[#a06b2d] shadow-sm'
                    : isUnlocked
                    ? 'bg-[#24170c] hover:bg-[#2c1d0f] border-[#4d3215]'
                    : 'bg-[#181008]/60 border-[#382310]/40 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 shrink-0 flex items-center justify-center p-1 rounded-xl bg-[#2d1b0e] border border-[#543517] overflow-hidden">
                    <SkinGraphic skinId={skin.id} className="w-11 h-11" showAura={false} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#f5e6c8] truncate">
                      {skin.name}
                    </div>
                    <div className="text-xs text-[#a3855e] truncate">
                      {skin.desc}
                    </div>
                    {!isUnlocked && (
                      <div className="text-[11px] text-[#e09848] font-medium flex items-center gap-1 mt-0.5">
                        <Lock className="w-3 h-3" /> {skin.unlockReq}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <span className="px-3 py-1.5 rounded-lg bg-[#a6d854]/20 border border-[#a6d854]/50 text-[#a6d854] text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Vald
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onSelectSkin(skin.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#422c16] hover:bg-[#593b1d] text-[#f5e6c8] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Välj
                    </button>
                  ) : (
                    <span className="text-xs text-[#705638] font-medium flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Låst
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#3d2713] flex justify-end mt-3">
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
