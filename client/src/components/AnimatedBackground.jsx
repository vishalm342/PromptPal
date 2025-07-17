import React from 'react';

const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Grid overlay - more subtle */}
      <div className="absolute inset-0 opacity-15 bg-grid-pattern" />
      
      {/* Main centered radial gradient glow - brighter */}
      <div className="absolute inset-0 bg-radial-glow" />
      
      {/* Additional glow layers for depth - enhanced */}
      <div className="absolute inset-0 opacity-70 bg-glow-purple" />
      <div className="absolute inset-0 opacity-55 bg-glow-orange" />
      <div className="absolute inset-0 opacity-40 bg-glow-green" />
      
      {/* Animated overlay for subtle movement - brighter */}
      <div className="absolute inset-0 opacity-8 bg-animated-glow animate-glow-pulse" />
      
      {/* Additional floating elements for dynamic effect - enhanced */}
      <div 
        className="absolute inset-0 opacity-15 animate-float-enhanced"
        style={{
          background: `
            radial-gradient(
              circle 400px at 30% 70%,
              rgba(108, 43, 217, 0.2) 0%,
              rgba(147, 51, 234, 0.15) 50%,
              transparent 80%
            )
          `
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-12 animate-float-enhanced"
        style={{
          animationDelay: '8s',
          background: `
            radial-gradient(
              circle 500px at 70% 30%,
              rgba(255, 179, 71, 0.18) 0%,
              rgba(251, 146, 60, 0.12) 60%,
              transparent 85%
            )
          `
        }}
      />
      
      {/* Yellow accent glow */}
      <div 
        className="absolute inset-0 opacity-10 animate-float-enhanced"
        style={{
          animationDelay: '15s',
          background: `
            radial-gradient(
              circle 350px at 50% 60%,
              rgba(255, 215, 0, 0.15) 0%,
              rgba(255, 193, 7, 0.1) 50%,
              transparent 75%
            )
          `
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
