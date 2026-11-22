import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  masthead: 'THE SPECIAL EDITION',
  receiverName: 'Laras',
  senderName: 'Bima',
  headline: 'Berita Utama: Aku Masih Jatuh Cinta Padamu Setiap Hari',
  subheadline:
    'Sebuah edisi khusus yang ditulis, disunting, dan diterbitkan secara eksklusif hanya untuk satu pembaca.',
  heroImage:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop',
  mainLetter:
    'Kalau perasaan bisa masuk halaman depan surat kabar, namamu mungkin sudah jadi berita utama sejak hari pertama kita bertemu. Bedanya, berita di luar sana cepat sekali usang, sementara hal-hal tentangmu justru terasa makin penting setiap harinya.\n\nAku menulis edisi khusus ini bukan karena ada momen besar yang sedang dirayakan, melainkan karena aku sadar kita sering terlalu sibuk menjalani hari sampai lupa berhenti sejenak dan bilang terima kasih. Terima kasih sudah menjadi tempat pulang yang paling tenang, bahkan ketika dunia di luar sedang berisik.\n\nDi tengah semua hal yang berubah begitu cepat, memilikimu di sisiku adalah satu-satunya kabar baik yang tidak pernah gagal membuat hariku terasa utuh.',
  inBrief:
    'Hal yang Paling Kurindukan | Suaramu saat bercerita panjang lebar tentang hal-hal acak di penghujung hari.\nKebiasaan Favoritmu | Caramu selalu memastikan orang di sekitarmu sudah makan dan baik-baik saja.\nRencana Selanjutnya | Lebih banyak perjalanan santai, kopi pagi tanpa buru-buru, dan akhir pekan yang tenang berdua.\nFakta Singkat | Tidak ada satu hari pun yang terasa biasa sejak kamu hadir.',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=700&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Arsip sore yang tenang sebelum matahari tenggelam.\nMomen tanpa rencana yang berakhir jadi kenangan terbaik.\nSatu sudut kota yang diam-diam selalu mengingatkanku padamu.\nTentang kita, terekam apa adanya.',
  personalNotice:
    'Diumumkan secara resmi bahwa hati penulis masih sepenuhnya ditempati oleh Laras. Tidak menerima pengajuan lain. Berlaku hari ini, besok, dan seterusnya.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'love-letter-05',
  name: 'The Special Edition',
  category: 'love-letter',
  description:
    'Surat cinta bergaya koran editorial edisi khusus. Halaman depan broadsheet, artikel utama, kolom In Brief, photo essay, dan kotak pengumuman Personal Notice.',
  previewImage:
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
