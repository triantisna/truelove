import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData: Record<string, unknown> = {
  senderName: 'Rayhan',
  receiverName: 'Nadine',
  ageNumber: '24',
  editionCode: 'PRIVATE CELEBRATION · NO. 06',
  birthdayDate: '24 November 2026',
  openingLine:
    'Untuk satu tahun lagi bersamamu—babak terbaik dalam hidupmu baru saja dimulai.',

  toast1Title: 'Untuk Tahun yang Sudah Dilewati',
  toast1Text:
    'Kamu sudah melewati banyak hari yang tidak mudah sepanjang tahun lalu, dan kamu berhasil sampai di sini dengan kepala tegak. Aku bangga sekali melihat ketangguhanmu.',

  toast2Title: 'Untuk Siapa Kamu Hari Ini',
  toast2Text:
    'Untuk hatimu yang tetap hangat di tengah dunia yang serba cepat, untuk caramu peduli pada hal-hal kecil, dan untuk kehadiranmu yang selalu menenangkan orang di sekitarmu.',

  toast3Title: 'Untuk Semua yang Akan Datang',
  toast3Text:
    'Semoga usia barumu dipenuhi pintu-pintu baik yang terbuka tepat waktu, mimpi yang satu per satu menjadi nyata, dan hari-hari yang membuatmu tersenyum lega.',

  letterTitle: 'Selamat Bertambah Usia, Orang Paling Berharga',
  letterBody:
    'Malam ini aku tidak ingin merayakan ulang tahunmu dengan keramaian yang cepat berlalu. Aku ingin merayakannya dengan tenang—seperti mengangkat gelas di sebuah ruangan hangat yang hanya berisi rasa syukur karena kamu ada di dunia ini.\n\nSatu tahun ke belakang mungkin membawa banyak tantangan, lelah, dan pelajaran baru yang tidak selalu ringan. Tapi melihat caramu bertahan, belajar, dan tetap menjadi dirimu sendiri membuatku semakin kagum setiap hari. Kamu tumbuh dengan sangat indah.\n\nDi usia barumu ini, aku berharap kamu tidak pernah lupa untuk merayakan dirimu sendiri—bukan hanya saat mencapai hal besar, tapi juga di hari-hari biasa. Terima kasih sudah lahir, sudah bertahan sejauh ini, dan sudah membiarkanku ikut menyaksikan perjalananmu.',

  chapter1Tag: 'SOROTAN 01 · KETENANGANMU',
  chapter1Title: 'Cara Kamu Menghadapi Hari yang Sulit',
  chapter1Story:
    'Ada ketenangan luar biasa dalam caramu menata ulang langkah setiap kali rencana tidak berjalan mulus. Kamu selalu menemukan jalan pulang menuju dirimu sendiri.',

  chapter2Tag: 'SOROTAN 02 · KEHANGATANMU',
  chapter2Title: 'Tawa yang Selalu Menghidupkan Ruangan',
  chapter2Story:
    'Tanpa kamu sadari, tawa dan ceritamu sering kali menjadi alasan hari seseorang terasa jauh lebih ringan. Jangan pernah kehilangan sisi hangat itu.',

  chapter3Tag: 'SOROTAN 03 · PERTUMBUHANMU',
  chapter3Title: 'Versi Dirimu yang Makin Dewasa',
  chapter3Story:
    'Melihatmu semakin mengenal apa yang kamu mau, berani berkata tidak pada hal yang menguras energimu, dan semakin menyayangi dirimu sendiri adalah hal paling membanggakan tahun ini.',

  chapter4Tag: 'SOROTAN 04 · BABAK BARUMU',
  chapter4Title: 'Semua Hal Baik yang Menunggu di Depan',
  chapter4Story:
    'Usia baru bukan sekadar angka yang bertambah, melainkan ruang baru untuk lebih banyak perjalanan, ketenangan, dan kebahagiaan yang benar-benar pantas kamu dapatkan.',

  mainPhoto: img('photo-1513151233558-d860c5398176'),
  mainPhotoCaption:
    'Potret Utama — Selamat memasuki usia baru yang lebih hangat dan bercahaya.',

  galleryPhotos: [
    img('photo-1530103862676-de8c9debad1d'),
    img('photo-1464349153735-7db50ed83c84'),
    img('photo-1516589178581-6cd7833ae3b2'),
    img('photo-1522673607200-164d1b6ce486'),
  ],
  galleryCaptions:
    'Momen 02 — Cahaya kecil yang selalu bikin malam terasa istimewa\nMomen 03 — Tawa lepas yang semoga selalu menemani langkahmu\nMomen 04 — Jeda hangat di tengah tahun yang sibuk\nMomen 05 — Bersulang untuk semua kenangan baru yang menanti',

  signature: 'Rayhan',
  goldenWishTitle: 'Doa Terbaik untuk Babak Barumu',
  goldenWishText:
    'Semoga kamu selalu diberi kesehatan yang utuh, hati yang lapang, rezeki yang tenang, dan orang-orang tulus yang menjagamu. Selamat ulang tahun, Nadine—teruslah bersinar dengan caramu sendiri.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'birthday-surprise-06',
  name: 'The Midnight Toast',
  category: 'birthday',
  active: true,
  tier: 'premium',
  description:
    'Here’s to another year of you—the best chapter is only just beginning.',
  previewImage: img('photo-1513151233558-d860c5398176'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
