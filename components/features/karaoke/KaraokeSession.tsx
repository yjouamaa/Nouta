
import React, { useState, useEffect, useRef } from 'react';
import type { KaraokeSong } from '../../../types';
import { KaraokeIcon, DownloadIcon, ReplayIcon, LeftArrowIcon } from '../../icons';

interface KaraokeSessionProps {
    song: KaraokeSong;
    onFinish: () => void;
}

export const KaraokeSession: React.FC<KaraokeSessionProps> = ({ song, onFinish }) => {
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        async function initMic() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setRecordedAudioUrl(audioUrl);
                    setIsRecording(false);
                };

                mediaRecorderRef.current = mediaRecorder;
            } catch (err) {
                console.error("Mic error:", err);
            }
        }
        initMic();
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const time = audioRef.current.currentTime;
        setCurrentTime(time);

        let activeLineIndex = -1;
        for (let i = song.lyrics.length - 1; i >= 0; i--) {
            if (time >= song.lyrics[i].time) {
                activeLineIndex = i;
                break;
            }
        }

        if (activeLineIndex !== currentLineIndex) {
            setCurrentLineIndex(activeLineIndex);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setLoading(false);
            setError(null);
        }
    };

    const handleAudioError = () => {
        console.error("Failed to load audio from:", song.audioUrl);
        setError("فشل تحميل الأغنية. تأكد من أن الرابط مباشر وصحيح.");
        setLoading(false);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setIsFinished(true);
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    };

    const togglePlay = () => {
        if (!audioRef.current || error) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => {
                console.error("Play error:", e);
                setError("لا يمكن تشغيل الملف. حاول مرة أخرى.");
            });
            setIsPlaying(true);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
                audioChunksRef.current = [];
                mediaRecorderRef.current.start();
                setIsRecording(true);
            }
        }
    };

    const handleRestart = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setIsFinished(false);
            setRecordedAudioUrl(null);
            setCurrentLineIndex(-1);
            setIsPlaying(false);
            setError(null);
        }
    };

    useEffect(() => {
        if (lyricsContainerRef.current && currentLineIndex >= 0) {
            const activeLineElement = lyricsContainerRef.current.children[currentLineIndex] as HTMLElement;
            if (activeLineElement) {
                const container = lyricsContainerRef.current;
                const offset = activeLineElement.offsetTop - container.offsetTop - (container.offsetHeight / 2) + (activeLineElement.offsetHeight / 2);
                container.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }
    }, [currentLineIndex]);

    if (isFinished) {
        return (
            <div className="min-h-screen bg-brand-gray-dark text-white font-tajawal flex flex-col p-6 items-center justify-center">
                <div className="w-full max-w-lg bg-brand-gray-light rounded-3xl shadow-2xl p-8 text-center animate-fade-in-up border border-brand-gold/20">
                    <h2 className="text-4xl font-black text-brand-gold mb-2">أداء مذهل!</h2>
                    <p className="text-gray-300 mb-8">لقد انتهيت من غناء "{song.title}"</p>
                    
                    {recordedAudioUrl && (
                        <div className="mb-8 p-6 bg-brand-gray-dark rounded-2xl border border-brand-turquoise/30">
                            <p className="text-brand-turquoise font-bold mb-4">استمع إلى تسجيلك:</p>
                            <audio controls src={recordedAudioUrl} className="w-full mb-6" />
                            <a 
                                href={recordedAudioUrl} 
                                download={`Nawta_${song.title}.webm`}
                                className="inline-flex items-center gap-2 bg-brand-turquoise text-brand-gray-dark font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                <span>تحميل الأداء</span>
                            </a>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button onClick={handleRestart} className="w-full bg-brand-purple text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-opacity-90">
                            <ReplayIcon className="w-5 h-5" />
                            <span>غناء مرة أخرى</span>
                        </button>
                        <button onClick={onFinish} className="w-full bg-brand-gray-dark text-white font-bold py-4 rounded-full border border-gray-600 hover:bg-gray-700">
                            العودة للقائمة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-brand-gray-dark text-white font-tajawal flex flex-col items-center justify-center relative overflow-hidden">
            <audio 
                ref={audioRef}
                src={song.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={handleAudioError}
                onEnded={handleEnded}
                preload="auto"
                className="hidden"
            />

            <div className="w-full max-w-4xl h-[85vh] bg-brand-gray-light/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col relative z-10 border border-white/5 mx-4">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onFinish} className="p-2 rounded-full bg-brand-gray-dark hover:bg-gray-700 transition-colors">
                        <LeftArrowIcon className="w-6 h-6 text-gray-300" />
                    </button>
                    <div className="text-center flex-grow mx-4">
                        <h1 className="text-2xl md:text-3xl font-black text-brand-orange truncate">{song.title}</h1>
                        <p className="text-brand-gold text-sm md:text-base">{song.artist}</p>
                    </div>
                    {isRecording ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-500 rounded-full border border-red-600/30 animate-pulse">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            <span className="text-xs font-bold uppercase tracking-widest">مباشر</span>
                        </div>
                    ) : <div className="w-12"></div>}
                </div>

                {error ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <p className="text-red-400 text-xl font-bold mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="bg-white/10 px-6 py-2 rounded-full hover:bg-white/20 transition-colors">تحديث الصفحة</button>
                    </div>
                ) : (
                    <div className="relative flex-grow flex flex-col overflow-hidden rounded-2xl bg-black/20 shadow-inner">
                        <div 
                            ref={lyricsContainerRef} 
                            className="lyrics-container flex-grow overflow-y-auto scroll-smooth py-[35vh] px-6 text-3xl md:text-5xl font-black space-y-12 no-scrollbar text-center"
                            style={{ direction: 'rtl' }}
                        >
                            {song.lyrics.map((line, index) => (
                                <p
                                    key={index}
                                    className={`transition-all duration-500 leading-tight ${
                                        index === currentLineIndex
                                            ? 'text-brand-turquoise scale-110 drop-shadow-[0_0_20px_rgba(64,224,208,0.7)]'
                                            : 'text-white/10'
                                    }`}
                                >
                                    {line.text}
                                </p>
                            ))}
                        </div>
                        
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                             <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                                <div 
                                    className="bg-brand-turquoise h-full transition-all duration-200"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                ></div>
                             </div>
                             <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                                <span className="text-brand-gold italic">Cloudinary Source</span>
                                <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                             </div>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col items-center gap-4 mt-8">
                    <button
                        onClick={togglePlay}
                        disabled={loading || !!error}
                        className={`min-w-[200px] py-4 px-10 rounded-full font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                            loading 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed animate-pulse' 
                            : !!error
                            ? 'bg-red-800 text-gray-300 cursor-not-allowed'
                            : isPlaying 
                            ? 'bg-brand-gray-dark text-white border-2 border-brand-orange' 
                            : 'bg-brand-orange text-brand-gray-dark hover:scale-105 active:bg-brand-gold'
                        }`}
                    >
                        {loading ? 'جاري التحميل...' : (isPlaying ? 'إيقاف مؤقت' : 'ابدأ الغناء')}
                    </button>
                </div>
            </div>

            <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-brand-purple/20 rounded-full blur-[100px] transition-opacity duration-1000 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`absolute -top-20 -right-20 w-80 h-80 bg-brand-turquoise/10 rounded-full blur-[100px] transition-opacity duration-1000 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
    );
};
