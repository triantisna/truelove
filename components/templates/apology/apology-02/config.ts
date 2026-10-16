import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type CanWeTalkConfig = TemplateDefinition & { mockData?: any };

export const apology02Config: CanWeTalkConfig = {
  id: 'apology-02',
  name: 'Can We Talk? - Editorial Chat',
  category: 'apology',
  description:
    'Pengalaman visual menyerupai percakapan tenang. Menggunakan desain frosted glass dan transisi warna ambient yang merespons scroll, tanpa tekanan untuk langsung membalas.',
  previewImage: '/previews/apology-02.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Salzahara',
    ambientImage: {
      url: 'https://picsum.photos/seed/nightink/1000/1000',
      publicId: 'mock-ambient-blur',
      type: 'image',
    },
    openingChat:
      "Hey, Salzahara.\n\nI've been thinking about what happened, and I don't want to pretend that everything is fine when I know there are things we haven't properly talked about.\n\nIf you're willing, I'd like to tell you what's been on my mind.",
    intentionChat:
      "I'm not sending this to win an argument or to explain away what I did.\n\nI want to understand what you felt, acknowledge the things I got wrong, and give you the apology I should have given you.\n\nI know a conversation can't fix everything in a single moment. But avoiding it won't help me become better, either.",

    // Pemisahan dengan Enter (\n) untuk memecah UI menjadi beberapa bubble chat
    reflectionCards:
      "When things got tense, I focused too much on my own feelings. I didn't give enough space to yours, and I'm sorry.\nEven if I didn't intend to hurt you, I understand that my intentions don't erase the impact of my actions.\nI wish I'd paused, listened, and asked what you needed instead of assuming I already understood.",

    transitionImage: {
      url: 'https://picsum.photos/seed/warmmist/800/800',
      publicId: 'mock-transition-img',
      type: 'image',
    },
    mainLetter:
      'I should have said, "I hear you."\n\nI should have asked, "Can you help me understand why this hurt you?"\n\nAnd I should have remembered that the person I care about isn\'t someone I need to defeat in a disagreement.\n\nI\'m sorry for the moments when I forgot that.',
    closingInvite:
      "If and when you're comfortable talking, I'd like to listen without interrupting or rushing you toward a solution.\n\nYou can take your time. You don't have to reply to this page or decide anything today.\n\nI just wanted to open the door to a better conversation, and to let you know that I'm willing to do my part.",
    senderName: 'Tiyy',
    backgroundMusic: '',
  },
};
