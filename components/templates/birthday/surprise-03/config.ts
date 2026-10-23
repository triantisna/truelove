import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type TodayIsYoursConfig = TemplateDefinition & { mockData?: any };

export const todayIsYoursConfig: TodayIsYoursConfig = {
  id: 'birthday-surprise-03',
  name: 'Today Is Yours - Birthday Party',
  category: 'birthday',
  description:
    'Template perayaan ulang tahun yang meriah, elegan, dan penuh warna pastel. Dilengkapi interaksi tiup lilin digital dan kartu harapan yang estetik.',
  previewImage: '/previews/birthday-03.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Melvina',
    heroTitle: 'Today Is Yours',
    heroSubtitle:
      'Hari ini, dunia berhenti sejenak untuk merayakan keberadaanmu.',
    introMessage:
      'Tebak apa, Melvina?\n\nHari ini bukan sekadar tanggal biasa di kalender. Ini adalah hari di mana kita merayakan kamu — seseorang yang selalu membawa cahayanya sendiri ke dalam hidup orang-orang di sekitarnya.\n\nJadi, biarkan segala penat beristirahat sejenak. Hari ini sepenuhnya milikmu.',
    mainWish:
      'Selamat Ulang Tahun, Melvina! 🎉\n\nSemoga hari ini dipenuhi dengan hal-hal yang paling kamu sukai, orang-orang yang paling kamu sayangi, dan momen-momen kecil yang membuatmu tersenyum tanpa sadar.\n\nKamu pantas mendapatkan perayaan yang seindah dan sehebat dirimu.',
    wishText:
      'Pejamkan matamu sejenak...\n\nPikirkan satu hal yang sangat kamu harapkan, sesuatu yang sedang kamu perjuangkan, atau impian kecil yang ingin kamu wujudkan tahun ini.\n\nTarik napas perlahan, tiup lilinnya, dan biarkan semesta membantumu mewujudkannya.',
    reflectionMessage:
      'Coba lihat seberapa jauh kamu telah melangkah.\n\nSetiap tantangan yang kamu hadapi, setiap pelajaran yang kamu petik, dan setiap langkah kecil yang kamu ambil telah membentuk dirimu menjadi luar biasa seperti sekarang.\n\nKamu tidak harus selalu menjadi sempurna untuk merasa bangga pada diri sendiri. Semoga tahun ini memberimu lebih banyak alasan untuk menghargai perjalananmu.',

    // Dipisah dengan Enter (\n) untuk dirender jadi kartu-kartu doa
    blessingsList:
      'Semoga kamu menemukan lebih banyak alasan untuk tertawa lepas setiap hari.\nSemoga kamu selalu memiliki keberanian untuk mencoba hal-hal baru yang sempat membuatmu ragu.\nSemoga orang-orang di sekelilingmu selalu mengingatkan betapa berharganya dirimu.\nDan semoga selalu ada ruang untuk kebahagiaan kecil yang tak terduga di setiap langkahmu.',

    gallery: [
      {
        url: 'https://picsum.photos/seed/bday1/800/800',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/bday2/800/800',
        type: 'image',
      },
      {
        url: 'https://picsum.photos/seed/bday3/800/800',
        type: 'image',
      },
    ],

    galleryCaptions:
      'Perayaan kecil yang penuh tawa.\nKue ulang tahunnya sempat miring tapi rasanya enak!\nMomen paling berkesan tahun ini.',

    closingMessage:
      'Selamat ulang tahun sekali lagi, Melvina.\n\nSemoga babak baru dalam hidupmu ini membawamu lebih dekat pada mimpi-mimpi besarmu, orang-orang tulus yang membuatmu merasa di rumah, dan versi terbaik dari dirimu yang sudah tidak sabar menyapa.\n\nNikmati harimu, bintang kecil. Kamu sangat layak mendapatkannya.',

    senderName: 'Arzaniel',
    backgroundMusic: '',
  },
};
