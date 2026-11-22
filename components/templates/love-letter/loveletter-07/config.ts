import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData = {
  senderName: 'Dimas',
  receiverName: 'Laras',
  editionNumber: 'No. 007',
  openingLine: 'Sebuah arsip kecil yang kusimpan untukmu',
  writtenDate: 'Minggu, 9 November 2025',
  location: 'Yogyakarta',

  topNoteTitle: 'Jeruk pahit dan hujan pertama',
  topNote:
    'Yang pertama kuingat darimu bukan wajah, melainkan wangi: sesuatu yang bersih dan sedikit pahit, seperti kulit jeruk yang baru dikupas di teras saat hujan pertama turun. Belakangan aku tahu itu hanya sabun tanganmu. Sampai sekarang aku tidak mau tahu mereknya.',
  heartNoteTitle: 'Teh melati yang diseduh terlalu lama',
  heartNote:
    'Setiap hari aku jatuh cinta lagi pada hal-hal yang tidak kamu anggap penting: caramu menyeduh teh sampai pahit lalu tetap meminumnya tanpa mengeluh, caramu mengeja nama jalan pelan-pelan agar tidak salah, caramu diam sebentar sebelum menjawab pertanyaan yang sulit.',
  baseNoteTitle: 'Kayu cendana, sore hari',
  baseNote:
    'Ada perasaan yang tidak pergi bahkan setelah kamu pulang: tenang, hangat, dan sedikit berat dalam arti yang baik. Seperti ruangan yang masih menyimpan aroma cendana lama setelah dupanya padam. Itu yang tertinggal di dadaku setiap kali kita berpisah di depan pagar.',

  letterBody:
    'Ada orang yang datang seperti musim hujan: ramai, basah, lalu pergi dan meninggalkan jalan yang licin. Kamu bukan itu. Kamu datang seperti wangi yang tidak pernah kuminta, tapi lama-lama kutemukan di mana-mana: di kemeja yang baru kuambil dari lemari, di buku yang kupinjam darimu dan tak kunjung kukembalikan, di sela-sela hari yang sebenarnya biasa saja.\n\nAku mulai menyimpan hal-hal kecil tentang kita seperti orang menyimpan bunga di dalam buku. Tidak ada rencana besar, hanya keinginan agar sesuatu yang rapuh ini tidak hilang bentuknya. Semakin lama kusimpan, semakin aku mengerti bahwa kamu bukan satu musim dalam hidupku. Kamu adalah cara aku membaca semua musim.\n\nAku tidak pandai berjanji dengan kalimat besar. Tapi aku bisa bilang ini: di musim yang panas aku ingin jadi tempatmu berteduh, di musim yang dingin jadi alasan kamu pulang lebih cepat, dan di musim yang tidak bernama, saat tidak ada yang terjadi dan semuanya sunyi, aku ingin tetap duduk di sampingmu.\n\nTerima kasih sudah tinggal. Sebagian besar hal baik dalam hidupku dimulai dari keputusanmu yang tampak sepele itu.',

  memory1When: 'Oktober',
  memory1Title: 'Stasiun Tugu, hujan tipis',
  memory1Story:
    'Kereta kita terlambat empat puluh menit dan kamu tidak mengeluh sekali pun. Kita berbagi satu payung yang terlalu kecil, dan untuk pertama kalinya aku berharap keretanya terlambat lebih lama lagi.',
  memory2When: 'Januari',
  memory2Title: 'Warung soto di ujung gang',
  memory2Story:
    'Kamu menghabiskan sotoku karena kubilang sudah kenyang, padahal aku berbohong. Aku membiarkannya. Itu cara paling murah untuk melihatmu bahagia.',
  memory3When: 'April',
  memory3Title: 'Balkon kos yang sempit',
  memory3Story:
    'Kita duduk di lantai sampai lewat tengah malam tanpa membicarakan hal penting apa pun. Di titik itu aku sadar, diam bersamamu adalah percakapan paling jujur yang pernah kupunya.',
  memory4When: 'Agustus',
  memory4Title: 'Toko buku bekas',
  memory4Story:
    'Kamu menemukan buku dengan catatan orang asing di pinggir halamannya, lalu membacakannya keras-keras dengan suara yang berbeda-beda. Aku membeli buku itu diam-diam. Masih kusimpan.',

  mainPhoto: img('photo-1522673607200-164d1b6ce486'),
  mainPhotoCaption:
    'Sore yang biasa saja, yang entah kenapa tidak mau kulupakan.',
  galleryPhotos: [
    img('photo-1494774157365-9e04c6720e47'),
    img('photo-1469371670807-013ccf25f16a'),
    img('photo-1519741497674-611481863552'),
    img('photo-1529333166437-7750a6dd5a70'),
  ],
  galleryCaptions:
    'Pagi yang pelan, kopi yang belum sempat dingin\nJalan pulang yang tiba-tiba terasa pendek\nKamu, tertawa pada sesuatu yang tidak kuketahui\nSatu dari banyak hari biasa, dan favoritku',

  signature: 'Dimas',
  promiseText:
    'Untuk musim-musim berikutnya: aku akan terus menyimpan hal-hal kecil tentangmu, tetap menjadi orang yang pulang kepadamu, dan belajar mencintaimu dengan cara yang lebih tenang setiap tahunnya. Kalau suatu hari kamu lupa betapa berartinya dirimu, buka kembali arsip ini. Semuanya masih di sini, tersimpan rapi.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'love-letter-07',
  name: 'Notes of You',
  category: 'love-letter',
  active: true,
  tier: 'premium',
  description:
    'Like a scent that lingers, some people stay in every season of our lives.',
  previewImage: img('photo-1522673607200-164d1b6ce486'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
