import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  accentColor?: string;
  priority?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
  accentColor = '#2563EB',
  priority = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 text-center ${className}`}
        style={{
          background: `linear-gradient(135deg, ${accentColor}18 0%, #F4F7FB 100%)`,
        }}
        role="img"
        aria-label={alt}
      >
        <Building2 className="w-7 h-7 mb-1.5" style={{ color: accentColor }} />
        <span className="text-xs font-medium text-[#17213A]/75 line-clamp-2">
          {fallbackLabel ?? alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
