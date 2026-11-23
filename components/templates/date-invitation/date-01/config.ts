import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Reza',
  receiverName: 'Clara',
  reservationCode: 'TABLE FOR TWO · NO. 01',
  coverTagline:
    'Kosongkan jadwalmu akhir pekan ini—sisanya sudah kuurus semua.',
  moodPhoto:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
  moodCaption:
    'Satu malam tenang, makanan hangat, dan obrolan tanpa buru-buru.',
  inviteTitle: 'Luangkan Satu Malam Untuk Kita Berdua',
  inviteMessage:
    'Beberapa minggu terakhir jadwal kita sama-sama padat dan lebih sering bertemu lewat layar. Jadi akhir pekan ini, aku ingin mencuri waktumu sebentar dari semua kesibukan itu.\n\nAku sudah menyiapkan tempat yang tenang dengan lampu hangat dan menu yang aku yakin bakal kamu suka. Tidak perlu memikirkan apa-apa—cukup datang, duduk santai, dan biarkan malam itu berjalan pelan.',
  dateText: 'Sabtu, 28 November 2026',
  timeText: '18.30 WIB – Selesai',
  locationText: 'Braga Bistro & Roastery, Bandung',
  dressCode: 'Smart Casual · Warna Hangat / Netral',
  itinerary:
    '18.30 WIB | Penjemputan | Aku sudah siap di depan rumahmu tepat waktu, tidak perlu buru-buru.\n19.15 WIB | Makan Malam | Meja sudut dekat jendela sudah kupesan khusus atas nama kita.\n21.00 WIB | Jalan Santai & Dessert | Menutup malam dengan gelato atau kopi hangat sambil keliling kota sebentar.',
  littleNotes:
    'Cukup bawa diri dan mood santai—semua reservasi sudah aman.\nBawa jaket tipis untuk jaga-jaga kalau angin malam agak dingin.\nKalau kamu punya request lagu di jalan nanti, langsung kabari aku ya.',
  closingNote: 'Tidak sabar melihatmu malam itu. Sampai ketemu di meja kita.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'date-01',
  name: 'Table for Two',
  category: 'date-invitation',
  description:
    'Undangan kencan bergaya kartu reservasi bistro klasik Eropa. Elegan, rapi, dan jelas dengan detail jadwal, itinerary, catatan kecil, serta tombol konfirmasi.',
  previewImage:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
