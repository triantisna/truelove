import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Galih',
  receiverName: 'Ratna',
  catalogCode: 'LP-04 · 33 RPM · EST. 2023',
  coverTagline:
    'Kalau cerita kita adalah sebuah piringan hitam, aku akan memutar setiap lagunya berulang kali.',
  heroPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
  heroCaption: 'Sampul depan dari hari-hari terbaik yang pernah kita jalani.',
  linerNotesTitle: 'Catatan di Balik Album Kita',
  linerNotesText:
    'Setiap hubungan punya ritmenya sendiri. Kadang pelan seperti lagu akustik di hari Minggu, kadang ramai dan penuh tawa seperti konser di malam hujan. Yang paling kusuka dari kita adalah betapa nyamannya semua nada itu saat dijalani bersamamu.\n\nAlbum kecil ini kusimpan sebagai pengingat dari setiap trek yang sudah kita lewati—dari obrolan canggung di awal sampai hari-hari tenang yang sekarang jadi rumah paling kurindukan.',
  tracklist:
    'Pertemuan Tanpa Rencana | MAR 2023 | Cuma mampir sebentar ke toko piringan hitam, tapi malah berakhir ngobrol tiga jam soal musik dan hal-hal acak.\nMalam Pertama Keliling Kota | JUN 2023 | Naik motor pelan melewati jalanan sepi, menyetel satu playlist yang sama sampai hafal urutannya.\nHujan di Akhir Pekan | DES 2023 | Batal pergi ke mana-mana, akhirnya cuma bikin kopi di rumah dan sadar bahwa diam bersamamu tidak pernah terasa canggung.\nLangkah Baru di Tahun Ini | OKT 2024 | Belajar saling mengerti lebih dalam dan merayakan pencapaian kecil satu sama lain tanpa perlu banyak sorotan.',
  albumCredits:
    'Direkam Di | Bandung & semua sudut kota yang pernah kita lewati\nLagu Wajib | Sore — Sssst... & Reality Club — Alexandra\nKebiasaan Kecil | Selalu rebutan pilih lagu pertama setiap masuk mobil\nMomen Terbaik | Setiap kali kita tertawa sampai lupa waktu',
  gallery: [
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Side A — Sore hangat yang selalu ingin diulang\nTawamu yang jadi melodi paling kusuka\nLangkah santai di tengah minggu yang sibuk\nSide B — Masih banyak cerita yang menanti kita',
  hiddenTrackTitle: 'Hidden Track — Untuk Tahun-Tahun Berikutnya',
  hiddenTrackText:
    'Side A sudah kita lewati dengan begitu banyak kenangan indah. Terima kasih sudah tetap di sini, dan aku tidak sabar memutar Side B bersamamu.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'ourstory-04',
  name: 'Side A & Side B',
  category: 'our-story',
  description:
    'Template perjalanan cinta bergaya album piringan hitam (Indie Vinyl & Liner Notes). Hangat dan nostalgik dengan sampul vinyl, tracklist momen, album credits, dan hidden track.',
  previewImage:
    'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
