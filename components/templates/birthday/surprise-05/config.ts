import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type MemoryVaultConfig = TemplateDefinition & { mockData?: any };

export const memoryVaultConfig: MemoryVaultConfig = {
  id: 'birthday-surprise-05',
  name: 'The Memory Vault - Digital Time Capsule',
  category: 'birthday',
  description:
    'Template ulang tahun eksklusif berupa brankas digital/kapsul waktu yang terkunci. Memerlukan kode rahasia untuk membuka linimasa kenangan dan pesan masa depan.',
  previewImage: '/previews/birthday-05.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Melvina',
    passcode: '2410',
    passcodeHint:
      'Tanggal spesial kita / hari ulang tahunmu... \n untuk passcode demo ini, gunakan 2410.',
    vaultTitle: 'The Memory Vault',
    introMessage:
      'Sebuah kapsul waktu telah disegel khusus untukmu, Melvina.\n\nDi dalamnya tersimpan memori, cerita, dan hal-hal yang mungkin terlupakan. Untuk membukanya, masukkan kode rahasia yang hanya kita berdua tahu.',

    chapter1:
      'Bab 1: Awal Mula Cerita\n\nSiapa sangka dari sekian banyak hari di kalender, jalurnya membawaku pada seseorang yang mengubah cara pandangku tentang banyak hal. Setiap percakapan awal kita terasa ringan, tapi diam-diam meninggalkan jejak yang dalam.',

    chapter2:
      'Bab 2: Hal-Hal Kecil yang Dirindukan\n\nDari tawa karena hal konyol, kebiasaan kecil yang akhirnya menular, hingga cara kita melewati hari-hari melelahkan bersama. Semua itu menyusun memori yang tidak ingin kuubah sedetik pun.',

    vaultImages: [
      {
        url: 'https://picsum.photos/seed/vault1/800/800',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/vault2/800/800',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/vault3/800/800',
        type: 'image',
      },
    ],

    futurePromises:
      'Semoga tahun depan kita bisa merayakan lebih banyak hal hebat bersama.\nSemoga mimpi-mimpi yang sedang kamu bangun satu per satu menemukan jalannya.\nApapun perubahan yang terjadi di masa depan, tempat ini akan selalu menyimpan cerita kita.',

    closingMessage:
      'Selamat Ulang Tahun, Melvina.\n\nBrankas ini sekarang resmi terbuka, tapi cerita kita masih panjang. Terima kasih sudah menjadi bagian paling berharga dalam hidupku.',

    senderName: 'Arzaniel',
    backgroundMusic: '',
  },
};
