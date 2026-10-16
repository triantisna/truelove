import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type ScrapbookConfig = TemplateDefinition & { mockData?: any };

export const anniversary03Config: ScrapbookConfig = {
  id: 'anniversary-03',
  name: 'Another Year With You',
  category: 'anniversary',
  description:
    'Template fun & playful ala digital scrapbook. Penuh warna pastel, stiker, efek confetti, dan statistik interaktif.',
  previewImage: '/previews/anniversary-03.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Melvina',
    heroTitle: 'Another Year With You!',
    heroImage: {
      url: 'https://picsum.photos/seed/fun1/800/800',
      publicId: 'mock-hero-scrapbook',
      type: 'image',
    },
    // Memisahkan nilai stat dan teksnya menggunakan pipa (|)
    funStats:
      '127 | hugs 🫂\n438 | photos 📸\nCountless | laughs 😂\nWay too many | food trips 🍜',
    gallery: [
      {
        url: 'https://picsum.photos/seed/fun2/800/1000',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/fun3/1000/800',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/fun4/800/800',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/fun5/800/1000',
        type: 'image',
      },
    ],
    punchlineText: "And somehow... I'd still choose all of it again.",
    mainMessage:
      'Tahun ini kerasa cepet banget ya? Kayaknya baru kemarin kita ketawa sampai perut sakit gara-gara hal random di jalan, eh sekarang udah setahun lagi aja.\n\nMakasih ya udah jadi partner ngemil, tempat cerita paling aman, dan alasan aku senyum sendirian tiap liat hp. I love you more than pizza, and you know how much I love pizza!',
    closingImage: {
      url: 'https://picsum.photos/seed/fun6/800/800',
      publicId: 'mock-closing-scrapbook',
      type: 'image',
    },
    senderName: 'Arzaniel',
    backgroundMusic: '',
  },
};
