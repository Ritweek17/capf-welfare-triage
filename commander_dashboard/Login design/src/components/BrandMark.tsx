import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl tracking-tight',
    lg: 'text-2xl tracking-tight',
  };

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Refined Geometric Logo Mark: Outer Shield + Orbital Signal Rings + Center Node */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-[#111214] text-[#C8FF2C] shadow-md border border-[#111214]/80 group transition-all duration-300 hover:border-[#C8FF2C]/50 hover:shadow-lg`}>
        <svg
          className="w-3/4 h-3/4 transition-transform duration-500 group-hover:scale-105"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Protective Contour */}
          <path
            d="M20 4L32 10V21C32 28.5 24.8 34.5 20 36C15.2 34.5 8 28.5 8 21V10L20 4Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          
          {/* Concentric Telemetry Orbit Ring */}
          <circle
            cx="20"
            cy="19"
            r="7"
            stroke="white"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            className="opacity-50"
          />

          {/* Central Human Wellbeing Pulse / Focal Signal Point */}
          <circle cx="20" cy="19" r="3" fill="#C8FF2C" />

          {/* Vertical Guard & Balance Beam */}
          <path
            d="M20 12V26"
            stroke="#C8FF2C"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="opacity-70"
          />
        </svg>

        {/* Small Ambient Glow Point */}
        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C8FF2C] shadow-[0_0_8px_#C8FF2C] animate-pulse" />
      </div>

      {/* Brand Text Identity */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-bold font-['Plus_Jakarta_Sans'] text-[#111214] ${titleSizes[size]} tracking-wider uppercase`}>
            CENTURION
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider bg-[#111214] text-[#C8FF2C] rounded uppercase">
            v2.4
          </span>
        </div>
        {showSubtitle && (
          <span className="text-xs font-medium text-[#111214]/60 tracking-normal">
            Welfare & Early-Warning Intelligence Platform
          </span>
        )}
      </div>
    </div>
  );
};
