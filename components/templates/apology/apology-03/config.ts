import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type Apology03Config = TemplateDefinition & { mockData?: any };

export const apology03Config: Apology03Config = {
  id: 'apology-03',
  name: 'The White Flag - Interactive Apology',
  category: 'apology',
  description:
    'Template permintaan maaf yang fun dan interaktif. Dilengkapi "Laporan Kesalahan", daftar sogokan, dan tombol "Tidak" yang akan kabur untuk memaksa pasangan memaafkanmu.',
  previewImage: '/previews/apology-03.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Melvina',
    heroTitle: 'Okay, hear me out...',
    heroImage: {
      url: 'https://picsum.photos/seed/sorry1/800/800',
      publicId: 'mock-hero-sorry',
      type: 'image',
    },
    introMessage:
      'Aku tau aku nyebelin, aku ngaku salah. Aku bikin halaman ini khusus buat minta maaf sama kamu 🥺',
    theCrime: 'Ketiduran semalem pas kamu lagi seru-serunya cerita.',
    myExcuse:
      'Gravitasi di kasurku tiba-tiba menguat secara drastis di luar kendali manusia.',
    theVerdict: '100% Guilty. Tidak ada pembelaan lagi.',

    // Dipisah dengan Enter
    peaceOfferings:
      'Beliin seblak level 3 plus ceker kesukaanmu.\nNemenin nonton drakor seharian tanpa protes.\nJanji nggak ngulangin lagi (setidaknya untuk minggu ini hehe).',

    questionText: 'So... are we good now?',
    yesButtonText: 'Iya dimaafin!',

    // Teks yang akan muter gonta-ganti pas tombol kabur
    noButtonTexts:
      'Masih ngambek\nYakin nih?\nAyolah 🥺\nCoba pikir lagi\nKan mau dibeliin seblak!\nTolonglah 🙏',

    successImage: {
      url: 'https://picsum.photos/seed/happy1/800/800',
      publicId: 'mock-success-sorry',
      type: 'image',
    },
    successMessage:
      'YAY! Makasih udah dimaafin! You are the best thing that ever happened to me ❤️\n\nTunggu di depan rumah ya, gofood seblaknya otw!',
    senderName: 'Arzaniel',
    backgroundMusic: '',
  },
};
