import React from 'react';
import { Palette, Crown, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black/30 border-b border-white/20 relative" style={{position: 'relative', zIndex: 100}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 p-3 rounded-xl animate-glow">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Crown className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">Canva Pro Teams</h1>
                <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
              </div>
              <p className="text-sm text-purple-300 font-medium">Premium Access • 100% Free</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#teams" className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105">
              Teams
            </a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105">
              Benefits
            </a>
            <a 
              href="https://canva.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium transform hover:scale-105 flex items-center space-x-2 animate-shimmer"
            >
              <span>Visit Canva</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
