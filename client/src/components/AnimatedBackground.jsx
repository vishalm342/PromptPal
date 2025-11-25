import React from 'react';

const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base gradient background - deep dark with subtle color */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#1A1A1A]" />
      
      {/* Subtle animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(
              ellipse 1200px 900px at 20% 30%,
              rgba(255, 215, 0, 0.08) 0%,
              transparent 50%
            )
          `
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: `
            radial-gradient(
              ellipse 1000px 800px at 80% 70%,
              rgba(255, 200, 0, 0.06) 0%,
              transparent 50%
            )
          `
        }}
      />
      
      {/* Floating orbs with blur for depth */}
      <div 
        className="absolute inset-0 opacity-20 animate-float-enhanced"
        style={{
          background: `
            radial-gradient(
              circle 600px at 50% 40%,
              rgba(255, 215, 0, 0.15) 0%,
              rgba(255, 200, 0, 0.08) 40%,
              transparent 70%
            )
          `,
          filter: 'blur(60px)'
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-15 animate-float-enhanced"
        style={{
          animationDelay: '7s',
          background: `
            radial-gradient(
              circle 500px at 30% 70%,
              rgba(255, 180, 0, 0.12) 0%,
              transparent 65%
            )
          `,
          filter: 'blur(50px)'
        }}
      />
      
      {/* Subtle grid pattern for texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-grid-pattern" />
      
      {/* Animated glow pulse */}
      <div 
        className="absolute inset-0 opacity-10 animate-glow-pulse"
        style={{
          background: `
            radial-gradient(
              ellipse 1400px 1000px at 50% 50%,
              rgba(255, 215, 0, 0.08) 0%,
              transparent 60%
            )
          `,
          filter: 'blur(80px)'
        }}
      />
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
