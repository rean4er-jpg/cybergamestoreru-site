import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  fallbackTone?: string;
}

export function ResilientImage({
  src,
  alt,
  title,
  className = '',
  fallbackTone = 'from-slate-800 to-slate-900',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br ${fallbackTone} text-slate-200 p-6 text-center ${className}`}
      >
        <Gamepad2 className="w-8 h-8 mb-2 opacity-75" strokeWidth={1.5} />
        {title && <span className="text-sm font-medium tracking-tight opacity-90">{title}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
