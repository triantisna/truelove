import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

// Kita gabungkan tipe agar TypeScript mengizinkan properti mockData
type AnniversaryConfig = TemplateDefinition & { mockData?: any };

export const anniversary01Config: AnniversaryConfig = {
  id: 'anniversary-01',
  name: 'Still You - Cinematic',
  category: 'anniversary',
  description:
    'Template premium dengan efek cinematic scroll, dark navy theme, dan countdown gerbang waktu.',
  previewImage: '/previews/anniversary-01.jpg',
  active: true,
  // Kita casting schemaJson ke TemplateSchema biar 100% aman
  schema: schemaJson as TemplateSchema,

  mockData: {
    // Trik Cerdas: Kita kasih flag khusus biar file index.tsx tau ini mode demo
    unlockDate: 'DEMO_5_SEC',
    receiverName: 'Melvina',
    heroTitle: 'Happy 3rd Anniversary, My Moon',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=800&auto=format&fit=crop',
      publicId: 'mock-hero',
      type: 'image',
    },
    timeline: [
      {
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
        caption:
          '14 Feb 2023 | Hari pertama kita memutuskan untuk memulai perjalanan ini bersama.',
        type: 'image',
      },
      {
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
        caption:
          '25 Dec 2023 | Hujan deras, motor mogok, tapi kita malah ketawa sepanjang jalan.',
        type: 'image',
      },
      {
        url: 'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?q=80&w=800&auto=format&fit=crop',
        caption:
          '14 Feb 2026 | Tiga tahun berlalu, and among all people... I am still glad I met you.',
        type: 'image',
      },
    ],
    mainMessage:
      'They say time flies when you are having fun. But with you, time does not just fly; it glows. Thank you for being my calm in the chaos, my safe place, and my favorite hello.\n\nHere is to all the memories we have made, and to a million more tomorrows.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop',
        type: 'image',
      },
      {
        url: 'https://images.unsplash.com/photo-1606907568152-cb2e32f05a1d?q=80&w=800&auto=format&fit=crop',
        type: 'image',
      },
    ],
    senderName: 'Arzaniel',
    backgroundMusic: '',
  },
};
