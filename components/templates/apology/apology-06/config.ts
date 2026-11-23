import type { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

const schema = schemaJson as unknown as TemplateSchema;

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const mockData: Record<string, unknown> = {
  senderName: 'Bima',
  receiverName: 'Sekar',
  writtenTime: '22:40',
  writtenDate: 'Selasa, 18 November 2025',
  openingLine: 'Maaf, kemarin aku yang jadi penyebab mendungnya.',

  voice1Title: 'Waktu kamu menunggu jawabanku',
  voice1Text:
    'Sebenarnya aku ingin langsung bilang aku salah. Tapi egoku terlalu sibuk mencari alasan, sampai akhirnya aku membiarkanmu menunggu dalam diam.',
  voice2Title: 'Waktu aku memilih diam',
  voice2Text:
    'Diamku kemarin bukan karena aku tidak peduli. Aku cuma takut mengakui bahwa sikapku sendiri yang membuatmu terluka.',
  voice3Title: 'Waktu kamu menangis di ujung telepon',
  voice3Text:
    'Di detik itu aku sadar, tidak ada satu pun argumen yang pantas dimenangkan kalau harganya adalah air matamu.',

  letterBody:
    'Hujan di luar baru saja reda, tapi rasa bersalahku sejak kemarin masih tertinggal. Aku duduk cukup lama malam ini, memutar ulang semua yang terjadi, dan akhirnya berhenti membela diri.\n\nAku salah, Sekar. Caraku bersikap kemarin tidak adil untukmu. Di saat kamu sedang berusaha jujur tentang apa yang kamu rasakan, aku justru menutup telinga dan membiarkan suasana berubah dingin.\n\nAku tidak menulis ini untuk memaksamu langsung baik-baik saja. Aku tahu luka tidak hilang hanya karena hujan berhenti. Aku hanya ingin kamu tahu bahwa aku benar-benar menyesal, aku melihat kesalahanku dengan jelas, dan aku ingin belajar menjagamu lebih baik lagi.',

  realize1Title: 'Aku meninggikan suara',
  realize1Confession:
    'Aku membiarkan emosiku mengambil alih nada bicaraku sampai membuatmu merasa tidak aman untuk bercerita.',
  realize1Fix:
    'Saat emosi mulai naik, aku akan berhenti sejenak dan menenangkan diri lebih dulu sebelum melanjutkan pembicaraan.',

  realize2Title: 'Aku menganggap perasaanmu berlebihan',
  realize2Confession:
    'Aku meremehkan hal yang sebenarnya sangat menyakitkan bagimu, hanya karena aku melihatnya dari sudut pandangku sendiri.',
  realize2Fix:
    'Aku akan mendengarkan sudut pandangmu sampai selesai dan memvalidasi perasaanmu tanpa menghakimi.',

  realize3Title: 'Aku memakai diam sebagai senjata',
  realize3Confession:
    'Aku menjauh dan membiarkanmu menebak-nebak, padahal kamu hanya butuh kejelasan dan ketenangan.',
  realize3Fix:
    'Kalau aku butuh waktu untuk berpikir, aku akan bilang dengan baik-baik—bukan menghilang begitu saja.',

  realize4Title: 'Aku terlalu sibuk membela diri',
  realize4Confession:
    'Aku lebih fokus membuktikan bahwa niatku tidak buruk, daripada mengakui bahwa dampaknya tetap melukaimu.',
  realize4Fix:
    'Aku akan mengutamakan perasaan kita berdua di atas egoku sendiri.',

  mainPhoto: img('photo-1516589178581-6cd7833ae3b2'),
  mainPhotoCaption:
    'Hari yang cerah itu masih nyata, dan aku ingin kembali ke sana bersamamu.',
  galleryPhotos: [
    img('photo-1522673607200-164d1b6ce486'),
    img('photo-1529634806980-85c3dd6d34ac'),
    img('photo-1518199266791-5375a83190b7'),
    img('photo-1494774157365-9e04c6720e47'),
  ],
  galleryCaptions:
    'Sore tenang yang selalu ingin kuulang\nTawamu yang tidak pernah ingin kuhilangkan lagi\nLangkah pelan setelah hari yang panjang\nKita—yang selalu layak diperjuangkan',

  signature: 'Bima',
  hopeText:
    'Ambil waktumu sebanyak yang kamu butuh. Aku tidak menuntut jawaban hari ini. Aku akan tetap di sini, menunggu dengan sabar sampai kamu siap memulai lagi pelan-pelan.',

  backgroundMusic: '',
};

const config: TemplateDefinition = {
  id: 'apology-06',
  name: 'After the Rain',
  category: 'apology',
  active: true,
  tier: 'premium',
  description:
    'I hate that I was the storm. Let me be the calm that stays after.',
  previewImage:
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
  schema,
  mockData,
} as TemplateDefinition;

export default config;
export { config, mockData };
