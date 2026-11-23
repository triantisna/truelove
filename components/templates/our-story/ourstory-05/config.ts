import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Arga',
  receiverName: 'Nadia',
  editionMeta: 'VOL. 05 · SPECIAL ISSUE · EST. 2023',
  coverSubheadline:
    'Semua momen kecil yang layak dicetak, diarsipkan, dan dibaca ulang di hari Minggu yang tenang.',
  heroPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
  heroCaption:
    'Arsip utama: Sore biasa yang entah kenapa selalu terasa istimewa saat dijalani berdua.',
  leadTitle: 'Bagaimana Hari-Hari Biasa Berubah Jadi Cerita Favorit',
  leadStory:
    'Kalau suatu hari ada yang bertanya apa hal terbaik yang pernah terjadi beberapa tahun terakhir, jawabannya bukan pencapaian besar yang masuk berita utama—melainkan pertemuan sederhana yang pelan-pelan mengubah cara aku melihat dunia.\n\nBersamamu, hal-hal yang tadinya terasa rutin jadi punya alasan untuk dinanti. Mulai dari obrolan ringan di pagi hari, rencana akhir pekan yang sering berubah mendadak, sampai cara kita saling menenangkan saat hari sedang tidak ramah. Edisi khusus ini dicetak untuk merayakan perjalanan kita yang tidak pernah kehilangan hangatnya.',
  chronicle:
    'APRIL 2023 | Pertemuan Pertama yang Tidak Direncanakan | Awalnya cuma obrolan singkat soal buku dan kopi, tapi entah kenapa jadi percakapan yang paling lama kuingat.\nSEPTEMBER 2023 | Akhir Pekan Pertama Keluar Kota | Bangun terlalu pagi, sempat kehujanan di jalan, tapi pulang dengan daftar cerita baru yang tidak ada habisnya.\nMARET 2024 | Melewati Hari-Hari Sibuk Bersama | Belajar bahwa dukungan tidak selalu butuh kalimat panjang—cukup hadir dan saling mendengarkan.\nOKTOBER 2025 | Babak Baru yang Lebih Tenang | Semakin yakin bahwa rumah paling nyaman adalah setiap tempat yang kita datangi bersama.',
  quickFacts:
    'Bersama Sejak | April 2023\nKota Favorit | Bandung & sudut tenang mana pun yang punya kopi enak\nMenu Andalan | Es kopi susu & makanan hangat tengah malam\nMomen Terbaik | Setiap Minggu pagi tanpa alarm dan tanpa buru-buru',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Cahaya sore yang jatuh tepat di hari favorit kita\nTawa lepas yang selalu layak masuk halaman depan\nLangkah pelan setelah minggu yang panjang\nSatu arsip lagi untuk kita baca bertahun-tahun nanti',
  editorsNoteTitle: 'Catatan untuk Edisi-Edisi Berikutnya',
  editorsNoteText:
    'Terima kasih sudah menjadi rekan perjalanan, tempat pulang, sekaligus cerita terbaik yang pernah kutulis. Mari terus mencetak edisi-edisi baru yang lebih hangat di tahun-tahun mendatang.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'ourstory-05',
  name: 'The Sunday Edition',
  category: 'our-story',
  description:
    'Template perjalanan cinta bergaya koran edisi Minggu klasik (Broadsheet Editorial). Bersih dan berkelas dengan halaman depan, lead story ber-drop cap, chronicle, quick facts, dan photo essay.',
  previewImage:
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
