import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as TemplateSchema;

const config = {
  id: 'birthday-surprise-01',
  name: 'Birthday Surprise',
  category: 'birthday',
  description:
    'Premium birthday template with lights-out intro, confetti, and interactive wish cards.',
  previewImage: '/placeholders/birthday-01.svg', // Nanti bisa diganti fotonya
  active: true,
  schema: typedSchema,
  mockData: {
    tapText: 'Tap to turn on the lights 💡',
    heroTitle: 'Happy Birthday My Love!',
    age: '24',
    openingText: 'Hari ini adalah harimu yang paling spesial...',
    mainMessage:
      'Terima kasih sudah lahir ke dunia dan menjadi alasan senyumku setiap hari. Ini ada sedikit kejutan buat kamu.',
    wish1: 'Semoga semua mimpimu perlahan menjadi nyata ✨',
    wish2: 'Semoga kamu selalu dikelilingi orang yang sayang sama kamu 🌻',
    wish3: 'Dan semoga kita selalu punya alasan untuk tertawa bareng ❤️',
    closingText: 'I love you to the moon and back.',
    heroImage:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
    closingImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', // Foto portrait bulat yang lebih pas
    // Galeri Birthday butuh kelipatan 2 biar grid-nya nggak bolong
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=500&auto=format&fit=crop',
      },
      {
        url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=500&auto=format&fit=crop',
      },
      {
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=500&auto=format&fit=crop',
      },
      {
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
} as TemplateDefinition & {
  mockData: Record<string, unknown>;
};

export default config;
