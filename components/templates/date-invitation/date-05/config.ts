import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Bagas',
  receiverName: 'Nabila',
  tripCode: 'TRIP NO. 05 · FIRST CLASS',
  routeFrom: 'HOME',
  routeTo: 'ESCAPE',
  coverTagline:
    'Bawa barang secukupnya—kita kabur sebentar dari rutinitas minggu ini.',
  destinationPhoto:
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
  destinationCaption:
    'Jalanan sejuk, playlist favorit, dan satu hari penuh tanpa terburu-buru.',
  briefTitle: 'Waktunya Kabur Sebentar dari Rutinitas',
  briefMessage:
    'Setelah beberapa minggu yang penuh dengan kerjaan dan layar laptop, kayaknya kita berdua butuh ganti suasana sebentar. Tidak perlu pergi terlalu jauh—cukup jalan keluar kota pagi-pagi, cari udara dingin, dan menikmati hari tanpa jadwal yang kaku.\n\nSemua rute, tempat mampir, sampai camilan di jalan sudah kupikirkan. Tugasmu cuma siap-siap santai dan pegang kendali penuh atas playlist lagu sepanjang perjalanan.',
  dateText: 'Sabtu, 12 Desember 2026',
  timeText: '08.00 WIB – Malam',
  destinationText: 'Lembang & Hutan Pinus Cikole, Bandung Utara',
  packingNote: 'Jaket hangat, outfit nyaman, & kamera',
  routeWaypoints:
    '08.00 WIB | Penjemputan & Sarapan Ringan | Berangkat sebelum jalanan macet, mampir beli kopi hangat dan roti buat bekal di mobil.\n10.00 WIB | Tiba di Tujuan & Jalan Santai | Menikmati udara sejuk, jalan kaki santai, dan foto-foto tanpa perlu buru-buru.\n13.00 WIB | Makan Siang dengan Pemandangan | Rehat di tempat makan tenang sambil menikmati menu hangat dan udara dingin.\n16.30 WIB | Golden Hour Drive Pulang | Pulang santai sambil mampir beli oleh-oleh atau makan malam sebelum sampai rumah.',
  onboardPerks:
    'Hak penuh 100% mengatur playlist Spotify sepanjang perjalanan\nKursi depan VIP lengkap dengan bantal leher dan charger siap pakai\nStok camilan & minuman dingin favoritmu sudah aman di bagasi\nBebas minta berhenti kapan saja kalau lihat pemandangan atau spot foto bagus',
  closingNote:
    'Kursi depan sudah siap atas namamu—tinggal duduk manis dan nikmati perjalanan kita.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'date-05',
  name: 'Boarding Pass for Two',
  category: 'date-invitation',
  description:
    'Undangan kencan roadtrip dan short escape bergaya boutique boarding pass (Crisp Aviation & Boarding Amber). Segar dengan kode rute, jadwal keberangkatan, waypoints, on-board perks, dan stempel check-in.',
  previewImage:
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
