import React, { useState, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import type { GuessSongQuestion, GameState } from '../../../types';
import { fetchGuessSongSession } from '../../../services/gameApi';
import { LeftArrowIcon, GuessSongIcon, PlayIcon } from '../../icons';

const ROUND_DURATION = 15; // 15 seconds
const CLIP_DURATION = 10; // Play 10 seconds of the song

interface GameSessionProps {
  onExit: () => void;
}

export const GameSession: React.FC<GameSessionProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [questions, setQuestions] = useState<GuessSongQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const loadQuestions = useCallback(async () => {
    setGameState('loading');
    const newQuestions = await fetchGuessSongSession();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setGameState('playing');
    setTimeLeft(ROUND_DURATION);
    setHasPlayed(false);
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswerSelect(''); // Timeout
    }
  }, [gameState, timeLeft]);

  const onPlayerReady = (event: { target: any }) => {
    setPlayer(event.target);
  };

  const playAudio = () => {
    if (player && !hasPlayed) {
      const startTime = questions[currentQuestionIndex].startTime || 0;
      player.seekTo(startTime);
      player.playVideo();
      setHasPlayed(true);

      setTimeout(() => {
        player.pauseVideo();
      }, CLIP_DURATION * 1000);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (gameState !== 'playing') return;
    player?.pauseVideo();
    setGameState('answered');
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 100 + timeLeft * 5);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(ROUND_DURATION);
      setGameState('playing');
      setHasPlayed(false);
    } else {
      setGameState('finished');
    }
  };

  if (gameState === 'loading' || !questions.length) {
    return (
      <div className="min-h-screen bg-brand-gray-dark flex flex-col items-center justify-center text-white">
        <GuessSongIcon className="w-16 h-16 text-brand-purple animate-pulse" />
        <h2 className="text-2xl font-bold mt-4">نجهز لك الأغاني...</h2>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-brand-gray-dark text-white font-tajawal p-4 flex flex-col">
       <header className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="p-2 rounded-full bg-brand-gray-light hover:bg-opacity-70 transition-colors">
          <LeftArrowIcon className="w-6 h-6"/>
        </button>
        <div className="text-center">
            <p className="text-lg font-bold text-brand-gold">{score} نقطة</p>
            <p className="text-sm text-gray-300">السؤال {currentQuestionIndex + 1}/{questions.length}</p>
        </div>
        <div className="w-10 h-10"></div>
      </header>
      <div className="w-full bg-brand-gray-light rounded-full h-2.5 mb-6">
        <div className="bg-brand-purple h-2.5 rounded-full" style={{ width: `${(timeLeft / ROUND_DURATION) * 100}%`, transition: 'width 0.5s linear' }}></div>
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="hidden">
          <YouTube
            videoId={currentQuestion.videoId}
            onReady={onPlayerReady}
            opts={{ height: '0', width: '0' }}
          />
        </div>
        <h2 className="text-xl md:text-2xl text-center text-gray-200 mb-8">خمّن اسم الأغنية أو الفنان!</h2>
        <div className="flex flex-col items-center gap-4 mb-8">
            <button 
              onClick={playAudio} 
              disabled={hasPlayed}
              className="w-32 h-32 rounded-full bg-brand-purple flex items-center justify-center text-white transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                <PlayIcon className="w-16 h-16"/>
            </button>
            <p className="text-gray-400">{hasPlayed ? 'تم الاستماع' : 'اضغط للاستماع'}</p>
        </div>
        <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {currentQuestion.options.map(option => {
                const isTheCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;
                let btnClass = "bg-brand-gray-light hover:bg-opacity-80";
                if(gameState === 'answered') {
                    if(isTheCorrect) btnClass = "bg-brand-turquoise";
                    else if(isSelected) btnClass = "bg-red-600";
                    else btnClass = "bg-brand-gray-light opacity-50";
                }
                return (
                    <button key={option} onClick={() => handleAnswerSelect(option)} disabled={gameState === 'answered'}
                    className={`p-4 rounded-lg text-lg font-bold transition-all duration-300 ${btnClass}`}>
                        {option}
                    </button>
                )
            })}
        </div>
      </main>

      {gameState === 'answered' && (
         <div className="fixed inset-x-0 bottom-0 p-4 bg-brand-gray-light/80 backdrop-blur-sm animate-fade-in-up">
            <div className="container mx-auto text-center">
              <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-brand-turquoise' : 'text-red-500'}`}>
                {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
              </h3>
              {!isCorrect && <p className="text-white mb-4">الإجابة الصحيحة هي: <span className="font-bold text-brand-gold">{currentQuestion.correctAnswer}</span></p>}
              <button onClick={handleNextQuestion} className="bg-brand-gold text-brand-gray-dark font-bold py-3 px-10 rounded-full w-full max-w-xs hover:opacity-90">
                {currentQuestionIndex < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
              </button>
            </div>
         </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-brand-gray-light p-8 rounded-2xl shadow-2xl border-2 border-brand-gold max-w-sm text-center transform animate-fade-in-up">
            <h2 className="text-3xl font-bold text-brand-gold mb-2">انتهت اللعبة!</h2>
            <p className="text-gray-200 mb-4">نتيجتك النهائية هي</p>
            <p className="text-5xl font-extrabold text-brand-turquoise mb-8">{score}</p>
            <div className="flex justify-center gap-4">
               <button onClick={loadQuestions} className="bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">العب مرة أخرى</button>
               <button onClick={onExit} className="bg-brand-gray-light text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-80">الرئيسية</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
