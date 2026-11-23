import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData = {
  senderName: 'Arya',
  receiverName: 'Kinanti',
  writtenDate: 'Kamis, 20 November 2025',
  openingLine: 'Tidak ada yang perlu dijawab hari ini. Baca saja, pelan-pelan.',

  ledgerSaid:
    'Aku bilang kamu selalu membesar-besarkan masalah, di depan orang lain. Aku memotong ucapanmu di tengah kalimat. Aku menjawab pertanyaanmu dengan helaan napas, seakan kamu adalah bebanku. Semua itu keluar dari mulutku dengan sangat mudah, dan itulah yang paling membuatku malu.\n\nAku sudah memeriksa dari mana kebiasaan itu datang. Bukan untuk membela diri, tetapi supaya aku tahu apa yang harus kuperbaiki.',
  ledgerRegret:
    'Aku menyesal karena yang kuprioritaskan malam itu adalah terdengar benar, bukan membuatmu merasa aman. Aku menyesal karena kamu sampai harus menyiapkan diri sebelum berbicara denganku, seolah jujur kepadaku adalah keputusan yang berisiko.\n\nPenyesalan ini tanpa kata "tetapi" dan tanpa "kalau saja". Yang terjadi adalah perbuatanku, dan hanya itu.',
  ledgerDeserve:
    'Kamu layak mendapat pendengar yang tidak sibuk menyiapkan jawaban. Kamu layak mendapat nada yang sama lembutnya saat kita sedang tidak sepakat. Kamu layak mendapat orang yang mengakui lebih dulu, bukan setelah dibujuk.\n\nDan kamu layak mendapat waktu untuk memutuskan, tanpa harus merasa bersalah karena memintanya.',

  letterBody:
    'Aku menulis ini di meja yang sama tempat kita biasa berdebat soal hal sepele, dan baru sekarang aku sadar betapa mahalnya hal sepele itu ketika kamu tidak lagi mau duduk di seberangku.\n\nAda satu hal sulit yang ingin kukatakan: aku salah. Bukan sebagian, bukan "kita berdua", dan bukan salah paham. Aku salah. Kalimat sependek itu ternyata butuh tiga hari sebelum bisa kuucapkan tanpa menambahkan alasan di belakangnya.\n\nSelama ini aku mengira damai adalah soal siapa yang lebih dulu benar. Ternyata damai adalah soal siapa yang lebih dulu rela memilih. Dan hari ini aku memilih kamu, bukan harga diriku, bukan posisiku dalam percakapan itu, bukan kebutuhanku untuk dimengerti lebih dulu.\n\nTidak ada tenggat waktu dariku. Kalau kamu ingin membalas, aku mendengarkan. Kalau kamu butuh diam, aku menunggu dengan sabar, dan tanpa menghitung hari.',

  commit1Title: 'Mengakui lebih dulu',
  commit1Detail:
    'Saat aku salah, aku akan mengatakannya di percakapan yang sama, bukan tiga hari kemudian.',
  commit2Title: 'Menunggu giliran bicara',
  commit2Detail:
    'Aku akan mendengarkan sampai kamu selesai, lalu menjeda dua tarikan napas sebelum menjawab.',
  commit3Title: 'Jeda yang jelas',
  commit3Detail:
    'Kalau aku mulai panas, aku akan bilang aku butuh waktu dan kapan aku akan kembali, bukan pergi tanpa kabar.',
  commit4Title: 'Menjaga nada',
  commit4Detail:
    'Aku akan memperlakukan ketidaksepakatan kita sehalus aku memperlakukan hal-hal yang kusayangi, karena kamu termasuk di dalamnya.',

  mainPhoto: img('photo-1494774157365-9e04c6720e47'),
  mainPhotoCaption:
    'Hari yang tenang itu masih ingin kujaga, dengan cara yang lebih baik.',
  galleryPhotos: [
    img('photo-1522673607200-164d1b6ce486'),
    img('photo-1469371670807-013ccf25f16a'),
    img('photo-1519741497674-611481863552'),
    img('photo-1529333166437-7750a6dd5a70'),
  ],
  galleryCaptions:
    'Kita pernah bisa diam tanpa merasa canggung\nSore yang cukup dengan obrolan yang pelan\nKamu tertawa, dan aku lupa semua yang rumit\nHari biasa yang kini kusadari sangat berharga',

  signature: 'Arya',
  closingNote:
    'Pintu ini selalu terbuka. Ambil waktumu sebanyak yang kamu butuh. Kalau suatu hari kamu ingin masuk, kamu tidak perlu menjelaskan apa-apa. Cukup ketuk, dan aku akan ada di sini, dengan teh hangat dan telinga yang sungguh-sungguh mendengarkan.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'apology-07',
  name: 'The Olive Branch',
  category: 'apology',
  active: true,
  tier: 'premium',
  description:
    'Peace isn’t won by being right; it’s built by choosing you over my pride.',
  previewImage: img('photo-1494774157365-9e04c6720e47'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
