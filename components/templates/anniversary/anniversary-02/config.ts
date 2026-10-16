import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type UniverseConfig = TemplateDefinition & { mockData?: any };

export const anniversary02Config: UniverseConfig = {
  id: 'anniversary-02',
  name: 'Our Little Universe',
  category: 'anniversary',
  description:
    'Template estetik dengan nuansa warm cream, portal interaktif, album polaroid, dan 3D flip cards untuk momen termanis kalian.',
  previewImage: '/previews/anniversary-02.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Salzahara',
    heroTitle: 'Welcome to Our Little Universe',
    heroImage: {
      // Menggunakan Picsum agar link foto abadi dan dijamin muncul
      url: 'https://picsum.photos/seed/truelove1/800/800',
      publicId: 'mock-hero-univ',
      type: 'image',
    },
    storyBeganDate: 'The day our story began...',
    gallery: [
      {
        url: 'https://picsum.photos/seed/truelove2/800/1000',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/truelove3/800/1000',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/truelove4/800/1000',
        type: 'image',
      },
    ],
    thingsILove:
      'Cara kamu tersenyum saat melihat makanan enak.\nSuaramu yang selalu jadi penenang terbaik di hari yang melelahkan.\nBagaimana kamu selalu mengingat detail-detail kecil tentang aku.\nSabar dan lembutnya kamu saat aku lagi keras kepala.',
    mainMessage:
      'Di antara miliaran manusia dan luasnya semesta, punya dunia kecil bersamamu adalah hal terbaik yang pernah terjadi padaku. Terima kasih sudah merayakanku di hari-hari baik, dan tetap menggenggam tanganku di hari-hari yang sulit.\n\nMemilikimu bukan sekadar takdir, tapi anugerah terindah yang selalu aku syukuri setiap pagi.',
    closingImage: {
      url: 'https://picsum.photos/seed/truelove5/800/800',
      publicId: 'mock-closing-univ',
      type: 'image',
    },
    closingText: 'To many more trips around the sun together.',
    senderName: 'Tiyy',
    backgroundMusic: '',
  },
};
