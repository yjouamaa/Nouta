import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GAMES } from './constants';
import type { Game } from './types';
import { GameSession } from './components/GameSession';
import { MusicalPicturesSession } from './components/MusicalPicturesSession';
import { KaraokeLobby } from './components/KaraokeLobby';
import { SongLetterSession } from './components/SongLetterSession';

const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (activeGame) {
      setShowWelcome(false);
      return;
    }
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [activeGame]);

  const handleGameSelect = (game: Game) => {
    setActiveGame(game);
  };

  const handleExitGame = () => {
    setActiveGame(null);
  };

  const renderActiveGame = () => {
    if (!activeGame) return null;
    
    switch (activeGame.id) {
      case 'guess-song':
        return <GameSession onExit={handleExitGame} />;
      case 'musical-pictures':
        return <MusicalPicturesSession onExit={handleExitGame} />;
      case 'karaoke':
        return <KaraokeLobby onExit={handleExitGame} />;
      case 'song-letter':
        return <SongLetterSession onExit={handleExitGame} />;
      default:
        // Fallback to exit if game component doesn't exist
        handleExitGame();
        return null;
    }
  };
  
  if (activeGame) {
    return renderActiveGame();
  }

  return (
    <div className="min-h-screen bg-brand-gray-dark text-white font-tajawal antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-brand-gold animate-fade-in-down">
          أهلاً بك في نوتة
        </h1>
        <p className="text-lg text-center text-gray-300 mb-12 animate-fade-in-up">
          اختر لعبتك الموسيقية المفضلة وانطلق!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {GAMES.map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onSelect={handleGameSelect} 
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </main>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-brand-gray-light p-8 rounded-2xl shadow-2xl border border-brand-purple max-w-md text-center transform transition-transform duration-300 scale-100 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-brand-turquoise mb-4">مرحباً في عالم نوتة!</h2>
            <p className="text-gray-200">
              تطبيق الألعاب الموسيقية الأول في العالم العربي. استعد لتحديات ممتعة واختبر معلوماتك الموسيقية.
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="mt-6 bg-brand-purple text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-80 transition-all duration-300"
            >
              لنبدأ!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;