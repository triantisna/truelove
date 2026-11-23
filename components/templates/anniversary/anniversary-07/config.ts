import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Arya',
  receiverName: 'Kirana',
  chapterLabel: 'CHAPTER 04',
  editionCode: 'EDITION NO. 07 · HARDCOVER',
  bookTitle: 'Pages of Us',
  coverTagline:
    'Setiap tahun menambah bab baru—dan kamu masih menjadi cerita favoritku.',
  frontispiecePhoto:
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
  dedicationText:
    'Untuk Kirana, yang selalu menjadi tempat pulang paling tenang di setiap bab.',
  forewordTitle: 'Kata Pengantar untuk Tahun Keempat',
  forewordBody:
    'Empat tahun bukan waktu yang sebentar, tapi bersamamu semuanya terasa mengalir begitu wajar. Tidak setiap halaman yang kita tulis selalu cerah—ada hari-hari yang padat, ada pula masa ketika kita harus berhenti sebentar untuk saling memahami lagi.\n\nNamun justru dari halaman-halaman itulah aku belajar satu hal yang paling pasti: selama kamu masih ada di sampingku, bab sesulit apa pun selalu terasa layak dijalani. Terima kasih sudah terus memilih untuk berjalan bersamaku sejauh ini.',
  bookmarkedMoments:
    'FEB 2026 | Minggu Pagi di Toko Buku | Menghabiskan hampir tiga jam cuma buat baca halaman acak, tukar rekomendasi, lalu pulang bawa kopi hangat.\nJUN 2026 | Melewati Bulan Tersibuk | Saat jadwal kita sama-sama padat, tapi kamu tetap menyempatkan telepon sepuluh menit setiap malam sebelum tidur.\nOKT 2026 | Jalan Sore Tanpa Tujuan | Tidak ada rencana besar, hanya jalan kaki santai sambil bercerita tentang mimpi-mimpi kecil kita tahun depan.\nNOV 2026 | Memasuki Bab Keempat | Masih dengan rasa syukur yang sama, tapi dengan ketenangan yang jauh lebih dalam dari hari pertama.',
  marginNotes:
    'Caramu selalu menatap penuh perhatian setiap kali aku bercerita tentang hal-hal sepele\nKebiasaanmu menyimpan struk atau tiket kecil dari tempat-tempat yang pernah kita datangi\nSuaramu yang selalu berhasil menurunkan riuh di kepalaku setelah hari yang panjang\nCaramu merayakan pencapaian kecilku seolah itu adalah kemenangan terbesar di dunia',
  closingNote:
    'Masih banyak halaman kosong di depan kita, dan aku hanya ingin menulis semuanya bersamamu.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'anniversary-07',
  name: 'Pages of Us',
  category: 'anniversary',
  description:
    'Template anniversary bergaya buku sastra hardcover klasik (Bookcloth Forest & Antique Brass). Tenang dan timeless dengan frontispiece, kata pengantar, bookmarked moments, margin notes, dan penutup To Be Continued.',
  previewImage:
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
