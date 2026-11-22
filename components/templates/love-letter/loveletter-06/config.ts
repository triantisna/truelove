import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData = {
  senderName: 'Raka',
  receiverName: 'Nadia',
  writtenTime: '02:14 AM',
  location: 'Bandung',
  writtenDate: 'Jumat, 14 Maret 2025',
  openingLine: 'Ditulis saat kamu sedang tertidur',

  draft1Time: '01:12 AM',
  draft1Text:
    'Kamu sudah makan? Aku bertanya begitu bukan karena ingin tahu. Aku hanya ingin namamu ada di layar ponselku sedikit lebih lama.',
  draft2Time: '01:47 AM',
  draft2Text:
    'Tadi aku lewat kafe tempat kamu pernah tertawa sampai tersedak. Kursinya masih sama. Aku nyaris mengirimimu fotonya.',
  draft3Time: '02:03 AM',
  draft3Text:
    'Kamu tidak harus kuat setiap waktu. Kalau capek, bilang saja. Aku bisa jadi tempat yang tidak bertanya macam-macam.',
  draft4Time: '02:09 AM',
  draft4Text:
    'Aku merindukanmu. Itu saja. Tapi kata itu terlalu pendek untuk menampung semua ini, jadi kuhapus dan kutulis surat ini.',

  letterBody:
    'Jam di dinding kamarku baru saja lewat pukul dua. Rumah ini sudah lama kehilangan suaranya, tinggal kipas angin dan lampu meja yang berdengung pelan. Di jam seperti ini, pikiranku berhenti berpura-pura sibuk, dan ternyata ia hanya tahu satu jalan pulang: kamu.\n\nAku bukan orang yang pandai bicara. Di depanmu, kalimatku sering putus di tengah jalan, dan kamu selalu sabar menunggu sampai aku menemukan sisanya. Mungkin itu alasan aku menulis. Di atas kertas, tidak ada yang buru-buru memotongku, dan aku bisa jujur dari awal sampai akhir.\n\nYang ingin kukatakan sebenarnya sederhana. Bersamamu, aku jadi versi diriku yang tidak perlu dibuktikan kepada siapa pun. Aku boleh lelah, boleh salah, boleh diam berjam-jam, dan kamu tetap duduk di sebelahku seolah itu bukan masalah.\n\nAku tidak menjanjikan hidup yang selalu terang. Yang bisa kujanjikan: di malam-malam yang panjang, aku akan jadi orang yang menyalakan lampu lebih dulu, supaya kamu tidak pernah pulang ke ruangan yang gelap.\n\nKalau kamu membaca ini setelah bangun, selamat pagi. Surat ini sudah menunggumu sejak tadi, seperti aku.',

  thing1:
    'Caramu menyelipkan rambut ke belakang telinga saat sedang berpikir keras.',
  thing2:
    'Kebiasaanmu membaca bagian belakang kemasan sebelum membeli apa pun.',
  thing3:
    'Suaramu yang mengecil saat bercerita tentang hal yang paling kamu sayangi.',
  thing4:
    'Kamu selalu berterima kasih kepada abang ojek, bahkan di tengah hujan.',
  thing5:
    'Cara kamu tertidur lebih dulu di tengah film yang kamu pilih sendiri.',

  mainPhoto: img('photo-1518199266791-5375a83190b7'),
  mainPhotoCaption:
    'Sore itu, sebelum hujan turun. Aku tidak ingat filmnya, hanya ingat kamu.',
  galleryPhotos: [
    img('photo-1529333166437-7750a6dd5a70'),
    img('photo-1516589178581-6cd7833ae3b2'),
    img('photo-1474552226712-ac0f0961a954'),
    img('photo-1511895426328-dc8714191300'),
  ],
  galleryCaptions:
    'Kopi yang sudah dingin, obrolan yang belum selesai\nJalan pulang yang tiba-tiba terasa pendek\nKamu, tertawa pada hal yang tidak kuketahui\nSatu dari seribu hari biasa, dan favoritku',

  signature: 'Raka',
  psText:
    'P.S. Lampu meja ini kuletakkan menghadap kursi kosong di sebelahku. Aku belum mau memindahkannya. Itu tempatmu, kapan pun kamu mau duduk.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'love-letter-06',
  name: 'The Midnight Letter',
  category: 'love-letter',
  active: true,
  tier: 'premium',
  description: 'Written in the quiet hours, when all I can think about is you.',
  previewImage:
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=600&q=80',
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
