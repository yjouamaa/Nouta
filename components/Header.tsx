import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-gray-light/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4 text-right">
          <img 
            src="https://picsum.photos/seed/nawta-user/40/40" 
            alt="صورة المستخدم" 
            className="w-10 h-10 rounded-full border-2 border-brand-gold"
          />
          <div>
            <p className="font-bold text-white">لاعب جديد</p>
            <p className="text-sm text-brand-gold font-semibold">1,250 نقطة</p>
          </div>
        </div>
        <Logo />
      </div>
    </header>
  );
};