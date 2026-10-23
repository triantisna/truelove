import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type BirthdayBoxConfig = TemplateDefinition & { mockData?: any };

export const birthdayBoxConfig: BirthdayBoxConfig = {
  id: 'birthday-surprise-02',
  name: 'Birthday Box - Interactive Gift',
  category: 'birthday',
  description:
    'Template hadiah ulang tahun interaktif dengan pengalaman membuka kotak kado virtual, animasi pita, dan rangkaian kartu memori yang estetik.',
  previewImage: '/previews/birthday-02.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Melvina',
    introMessage:
      'Today is your day, and I wanted to give you something a little different.\n\nIt may not come wrapped in real paper, but every little part of this surprise was made with you in mind.\n\nReady to open it?',
    birthdayWish:
      "Another year of you being you — and honestly, the world is a little more wonderful because you're in it.\n\nI hope today brings you the kind of happiness that stays long after the candles are blown out.",
    memoryImage: {
      url: 'https://picsum.photos/seed/bdaymemories/800/800',
      publicId: 'mock-bday-box-img',
      type: 'image',
    },
    memoryCaption:
      "Some moments may look ordinary when they happen, but somehow become the ones we want to keep forever.\n\nI'm glad I get to have memories with you, and I'm looking forward to making so many more.",
    personalLetter:
      "If I could wrap one thing up and give it to you today, it would be the reminder that you are loved, appreciated, and worthy of all the good things you're working toward.\n\nI hope you never feel like you have to be perfect to deserve happiness. You deserve kindness on the easy days and the difficult ones, too.",

    // Dipisah dengan Enter untuk dirender menjadi kartu-kartu kecil
    moreThings:
      "Here's to more laughter, more spontaneous plans, and more silly moments together.\nAnd whenever life gets a little overwhelming, I hope you remember that you don't have to figure everything out at once.",

    closingMessage:
      "Happy Birthday, once again.\n\nI hope this new chapter brings you closer to the things you dream about, the people who make you feel at home, and the version of yourself you're excited to become.\n\nEnjoy your day, birthday star. You deserve it.",

    senderName: 'Arzaniel',
    backgroundMusic: '',
  },
};
