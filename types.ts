import React from 'react';

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export type GameState = 'loading' | 'playing' | 'answered' | 'finished';

export interface GuessSongQuestion {
  id: string;
  videoId: string;
  startTime?: number;
  options: string[];
  correctAnswer: string;
}

export interface MusicalPictureQuestion {
  id: string;
  images: string[];
  options: string[];
  correctAnswer: string;
}

export interface KaraokeSong {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  lyrics: { time: number; text: string }[];
}

export interface ChatMessage {
    id: number;
    author: 'user' | 'system' | 'bot1' | 'bot2' | 'bot3';
    text: string;
    authorName?: string;
}

export interface BotSong {
  title: string;
  artist: string;
}
