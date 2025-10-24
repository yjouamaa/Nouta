
import React from 'react';

export const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 85C68.2843 85 75 78.2843 75 70C75 61.7157 68.2843 55 60 55C51.7157 55 45 61.7157 45 70C45 78.2843 51.7157 85 60 85Z" stroke="#A020F0" strokeWidth="8"/>
      <path d="M75 70V15C75 12.2386 77.2386 10 80 10H85" stroke="#A020F0" strokeWidth="8" strokeLinecap="round"/>
      <path d="M25 20C46.5 15.5 54.5 35 30 50C20.21 56.1 20 80 20 80" stroke="#FFD700" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 25C42.5 25 42.5 22.5 40 22.5C37.5 22.5 37.5 25 40 25Z" fill="#FFD700"/>
    </svg>
    <span className="text-2xl font-extrabold text-white hidden sm:block">نوتة</span>
  </div>
);
