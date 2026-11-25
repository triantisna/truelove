import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Bima',
  receiverName: 'Naya',
  boardTitle: 'All The Little Pieces',
  boardSubtitle:
    'Ketuk 3 kepingan di bawah ini untuk membuka satu pertanyaan penting dariku.',
  momentPhoto:
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
  momentTitle: 'Momen yang Bikin Aku Yakin',
  momentNote:
    'Di sore ini aku sadar kalau waktu selalu terasa berjalan terlalu cepat setiap kali aku sedang duduk dan bercerita bersamamu.',
  reasonsTitle: 'Kenapa Harus Kamu?',
  reasonsList:
    'Caramu selalu mendengar dengan tenang tanpa pernah menghakimi\nEnergi hangatmu yang bikin hari biasa langsung terasa spesial\nRasa nyaman yang tidak pernah perlu dibuat-buat saat kita berdua',
  promiseTitle: 'Janji Kecilku',
  promiseText:
    'Aku tidak menjanjikan hari-hari yang selalu tanpa masalah, tapi aku berjanji akan selalu berusaha jujur, sabar, dan menjadi tempat pulang yang aman untukmu.',
  questionText: 'Maukah kamu menjadi pasanganku?',
  yesButtonLabel: 'Iya, Aku Mau!',
  celebrationTitle: 'Semua Kepingan Lengkap',
  celebrationMessage:
    'Terima kasih sudah memilih berjalan bersamaku. Mari kita kumpulkan lebih banyak kepingan cerita indah mulai hari ini.',
  officialDate: '',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'proposal-03',
  name: 'All The Little Pieces',
  category: 'proposal',
  description:
    'Template proposal & confession bergaya Interactive Bento Board (Soft Butter, Matcha & Espresso). Penerima mengetuk 3 widget cerita untuk membuka kartu pertanyaan utama yang terkunci.',
  previewImage:
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
