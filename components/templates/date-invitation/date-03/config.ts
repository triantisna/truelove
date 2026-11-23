import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Kevin',
  receiverName: 'Vania',
  ticketCode: 'ADMIT TWO · STUDIO 03',
  coverTagline:
    'Dua kursi, satu layar, dan orang favoritku duduk tepat di sebelahku.',
  posterPhoto:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
  posterCaption: 'Tayang eksklusif satu malam — khusus untuk kita berdua.',
  movieTitle: 'Malam Minggu di Baris Tengah',
  synopsis:
    'Sudah terlalu lama kita cuma saling kirim trailer film sambil bilang "nanti nonton ini yuk". Akhir pekan ini, aku mau benar-benar mewujudkan jadwal nonton kita tanpa ditunda lagi.\n\nAku sudah incar kursi paling nyaman di baris tengah biar pandangan kita pas ke layar. Tugasmu cuma datang dengan outfit paling nyaman, sisanya dari tiket sampai camilan biar aku yang siapkan.',
  dateText: 'Sabtu, 5 Desember 2026',
  timeText: '19.00 WIB – Selesai',
  locationText: 'Cinema Premiere, Bandung',
  seatInfo: 'Row E Seat 07–08 · Casual & Jaket Hangat',
  schedule:
    '18.15 WIB · PRE-SHOW | Jemput & Beli Camilan | Mampir sebentar sebelum masuk studio buat ambil popcorn dan minuman favoritmu.\n19.00 WIB · MAIN FEATURE | Mulai Tayang | Matikan notifikasi HP, duduk nyaman, dan nikmati filmnya bareng-bareng.\n21.15 WIB · POST-CREDITS | Makan Malam & Review Film | Bahas adegan paling seru sambil makan hangat sebelum pulang.',
  concessions:
    '1x Popcorn Caramel Large (bebas ambil duluan)\n2x Minuman dingin atau cokelat hangat sesuai mood\n1x Jaket cadangan kalau AC studio terlalu dingin\n1x Bahu gratis buat sandaran sepanjang film',
  closingNote:
    'Tiket sudah aman di tanganku—tinggal tunggu kamu duduk di kursi sebelah.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'date-03',
  name: 'Now Showing: Us',
  category: 'date-invitation',
  description:
    'Undangan kencan gelap dan sinematik bergaya tiket bioskop indie (Velvet Theater & Marquee Gold). Lengkap dengan poster, sinopsis, showtime, concession stand, dan konfirmasi kursi.',
  previewImage:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
