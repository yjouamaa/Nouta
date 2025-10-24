
import type { Game } from './types';
import { GuessSongIcon, MusicalPicturesIcon, KaraokeIcon, SongLetterIcon } from './components/icons';

export const GAMES: Game[] = [
  {
    id: 'guess-song',
    title: 'التخمين السريع',
    description: 'استمع للمقطع وخمّن اسم الأغنية أو الفنان بأسرع وقت ممكن.',
    icon: GuessSongIcon,
    color: '#A020F0', // brand-purple
  },
  {
    id: 'musical-pictures',
    title: 'الصور الموسيقية',
    description: 'شاهد الصور التي تعبر عن أغنية وحاول تخمين اسمها الصحيح.',
    icon: MusicalPicturesIcon,
    color: '#40E0D0', // brand-turquoise
  },
  {
    id: 'karaoke',
    title: 'الكاريوكي',
    description: 'اختر أغنيتك المفضلة، غنِّ، وسجّل أداءك أو نافس أصدقاءك.',
    icon: KaraokeIcon,
    color: '#FFA500', // brand-orange
  },
  {
    id: 'song-letter',
    title: 'حرف الأغاني',
    description: 'تنافس مع 3 لاعبين آخرين في تحدي إيجاد أغنية تبدأ بآخر حرف.',
    icon: SongLetterIcon,
    color: '#FFD700', // brand-gold
  },
];
