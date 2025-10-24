import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import type { KaraokeSong } from '../../../types';

interface KaraokeSessionProps {
    song: KaraokeSong;
    onFinish: () => void;
}

export const KaraokeSession: React.FC<KaraokeSessionProps> = ({ song, onFinish }) => {
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState<any>(null);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    const onPlayerReady = (event: { target: any }) => {
        setPlayer(event.target);
    };

    useEffect(() => {
        if (!isPlaying || !player) return;

        const interval = setInterval(() => {
            const currentTime = player.getCurrentTime();
            if(currentTime) {
                const activeLineIndex = song.lyrics.findIndex((line, index) => {
                    const nextLine = song.lyrics[index + 1];
                    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
                });
                setCurrentLineIndex(activeLineIndex);
            }
        }, 500); // Poll every 500ms for current time

        return () => clearInterval(interval);
    }, [isPlaying, player, song.lyrics]);


    useEffect(() => {
        if (lyricsContainerRef.current && currentLineIndex > 0) {
            const activeLineElement = lyricsContainerRef.current.children[currentLineIndex] as HTMLElement;
            if (activeLineElement) {
                lyricsContainerRef.current.scrollTop = activeLineElement.offsetTop - lyricsContainerRef.current.offsetTop - (lyricsContainerRef.current.offsetHeight / 2) + (activeLineElement.offsetHeight / 2);
            }
        }
    }, [currentLineIndex]);
    
    const onPlayerStateChange = (event: { data: number }) => {
      // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
      if (event.data === 0) { // ended
          setIsPlaying(false);
          setCurrentLineIndex(-1);
      }
    };

    const handlePlayPause = () => {
        if (!player) return;

        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="h-screen bg-brand-gray-dark text-white font-tajawal flex flex-col p-4 items-center justify-center">
            <div className="w-full max-w-3xl bg-brand-gray-light rounded-lg shadow-lg p-8 text-center flex flex-col" style={{height: '80vh'}}>
                <div className="hidden">
                    <YouTube
                      videoId={song.videoId}
                      onReady={onPlayerReady}
                      onStateChange={onPlayerStateChange}
                      opts={{ height: '0', width: '0' }}
                    />
                </div>
                <h1 className="text-3xl font-bold text-brand-orange">{song.title}</h1>
                <h2 className="text-xl text-brand-gold mb-8">{song.artist}</h2>

                <div ref={lyricsContainerRef} className="lyrics-container flex-grow overflow-y-auto scroll-smooth mb-8 text-3xl font-bold space-y-4"
                     style={{ direction: 'rtl' }}
                >
                    {song.lyrics.map((line, index) => (
                        <p
                            key={index}
                            className={`transition-all duration-300 ${
                                index === currentLineIndex
                                    ? 'text-brand-turquoise scale-105'
                                    : 'text-gray-400 opacity-60'
                            }`}
                        >
                            {line.text}
                        </p>
                    ))}
                </div>
                
                <div className="flex items-center justify-center gap-6 mt-auto">
                    <button
                        onClick={handlePlayPause}
                        disabled={!player}
                        className="bg-brand-orange text-brand-gray-dark font-bold py-3 px-8 rounded-full hover:opacity-90 disabled:opacity-50"
                    >
                        {isPlaying ? 'إيقاف مؤقت' : 'ابدأ الغناء'}
                    </button>
                    <button
                        onClick={onFinish}
                        className="bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-80"
                    >
                        إنهاء
                    </button>
                </div>
            </div>
        </div>
    );
};
