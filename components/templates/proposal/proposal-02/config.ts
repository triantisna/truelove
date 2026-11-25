import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Rafa',
  receiverName: 'Syifa',
  openingMsg1: 'Hai Syifa, lagi sibuk gak?',
  openingMsg2:
    'Ada sesuatu yang dari kemarin kuketik terus kuhapus lagi. Tapi malam ini aku mau kirim beneran.',
  replyBtn1: 'Enggak kok, ada apa?',
  chatPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
  photoMessage:
    'Setiap lihat foto ini, aku selalu ingat betapa nyamannya hari itu. Dari situ aku mulai sadar kalau aku selalu nungguin kabar darimu.',
  replyBtn2: 'Haha inget banget! Terus?',
  confessionMsg1:
    'Aku suka caramu dengerin ceritaku yang kadang gak penting, caramu ketawa, dan gimana hari yang capek selalu terasa lebih ringan kalau sudah ngobrol sama kamu.',
  confessionMsg2:
    'Aku mungkin bukan orang yang paling sempurna, tapi aku janji akan selalu berusaha jadi tempat yang aman, sabar, dan jujur buat kamu.',
  replyBtn3: 'Jujur ini bikin deg-degan...',
  questionText: 'Jadi... maukah kamu jadi pasanganku?',
  yesReplyLabel: 'Iya, aku mau! ❤️',
  playfulReplyLabel: 'Bentar, masih salting 😅',
  playfulSenderResponse: 'Haha ambil napas dulu, aku tunggu di sini kok ✨',
  closingReply:
    'Serius?! Makasih banyak ya sudah memilih jalan bareng aku. Mulai hari ini, resmi ya—jangan lupa screenshot chat ini!',
  officialDate: '',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'proposal-02',
  name: 'Late Night Text',
  category: 'proposal',
  description:
    'Template proposal & confession bergaya aplikasi chat interaktif (Clean Modern Messenger). Dilengkapi status sedang mengetik, gelembung foto, quick reply interaktif, dan Pinned Official Banner.',
  previewImage:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
