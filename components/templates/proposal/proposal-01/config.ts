import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Keenan',
  receiverName: 'Aura',
  hookTitle: 'Ada satu hal yang sudah lama ingin kutanyakan padamu...',
  hookSubtext: 'Baca pelan-pelan sampai halaman terakhir, ya.',
  momentPhoto:
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
  momentTitle: 'Di Momen Ini, Aku Sadar',
  momentStory:
    'Entah sejak kapan, hal pertama yang ingin kuceritakan setiap kali terjadi sesuatu—baik itu kabar baik maupun hari yang melelahkan—selalu mengarah padamu.',
  reasonsTitle: 'Kenapa Harus Kamu?',
  reasonsList:
    'Caramu mendengarkan dengan tulus tanpa pernah membuatku merasa sendirian\nTawamu yang selalu berhasil mengubah hari biasa jadi momen favoritku\nKetenangan yang selalu kurasakan setiap kali kita cuma duduk berdua tanpa perlu banyak bicara',
  promiseTitle: 'Sebelum Aku Bertanya...',
  promiseBody:
    'Aku mungkin tidak bisa menjanjikan hari-hari kita akan selalu sempurna tanpa masalah. Tapi aku berjanji akan selalu berusaha menjadi tempat pulang yang aman, mendengar dengan sabar, dan memilihmu setiap hari—di saat mudah maupun sulit.',
  questionText: 'Maukah kamu menjadi pasanganku?',
  yesButtonLabel: 'Iya, Aku Mau!',
  celebrationTitle: 'Mulai Hari Ini, Kita Resmi',
  celebrationMessage:
    'Terima kasih sudah memberi kesempatan dan memilih berjalan bersamaku. Aku tidak sabar membuat lebih banyak kenangan indah denganmu.',
  officialDate: '',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'proposal-01',
  name: 'One Question',
  category: 'proposal',
  description:
    'Template proposal & confession bergaya Full-Screen Interactive Story Deck (5 layar tanpa scroll). Dilengkapi progress bar, foto bingkai Arch, tombol interaktif playful, dan layar perayaan ber-confetti.',
  previewImage:
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
