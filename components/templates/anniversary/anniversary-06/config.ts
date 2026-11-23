import schema from './schema.json';
import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as unknown as TemplateSchema;

const mockData: Record<string, unknown> = {
  senderName: 'Fajar',
  receiverName: 'Laras',
  yearLabel: 'YEAR 03',
  catalogCode: 'LP-06 · ANNIVERSARY EDITION',
  albumTitle: 'Side A / Side B',
  coverTagline:
    'Setiap tahun bersamamu adalah rekaman favorit yang selalu ingin kuputar ulang.',
  linerNotesTitle: 'Catatan di Balik Sampul Tahun Ketiga',
  linerNotesBody:
    'Tiga tahun berlalu, dan rasanya kita sudah melewati begitu banyak melodi—dari hari-hari yang ringan penuh tawa, sampai masa-masa yang menuntut kita belajar lebih sabar mendengar satu sama lain.\n\nHal yang paling kusyukuri bukan karena perjalanan kita selalu mulus, melainkan karena setiap kali ada jeda atau salah paham, kita selalu memilih untuk duduk tenang dan kembali pulang ke arah yang sama. Terima kasih sudah tetap tinggal dan bertumbuh bersamaku.',
  sideATracks:
    'JAN 2026 | Liburan Singkat Tanpa Rencana | Berangkat pagi-pagi modal nekat, nyasar sedikit, tapi justru jadi salah satu hari paling seru tahun ini.\nMEI 2026 | Malam Panjang Sambil Ngopi | Saat kerjaan lagi padat-padatnya dan kamu tetap menyempatkan diri mendengarkan ceritaku sampai tuntas.\nAGT 2026 | Merayakan Pencapaian Kecil | Makan malam sederhana setelah satu target besarmu tercapai—melihat senyum legamu malam itu tidak tergantikan.\nNOV 2026 | Tahun Ketiga Kita | Masih dengan orang yang sama, obrolan yang tidak pernah habis, dan rasa tenang yang makin kuat.',
  sideBThings:
    'Caramu selalu ingat detail kecil dari hal-hal yang cuma kusebut sepintas\nTawa spontanmu setiap kali kita nonton atau bahas hal random di perjalanan\nKetenanganmu saat menenangkanku di hari-hari yang terasa terlalu berisik\nKebiasaan kita menutup hari dengan saling tanya: “Hari ini gimana?”',
  snapshotPhoto:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
  snapshotCaption:
    'Salah satu sore paling tenang yang selalu ingin kuulang bersamamu.',
  closingNote:
    'Terima kasih sudah menjadi rekan perjalanan terbaik. Mari putar tahun berikutnya bersama.',
  backgroundMusic: '',
};

const config: TemplateDefinition & {
  mockData: Record<string, unknown>;
} = {
  id: 'anniversary-06',
  name: 'Side A / Side B',
  category: 'anniversary',
  description:
    'Template anniversary bergaya sampul piringan hitam (Warm Vinyl Sleeve & Terracotta). Hangat dan nostalgik dengan liner notes, Side A tracklist momen, Side B hal kecil favorit, dan stempel On Repeat.',
  previewImage:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
  active: true,
  schema: typedSchema,
  mockData,
};

export default config;
export { config, mockData };
