import type { GuessSongQuestion, MusicalPictureQuestion, KaraokeSong } from '../types';

// Mock data for Guess the Song game
const GUESS_SONG_QUESTIONS: GuessSongQuestion[] = [
  {
    id: 'gs1',
    videoId: 'g-3-4432', // Mock Video ID
    startTime: 60,
    options: ['3 Daqat - Abu ft. Yousra', 'Bel Bont El 3areed - Hussein Al Jasmi', 'Enta Eih - Nancy Ajram', 'Ya Tabtab - Nancy Ajram'],
    correctAnswer: '3 Daqat - Abu ft. Yousra',
  },
  {
    id: 'gs2',
    videoId: 'dQw4w9WgXcQ', // Mock Video ID
    startTime: 43,
    options: ['Ana Dammi Falastini - Mohammed Assaf', 'Mawtini - Various Artists', 'Bel Bont El 3areed - Hussein Al Jasmi', 'Al Atlal - Umm Kulthum'],
    correctAnswer: 'Bel Bont El 3areed - Hussein Al Jasmi',
  },
  {
    id: 'gs3',
    videoId: 'asdfg123', // Mock Video ID
    startTime: 30,
    options: ['El Donia Helwa - Nancy Ajram', 'Habibi Ya Nour El Ein - Amr Diab', 'Boshret Kheir - Hussein Al Jasmi', 'Tamally Maak - Amr Diab'],
    correctAnswer: 'Tamally Maak - Amr Diab',
  },
];

// Mock data for Musical Pictures game
const MUSICAL_PICTURES_QUESTIONS: MusicalPictureQuestion[] = [
  {
    id: 'mp1',
    images: ['https://picsum.photos/seed/moon/200', 'https://picsum.photos/seed/night/200', 'https://picsum.photos/seed/stars/200'],
    options: ['Qamarun - Maher Zain', 'Nour El Shams - Pascale Machaalani', 'Ya Ghayeb - Fadel Shaker', 'Bent El Shalabiya - Fairuz'],
    correctAnswer: 'Qamarun - Maher Zain',
  },
  {
    id: 'mp2',
    images: ['https://picsum.photos/seed/sea/200', 'https://picsum.photos/seed/boat/200', 'https://picsum.photos/seed/wave/200'],
    options: ['Bahlam Maak - Najwa Karam', 'Aal Bahr - Mohamed Mounir', 'El Gharam El Mostaheel - Wael Kfoury', 'Shoufi Bini W Bink - Hisham Abbas'],
    correctAnswer: 'Aal Bahr - Mohamed Mounir',
  },
];

// Mock data for Karaoke songs
const KARAOKE_SONGS: KaraokeSong[] = [
  {
    id: 'k1',
    title: '3 Daqat',
    artist: 'Abu ft. Yousra',
    videoId: 'g-3-4432', // Mock Video ID
    lyrics: [
      { time: 58, text: 'وقت غروب الشمس واقف ع البحر بعيد' },
      { time: 62, text: 'عمال بحكيله وأشكيله وأشرح وأعيد' },
      { time: 66, text: 'فجأة لقيتها وكنت فاكرها عروسة البحر' },
      { time: 70, text: 'خارجة من المايه وطلتها أقوى من السحر' },
    ],
  },
  {
    id: 'k2',
    title: 'Tamally Maak',
    artist: 'Amr Diab',
    videoId: 'asdfg123', // Mock Video ID
    lyrics: [
      { time: 25, text: 'تملي معاك' },
      { time: 29, text: 'ولو حتى بعيد عني في قلبي هواك' },
      { time: 33, text: 'تملي معاك' },
      { time: 37, text: 'تملي في بالي وفي قلبي ولا بنساك' },
    ],
  },
  {
    id: 'k3',
    title: 'Lama Bada Yatathanna',
    artist: 'Traditional',
    videoId: 'qwerty456', // Mock Video ID
    lyrics: [
        { time: 5, text: 'لما بدا يتثنى' },
        { time: 9, text: 'حبي جماله فتنا' },
        { time: 13, text: 'أمر ما بلحظة أسرنا' },
        { time: 17, text: 'غصن ثنا حين مال' },
    ],
  },
];

// Mock data for Song Letter game
export const BOT_SONG_LIST: { title: string; artist: string }[] = [
    { title: 'تملي معاك', artist: 'Amr Diab' },
    { title: 'كل القصايد', artist: 'Marwan Khoury' },
    { title: 'كيفك انت', artist: 'Fairuz' },
    { title: 'نسم علينا الهوى', artist: 'Fairuz' },
    { title: 'وحشتيني', artist: 'Amr Diab' },
    { title: 'يا غايب', artist: 'Fadel Shaker' },
    { title: 'بحبك وحشتيني', artist: 'Hussein Al Jasmi' },
    { title: 'أنا لك على طول', artist: 'Abdel Halim Hafez' },
    { title: 'جانا الهوى', artist: 'Abdel Halim Hafez' },
    { title: 'زيديني عشقا', artist: 'Kadim Al Sahir' },
];

// Simulate API call
const apiCall = <T>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), 500 + Math.random() * 500));

export const fetchGuessSongSession = (): Promise<GuessSongQuestion[]> => {
  // Shuffle questions for variety
  const shuffled = [...GUESS_SONG_QUESTIONS].sort(() => 0.5 - Math.random());
  return apiCall(shuffled.slice(0, 3)); // Return 3 random questions
};

export const fetchMusicalPicturesSession = (): Promise<MusicalPictureQuestion[]> => {
  const shuffled = [...MUSICAL_PICTURES_QUESTIONS].sort(() => 0.5 - Math.random());
  return apiCall(shuffled.slice(0, 2)); // Return 2 random questions
};

export const fetchKaraokeSongs = (): Promise<KaraokeSong[]> => {
  return apiCall(KARAOKE_SONGS);
};
