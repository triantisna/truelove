import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  bookTitle: 'Bab Tentangmu',
  receiverName: 'Sekar',
  senderName: 'Dimas',
  dedicationQuote:
    'Jika hidupku adalah sebuah buku, kamu adalah bab favorit yang tidak pernah bosan kubaca berulang kali.',
  chapterTitle: 'Tentang Cara Kamu Membuat Semuanya Terasa Pulang',
  mainLetter:
    'Aku bukan orang yang pandai merangkai kalimat puitis. Sering kali, apa yang ada di kepalaku terasa jauh lebih hangat daripada apa yang akhirnya keluar dari mulutku. Karena itu, aku memilih menuliskannya di sini—pelan-pelan, tanpa terburu-buru.\n\nSejak kamu ada, hari-hari yang biasanya lewat begitu saja mulai punya warna. Hal-hal sederhana seperti obrolan di perjalanan pulang, tawa kecil di sela kesibukan, atau sekadar duduk diam di ruangan yang sama, semuanya berubah menjadi momen yang ingin kusimpan lama.\n\nTerima kasih sudah hadir dengan segala ketenanganmu. Terima kasih sudah mau mendengar cerita-ceritaku yang kadang tidak berujung, dan tetap tinggal bahkan di hari-hari ketika aku tidak sedang baik-baik saja.',
  heroImage:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop',
  marginNotes:
    'Caramu selalu ingat detail-detail kecil yang bahkan aku sendiri sering lupa.\nKetulusanmu saat mendengarkan tanpa pernah menghakimi.\nTawamu yang selalu berhasil mencairkan hari paling melelahkan sekalipun.\nSabar dan hangatnya caramu mengingatkanku untuk terus bertumbuh.',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=700&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Sore yang tenang sebelum hujan turun\nLangkah kecil di akhir pekan favorit kita\nSatu frame yang selalu membuatku tersenyum\nTentang kita, tanpa perlu banyak kata',
  closingText:
    'Masih banyak halaman kosong di depan sana, dan aku tidak ingin menulisnya bersama siapa pun selain kamu.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'love-letter-03',
  name: 'A Chapter About You',
  category: 'love-letter',
  description:
    'Surat cinta bergaya buku sastra modern. Sampul hardcover minimalis, halaman dedikasi, surat dengan drop cap, catatan pinggir, dan galeri editorial.',
  previewImage:
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
