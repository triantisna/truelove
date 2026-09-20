import schema from './schema.json';

import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as TemplateSchema;

const config: TemplateDefinition = {
  id: 'love-letter-01',

  name: 'Dear You',

  category: 'love-letter',

  description: 'An intimate interactive love letter with a romantic reveal.',

  previewImage: '/placeholders/love-letter-01.svg',

  active: true,

  schema: typedSchema,

  mockData: {
    heroTitle: 'For My One and Only',
    openingText: 'A little surprise just for you...',
    mainMessage:
      'Aku mungkin bukan orang yang paling pandai merangkai kata. Tapi lewat surat digital ini, aku cuma mau bilang terima kasih udah nemenin aku melewati banyak hal hebat tahun ini.\n\nYou make my world so much brighter.',
    closingText: 'With all my love,',
    heroImage:
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    closingImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    // Tambahan wajib untuk Love Letter biar teksnya nggak fallback ke default Inggris:
    reasons: [
      'Kamu selalu sabar ngadepin keras kepalanya aku.',
      'Tawamu selalu jadi suara favoritku.',
      'Karena sama kamu, hal sederhana kerasa mewah.',
    ],
    // Galeri Love Letter butuh 3 foto biar polaroidnya pas
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=500&auto=format&fit=crop',
        caption: 'First date kita',
      },
      {
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=500&auto=format&fit=crop',
        caption: 'Liburan seru',
      },
      {
        url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=500&auto=format&fit=crop',
        caption: 'Selalu bareng',
      },
    ],
  },
} as TemplateDefinition & {
  mockData: Record<string, unknown>;
};

export default config;
