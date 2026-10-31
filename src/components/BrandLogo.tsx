import React from 'react';

interface BrandLogoProps {
  layoutStyle?: 'standard' | 'royal' | 'modern' | 'journal';
  theme?: 'classic-bw' | 'warm-gold' | 'midnight';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandEmblem: React.FC<{
  size?: number;
  layoutStyle?: string;
  theme?: string;
  className?: string;
}> = ({ size = 38, layoutStyle = 'standard', theme = 'classic-bw', className = '' }) => {
  const isWarmGold = theme === 'warm-gold' || layoutStyle === 'royal';
  const isMidnight = theme === 'midnight' || layoutStyle === 'modern';
  const isJournal = layoutStyle === 'journal';

  const strokeColor = isWarmGold 
    ? '#F59E0B' 
    : isMidnight 
    ? '#38BDF8' 
    : isJournal 
    ? '#10B981' 
    : '#F3F4F6';

  const badgeBg = isWarmGold 
    ? 'rgba(245, 158, 11, 0.12)' 
    : isMidnight 
    ? 'rgba(56, 189, 248, 0.12)' 
    : isJournal 
    ? 'rgba(16, 185, 129, 0.12)' 
    : 'rgba(255, 255, 255, 0.08)';

  const badgeBorder = isWarmGold 
    ? 'rgba(245, 158, 11, 0.35)' 
    : isMidnight 
    ? 'rgba(56, 189, 248, 0.35)' 
    : isJournal 
    ? 'rgba(16, 185, 129, 0.35)' 
    : 'rgba(255, 255, 255, 0.2)';

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl transition-all duration-300 group-hover:scale-105 ${className}`}
      style={{ 
        width: size, 
        height: size,
        backgroundColor: badgeBg,
        border: `1px solid ${badgeBorder}`
      }}
    >
      <svg 
        width={Math.round(size * 0.62)} 
        height={Math.round(size * 0.62)} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-colors"
      >
        <path 
          d="M3 19C4.8 17.8 7.5 17.5 12 19V5C7.5 3.5 4.8 3.8 3 5V19Z" 
          stroke={strokeColor} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M21 19C19.2 17.8 16.5 17.5 12 19V5C16.5 3.5 19.2 3.8 21 5V19Z" 
          stroke={strokeColor} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M12 5V11" 
          stroke={strokeColor} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  layoutStyle = 'standard',
  theme = 'classic-bw',
  size = 'md',
  className = ''
}) => {
  const pixelSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  const isWarmGold = theme === 'warm-gold' || layoutStyle === 'royal';
  const isMidnight = theme === 'midnight' || layoutStyle === 'modern';

  // Luxury gradient text style depending on active theme
  const nameGradientClass = isWarmGold
    ? 'bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)]'
    : isMidnight
    ? 'bg-gradient-to-r from-sky-200 via-white to-sky-300 text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(56,189,248,0.25)]'
    : 'bg-gradient-to-r from-white via-neutral-100 to-neutral-300 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <BrandEmblem 
        size={pixelSize} 
        layoutStyle={layoutStyle} 
        theme={theme} 
      />

      {/* Pure, prestigious name display with zero subtitle or design tags */}
      <div className="flex items-center">
        <span 
          className={`font-['Cormorant_Garamond',serif] text-xl sm:text-2xl md:text-[26px] font-bold tracking-[0.05em] leading-none transition-all duration-300 group-hover:opacity-95 ${nameGradientClass}`}
          style={{ letterSpacing: '0.05em' }}
        >
          Saiful Islam Rifat
        </span>
      </div>
    </div>
  );
};
