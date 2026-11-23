import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  receiverName: 'Hana',
  senderName: 'Arya',
  openingNote: 'Tidak ada pembelaan di dalam sini, hanya kejujuran.',
  acknowledgment:
    'Aku salah karena membiarkan egoku bicara lebih keras daripada rasa peduliku kemarin. Aku tidak mendengarkanmu saat kamu sedang berusaha jujur, dan aku menyesal sudah membuatmu merasa sendirian.',
  letterHeadline: 'Maaf karena sudah membuatmu kecewa',
  mainLetter:
    'Setelah semuanya tenang, aku duduk cukup lama dan memikirkan ulang caraku bersikap kemarin. Semakin kupikirkan, semakin aku sadar betapa tidak adilnya aku padamu. Kamu berhak didengar, dimengerti, dan diperlakukan dengan sabar—bukan malah dihadapi dengan sikap dingin.\n\nAku tidak menulis ini untuk memintamu langsung melupakan semuanya. Aku tahu rasa kecewa tidak hilang hanya karena satu kalimat maaf. Aku hanya ingin kamu tahu bahwa aku benar-benar melihat kesalahanku, dan aku tidak menganggap remeh perasaanmu.\n\nKamu terlalu berharga untuk sekadar kutinggalkan dengan rasa sakit yang kubuat sendiri. Kalau masih ada ruang untuk memperbaiki ini pelan-pelan, aku ingin melakukannya dengan benar.',
  memoryPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop',
  memoryCaption: 'Kita—hal terbaik yang tidak pernah ingin kusia-siakan.',
  commitments:
    'Mendengarkan sampai selesai | Tidak memotong pembicaraan atau langsung membela diri saat kita sedang berbeda pendapat.\nMenahan ego saat emosi | Memilih jeda sebentar daripada mengucapkan hal yang akhirnya melukaimu.\nLebih jujur dan terbuka | Menyampaikan apa yang kurasakan dengan tenang sebelum semuanya menumpuk.\nMenjaga ruang aman kita | Memastikan kamu selalu merasa dihargai, bahkan di hari-hari yang sulit.',
  closingText:
    'Ambil waktumu sebanyak yang kamu butuh. Tidak ada paksaan untuk langsung membalas. Aku di sini, menunggu dengan sabar sampai kamu siap bicara lagi.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'apology-04',
  name: 'The Quiet Mend',
  category: 'apology',
  description:
    'Permintaan maaf bergaya minimalis Jepang (Wabi-Sabi / Kintsugi). Tenang, dewasa, dan tulus dengan blok pengakuan jujur, surat utama, dan daftar komitmen nyata.',
  previewImage:
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
