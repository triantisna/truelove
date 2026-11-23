import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Bagas',
  receiverName: 'Laras',
  rollCode: 'ROLL 02 · ISO 400 · 35MM',
  coverTagline:
    'Beberapa momen terlalu berharga untuk dibiarkan pudar—jadi kusimpan semuanya di sini.',
  heroPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
  heroMeta: 'BANDUNG · OKT 2023',
  introTitle: 'Frame Pertama yang Mengubah Segalanya',
  introText:
    'Kalau perjalanan kita adalah sebuah film indie, aku tidak akan memotong satu pun adegannya—bahkan bagian saat kita kehujanan, salah jalan, atau cuma duduk diam di pinggir jalan sambil menunggu kopi dingin.\n\nSetiap potongan di gulungan ini adalah bukti betapa serunya tumbuh bersama kamu. Tidak harus selalu sempurna, yang penting selalu nyata.',
  exposures:
    'OKT 2023 · DAGO | Sore Pertama Tanpa Rencana | Cuma niat beli buku sebentar, berakhir keliling kota sampai lampu jalan menyala satu per satu.\nFEB 2024 · YOGYAKARTA | Perjalanan Jauh Pertama | Kereta malam, kamera analog yang hampir kehabisan roll, dan tawa yang tidak berhenti sampai pagi.\nAGT 2024 · JAKARTA | Konser di Bawah Hujan | Baju basah kuyup, suara hampir habis, tapi itu tetap jadi salah satu malam terbaik yang pernah kita punya.\nJAN 2025 · RUMAH | Hari-Hari Biasa yang Tenang | Akhirnya sadar bahwa adegan paling kusuka bukan liburan jauh—melainkan sore biasa saat kita cuma masak bareng.',
  productionNotes:
    'Pemeran Utama | Bagas & Laras\nLokasi Favorit | Kursi belakang kedai kopi & jalanan sepi jam 9 malam\nSoundtrack Kita | Reality Club — Anything You Want\nAdegan Terbaik | Setiap kali kamu tertawa sampai lupa sedang difoto',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Cahaya sore yang jatuh pas di wajahmu\nMomen candid yang selalu jadi favoritku\nLangkah pelan setelah seharian keliling kota\nFrame terakhir di roll ini, tapi bukan akhir cerita kita',
  closingTitle: 'Gulungan Berikutnya Masih Menunggu Kita',
  closingText:
    'Terima kasih sudah jadi partner perjalanan terbaik. Masih banyak tempat, tawa, dan roll film baru yang ingin kuhabiskan bersamamu.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'ourstory-02',
  name: '35mm of Us',
  category: 'our-story',
  description:
    'Template perjalanan cinta bergaya fotografi analog 35mm dan contact sheet darkroom. Gelap, sinematik, dan modern dengan daftar exposure, production notes, serta darkroom prints.',
  previewImage:
    'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
