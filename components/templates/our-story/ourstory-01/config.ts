import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Raka',
  receiverName: 'Nadya',
  sinceYear: '2022',
  coverTagline:
    'Dari obrolan singkat di sore hujan, sampai jadi rumah paling tenang untuk pulang.',
  heroPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
  heroCaption: 'Halaman pertama yang tidak pernah ingin kututup.',
  prologueTitle: 'Bagaimana Semuanya Dimulai',
  prologueText:
    'Tidak ada yang menyangka pertemuan biasa di sebuah kedai kopi kecil bisa berubah menjadi cerita terpanjang yang paling kusyukuri. Awalnya kita cuma dua orang asing yang kebetulan punya selera musik sama dan sama-sama tidak suka pulang terlalu cepat.\n\nPelan-pelan, percakapan ringan berubah menjadi kebiasaan. Hari-hari yang tadinya terasa datar mulai punya warna sejak ada namamu di dalamnya. Di sini aku simpan bab-bab kecil perjalanan kita—supaya suatu hari nanti kita selalu ingat betapa jauh dan indahnya langkah yang sudah kita lalui.',
  chapters:
    'Oktober 2022 | Pertama Kali Duduk Berdua | Hujan deras sore itu bikin kita terjebak dua jam lebih lama dari rencana. Anehnya, waktu terasa berjalan terlalu cepat.\nJanuari 2023 | Mulai Berjalan Searah | Malam tahun baru yang sederhana, tanpa kembang api mewah—cuma janji kecil untuk saling menjaga dan tidak mudah menyerah.\nAgustus 2023 | Perjalanan Pertama ke Luar Kota | Nyasar dua kali, kehujanan di jalan, tapi justru jadi tawa paling lepas yang pernah kita punya.\nNovember 2024 | Belajar Dewasa Bersama | Melewati hari-hari yang tidak selalu mudah, tapi akhirnya sadar bahwa rumah bukan soal tempat—melainkan siapa yang ada di sampingmu.',
  littleThings:
    'Lagu Kita | Nadin Amizah — Semua Aku Dirayakan\nTempat Favorit | Sudut jendela kedai kopi langganan setiap Minggu sore\nMakanan Wajib | Mie pedas tengah malam & es kopi susu gula aren\nKebiasaan Kecil | Selalu kirim foto langit sore kalau lagi tidak bersama',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Sore tenang yang selalu ingin kuulang\nTawamu yang jadi favoritku sepanjang waktu\nLangkah pelan di hari yang panjang\nKita—dan semua cerita yang masih menanti',
  epilogueTitle: 'Masih Banyak Bab yang Ingin Kutulis Bersamamu',
  epilogueText:
    'Terima kasih sudah bertahan, tumbuh, dan memilih untuk tetap di sini. Bab-bab berikutnya masih kosong, dan aku tidak sabar mengisinya satu per satu bersamamu.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'ourstory-01',
  name: 'Chapters of Us',
  category: 'our-story',
  description:
    'Template perjalanan cinta bergaya buku memoar editorial (Kinfolk). Menampilkan sampul buku, prolog, garis waktu per bab, catatan kecil tentang kita, dan galeri kenangan.',
  previewImage:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
