import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Naufal',
  receiverName: 'Salma',
  inviteCode: 'OUTDOOR DATE · NO. 04',
  coverTagline:
    'Tikar hangat, cahaya matahari sore, dan tidak ada tempat lain yang perlu kita buru.',
  moodPhoto:
    'https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=1200&auto=format&fit=crop',
  moodCaption: 'Sore yang pelan, angin sejuk, dan langit keemasan.',
  noteTitle: 'Menikmati Sore Tanpa Terburu-buru',
  picnicNote:
    'Akhir-akhir ini kita terlalu sering menghabiskan waktu di dalam ruangan yang dingin sambil menatap layar. Jadi Minggu sore ini, aku ingin mengajakmu keluar sebentar untuk menghirup udara segar.\n\nKita tidak perlu jadwal yang padat—cukup gelar tikar di bawah pohon yang teduh, menikmati camilan hangat, mendengarkan playlist sore, dan melihat langit berubah warna pelan-pelan.',
  dateText: 'Minggu, 6 Desember 2026',
  timeText: '15.30 WIB – Sunset',
  locationText: 'Taman Kota & Area Rumput Teduh, Bandung',
  outfitNote:
    'Casual santai, warna cerah / earth tone, nyaman buat duduk lesehan',
  afternoonFlow:
    '15.30 WIB | Cari Spot & Gelar Tikar | Pilih area rumput yang paling teduh sambil menata semua camilan dan minuman dingin.\n16.15 WIB | Ngobrol, Main Kartu & Baca Buku | Waktu bebas tanpa distraksi HP—mau ngobrol ngalor-ngidul atau main kartu bareng.\n17.30 WIB | Golden Hour & Foto Sore | Menikmati cahaya sore paling bagus sebelum kita beres-beres dan cari makan malam hangat.',
  picnicBasket:
    'Sandwich homemade, pastry hangat, dan buah potong segar\nMinuman dingin favoritmu lengkap dengan es batu di tumbler\nTikar piknik lebar + dua bantal kecil biar duduk makin nyaman\nSpeaker mini berisi playlist akustik sore & kamera buat dokumentasi',
  closingNote:
    'Cukup datang bawa diri dan mood santai—semua isi keranjang piknik sudah kusiapkan.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'date-04',
  name: 'Sunday in the Park',
  category: 'date-invitation',
  description:
    'Undangan kencan piknik sore bernuansa organik dan hangat (Sunlit Meadow & Picnic Terracotta). Lengkap dengan aksen gingham tipis, detail spot piknik, alur sore, isi keranjang piknik, dan konfirmasi.',
  previewImage:
    'https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
