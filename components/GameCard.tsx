
import React from 'react';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  style?: React.CSSProperties;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect, style }) => {
  const { title, description, icon: Icon, color } = game;

  return (
    <div
      onClick={() => onSelect(game)}
      className="bg-brand-gray-light rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer
                 border-2 border-transparent hover:border-brand-gold
                 transform hover:-translate-y-2 transition-all duration-300 ease-in-out
                 shadow-lg hover:shadow-2xl hover:shadow-brand-purple/20 animate-fade-in-up"
      style={style}
    >
      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 transform group-hover:scale-110"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-12 h-12" style={{ color }} />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color }}>{title}</h3>
      <p className="text-gray-300 text-sm flex-grow">{description}</p>
    </div>
  );
};
