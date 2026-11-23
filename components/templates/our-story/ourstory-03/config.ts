import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Fajar',
  receiverName: 'Kirana',
  postmarkOrigin: 'BANDUNG · EST. 2023',
  coverTagline:
    'Setiap tempat terasa seperti rumah selama aku menempuhnya bersamamu.',
  heroPhoto:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  heroCaption: 'Angin sore yang selalu bikin kita lupa waktu.',
  openingTitle: 'Dari Satu Perjalanan ke Perjalanan Berikutnya',
  openingLetter:
    'Aku selalu suka cara kita menikmati perjalanan—bukan cuma soal ke mana kita pergi, tapi bagaimana hal-hal kecil di tengah jalan selalu berubah jadi cerita yang kita tertawakan berulang kali.\n\nMulai dari salah belok di jalan kecil, berhenti mendadak demi kopi pinggir jalan, sampai duduk diam melihat langit berubah warna. Kumpulan kartu pos ini kusimpan supaya kita selalu ingat bahwa perjalanan terbaikku adalah semua langkah yang kutempuh bersamamu.',
  milestones:
    'BANDUNG · MEI 2023 | Sore Pertama di Braga | Jalan kaki tanpa tujuan jelas, mampir ke toko buku kecil, dan sadar kalau obrolan kita tidak pernah kehabisan topik.\nYOGYAKARTA · NOV 2023 | Kereta Pagi Pertama | Berangkat subuh dengan mata mengantuk, tapi begitu sampai di stasiun rasanya seperti dunia cuma milik kita berdua.\nBALI · JUL 2024 | Senja di Pinggir Pantai | Sepatu penuh pasir, angin kencang, dan janji kecil untuk kembali lagi suatu hari nanti.\nJAKARTA · FEB 2025 | Pulang ke Hari-Hari Biasa | Akhirnya paham bahwa liburan tidak selalu butuh tiket pesawat—cukup duduk berdua di akhir pekan.',
  souvenirs:
    'Rute Favorit | Jalanan sepi sore hari sambil buka jendela\nMakanan Wajib | Kopi susu dingin & roti bakar cokelat keju\nLagu di Perjalanan | Tulus — Monokrom\nTujuan Berikutnya | Menjelajahi kota baru tanpa itinerary ketat',
  gallery: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Stempel kenangan dari sore yang tenang\nTawamu yang selalu jadi tujuan pulang\nLangkah santai tanpa perlu terburu-buru\nSatu kartu pos lagi untuk disimpan selamanya',
  nextDestinationTitle: 'Tujuan Berikutnya: Ke Mana Pun Bersamamu',
  nextDestinationText:
    'Masih banyak tempat yang belum kita datangi dan banyak cerita yang belum kita tulis. Terima kasih sudah jadi teman perjalanan terbaik dalam hidupku.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'ourstory-03',
  name: 'Postcards from Us',
  category: 'our-story',
  description:
    'Template perjalanan cinta bergaya arsip kartu pos Eropa (Travel Stationery). Segar dan penuh nostalgia dengan stempel pos, jejak perjalanan, oleh-oleh kecil, dan galeri kartu pos.',
  previewImage:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
