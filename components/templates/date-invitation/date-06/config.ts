import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData: Record<string, unknown> = {
  senderName: 'Adrian',
  receiverName: 'Celine',
  invitationCode: 'SOIRÉE NO. 06 · PRIVATE INVITE',
  openingLine:
    'Berdandanlah yang paling kamu suka—malam ini sepenuhnya milik kita berdua.',

  clue1Title: 'Suasana',
  clue1Text:
    'Cahaya lilin hangat, alunan musik pelan, dan meja sudut tenang dengan pemandangan lampu kota dari atas.',

  clue2Title: 'Rasa',
  clue2Text:
    'Tiga sajian hangat yang sudah kupesankan khusus untuk kita, ditutup dessert favoritmu yang selalu kamu cari.',

  clue3Title: 'Kejutan Kecil',
  clue3Text:
    'Ada sesuatu yang sudah lama kamu sebut sepintas beberapa bulan lalu—kusiapkan diam-diam untuk malam itu.',

  dateText: 'Sabtu, 19 Desember 2026',
  timeText: '19.00 WIB – Larut',
  locationText: 'The Velvet Rooftop & Lounge, Bandung',
  dressCode: 'Evening Chic · Hitam, Ivory, atau Champagne',

  letterTitle: 'Satu Malam yang Sengaja Kusisihkan untuk Kita',
  letterBody:
    'Di antara hari-hari yang berjalan terlalu cepat dan jadwal yang sering membuat kita hanya sempat bertukar kabar singkat, aku ingin mencuri satu malam penuh khusus untukmu.\n\nTidak ada agenda pekerjaan, tidak ada distraksi layar—hanya kita berdua, pakaian terbaik yang membuatmu merasa paling percaya diri, makan malam yang hangat, dan percakapan panjang sampai malam terasa benar-benar milik kita.\n\nSemua reservasi sudah aman atas nama kita. Tugasmu malam itu hanya satu: datang dengan tenang, dan biarkan aku merayakan kehadiranmu.',

  chapter1Time: '18.30 WIB · PENJEMPUTAN',
  chapter1Title: 'Menjemputmu Tanpa Terburu-Buru',
  chapter1Story:
    'Aku akan tiba tepat waktu di depan rumahmu. Ambil waktumu untuk bersiap, dan kita mulai perjalanan malam itu dengan playlist yang tenang.',

  chapter2Time: '19.30 WIB · CANDLELIT DINNER',
  chapter2Title: 'Makan Malam di Meja Sudut',
  chapter2Story:
    'Meja terbaik dengan cahaya lilin hangat sudah menanti kita. Waktunya menikmati hidangan perlahan sambil bercerita tentang semua hal yang belum sempat kita bahas.',

  chapter3Time: '21.30 WIB · LATE NIGHT DRIVE',
  chapter3Title: 'Menutup Malam dengan Jalanan Sepi',
  chapter3Story:
    'Setelah makan malam selesai, kita tidak perlu langsung pulang—kita bisa keliling kota sebentar menikmati angin malam sebelum kuantar kembali dengan selamat.',

  mainPhoto: img('photo-1514933651103-005eec06c04b'),
  mainPhotoCaption:
    'Atmosfer malam — lampu temaram, meja berdua, dan waktu yang berjalan pelan.',

  moodboardPhotos: [
    img('photo-1559339352-11d035aa65de'),
    img('photo-1414235077428-338989a2e8c0'),
    img('photo-1517248135467-4c7edcad34c4'),
  ],
  moodboardCaptions:
    'Inspirasi suasana — hangat, intim, dan tenang\nHidangan malam yang siap dinikmati tanpa buru-buru\nSudut terbaik untuk menutup pekan bersamamu',

  signature: 'Adrian',
  closingNote:
    'Pilih vibe-mu untuk malam itu, lalu konfirmasi kehadiranmu agar Golden Pass-mu aktif.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'date-06',
  name: 'The Midnight Soirée',
  category: 'date-invitation',
  active: true,
  tier: 'premium',
  description: 'Dress up, step out—tonight belongs only to the two of us.',
  previewImage: img('photo-1514933651103-005eec06c04b'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
