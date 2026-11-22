import schema from './schema.json';

import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as TemplateSchema;

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'love-letter-02',

  name: 'The Letter I Kept',

  category: 'love-letter',

  description:
    'An intimate vintage-inspired love letter, revealing heartfelt words through an elegant envelope-opening experience.',

  previewImage: '/placeholders/love-letter-02.svg',

  active: true,

  schema: typedSchema,

  mockData: {
    senderName: 'Arzaniel',
    receiverName: 'Melvina',

    openingText: 'To someone who means more than words could ever explain.',

    mainMessage:
      'Dear Melvina,\n\nSometimes, I wish I could find the perfect words to tell you how much you mean to me. But somehow, every word feels too small compared to what I feel.\n\nI just want you to know that having you in my life is something I will never take for granted. Your presence makes ordinary days feel a little more beautiful, and even the simplest moments become memories I want to keep.\n\nIf there is one thing I hope you never forget, it is this: you are loved, appreciated, and always worth choosing.\n\nNo matter how many pages I write, there will always be more things I want to tell you.',

    closingText: 'Until words become memories, and memories become forever.',

    heroImage:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop',

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
        caption: 'A moment worth keeping',
      },
      {
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop',
        caption: 'One of my favorite days',
      },
      {
        url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&auto=format&fit=crop',
        caption: 'A memory I will always cherish',
      },
    ],

    backgroundMusic: '',
  },
};

export default config;
