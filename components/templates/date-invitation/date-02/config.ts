import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Dika',
  receiverName: 'Tania',
  orderNumber: 'ORDER #02 · DATE PASS',
  coverTagline:
    'Tidak perlu dress code ribet—cukup kopi enak, jalan santai sore hari, dan kamu.',
  moodPhoto:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
  moodCaption: 'Dua gelas kopi, obrolan acak, dan sore yang berjalan pelan.',
  noteTitle: 'Yuk Kabur Sebentar dari Rutinitas',
  casualNote:
    'Minggu ini rasanya kerjaan dan tugas tidak ada habisnya. Daripada akhir pekan cuma habis buat rebahan sambil scroll HP, gimana kalau kita jalan santai sore-sore?\n\nTidak ada itinerary yang kaku—cuma ngopi di tempat yang tenang, mampir lihat-lihat buku atau foto box kalau lagi mood, lalu tutup hari dengan makan enak sebelum pulang.',
  dateText: 'Minggu, 29 November 2026',
  timeText: '15.30 WIB – Santai',
  locationText: 'Kopi Cihapit & Sekitarnya, Bandung',
  outfitVibe: 'Casual santai & sneakers paling nyaman',
  gamePlan:
    '15.30 WIB | Ngopi Sore & Catch Up | Pesan kopi atau matcha favoritmu, duduk dekat jendela, dan cerita apa saja.\n17.00 WIB | Jalan Kaki & Foto Box | Keliling area sekitar, mampir ke toko buku atau photobooth buat koleksi baru.\n18.45 WIB | Makan Malam Santai | Cari tempat makan hangat yang paling kamu mau sebelum aku antar pulang.',
  perks:
    '1x Es Kopi Susu atau Matcha favoritmu (bebas pilih ukuran)\n1x Jasa fotografer pribadi seharian (jaminan angle bagus)\n1x Sesi foto box berdua buat disimpan di casing HP\nUnlimited waktu buat cerita hal penting maupun tidak penting',
  closingNote:
    'Cukup datang bawa badan dan mood santai—semuanya on me hari itu.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'date-02',
  name: 'Coffee & Stroll',
  category: 'date-invitation',
  description:
    'Undangan kencan kasual dan playful bergaya struk pesanan coffee shop (Café Order Slip). Segar dengan palet Cobalt Blue, rute jalan santai, bonus kencan, dan stempel konfirmasi.',
  previewImage:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
