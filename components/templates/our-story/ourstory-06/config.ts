import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData: Record<string, unknown> = {
  senderName: 'Raditya',
  receiverName: 'Alena',
  catalogNumber: 'EXH-06 · PRIVATE VIEWING',
  openingLine:
    'Andai aku bisa membangun museum dari semua hal yang kucintai, setiap ruangannya tentangmu.',
  writtenDate: 'Sabtu, 14 November 2026',

  artifact1Label: 'Dua Gelas Kopi Dingin',
  artifact1Meta: 'OKTOBER 2023 · DAGO',
  artifact1Story:
    'Es batunya sudah mencair setengah sebelum kita sadar sudah mengobrol hampir tiga jam. Di meja kayu kecil itulah aku pertama kali merasa tidak perlu berpura-pura jadi siapa pun.',

  artifact2Label: 'Tiket Kereta Malam',
  artifact2Meta: 'JANUARI 2024 · STASIUN BANDUNG',
  artifact2Story:
    'Masih kusimpan di selipan dompet sampai tintanya hampir pudar. Bukan karena tujuannya, melainkan karena malam itu kamu tertidur di bahuku sepanjang perjalanan.',

  artifact3Label: 'Payung Lipat Hitam',
  artifact3Meta: 'AGUSTUS 2024 · YOGYAKARTA',
  artifact3Story:
    'Terlalu kecil untuk berdua, akhirnya bahu kita sama-sama basah. Tapi tawa kita di pinggir trotoar malam itu jadi salah satu suara paling hangat yang pernah kusimpan.',

  artifact4Label: 'Playlist Tengah Malam',
  artifact4Meta: '2023 – SEKARANG',
  artifact4Story:
    'Kumpulan lagu yang diam-diam kita tambahkan satu per satu. Setiap kali lagu-lagu itu terputar secara acak, selalu ada potongan hari bersamamu yang ikut kembali.',

  curatorTitle: 'Catatan Kurator untuk Ruang yang Paling Kujaga',
  letterBody:
    'Malam ini pintu pameran ini dibuka hanya untuk satu orang: kamu. Tidak ada keramaian, tidak ada jadwal yang memburu—hanya cahaya lampu yang hangat dan potongan-potongan waktu yang diam-diam kukumpulkan sejak hari pertama kita berjalan searah.\n\nOrang sering mengira cinta hanya tentang momen-momen besar yang megah. Padahal setelah berjalan sejauh ini bersamamu, aku baru sadar bahwa karya terbaik dalam hidupku justru lahir dari hal-hal yang paling sunyi: caramu menanyakan kabarku di sela hari yang padat, caramu mengingat detail kecil yang bahkan aku sendiri lupa, dan caramu tetap tinggal saat hari sedang tidak mudah.\n\nJika suatu hari dunia terasa terlalu bising dan melelahkan, kembalilah ke ruang ini. Lihat betapa jauh kita sudah melangkah, dan ingat bahwa di setiap ruangan waktu yang sudah kita lewati, kamu selalu menjadi bagian yang paling berharga.',

  room1When: '2023 · AWAL PERTEMUAN',
  room1Title: 'Ruang Pertama — Saat Kita Masih Asing',
  room1Story:
    'Semuanya dimulai tanpa rencana besar. Dua orang yang kebetulan bertemu di waktu yang tepat, saling melempar cerita ringan, lalu perlahan menemukan bahwa percakapan paling nyaman ternyata ada di depan mata.',

  room2When: '2024 · PERJALANAN PERTAMA',
  room2Title: 'Ruang Kedua — Belajar Menjadi Kita',
  room2Story:
    'Tahun saat kita mulai mengenal kebiasaan kecil satu sama lain—dari jam makan yang berantakan sampai cara kita menyelesaikan perbedaan tanpa saling meninggalkan. Di sini aku belajar bahwa mencintai berarti juga mau bertumbuh.',

  room3When: '2025 · HARI-HARI YANG TENANG',
  room3Title: 'Ruang Ketiga — Menemukan Rumah',
  room3Story:
    'Tidak lagi selalu butuh tempat baru atau acara khusus untuk merasa bahagia. Duduk berdampingan di sore yang biasa saja sudah cukup membuatku merasa pulang.',

  room4When: '2026 · HARI INI',
  room4Title: 'Ruang Keempat — Tetap Memilihmu',
  room4Story:
    'Setelah semua musim yang kita lewati, satu hal tidak pernah berubah: setiap pagi, aku masih bersyukur bahwa orang yang berjalan di sampingku adalah kamu.',

  mainPhoto: img('photo-1516589178581-6cd7833ae3b2'),
  mainPhotoCaption:
    'Karya Utama No. 01 — Sore yang tenang, dan alasan kenapa aku selalu ingin pulang kepadamu.',

  galleryPhotos: [
    img('photo-1522673607200-164d1b6ce486'),
    img('photo-1529634806980-85c3dd6d34ac'),
    img('photo-1518199266791-5375a83190b7'),
    img('photo-1494774157365-9e04c6720e47'),
  ],
  galleryCaptions:
    'Koleksi No. 02 — Cahaya sore yang selalu jatuh pas di wajahmu\nKoleksi No. 03 — Tawa yang tidak pernah gagal meredakan lelahku\nKoleksi No. 04 — Langkah pelan setelah hari yang panjang\nKoleksi No. 05 — Kita, dan semua hal baik yang masih menanti',

  signature: 'Raditya',
  futureWingTitle: 'Sayap yang Masih Sengaja Kubiarkan Kosong',
  futureWingText:
    'Di ujung pameran ini masih ada satu ruangan luas dengan dinding yang belum terisi. Aku sengaja membiarkannya kosong—untuk semua perjalanan baru, tawa yang belum terjadi, dan tahun-tahun tenang yang ingin terus kupajang bersamamu.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'ourstory-06',
  name: 'The Private Exhibition',
  category: 'our-story',
  active: true,
  tier: 'premium',
  description:
    'If I could build a museum of everything I love, every room would be about you.',
  previewImage: img('photo-1516589178581-6cd7833ae3b2'),
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
