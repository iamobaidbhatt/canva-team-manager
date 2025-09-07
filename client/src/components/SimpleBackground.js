import React from 'react';

const SimpleBackground = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #1a1a3e 75%, #0f0f23 100%)'
      }}
    >
      {/* Simple floating shapes without complex animations */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite'
        }}
      ></div>
      <div 
        className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse',
          animationDelay: '2s'
        }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '4s'
        }}
      ></div>
    </div>
  );
};

export default SimpleBackground;

