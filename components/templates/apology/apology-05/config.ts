import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  receiverName: 'Clara',
  senderName: 'Dimas',
  invitationLine: 'Boleh kita duduk sebentar dan bicara pelan-pelan?',
  whatIDid:
    'Aku terlalu cepat tersulut emosi, memotong ceritamu di tengah jalan, lalu malah memilih diam saat kamu sebenarnya cuma butuh didengarkan.',
  whatIShouldHaveDone:
    'Seharusnya aku menarik napas sebentar, menaruh egoku di samping, dan mendengarkan sudut pandangmu sampai selesai dengan kepala dingin.',
  letterHeadline: 'Maaf sudah membuat ruang di antara kita terasa dingin',
  mainLetter:
    'Semalaman aku memikirkan obrolan kita kemarin, dan jujur aku merasa bersalah sekali. Kamu datang dengan niat baik untuk bicara, tapi aku malah menyambutnya dengan sikap defensif yang tidak perlu.\n\nAku tidak mau kita terbiasa tidur dengan perasaan mengganjal seperti ini. Bagiku, memenangkan argumen tidak pernah ada artinya kalau ujung-ujungnya aku melukai orang yang paling kusayang.\n\nMaaf ya, sudah membuat harimu jadi berat. Aku benar-benar menghargai kesabaranmu selama ini, dan aku ingin kita kembali duduk di sisi yang sama—bukan saling berhadapan karena ego.',
  gallery: [
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=700&auto=format&fit=crop',
  ],
  galleryCaptions:
    'Kopi sore yang selalu jadi alasan kita betah ngobrol lama\nTawamu yang tidak pernah ingin kuhilangkan\nLangkah santai yang selalu kurindukan\nKita—terlalu berharga untuk dikalahkan ego',
  peaceOfferingTitle: 'Kopi, Makan Enak & Obrolan Tenang',
  peaceOfferingDetail:
    'Berlaku untuk 1x traktir kopi dan makanan favoritmu di tempat pilihanmu, lengkap dengan aku yang mendengarkan semua ceritamu tanpa menyela. Bisa ditukar kapan pun kamu siap.',
  closingText:
    'Tidak perlu buru-buru. Kursi di seberangku selalu ada untukmu—kabari aku kapan pun hatimu sudah lebih lega.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'apology-05',
  name: 'Over Coffee',
  category: 'apology',
  description:
    'Permintaan maaf bernuansa hangat ala editorial kafe. Dilengkapi kartu reservasi pembuka, refleksi 2 kolom, surat utama, galeri kenangan, dan voucher Peace Offering.',
  previewImage:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
