import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  albumTitle: 'For You, Always',
  receiverName: 'Naya',
  senderName: 'Reza',
  coverImage:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=900&auto=format&fit=crop',
  letterHeadline: 'Catatan di Balik Lagu yang Selalu Mengingatkanku Padamu',
  mainLetter:
    'Setiap kali aku mendengar lagu yang bagus, hal pertama yang terlintas di kepalaku selalu sama: kamu harus dengar ini juga. Entah sejak kapan, musik dan kamu jadi dua hal yang selalu berjalan beriringan di kepalaku.\n\nAku membuat halaman ini seperti catatan kecil di balik sampul album fisik—hal-hal yang biasanya hanya dibaca oleh orang yang benar-benar peduli. Tidak ada kalimat yang dilebih-lebihkan di sini, hanya rasa syukur yang selama ini mungkin terlalu sering kusimpan sendiri.\n\nTerima kasih sudah hadir dengan ritmemu sendiri, membuat hari-hari yang tadinya berisik jadi terasa lebih tenang, dan membuat setiap perjalanan terasa selalu layak untuk diulang.',
  tracklist:
    'Obrolan Tanpa Arah | Cara kita bisa bicara berjam-jam tentang hal paling receh sampai hal paling serius.\nKopi Sore di Akhir Pekan | Momen paling sederhana yang entah kenapa selalu jadi favoritku.\nCaramu Mendengarkan | Kamu tidak pernah terburu-buru menyela, selalu memberi ruang untukku bercerita.\nTawa Kecilmu | Bagian terbaik yang selalu berhasil memperbaiki suasana hatiku.\nPulang yang Tenang | Perasaan aman setiap kali tahu kamu ada di sisiku.',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=700&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Sore setelah hujan reda\nMenunggu pesanan di meja pojok\nLangkah santai tanpa tujuan\nMomen yang tidak ingin kulupakan',
  outroText:
    'Kalau hidup ini adalah sebuah playlist panjang, kamu adalah lagu yang akan selalu kuputar ulang tanpa pernah bosan.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'love-letter-04',
  name: 'Liner Notes',
  category: 'love-letter',
  description:
    'Surat cinta bergaya booklet album musik indie (Side A / Side B). Sampul album 1:1, liner notes, daftar tracklist hal yang disukai, galeri contact sheet analog, dan credits penutup.',
  previewImage:
    'https://images.unsplash.com/photo-1614613534508-65cbf264c270?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
