import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData: Record<string, unknown> = {
  senderName: 'Dimas',
  receiverName: 'Alana',
  ageNumber: '23',
  issueDate: 'NOVEMBER 2026',
  coverPhoto: img('photo-1534528741775-53994a69daeb'),
  coverHeadlines:
    'COVER STORY: MERAYAKAN SATU TAHUN PENUH WARNA\nTHE EDIT: 4 HAL KECIL YANG PALING DISUKAI\nBONUS: VOUCHER HADIAH EKSKLUSIF DI SAMPUL BELAKANG',

  stat1Value: '23',
  stat1Label: 'Tahun Bersinar',
  stat2Value: '100%',
  stat2Label: 'Orang Favoritku',
  stat3Value: '365',
  stat3Label: 'Hari Penuh Cerita',
  superpowerText: 'Bikin Semua Orang Nyaman',

  storyTitle: 'Mengapa Tahun Ini Sepenuhnya Milikmu',
  pullQuote:
    'Kamu tidak pernah perlu berusaha keras untuk jadi istimewa—caramu hadir dan peduli pada hal-hal kecil saja sudah lebih dari cukup.',
  storyBody:
    'Kalau ulang tahunmu bisa dirangkum dalam satu edisi khusus majalah, satu halaman jelas tidak akan pernah cukup. Tahun lalu kamu melewati begitu banyak hal: hari-hari yang padat, keputusan besar yang sempat membuatmu ragu, sampai tawa-tawa spontan yang tidak pernah direncanakan.\n\nDi balik semua itu, satu hal yang paling aku kagumi adalah bagaimana kamu selalu berhasil menjaga hatimu tetap hangat. Kamu bertumbuh tanpa kehilangan sisi tulusmu, dan itu hal yang sangat langka.\n\nSelamat memasuki babak baru, Alana. Semoga tahun ini membawa lebih banyak perjalanan seru, ketenangan yang kamu cari, dan mimpi-mimpi yang akhirnya bisa kamu centang satu per satu.',

  edit1Title: 'Lagu yang Mengingatkanku Padamu',
  edit1Text:
    'Setiap lagu akustik yang diputar di sore hari—tenang, bikin mood langsung naik, dan selalu enak didengar berulang kali tanpa pernah bosan.',

  edit2Title: 'Kebiasaan Kecil Favorit',
  edit2Text:
    'Ekspresimu yang langsung berbinar setiap kali ketemu makanan enak, kopi yang pas, atau lihat langit sore yang bagus.',

  edit3Title: 'Momen Paling Ikonik',
  edit3Text:
    'Obrolan panjang tanpa arah sambil jalan kaki santai yang ujung-ujungnya bikin kita lupa waktu dan tertawa sampai lupa capek.',

  edit4Title: 'Harapan Terbesar Tahun Ini',
  edit4Text:
    'Semoga kamu selalu sehat, dikelilingi orang-orang baik, dan tidak pernah ragu untuk mengambil ruang buat kebahagiaanmu sendiri.',

  spreadPhotos: [
    img('photo-1517841905240-472988babdf9'),
    img('photo-1524504388940-b1c1722653e1'),
    img('photo-1488426862026-3ee34a7d66df'),
    img('photo-1515886657613-9f3515b0c78f'),
  ],
  spreadCaptions:
    'Look 01 — Energi cerah yang selalu kamu bawa ke mana pun kamu pergi\nLook 02 — Momen santai terbaik di tengah jadwal yang padat\nLook 03 — Senyum yang paling pantas dirayakan hari ini\nLook 04 — Siap melangkah ke babak baru dengan percaya diri',

  voucherTitle: '1x Dinner & Hadiah Pilihanmu',
  voucherDetail:
    'Bebas pilih restoran, menu favorit, atau satu barang yang sudah lama ada di wishlist-mu. Berlaku kapan saja tanpa tanggal kedaluwarsa.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'birthday-surprise-07',
  name: 'The Birthday Issue',
  category: 'birthday',
  active: true,
  tier: 'premium',
  description:
    'A collector’s edition dedicated entirely to you—the cover star of the year.',
  previewImage: img('photo-1534528741775-53994a69daeb'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
