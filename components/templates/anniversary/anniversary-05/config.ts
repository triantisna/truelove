import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

export const schema = schemaJson as unknown as TemplateSchema;

const mockData: Record<string, any> = {
  // Informasi Pameran
  receiverName: 'Nadira',
  senderName: 'Bayu',
  anniversaryTitle: 'Retrospektif Kita',
  exhibitionSubtitle: 'Pameran tunggal tentang tiga tahun bersama',
  anniversaryDate: 2026,

  // Ruang 1: The Foyer
  curatorNote:
    'Selamat datang di pameran privat yang hanya dibuka untuk satu pengunjung. Aku bukan seniman, dan aku tidak pernah belajar melukis. Tapi sejak bertemu denganmu, aku mulai mengerti kenapa orang bisa berdiri berjam-jam di depan satu kanvas: ada hal-hal yang terlalu indah untuk dilewati begitu saja.\n\nKarya-karya di ruangan ini tidak dibuat dengan kuas dan cat. Bahannya adalah sore yang kita habiskan di kedai kopi, perjalanan pulang yang sengaja dilambatkan, dan percakapan larut malam yang tidak pernah ada habisnya. Aku mengumpulkannya satu per satu, lalu membingkainya supaya kamu tahu betapa berharganya semua itu bagiku.\n\nSilakan berjalan pelan-pelan. Baca setiap plakat, berhenti sebentar di depan karya yang kamu suka, dan jangan lupa untuk tersenyum. Kurator tidak akan melarang kamu menyentuh karya, karena semuanya memang milikmu.',

  // Ruang 2: Hall of Classics
  gallery: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
  ],
  museumPlacards:
    'Sore di Dago | Mixed media: Waktu, Cinta, dan Kesabaran | Hari pertama kita berani berjalan bergandengan tangan di depan banyak orang. Kamu bilang tanganmu dingin, padahal aku yang gugup setengah mati.\nKopi Susu Terakhir | Tinta, tawa, dan secangkir kopi dingin | Kamu menghabiskan kopiku tanpa izin. Sejak itu aku selalu memesan dua gelas, satu untukku dan satu untuk kamu curi.\nPerjalanan ke Yogyakarta | Kereta malam, bahu yang nyaman, dan lagu yang diulang | Kamu tertidur sebelum Cirebon. Aku tidak bergerak sampai Lempuyangan karena tidak tega membangunkanmu.\nUlang Tahunmu yang Ke-26 | Kue sederhana, lilin miring, dan harapan diam-diam | Kuenya tidak sempurna dan lilinnya hampir jatuh. Tapi wajahmu malam itu adalah karya terbaik yang pernah kulihat.\nMalam Tahun Baru | Langit, keheningan, dan genggaman tangan | Saat orang-orang sibuk menghitung mundur, aku sibuk menghitung betapa beruntungnya aku bisa berdiri di sampingmu.',

  // Ruang 3: Abstract Room
  abstractInstallations:
    'Rumah bukan sebuah tempat, rumah adalah kamu.\nAda cinta yang berisik, dan ada cinta yang cukup duduk berdampingan tanpa bicara.\nAku tidak mencari yang sempurna, aku menemukan yang membuatku ingin menjadi lebih baik.\nWaktu berjalan, tapi aku memilih tinggal.',

  // Ruang 4: The Grand Unveil
  masterpieceWish:
    'Nadira, karya terbaik di pameran ini bukan foto, bukan kutipan, dan bukan bingkai yang kupilih dengan hati-hati. Karya terbaiknya adalah hari-hari biasa yang kita lewati bersama dan terasa luar biasa.\n\nTiga tahun ini kamu mengajariku bahwa cinta tidak harus megah. Ia cukup hadir, mau mendengar, dan tetap tinggal ketika keadaan sedang tidak mudah. Terima kasih sudah memilih tinggal.\n\nSelamat ulang tahun hubungan kita yang ketiga. Aku berharap pameran ini tidak pernah ditutup, dan kita terus menambah karya baru di dinding yang masih panjang. Aku mencintaimu, hari ini dan di semua hari yang belum datang.',
  backgroundMusic:
    'https://res.cloudinary.com/oxzkml7u/video/upload/v1789622686/truelove/music/ytdnbb4hsfeuafh1tpgg.mp3',

  // Ruang 5: Guestbook
  guestbookMessage:
    'Pameran terindah yang pernah kukunjungi, dan aku ingin kembali setiap hari.',
};

const config: TemplateDefinition = {
  id: 'anniversary-05',
  name: 'The Masterpiece',
  description:
    'Template anniversary bertema galeri seni privat yang minimalis dan mewah. Pass VIP, catatan kurator, lukisan dengan plakat museum, instalasi kutipan, pembukaan karya rahasia, dan buku tamu.',
  category: 'anniversary',
  thumbnail:
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=600&q=80',
  previewImage:
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=600&q=80',
  active: true,
  tier: 'premium',
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
