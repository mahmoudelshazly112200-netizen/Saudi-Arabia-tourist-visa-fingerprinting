import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  fallbackLabel,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative overflow-hidden bg-[#0C0E52]',
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={containerClassName}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={className}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#161A8D] to-[#0C0E52] text-white"
        >
          <Compass className="w-8 h-8 text-[#C9A13B] mb-2.5" aria-hidden="true" />
          <span className="text-sm font-semibold text-[#C5E5FF]">
            {fallbackLabel || alt}
          </span>
        </div>
      )}
    </div>
  );
}
