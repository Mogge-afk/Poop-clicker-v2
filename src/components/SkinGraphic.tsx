import React from 'react';

interface SkinGraphicProps {
  skinId: string;
  isPressing?: boolean;
  className?: string;
  showAura?: boolean;
}

export const SkinGraphic: React.FC<SkinGraphicProps> = ({
  skinId,
  isPressing = false,
  className = 'w-32 h-32',
  showAura = true,
}) => {
  // Common squash-and-stretch transform when clicked
  const transformStyle = {
    transform: isPressing
      ? 'scale(0.88, 0.82) translateY(6px)'
      : 'scale(1, 1) translateY(0)',
    transition: 'transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  switch (skinId) {
    case 'golden':
      return (
        <div className={`relative inline-block select-none ${className}`}>
          {showAura && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/25 via-yellow-300/35 to-amber-500/25 blur-xl animate-pulse pointer-events-none -z-10" />
          )}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(234,179,8,0.45)]"
            style={transformStyle}
          >
            <defs>
              <linearGradient id="goldSwirlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3a1" />
                <stop offset="25%" stopColor="#ffd700" />
                <stop offset="65%" stopColor="#d49200" />
                <stop offset="100%" stopColor="#875700" />
              </linearGradient>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffe600" />
                <stop offset="100%" stopColor="#c78000" />
              </linearGradient>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Back base shadow */}
            <ellipse cx="100" cy="180" rx="70" ry="12" fill="rgba(0,0,0,0.3)" />

            {/* Bottom tier */}
            <path
              d="M36,170 C24,158 28,136 50,132 C75,128 125,128 150,132 C172,136 176,158 164,170 C146,182 54,182 36,170 Z"
              fill="url(#goldSwirlGrad)"
              stroke="#875700"
              strokeWidth="4"
            />
            {/* Bottom shine highlight */}
            <path
              d="M48,162 C40,154 50,142 75,138 C115,133 145,136 155,145"
              fill="none"
              stroke="#fff9c4"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Middle tier */}
            <path
              d="M52,135 C42,122 46,104 68,100 C88,96 112,96 132,100 C154,104 158,122 148,135 C136,146 64,146 52,135 Z"
              fill="url(#goldSwirlGrad)"
              stroke="#875700"
              strokeWidth="4"
            />
            {/* Middle shine highlight */}
            <path
              d="M62,125 C56,118 64,108 85,105 C110,102 130,105 138,112"
              fill="none"
              stroke="#fff9c4"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Top Swirl Cone */}
            <path
              d="M72,102 C66,88 78,74 94,64 C100,60 108,54 116,48 C124,42 128,46 122,56 C116,66 128,74 134,84 C140,94 134,102 120,105 C104,108 82,108 72,102 Z"
              fill="url(#goldSwirlGrad)"
              stroke="#875700"
              strokeWidth="4"
            />
            {/* Swirl Tip curly curl */}
            <path
              d="M116,48 C122,43 130,46 128,52 C126,56 120,58 116,56"
              fill="#fff9c4"
              stroke="#875700"
              strokeWidth="2.5"
            />

            {/* Royal King Crown */}
            <g transform="translate(68, 20)">
              {/* Crown Base */}
              <path
                d="M4,34 L60,34 L56,14 L42,24 L32,6 L22,24 L8,14 Z"
                fill="url(#crownGrad)"
                stroke="#633e00"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <rect x="6" y="30" width="52" height="6" rx="2" fill="#9e1c1c" stroke="#633e00" strokeWidth="2" />
              {/* Crown Jewels */}
              <circle cx="8" cy="14" r="3" fill="#ff2222" stroke="#fff" strokeWidth="1" />
              <circle cx="32" cy="6" r="3.5" fill="#38ef7d" stroke="#fff" strokeWidth="1" />
              <circle cx="56" cy="14" r="3" fill="#ff2222" stroke="#fff" strokeWidth="1" />
              {/* Front band gems */}
              <circle cx="20" cy="33" r="2" fill="#00e5ff" />
              <circle cx="32" cy="33" r="2.5" fill="#ffd700" />
              <circle cx="44" cy="33" r="2" fill="#00e5ff" />
            </g>

            {/* Cool Sunglasses / Regal Eyes */}
            <g transform="translate(62, 108)">
              {/* Left Lens */}
              <rect x="4" y="0" width="30" height="20" rx="6" fill="#111" stroke="#ffd700" strokeWidth="2.5" />
              <path d="M8,4 L20,4" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              {/* Right Lens */}
              <rect x="42" y="0" width="30" height="20" rx="6" fill="#111" stroke="#ffd700" strokeWidth="2.5" />
              <path d="M46,4 L58,4" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              {/* Sunglasses bridge */}
              <path d="M34,8 L42,8" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Regal Smirk / Smile */}
            <path
              d="M88,142 Q100,152 114,142"
              fill="none"
              stroke="#593a02"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse cx="101" cy="145" rx="5" ry="3" fill="#ff4d4d" />

            {/* Sparkle Stars */}
            <g transform="translate(24, 60)" className="animate-spin" style={{ transformOrigin: '32px 68px', animationDuration: '6s' }}>
              <path d="M8,0 L10,6 L16,8 L10,10 L8,16 L6,10 L0,8 L6,6 Z" fill="#ffffff" filter="url(#goldGlow)" />
            </g>
            <g transform="translate(156, 90)">
              <path d="M6,0 L7,4 L12,6 L7,8 L6,12 L5,8 L0,6 L5,4 Z" fill="#fff9c4" />
            </g>
          </svg>
        </div>
      );

    case 'tp':
      return (
        <div className={`relative inline-block select-none ${className}`}>
          {showAura && (
            <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-xl pointer-events-none -z-10" />
          )}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
            style={transformStyle}
          >
            <defs>
              <linearGradient id="tpRollBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="35%" stopColor="#ffffff" />
                <stop offset="80%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="tpTopOval" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="cardboardHole" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#54381e" />
                <stop offset="100%" stopColor="#966a3b" />
              </linearGradient>
              <pattern id="quiltPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M0,8 L8,0 L16,8 L8,16 Z" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                <circle cx="8" cy="8" r="0.8" fill="#cbd5e1" />
              </pattern>
            </defs>

            {/* Base shadow */}
            <ellipse cx="100" cy="180" rx="65" ry="12" fill="rgba(0,0,0,0.35)" />

            {/* Roll Main Body */}
            <path
              d="M48,56 L152,56 C152,56 156,150 152,156 C148,164 52,164 48,156 C44,150 48,56 48,56 Z"
              fill="url(#tpRollBody)"
              stroke="#94a3b8"
              strokeWidth="3.5"
            />

            {/* Texture pattern overlay */}
            <path
              d="M49,58 L151,58 L151,154 C148,162 52,162 49,154 Z"
              fill="url(#quiltPattern)"
              opacity="0.7"
            />

            {/* Hanging Sheet Flap */}
            <path
              d="M48,82 C34,92 24,128 26,168 C38,172 56,170 68,164 C64,136 58,104 48,82 Z"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="3"
            />
            {/* Perforation line */}
            <line x1="32" y1="165" x2="64" y2="162" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

            {/* Top Surface Oval */}
            <ellipse
              cx="100"
              cy="56"
              rx="52"
              ry="22"
              fill="url(#tpTopOval)"
              stroke="#94a3b8"
              strokeWidth="3.5"
            />

            {/* Roll Layers Rim */}
            <ellipse cx="100" cy="56" rx="44" ry="18" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
            <ellipse cx="100" cy="56" rx="34" ry="14" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />

            {/* Inner Cardboard Core */}
            <ellipse
              cx="100"
              cy="56"
              rx="20"
              ry="9"
              fill="url(#cardboardHole)"
              stroke="#6b4624"
              strokeWidth="2.5"
            />
            {/* Deep dark center of the tube */}
            <ellipse cx="100" cy="56" rx="14" ry="6" fill="#2d1c0f" />

            {/* Cute Cartoon Face on the Front */}
            <g transform="translate(100, 114)">
              {/* Left Eye (Wink) */}
              <path d="M-22,-4 Q-16,-10 -10,-4" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
              {/* Right Eye (Big shiny open eye) */}
              <circle cx="16" cy="-4" r="7" fill="#1e293b" />
              <circle cx="18" cy="-6" r="2.5" fill="#ffffff" />
              <circle cx="14" cy="-2" r="1.2" fill="#ffffff" />

              {/* Blush cheeks */}
              <ellipse cx="-20" cy="4" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />
              <ellipse cx="20" cy="4" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />

              {/* Happy Open Smile */}
              <path
                d="M-8,4 Q0,15 8,4 Z"
                fill="#e11d48"
                stroke="#334155"
                strokeWidth="2"
              />
              <path d="M-4,7 Q0,10 4,7" fill="#fda4af" />
            </g>

            {/* Fresh Sparkles */}
            <g transform="translate(145, 36)">
              <path d="M6,0 L7,4 L12,6 L7,8 L6,12 L5,8 L0,6 L5,4 Z" fill="#38bdf8" />
            </g>
            <g transform="translate(18, 110)">
              <path d="M5,0 L6,3 L10,5 L6,7 L5,10 L4,7 L0,5 L4,3 Z" fill="#38bdf8" />
            </g>
          </svg>
        </div>
      );

    case 'rainbow':
      return (
        <div className={`relative inline-block select-none ${className}`}>
          {showAura && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-cyan-400/25 blur-xl pointer-events-none -z-10 animate-pulse" />
          )}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(219,39,119,0.35)]"
            style={transformStyle}
          >
            <defs>
              <linearGradient id="rainbowSwirl1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff9a9e" />
                <stop offset="35%" stopColor="#fecfef" />
                <stop offset="70%" stopColor="#a1c4fd" />
                <stop offset="100%" stopColor="#c2e9fb" />
              </linearGradient>
              <linearGradient id="rainbowSwirl2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbc2eb" />
                <stop offset="50%" stopColor="#a6c1ee" />
                <stop offset="100%" stopColor="#84fab0" />
              </linearGradient>
              <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="40%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Base shadow */}
            <ellipse cx="100" cy="180" rx="70" ry="12" fill="rgba(0,0,0,0.3)" />

            {/* Bottom tier */}
            <path
              d="M36,170 C24,158 28,136 50,132 C75,128 125,128 150,132 C172,136 176,158 164,170 C146,182 54,182 36,170 Z"
              fill="url(#rainbowSwirl1)"
              stroke="#9333ea"
              strokeWidth="3.5"
            />
            {/* Middle tier */}
            <path
              d="M52,135 C42,122 46,104 68,100 C88,96 112,96 132,100 C154,104 158,122 148,135 C136,146 64,146 52,135 Z"
              fill="url(#rainbowSwirl2)"
              stroke="#9333ea"
              strokeWidth="3.5"
            />
            {/* Top Swirl */}
            <path
              d="M72,102 C66,88 78,74 94,64 C100,60 108,54 116,48 C124,42 128,46 122,56 C116,66 128,74 134,84 C140,94 134,102 120,105 C104,108 82,108 72,102 Z"
              fill="url(#rainbowSwirl1)"
              stroke="#9333ea"
              strokeWidth="3.5"
            />

            {/* Golden Twisted Unicorn Horn */}
            <path
              d="M92,54 L108,8 L114,54 Z"
              fill="url(#hornGrad)"
              stroke="#b45309"
              strokeWidth="2.5"
            />
            {/* Horn twist stripes */}
            <path d="M96,44 L112,40" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M100,32 L110,28" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <path d="M104,18 L108,16" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />

            {/* Big Anime Eyes with Star Sparkles */}
            <g transform="translate(68, 114)">
              {/* Left Eye */}
              <circle cx="10" cy="0" r="11" fill="#4c1d95" />
              <circle cx="8" cy="-3" r="4.5" fill="#ffffff" />
              <circle cx="14" cy="4" r="2" fill="#e9d5ff" />
              {/* Right Eye */}
              <circle cx="54" cy="0" r="11" fill="#4c1d95" />
              <circle cx="52" cy="-3" r="4.5" fill="#ffffff" />
              <circle cx="58" cy="4" r="2" fill="#e9d5ff" />

              {/* Anime Blush */}
              <ellipse cx="6" cy="11" rx="7" ry="3.5" fill="#ec4899" opacity="0.6" />
              <ellipse cx="58" cy="11" rx="7" ry="3.5" fill="#ec4899" opacity="0.6" />

              {/* Cute Cat-like Smile */}
              <path
                d="M26,8 Q32,14 36,8 Q40,14 46,8"
                fill="none"
                stroke="#581c87"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* Magic Sparkle Stars */}
            <g transform="translate(30, 75)">
              <polygon points="6,0 8,5 13,6 8,8 6,13 4,8 0,6 4,5" fill="#f472b6" />
            </g>
            <g transform="translate(152, 60)">
              <polygon points="7,0 9,6 15,7 9,9 7,15 5,9 0,7 5,6" fill="#38bdf8" />
            </g>
            <g transform="translate(112, 10)">
              <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="#fbbf24" />
            </g>
          </svg>
        </div>
      );

    case 'radioactive':
      return (
        <div className={`relative inline-block select-none ${className}`}>
          {showAura && (
            <div className="absolute inset-0 rounded-full bg-lime-400/25 blur-xl pointer-events-none -z-10 animate-pulse" />
          )}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(74,222,128,0.45)]"
            style={transformStyle}
          >
            <defs>
              <linearGradient id="toxicSlimeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#adff2f" />
                <stop offset="50%" stopColor="#44cf19" />
                <stop offset="100%" stopColor="#146006" />
              </linearGradient>
            </defs>

            {/* Slime puddle shadow */}
            <ellipse cx="100" cy="180" rx="72" ry="14" fill="#0d3b04" opacity="0.6" />

            {/* Bottom tier with drips */}
            <path
              d="M34,166 C22,152 26,134 48,130 C72,126 128,126 152,130 C174,134 178,152 166,166 C158,176 138,180 120,180 C116,186 112,192 108,192 C104,192 102,180 94,180 C84,180 62,184 48,180 C38,176 34,170 34,166 Z"
              fill="url(#toxicSlimeGrad)"
              stroke="#0a3a02"
              strokeWidth="4"
            />

            {/* Middle tier */}
            <path
              d="M50,132 C40,118 44,102 66,98 C86,94 114,94 134,98 C156,102 160,118 150,132 C138,144 62,144 50,132 Z"
              fill="url(#toxicSlimeGrad)"
              stroke="#0a3a02"
              strokeWidth="4"
            />
            {/* Slime Drip hanging down */}
            <path
              d="M65,138 C65,152 69,158 72,158 C75,158 78,152 77,138 Z"
              fill="#adff2f"
              stroke="#0a3a02"
              strokeWidth="2.5"
            />

            {/* Top Swirl */}
            <path
              d="M70,100 C64,86 76,72 92,62 C98,58 106,52 114,46 C122,40 126,44 120,54 C114,64 126,72 132,82 C138,92 132,100 118,103 C102,106 80,106 70,100 Z"
              fill="url(#toxicSlimeGrad)"
              stroke="#0a3a02"
              strokeWidth="4"
            />

            {/* Toxic Bubbles */}
            <circle cx="132" cy="74" r="6" fill="#84cc16" stroke="#0a3a02" strokeWidth="2" opacity="0.9" />
            <circle cx="134" cy="72" r="2" fill="#fff" />
            <circle cx="56" cy="116" r="4.5" fill="#84cc16" stroke="#0a3a02" strokeWidth="1.8" opacity="0.9" />

            {/* 3 Mutant Monster Eyes */}
            <g transform="translate(62, 102)">
              {/* Left Eye */}
              <circle cx="10" cy="8" r="9" fill="#facc15" stroke="#0a3a02" strokeWidth="3" />
              <ellipse cx="10" cy="8" rx="2.5" ry="6" fill="#1e1b4b" />
              <circle cx="8" cy="6" r="1.5" fill="#fff" />

              {/* Big Center Eye */}
              <circle cx="38" cy="0" r="13" fill="#facc15" stroke="#0a3a02" strokeWidth="3.5" />
              <ellipse cx="38" cy="0" rx="3.5" ry="9" fill="#1e1b4b" />
              <circle cx="35" cy="-3" r="2.5" fill="#fff" />

              {/* Right Eye */}
              <circle cx="66" cy="8" r="9" fill="#facc15" stroke="#0a3a02" strokeWidth="3" />
              <ellipse cx="66" cy="8" rx="2.5" ry="6" fill="#1e1b4b" />
              <circle cx="64" cy="6" r="1.5" fill="#fff" />
            </g>

            {/* Biohazard Forehead Emblem */}
            <g transform="translate(86, 68) scale(0.65)">
              <circle cx="20" cy="20" r="18" fill="#111" stroke="#facc15" strokeWidth="3" />
              <path d="M20,6 L20,15 M10,26 L17,21 M30,26 L23,21" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
              <circle cx="20" cy="20" r="4" fill="#facc15" />
            </g>

            {/* Crooked toothy grin */}
            <path
              d="M74,142 Q100,160 126,142"
              fill="#18181b"
              stroke="#0a3a02"
              strokeWidth="3.5"
            />
            {/* Mutant Teeth */}
            <polygon points="84,144 88,150 92,145" fill="#fef08a" />
            <polygon points="106,146 110,152 114,147" fill="#fef08a" />
          </svg>
        </div>
      );

    case 'cyber':
      return (
        <div className={`relative inline-block select-none ${className}`}>
          {showAura && (
            <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-xl pointer-events-none -z-10 animate-pulse" />
          )}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(6,182,212,0.4)]"
            style={transformStyle}
          >
            <defs>
              <linearGradient id="metalPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="neonVisor" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Base shadow */}
            <ellipse cx="100" cy="180" rx="70" ry="12" fill="rgba(0,0,0,0.5)" />

            {/* Bottom mechanical tier */}
            <path
              d="M36,170 C24,158 28,136 50,132 C75,128 125,128 150,132 C172,136 176,158 164,170 C146,182 54,182 36,170 Z"
              fill="url(#metalPlate)"
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Rivets / Bolts on bottom plate */}
            <circle cx="52" cy="162" r="3" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
            <circle cx="100" cy="172" r="3" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
            <circle cx="148" cy="162" r="3" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />

            {/* Middle tier */}
            <path
              d="M52,135 C42,122 46,104 68,100 C88,96 112,96 132,100 C154,104 158,122 148,135 C136,146 64,146 52,135 Z"
              fill="url(#metalPlate)"
              stroke="#0f172a"
              strokeWidth="4"
            />

            {/* Top Swirl Dome */}
            <path
              d="M72,102 C66,88 78,74 94,64 C100,60 108,54 116,48 C124,42 128,46 122,56 C116,66 128,74 134,84 C140,94 134,102 120,105 C104,108 82,108 72,102 Z"
              fill="url(#metalPlate)"
              stroke="#0f172a"
              strokeWidth="4"
            />

            {/* Cyber Antenna on Top */}
            <line x1="120" y1="48" x2="135" y2="20" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="135" cy="20" r="5" fill="#ef4444" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="135" cy="20" r="4.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />

            {/* Glowing Cyan Visor */}
            <g transform="translate(56, 108)">
              <rect x="0" y="0" width="88" height="22" rx="11" fill="#0f172a" stroke="#0891b2" strokeWidth="2.5" />
              <rect x="4" y="3" width="80" height="16" rx="8" fill="url(#neonVisor)" />
              {/* Scanline glint */}
              <line x1="12" y1="11" x2="76" y2="11" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
            </g>

            {/* Circuit Lines */}
            <path d="M48,140 L60,146 L76,146" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
            <circle cx="76" cy="146" r="2" fill="#06b6d4" />
            <path d="M152,140 L140,146 L124,146" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
            <circle cx="124" cy="146" r="2" fill="#06b6d4" />

            {/* Speaker Grille Mouth */}
            <g transform="translate(86, 148)">
              <rect x="0" y="0" width="28" height="4" rx="2" fill="#06b6d4" />
              <rect x="4" y="7" width="20" height="3" rx="1.5" fill="#06b6d4" />
            </g>
          </svg>
        </div>
      );

    case 'default':
    default:
      return (
        <div className={`relative inline-block select-none ${className}`}>
          {showAura && (
            <div className="absolute inset-0 rounded-full bg-amber-600/15 blur-xl pointer-events-none -z-10" />
          )}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
            style={transformStyle}
          >
            <defs>
              <linearGradient id="poopBrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9a602a" />
                <stop offset="45%" stopColor="#6e4219" />
                <stop offset="85%" stopColor="#4d2b0e" />
                <stop offset="100%" stopColor="#301905" />
              </linearGradient>
              <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c5874c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6e4219" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="100" cy="180" rx="72" ry="12" fill="rgba(0,0,0,0.4)" />

            {/* Bottom tier */}
            <path
              d="M36,170 C24,158 28,136 50,132 C75,128 125,128 150,132 C172,136 176,158 164,170 C146,182 54,182 36,170 Z"
              fill="url(#poopBrownGrad)"
              stroke="#2c1605"
              strokeWidth="4"
            />
            {/* Bottom tier top highlight edge */}
            <path
              d="M48,162 C40,154 50,140 75,136 C115,132 145,134 156,144"
              fill="none"
              stroke="url(#highlightGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Middle tier */}
            <path
              d="M52,135 C42,122 46,104 68,100 C88,96 112,96 132,100 C154,104 158,122 148,135 C136,146 64,146 52,135 Z"
              fill="url(#poopBrownGrad)"
              stroke="#2c1605"
              strokeWidth="4"
            />
            {/* Middle tier highlight edge */}
            <path
              d="M62,125 C56,118 64,108 85,104 C110,100 130,104 138,112"
              fill="none"
              stroke="url(#highlightGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Top Swirl Cone */}
            <path
              d="M72,102 C66,88 78,74 94,64 C100,60 108,54 116,48 C124,42 128,46 122,56 C116,66 128,74 134,84 C140,94 134,102 120,105 C104,108 82,108 72,102 Z"
              fill="url(#poopBrownGrad)"
              stroke="#2c1605"
              strokeWidth="4"
            />
            {/* Swirl curly tip */}
            <path
              d="M116,48 C122,43 130,46 128,52 C126,56 120,58 116,56"
              fill="#c5874c"
              stroke="#2c1605"
              strokeWidth="2.5"
            />

            {/* Big Friendly Cartoon Eyes */}
            <g transform="translate(68, 108)">
              {/* Left Eye */}
              <ellipse cx="12" cy="4" rx="10" ry="13" fill="#ffffff" stroke="#2c1605" strokeWidth="3" />
              <ellipse cx="14" cy="5" rx="5.5" ry="8" fill="#1a0d03" />
              <circle cx="16" cy="1" r="3" fill="#ffffff" />
              <circle cx="12" cy="7" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="52" cy="4" rx="10" ry="13" fill="#ffffff" stroke="#2c1605" strokeWidth="3" />
              <ellipse cx="50" cy="5" rx="5.5" ry="8" fill="#1a0d03" />
              <circle cx="52" cy="1" r="3" fill="#ffffff" />
              <circle cx="48" cy="7" r="1.5" fill="#ffffff" />

              {/* Rosy Blushing Cheeks */}
              <ellipse cx="2" cy="16" rx="7" ry="4" fill="#e06353" opacity="0.45" />
              <ellipse cx="62" cy="16" rx="7" ry="4" fill="#e06353" opacity="0.45" />
            </g>

            {/* Happy Curved Smile */}
            <path
              d="M84,142 Q100,156 116,142"
              fill="#7a1a1a"
              stroke="#2c1605"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Cute pink tongue */}
            <path
              d="M94,148 Q100,154 106,148 Q100,146 94,148"
              fill="#ff6b81"
            />

            {/* Playful aroma steam wisps */}
            <path
              d="M50,70 Q45,50 54,40 Q62,30 56,20"
              fill="none"
              stroke="#9a602a"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M145,65 Q150,48 142,38 Q135,28 140,18"
              fill="none"
              stroke="#9a602a"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        </div>
      );
  }
};
