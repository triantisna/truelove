import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';
import { config as anniversary04Config } from '@/components/templates/anniversary/anniversary-04/config';

export const schema = schemaJson as unknown as TemplateSchema;

const mockData: Record<string, any> = {
  // Pemeran Utama
  receiverName: 'Anindya',
  senderName: 'Raka',
  anniversaryTitle: 'Tiga Tahun Bersamamu',
  anniversaryDate: '2023-02-14',
  openingTagline: 'Sebuah kisah cinta dalam empat babak',

  // Act I: The Meet Cute
  act1Title: 'Hujan Sore di Kedai Kopi',
  act1Location: 'Kedai Kopi Braga, Bandung',
  act1Story:
    'Sore itu hujan turun tanpa aba-aba. Aku berlari masuk ke sebuah kedai kopi kecil di Braga, basah kuyup, dan hanya ada satu meja kosong di dekat jendela. Kamu duduk di meja sebelahnya, sibuk dengan buku catatan dan secangkir kopi susu yang sudah hampir dingin.\n\nKamu menawarkan tisu, aku menawarkan nama. Dua puluh menit kemudian hujan sudah reda, tapi kita masih saling bertukar cerita. Aku pulang tanpa payung dan tanpa sadar sudah meninggalkan separuh hatiku di meja itu.\n\nSampai hari ini aku masih bersyukur hujan sore itu tidak berhenti lebih cepat.',
  act1Quote: 'Hujan berhenti, tapi aku tidak mau pulang.',
  coverImage:
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',

  // Act II: Favorite Scenes
  galleryTitle: 'Adegan Favorit Kita',
  gallery: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=700&q=80',
  ],
  galleryCaptions:
    'Kencan pertama di Lembang, kamu kedinginan dan aku pura-pura tidak tahu\nNonton midnight di bioskop kecil, popcornnya habis sebelum filmnya mulai\nPiknik dadakan di Dago, bekalnya cuma roti dan tawa\nHari ulang tahunmu, kue kecil dengan lilin yang miring\nPerjalanan kereta ke Yogyakarta, kamu tertidur di bahuku\nMalam tahun baru, kita memilih diam menatap langit',

  // Act III: The Soundtrack of Us
  soundtrackTitle: 'Lagu yang Selalu Kita Putar',
  soundtrackSong: 'Sore Tugu Pancoran',
  soundtrackArtist: 'Tulus',
  soundtrackMessage:
    'Lagu ini pertama kali kita dengar bersama di dalam mobil, waktu macet panjang di tol Cipularang. Kamu ikut bernyanyi dengan nada yang meleset, dan aku diam-diam merekam suaramu.\n\nSejak itu, setiap kali lagu ini diputar, aku selalu teringat tawamu. Bagiku, kamu adalah lagu yang tidak pernah bosan kuputar ulang.',
  backgroundMusic:
    'https://res.cloudinary.com/oxzkml7u/video/upload/v1789622686/truelove/music/ytdnbb4hsfeuafh1tpgg.mp3',

  // Epilogue & Credits
  epilogueTitle: 'Bersambung ke Selamanya',
  directedBy: 'Cinta',
  creditsList:
    'Skenario | Seribu Obrolan Larut Malam\nPenata Musik | Playlist Kita Berdua\nLokasi Syuting | Setiap Tempat Bersamamu\nPemeran Pendukung | Kucing Oyen dan Kopi Susu\nProduser Eksekutif | Restu Mama dan Papa',
  finalButtonText: 'Buka Surat Terakhir 💌',
  finalLetter:
    'Anindya sayang,\n\nTiga tahun lalu aku tidak tahu bahwa satu sore hujan akan mengubah seluruh jalan ceritaku. Kamu datang tanpa naskah, tapi entah bagaimana setiap adegan bersamamu terasa pas.\n\nTerima kasih sudah bertahan di hari-hari ketika aku bukan versi terbaikku. Terima kasih sudah tertawa di hal-hal kecil yang bahkan aku sendiri lupa lucunya.\n\nFilm kita belum selesai. Masih banyak adegan yang ingin kutulis bersamamu, dari yang sederhana sampai yang belum terbayang. Selamat ulang tahun hubungan kita yang ketiga.',
  finalSignature: 'Selalu milikmu, Raka',
};

const config: TemplateDefinition = {
  id: 'anniversary-04',
  name: 'The Cinema of Us',
  description:
    'Template anniversary bertema bioskop antik. Tirai beludru, tiket pembuka, galeri pita film, soundtrack hubungan, dan penutup bergaya movie credits.',
  category: 'anniversary',
  thumbnail:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
  previewImage:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
  active: true,
  tier: 'premium',
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
