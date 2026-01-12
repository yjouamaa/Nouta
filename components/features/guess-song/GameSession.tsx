
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GuessSongQuestion, GameState } from '../../../types';
import { fetchGuessSongSession } from '../../../services/gameApi';
import { LeftArrowIcon, GuessSongIcon, PlayIcon } from '../../icons';

const ROUND_DURATION = 15;
const CLIP_DURATION = 8;

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
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    setIsReady(false);
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswerSelect('');
    }
  }, [gameState, timeLeft]);

  const playAudio = () => {
    if (audioRef.current && !hasPlayed && isReady) {
      const startTime = questions[currentQuestionIndex].startTime || 0;
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
      setHasPlayed(true);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }, CLIP_DURATION * 1000);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (gameState !== 'playing') return;
    if (audioRef.current) audioRef.current.pause();
    
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
      setIsReady(false);
    } else {
      setGameState('finished');
    }
  };

  if (gameState === 'loading' || !questions.length) {
    return (
      <div className="min-h-screen bg-brand-gray-dark flex flex-col items-center justify-center text-white p-6">
        <GuessSongIcon className="w-16 h-16 text-brand-purple animate-pulse" />
        <h2 className="text-2xl font-bold mt-4">نجهز الألحان...</h2>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-brand-gray-dark text-white font-tajawal p-4 flex flex-col">
       <audio 
         ref={audioRef} 
         src={currentQuestion.audioUrl} 
         onCanPlayThrough={() => setIsReady(true)}
         className="hidden" 
       />

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
        <h2 className="text-xl md:text-2xl text-center text-gray-200 mb-8 font-black">خمّن اسم الأغنية أو الفنان!</h2>
        
        <div className="flex flex-col items-center gap-4 mb-8">
            <button 
                onClick={playAudio} 
                disabled={hasPlayed || !isReady}
                className="w-32 h-32 rounded-full bg-brand-purple flex items-center justify-center text-white transition-all transform hover:scale-105 shadow-lg shadow-brand-purple/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isReady ? <PlayIcon className="w-16 h-16"/> : <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>}
            </button>
            <p className="text-gray-400 font-bold">
                {!isReady ? 'جاري التحميل...' : hasPlayed ? 'تم الاستماع للمقطع' : 'اضغط للاستماع'}
            </p>
        </div>

        <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4">
            {currentQuestion.options.map(option => {
                const isTheCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;
                let btnClass = "bg-brand-gray-light hover:bg-opacity-80";
                if(gameState === 'answered') {
                    if(isTheCorrect) btnClass = "bg-brand-turquoise text-brand-gray-dark scale-105 z-10";
                    else if(isSelected) btnClass = "bg-red-600";
                    else btnClass = "bg-brand-gray-light opacity-50";
                }
                return (
                    <button key={option} onClick={() => handleAnswerSelect(option)} disabled={gameState === 'answered'}
                    className={`p-4 rounded-xl text-lg font-bold shadow-md transition-all duration-300 ${btnClass}`}>
                        {option}
                    </button>
                )
            })}
        </div>
      </main>

      {gameState === 'answered' && (
         <div className="fixed inset-x-0 bottom-0 p-4 bg-brand-gray-light/90 backdrop-blur-md animate-fade-in-up z-20">
            <div className="container mx-auto text-center">
              <h3 className={`text-2xl font-black mb-2 ${isCorrect ? 'text-brand-turquoise' : 'text-red-500'}`}>
                {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
              </h3>
              {!isCorrect && <p className="text-white mb-4">الإجابة الصحيحة هي: <span className="font-bold text-brand-gold">{currentQuestion.correctAnswer}</span></p>}
              <button onClick={handleNextQuestion} className="bg-brand-gold text-brand-gray-dark font-black py-4 px-12 rounded-full w-full max-w-xs hover:scale-105 transition-transform shadow-lg shadow-brand-gold/20">
                {currentQuestionIndex < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
              </button>
            </div>
         </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-gray-light p-8 rounded-3xl shadow-2xl border-2 border-brand-gold max-w-sm w-full text-center transform animate-fade-in-up">
            <h2 className="text-3xl font-black text-brand-gold mb-2">انتهت اللعبة!</h2>
            <p className="text-gray-200 mb-4">نتيجتك النهائية هي</p>
            <p className="text-6xl font-black text-brand-turquoise mb-8 drop-shadow-[0_0_15px_rgba(64,224,208,0.5)]">{score}</p>
            <div className="flex flex-col gap-3">
               <button onClick={loadQuestions} className="bg-brand-purple text-white font-bold py-4 rounded-full hover:bg-opacity-90 shadow-lg shadow-brand-purple/30">العب مرة أخرى</button>
               <button onClick={onExit} className="bg-brand-gray-dark text-white font-bold py-4 rounded-full border border-gray-600 hover:bg-gray-700">الرئيسية</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
