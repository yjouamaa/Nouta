import React, { useState, useEffect } from 'react';
import type { KaraokeSong } from '../types';
import { fetchKaraokeSongs } from '../services/gameApi';
import { KaraokeIcon, LeftArrowIcon, PlayIcon } from './icons';
import { KaraokeSession } from './KaraokeSession';

interface KaraokeLobbyProps {
  onExit: () => void;
}

export const KaraokeLobby: React.FC<KaraokeLobbyProps> = ({ onExit }) => {
  const [songs, setSongs] = useState<KaraokeSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSong, setActiveSong] = useState<KaraokeSong | null>(null);

  useEffect(() => {
    const loadSongs = async () => {
      const fetchedSongs = await fetchKaraokeSongs();
      setSongs(fetchedSongs);
      setLoading(false);
    };
    loadSongs();
  }, []);
  
  const handleFinishSong = () => {
    setActiveSong(null);
  };

  if (activeSong) {
      return <KaraokeSession song={activeSong} onFinish={handleFinishSong} />;
  }

  return (
    <div className="min-h-screen bg-brand-gray-dark text-white font-tajawal p-4 flex flex-col">
       <header className="flex items-center justify-between mb-8">
        <button onClick={onExit} className="p-2 rounded-full bg-brand-gray-light hover:bg-opacity-70 transition-colors">
          <LeftArrowIcon className="w-6 h-6"/>
        </button>
        <h1 className="text-2xl font-bold text-brand-orange">اختر أغنية للكاريوكي</h1>
        <div className="w-10 h-10"></div>
      </header>
      
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <KaraokeIcon className="w-16 h-16 text-brand-orange animate-pulse" />
          <p className="mt-4 text-lg">جاري تحميل الأغاني...</p>
        </div>
      ) : (
        <main className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map(song => (
            <div key={song.id} className="bg-brand-gray-light rounded-lg p-5 flex flex-col justify-between shadow-lg border border-transparent hover:border-brand-orange transition-colors">
                <div>
                    <h2 className="text-xl font-bold text-white">{song.title}</h2>
                    <p className="text-brand-gold">{song.artist}</p>
                </div>
                <button onClick={() => setActiveSong(song)} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-orange text-brand-gray-dark font-bold py-2 px-4 rounded-full hover:opacity-90 transition-opacity">
                    <PlayIcon className="w-6 h-6" />
                    <span>غنِّ الآن</span>
                </button>
            </div>
          ))}
        </main>
      )}
    </div>
  );
};
