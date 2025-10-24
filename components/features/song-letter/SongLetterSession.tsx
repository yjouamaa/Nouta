import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage, BotSong } from '../../../types';
import { LeftArrowIcon, ReplayIcon } from '../../icons';
import { fetchBotSongList } from '../../../services/gameApi';

const TURN_DURATION = 20;

const BOTS = [
    { name: 'لحن', id: 'bot1' },
    { name: 'نغم', id: 'bot2' },
    { name: 'هارموني', id: 'bot3' },
] as const;

export const SongLetterSession: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [currentLetter, setCurrentLetter] = useState('');
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'gameover' | 'loading'>('loading');
    const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
    const [botSongList, setBotSongList] = useState<BotSong[]>([]);
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const resetGame = useCallback(() => {
        const startLetter = String.fromCharCode(1575 + Math.floor(Math.random() * 28)); // Random Arabic letter
        setCurrentLetter(startLetter);
        setMessages([{ id: Date.now(), author: 'system', text: `اللعبة تبدأ بحرف "${startLetter}"` }]);
        setScore(0);
        setTimeLeft(TURN_DURATION);
        setGameState('playing');
    }, []);
    
    useEffect(() => {
        const loadContent = async () => {
            setGameState('loading');
            const songs = await fetchBotSongList();
            setBotSongList(songs);
            resetGame();
        }
        loadContent();
    }, [resetGame]);
    
    useEffect(() => {
        if(gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t-1), 1000);
            return () => clearTimeout(timer);
        }
        if(timeLeft === 0 && gameState === 'playing') {
            setGameState('gameover');
            setMessages(m => [...m, {id: Date.now(), author: 'system', text: 'انتهى الوقت!'}]);
        }
    }, [gameState, timeLeft]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim().startsWith(currentLetter)) {
            // Maybe show an error message
            return;
        }
        
        const lastChar = userInput.trim().slice(-1);
        if(!lastChar.match(/[\u0600-\u06FF]/)) { // Check if last char is arabic
            // Invalid last character
            return;
        }

        const newMessages: ChatMessage[] = [...messages, { id: Date.now(), author: 'user', text: userInput.trim(), authorName: 'أنت' }];
        setMessages(newMessages);
        setUserInput('');
        setScore(s => s + 100);
        setCurrentLetter(lastChar);
        setTimeLeft(TURN_DURATION);
        
        // Bot's turn
        setTimeout(() => botTurn(lastChar, newMessages), 1500);
    };

    const botTurn = (letter: string, currentMessages: ChatMessage[]) => {
        const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
        const possibleSongs = botSongList.filter(song => song.title.startsWith(letter));
        const song = possibleSongs.length ? possibleSongs[0] : { title: `${letter}... لا أعرف أغنية`, artist: 'Bot' };

        const lastChar = song.title.trim().slice(-1);
        if(!lastChar.match(/[\u0600-\u06FF]/)) {
            // Bot failed, user wins this round
            setMessages([...currentMessages, { id: Date.now(), author: bot.id, authorName: bot.name, text: song.title }]);
             setTimeout(() => {
                setGameState('gameover');
                setMessages(m => [...m, { id: Date.now(), author: 'system', text: 'لقد فزت! لم يستطع البوت إيجاد أغنية.'}]);
             }, 1000);
            return;
        }

        setCurrentLetter(lastChar);
        setTimeLeft(TURN_DURATION);
        setMessages([...currentMessages, { id: Date.now(), author: bot.id, authorName: bot.name, text: `${song.title} - ${song.artist}` }, {id: Date.now() + 1, author: 'system', text: `الآن حرف "${lastChar}"`}]);
    };
    
    if (gameState === 'loading') {
        return (
            <div className="min-h-screen bg-brand-gray-dark flex flex-col items-center justify-center text-white">
                <p>جاري تحميل اللعبة...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-brand-gray-dark text-white font-tajawal flex flex-col">
            <header className="flex items-center justify-between p-4 bg-brand-gray-light shadow-md">
                <button onClick={onExit} className="p-2 rounded-full hover:bg-brand-gray-dark"><LeftArrowIcon className="w-6 h-6"/></button>
                <div className="text-center">
                    <p className="text-xl font-bold text-brand-gold">حرف "{currentLetter}"</p>
                    <p>{score} نقطة</p>
                </div>
                <div className="w-10 text-lg font-mono">{timeLeft}</div>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.author !== 'user' && msg.author !== 'system' && <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-sm font-bold">{msg.authorName?.charAt(0)}</div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                            msg.author === 'user' ? 'bg-brand-turquoise text-brand-gray-dark rounded-br-none' : 
                            msg.author === 'system' ? 'bg-transparent text-center w-full text-brand-gold' : 
                            'bg-brand-gray-light rounded-bl-none'
                        }`}>
                           {msg.author !== 'user' && msg.author !== 'system' && <p className="font-bold text-brand-orange text-sm mb-1">{msg.authorName}</p>}
                           <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </main>

            {gameState === 'playing' ? (
                <footer className="p-4 bg-brand-gray-light">
                    <form onSubmit={handleUserSubmit} className="flex gap-2">
                        <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="اكتب اسم الأغنية هنا..."
                        className="flex-grow p-3 bg-brand-gray-dark border-2 border-brand-gray-light focus:border-brand-turquoise rounded-full outline-none transition-colors" />
                        <button type="submit" className="bg-brand-turquoise text-brand-gray-dark font-bold px-6 rounded-full hover:opacity-90 transition-opacity">&gt;</button>
                    </form>
                </footer>
            ) : (
                 <div className="p-4 bg-brand-gray-light text-center">
                    <h3 className="text-2xl font-bold text-red-500 mb-2">انتهت اللعبة!</h3>
                    <p className="text-lg mb-4">نتيجتك النهائية: <span className="text-brand-gold font-bold">{score}</span></p>
                    <button onClick={resetGame} className="bg-brand-purple flex items-center justify-center gap-2 w-full max-w-xs mx-auto text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">
                        <ReplayIcon className="w-6 h-6"/>
                        <span>العب مجدداً</span>
                    </button>
                </div>
            )}
        </div>
    );
};
