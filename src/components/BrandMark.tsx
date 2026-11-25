import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md', inverted = false }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 34 : 28;
  const textClass =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl'
      : 'text-xl';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="2" y="2" width="12" height="12" rx="3.5" fill="#F26444" />
        <rect x="18" y="2" width="12" height="12" rx="3.5" fill="#2563EB" />
        <rect x="2" y="18" width="12" height="12" rx="3.5" fill="#00A995" />
        <rect x="18" y="18" width="12" height="12" rx="3.5" fill="#F4BB45" />
        <path
          d="M11 16H21M16 11V21"
          stroke={inverted ? '#17213A' : '#FFFFFF'}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`${textClass} font-extrabold tracking-tight ${
          inverted ? 'text-white' : 'text-[#17213A]'
        }`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        TRAMA
      </span>
    </span>
  );
};
