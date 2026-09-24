import React from 'react';
import { Gift, Zap } from 'lucide-react';
import { fmt } from '../utils/calc';

interface OfflineEarningsModalProps {
  isOpen: boolean;
  points: number;
  secondsAway: number;
  onClaim: () => void;
}

export const OfflineEarningsModal: React.FC<OfflineEarningsModalProps> = ({
  isOpen,
  points,
  secondsAway,
  onClaim,
}) => {
  if (!isOpen || points <= 0) return null;

  const minutes = Math.floor(secondsAway / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const timeAwayText = hours > 0
    ? `${hours} timmar och ${remainingMinutes} minuter`
    : `${minutes > 0 ? `${minutes} minuter` : `${secondsAway} sekunder`}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#2d1b0e] to-[#1c1108] border border-[#734c24] rounded-2xl p-6 shadow-2xl text-center text-[#f5e6c8]">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#3d2713] border border-[#e29e34] flex items-center justify-center text-3xl">
          💩✨
        </div>

        <h2 className="text-xl font-bold font-display text-[#ffd780]">
          Välkommen tillbaka!
        </h2>

        <p className="text-xs text-[#b8956e] mt-1">
          Medan du var borta i <span className="text-[#f5e6c8] font-semibold">{timeAwayText}</span> fortsatte dina toaletter och fabriker att producera!
        </p>

        <div className="my-5 p-4 rounded-xl bg-[#22150a] border border-[#543618]">
          <div className="text-xs text-[#a6865c] uppercase font-mono tracking-wider">
            Intjänat AFK
          </div>
          <div className="text-2xl font-extrabold text-[#95e050] font-mono mt-1">
            +{fmt(points)} sp
          </div>
        </div>

        <button
          onClick={onClaim}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#91651e] via-[#b88229] to-[#91651e] hover:from-[#a67423] hover:to-[#a67423] text-white font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" />
          <span>Hämta dina skitpoäng!</span>
        </button>
      </div>
    </div>
  );
};
