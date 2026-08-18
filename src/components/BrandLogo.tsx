import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClass = {
    sm: 'h-6 w-6 rounded-lg',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
    xl: 'h-16 w-16 rounded-2xl'
  }[size];

  return (
    <div className={`relative flex ${sizeClass} overflow-hidden items-center justify-center border border-blue-500/40 bg-zinc-950 shadow-[0_0_20px_rgba(59,130,246,0.4)] shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
      {!imgError ? (
        <img 
          src="/logo.png" 
          alt="OpenLLM Hub Official Logo" 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white font-extrabold font-mono text-sm shadow-inner">
          <span className="text-cyan-200">🤖</span>
        </div>
      )}
    </div>
  );
};
