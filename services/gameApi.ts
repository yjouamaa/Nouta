import type { GuessSongQuestion, MusicalPictureQuestion, KaraokeSong, BotSong } from '../types';

const fetchData = async <T>(url: string): Promise<T[]> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error);
        return []; // Return empty array as a fallback
    }
};

export const fetchGuessSongSession = async (): Promise<GuessSongQuestion[]> => {
  const questions = await fetchData<GuessSongQuestion>('/content/guess-song.json');
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export const fetchMusicalPicturesSession = async (): Promise<MusicalPictureQuestion[]> => {
  const questions = await fetchData<MusicalPictureQuestion>('/content/musical-pictures.json');
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

export const fetchKaraokeSongs = async (): Promise<KaraokeSong[]> => {
  return fetchData<KaraokeSong>('/content/karaoke.json');
};

export const fetchBotSongList = async (): Promise<BotSong[]> => {
    return fetchData<BotSong>('/content/song-letter.json');
};
