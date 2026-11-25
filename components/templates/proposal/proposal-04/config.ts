import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Bagas',
  receiverName: 'Tania',
  deckTitle: 'The Final Card',
  coverNote:
    'Empat kartu untuk menceritakan perasaanku, dan satu kartu terakhir untuk bertanya padamu.',
  photoImage:
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
  photoTitle: 'Salah Satu Momen Favoritku',
  photoCaption:
    'Di hari ini aku sadar bahwa hal-hal paling sederhana selalu terasa jauh lebih hangat kalau dijalani bersamamu.',
  feelingTitle: 'Apa yang Berubah Sejak Mengenalmu',
  feelingStory:
    'Sebelumnya, hari-hari terasa berjalan begitu saja. Sejak kamu ada, aku selalu punya alasan kecil untuk menantikan esok hari—entah itu sekadar bertukar cerita singkat, tertawa soal hal sepele, atau duduk tenang di sebelahmu.',
  promiseTitle: 'Sebelum Kartu Terakhir',
  promiseBody:
    'Aku mungkin tidak bisa menjanjikan jalan yang selalu mulus tanpa rintangan. Tapi aku berjanji akan selalu berusaha menjadi pendengar yang sabar, jujur dalam setiap langkah, dan memilihmu di hari baik maupun sulit.',
  questionText: 'Maukah kamu menjadi pasanganku?',
  yesButtonLabel: 'Iya, Aku Mau!',
  keepsakeTitle: 'Official Keepsake',
  keepsakeMessage:
    'Terima kasih sudah memilih berjalan bersamaku. Simpan kartu ini sebagai penanda hari pertama dari banyak cerita indah kita ke depan.',
  officialDate: '',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'proposal-04',
  name: 'The Final Card',
  category: 'proposal',
  description:
    'Template proposal & confession bergaya Tactile Stacked Card Deck (Warm Linen & Deep Burgundy). Lima kartu fisik yang ditarik satu per satu hingga berakhir di kartu pertanyaan Burgundy dan Official Keepsake.',
  previewImage:
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
