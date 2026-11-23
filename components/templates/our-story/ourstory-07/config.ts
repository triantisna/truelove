import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData: Record<string, unknown> = {
  senderName: 'Bima',
  receiverName: 'Sekar',
  archiveNumber: 'ARCHIVE NO. 07 · PRESSED IN TIME',
  openingLine:
    'Beberapa momen terlalu rapuh jika hanya diserahkan pada ingatan—jadi kuawetkan semuanya di sini untuk kita.',
  writtenDate: 'Minggu, 22 November 2026',

  specimen1Label: 'Sore Pertama di Teras',
  specimen1Meta: 'APRIL 2023 · BANDUNG',
  specimen1Story:
    'Cahaya matahari miring jatuh di meja kayu, dan kita berbicara tentang hal-hal kecil yang tidak pernah kubagikan ke orang lain. Saat itu aku belum tahu bahwa sore biasa itu akan jadi awal dari rumahku.',

  specimen2Label: 'Bunga Kering di Halaman Buku',
  specimen2Meta: 'SEPTEMBER 2023 · TOKO BUKU',
  specimen2Story:
    'Kamu menyelipkan kelopak kecil di antara halaman buku yang sedang kubaca supaya aku tidak lupa bagian terakhirnya. Sampai hari ini kelopaknya masih ada di sana, sama utuhnya seperti rasaku padamu.',

  specimen3Label: 'Teh Hangat Setelah Hujan',
  specimen3Meta: 'FEBRUARI 2024 · YOGYAKARTA',
  specimen3Story:
    'Kita berteduh hampir satu jam di warung kecil pinggir jalan dengan sepatu basah. Anehnya, tidak ada sedikit pun rasa kesal—hanya tawa pelan dan rasa lega karena terjebak hujan bersamamu.',

  specimen4Label: 'Jalan Pagi Hari Minggu',
  specimen4Meta: '2024 – SEKARANG',
  specimen4Story:
    'Kebiasaan paling sederhana yang selalu kutunggu setiap pekan: berjalan pelan tanpa tujuan terburu-buru, membeli roti hangat, dan mendengarkan ceritamu tentang apa saja.',

  letterTitle: 'Untuk Semua Musim yang Kita Lewati Bersama',
  letterBody:
    'Seperti orang yang menyelipkan daun dan bunga di antara lembaran kertas katun agar bentuknya tidak hilang dimakan waktu, aku ingin menyimpan potongan-potongan perjalanan kita di sini. Bukan karena aku takut lupa, melainkan karena semua hari yang kujalani bersamamu terlalu indah untuk dibiarkan lewat begitu saja.\n\nBersamamu, aku belajar bahwa cinta tidak harus selalu riuh. Ia justru paling terasa di pagi-pagi yang pelan, di cara kita saling menjaga tanpa banyak kata, dan di keputusan kecil untuk tetap memilih satu sama lain bahkan ketika hari sedang tidak sempurna.\n\nTerima kasih sudah tumbuh bersamaku, sudah sabar merawat hal-hal baik di antara kita, dan sudah menjadi tempat paling teduh untuk pulang. Kapan pun kamu ingin melihat betapa berharganya kita, buka kembali lembaran arsip ini.',

  season1When: 'MUSIM 01 · AWAL MULA',
  season1Title: 'Saat Semuanya Baru Tumbuh',
  season1Story:
    'Masa ketika setiap pesan singkat membuat hari terasa lebih ringan, dan setiap pertemuan terasa selalu berakhir terlalu cepat. Kita mulai menanam kebiasaan-kebiasaan kecil yang tanpa sadar menjadi akar cerita kita.',

  season2When: 'MUSIM 02 · BERTUMBUH',
  season2Title: 'Belajar Saling Mengerti',
  season2Story:
    'Bukan hanya tentang tawa, tapi juga tentang belajar mendengar lebih tenang saat kita berbeda pendapat. Di musim ini aku sadar bahwa kita tidak sedang mencari pasangan yang sempurna—kita sedang membangun ruang yang aman bersama.',

  season3When: 'MUSIM 03 · BERTAHAN',
  season3Title: 'Tetap Hangat di Hari yang Teduh',
  season3Story:
    'Ketika jadwal sama-sama padat dan dunia terasa cepat, kehadiranmu selalu jadi jeda yang paling kunanti. Cukup duduk berdampingan dan berbagi cerita singkat sudah membuat semuanya terasa cukup.',

  season4When: 'MUSIM 04 · KINI',
  season4Title: 'Rumah yang Terus Kita Rawat',
  season4Story:
    'Hari ini, melihat ke belakang membuatku semakin yakin: setiap langkah yang kita ambil—baik yang mudah maupun yang menantang—membawa kita pada ketenangan yang sedang kita nikmati sekarang.',

  mainPhoto: img('photo-1522673607200-164d1b6ce486'),
  mainPhotoCaption:
    'Arsip Utama No. 01 — Cahaya pagi yang hangat, dan senyummu yang selalu jadi favoritku.',

  galleryPhotos: [
    img('photo-1516589178581-6cd7833ae3b2'),
    img('photo-1529634806980-85c3dd6d34ac'),
    img('photo-1518199266791-5375a83190b7'),
    img('photo-1494774157365-9e04c6720e47'),
  ],
  galleryCaptions:
    'Lembar No. 02 — Langkah pelan di sore yang tidak terburu-buru\nLembar No. 03 — Tawa lepas yang selalu ingin kuingat selamanya\nLembar No. 04 — Hari biasa yang terasa istimewa karena bersamamu\nLembar No. 05 — Kita, dan semua musim baik yang masih menunggu',

  signature: 'Bima',
  tomorrowTitle: 'Benih Kecil untuk Musim-Musim Berikutnya',
  tomorrowText:
    'Masih banyak halaman kosong di buku arsip ini. Aku ingin terus mengisinya bersamamu—dengan lebih banyak pagi yang tenang, perjalanan baru yang seru, dan cinta yang semakin dewasa dari tahun ke tahun.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'ourstory-07',
  name: 'Pressed in Time',
  category: 'our-story',
  active: true,
  tier: 'premium',
  description:
    'Some moments are too fragile to leave to memory—so I pressed them here for us.',
  previewImage: img('photo-1522673607200-164d1b6ce486'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
