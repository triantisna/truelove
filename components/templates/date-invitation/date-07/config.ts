import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData: Record<string, unknown> = {
  senderName: 'Rafael',
  receiverName: 'Bianca',
  editionCode: 'EDITION NO. 07 · SUNLIT INVITE',
  openingLine:
    'Cahaya matahari sore, obrolan pelan, dan satu siang yang khusus kupesan untuk kita.',

  promise1Title: 'Tanpa Buru-buru',
  promise1Text:
    'Tidak ada jadwal padat atau jam yang mengejar—kita biarkan siang dan sore berjalan pelan sesuai mood kita berdua.',

  promise2Title: 'Hidangan Favorit',
  promise2Text:
    'Meja dekat jendela dengan cahaya matahari terbaik, brunch hangat, kopi atau matcha dingin, dan pastry kesukaanmu.',

  promise3Title: 'Waktu Penuh Untukmu',
  promise3Text:
    'Ponsel masuk mode senyap—hari itu perhatianku sepenuhnya hanya untuk mendengarkan ceritamu dan tertawa bersamamu.',

  dateText: 'Minggu, 20 Desember 2026',
  timeText: '11.30 WIB – Golden Hour',
  locationText: 'Solstice Glasshouse & Terrace, Bandung',
  dressCode: 'Sunlit Linen · Putih, Cream, atau Biru Muda',

  letterTitle: 'Satu Sore Cerah yang Ingin Kuhabiskan Bersamamu',
  letterBody:
    'Minggu ini rasanya dunia berjalan terlalu cepat, dan kita berdua sama-sama pantas mendapat jeda yang terang dan menenangkan. Jadi akhir pekan ini, aku menyiapkan satu siang khusus—jauh dari layar kerja dan daftar tugas yang tidak ada habisnya.\n\nAku sudah memesan meja paling cerah di teras rumah kaca, tempat di mana sinar matahari jatuh lembut di atas meja dan kita bisa berbicara tentang apa saja tanpa merasa diburu waktu.\n\nPakailah pakaian paling nyaman yang membuatmu merasa ringan. Sisanya—dari brunch sampai gelato di sore hari—sudah kuurus semuanya.',

  chapter1Time: '11.30 WIB · BRUNCH & KOPI',
  chapter1Title: 'Meja Cerah di Dekat Jendela',
  chapter1Story:
    'Kita mulai pelan-pelan dengan brunch hangat, welcome treat pilihanmu, dan obrolan santai di bawah cahaya siang yang lembut.',

  chapter2Time: '14.00 WIB · JALAN SANTAI',
  chapter2Title: 'Menyusuri Sudut Kota & Galeri',
  chapter2Story:
    'Setelah makan, kita jalan kaki santai melihat toko bunga, mampir ke galeri kecil atau toko buku, dan mengambil beberapa foto sore.',

  chapter3Time: '16.30 WIB · GOLDEN HOUR',
  chapter3Title: 'Gelato & Cahaya Sore',
  chapter3Story:
    'Menutup hari dengan gelato dingin sambil menikmati langit sore yang mulai keemasan sebelum kuantar kamu pulang dengan tenang.',

  mainPhoto: img('photo-1554118811-1e0d58224f24'),
  mainPhotoCaption:
    'Atmosfer siang yang terang — meja dekat jendela, udara segar, dan obrolan tanpa batas waktu.',

  moodboardPhotos: [
    img('photo-1495474472287-4d71bcdd2085'),
    img('photo-1509440159596-0249088772ff'),
    img('photo-1507525428034-b723cf961d3e'),
  ],
  moodboardCaptions:
    'Welcome treat dingin untuk memulai siang yang hangat\nPastry segar & hidangan brunch favorit kita\nNuansa cerah dan ringan seperti liburan singkat di pesisir',

  signature: 'Rafael',
  closingNote:
    'Pilih welcome treat favoritmu terlebih dahulu, lalu konfirmasi kehadiranmu agar Sunlit Pass-mu aktif.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'date-07',
  name: 'La Dolce Afternoon',
  category: 'date-invitation',
  active: true,
  tier: 'premium',
  description:
    'Sunlight, slow conversations, and an afternoon reserved just for us.',
  previewImage: img('photo-1554118811-1e0d58224f24'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
