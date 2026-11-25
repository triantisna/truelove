import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Raka',
  receiverName: 'Nadya',
  documentTitle: 'Perjanjian Resmi Hati',
  exhibitPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
  exhibitCaption:
    'Lampiran A — Bukti nyata betapa nyamannya kita setiap kali sedang bersama.',
  clausesList:
    'Pihak Pertama wajib menjadi tempat pulang yang aman dan pendengar yang sabar.\nTidak ada tidur dalam keadaan marahan tanpa saling mencari jalan tengah.\nSelalu menyisihkan waktu untuk kencan kecil di tengah kesibukan.',
  questionText:
    'Maukah kamu menandatangani perjanjian ini dan menjadi pasanganku?',
  yesButtonLabel: 'Tanda Tangani & Resmikan ✒️',
  closingNote:
    'Perjanjian ini berlaku mulai hari ini dan seterusnya. Terima kasih sudah memilih berjalan bersamaku.',
  officialDate: '',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'proposal-05',
  name: 'The Official Agreement',
  category: 'proposal',
  description:
    'Template proposal bergaya surat perjanjian resmi bernuansa editorial klasik (Warm Ivory & Deep Forest). Dilengkapi lampiran foto bukti, pasal komitmen interaktif, tanda tangan, dan stempel tinta SAH.',
  previewImage:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
