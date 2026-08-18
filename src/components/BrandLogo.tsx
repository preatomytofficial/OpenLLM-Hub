import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
    xl: 'h-16 w-16 rounded-2xl'
  }[size];

  const svgSizes = {
    sm: 18,
    md: 24,
    lg: 30,
    xl: 40
  }[size];

  return (
    <div 
      className={`relative flex ${sizeClasses} items-center justify-center border border-cyan-500/40 bg-gradient-to-br from-zinc-950 via-slate-950 to-blue-950 shadow-[0_0_25px_rgba(6,182,212,0.35)] shrink-0 transition-transform duration-300 hover:scale-105 overflow-hidden group ${className}`}
      style={{ minWidth: size === 'sm' ? '1.75rem' : size === 'md' ? '2.5rem' : size === 'lg' ? '3rem' : '4rem' }}
    >
      {/* Background glow orb */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-cyan-400/20 to-purple-600/30 opacity-75 group-hover:opacity-100 transition-opacity" />

      {/* If Image is available, show Vite bundled asset; otherwise show ultra-crisp custom SVG */}
      {!imgError ? (
        <img 
          src={logoImg || "/logo.png"} 
          alt="OpenLLM Hub Logo" 
          className="h-full w-full object-cover relative z-10"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <svg 
            width={svgSizes} 
            height={svgSizes} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          >
            {/* Outer Hexagon / Tech Shield */}
            <polygon 
              points="24,4 42,14 42,34 24,44 6,34 6,14" 
              stroke="url(#brandGrad1)" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
              fill="rgba(8, 145, 178, 0.15)"
            />
            {/* Inner Neural Ring */}
            <circle 
              cx="24" 
              cy="24" 
              r="10" 
              stroke="url(#brandGrad2)" 
              strokeWidth="2" 
              strokeDasharray="4 2" 
            />
            {/* Central Holographic Spark Core */}
            <circle cx="24" cy="24" r="5" fill="#22d3ee" className="animate-pulse" />
            <path 
              d="M24 14V19M24 29V34M14 24H19M29 24H34M17 17L20.5 20.5M27.5 27.5L31 31M31 17L27.5 20.5M20.5 27.5L17 31" 
              stroke="#67e8f9" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
            />
            {/* Gradients */}
            <defs>
              <linearGradient id="brandGrad1" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="brandGrad2" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
};
