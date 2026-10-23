import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type ReasonsSpecialConfig = TemplateDefinition & { mockData?: any };

export const reasonsSpecialConfig: ReasonsSpecialConfig = {
  id: 'birthday-surprise-04',
  name: "Reasons You're Special - Appreciation Scrapbook",
  category: 'birthday',
  description:
    'Template ulang tahun bertema scrapbook romantis dan timeless. Berfokus pada serangkaian kartu alasan, kenangan, dan afirmasi personal yang menyentuh hati.',
  previewImage: '/previews/birthday-04.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Melvina',
    heroTitle: "Reasons You're Special",
    introMessage:
      'Birthdays are a lovely excuse to celebrate someone. But sometimes, I think the best things about a person are found in the little moments between celebrations.\n\nSo, today, I wanted to collect a few reminders of what makes you special to me.',

    // Format: Judul | Isi pesan, dipisah dengan Enter (\n)
    reasonsList:
      "The Way You Care | I admire the way you can care about things that other people might overlook. There's something beautiful about someone who notices, who remembers, and who tries to make the people around them feel a little more understood. I hope you know that your kindness matters.\nYour Own Kind of Light | You don't have to be the loudest person in a room to make a difference. There's something uniquely yours about the way you see things, the way you express yourself, and the little details that make you who you are. I hope you never feel like you have to become someone else to be appreciated.\nThe Little Things | Sometimes it's a small smile, an unexpected joke, a random story, or the way an ordinary day becomes more fun when you're around. They're little things, but they're part of the reasons I feel lucky to know you.",

    // Dipisah dengan Enter (\n) untuk poin afirmasi
    affirmationsList:
      'You are allowed to grow at your own pace.\nYou are allowed to make mistakes and learn from them.\nYou are allowed to rest without feeling guilty.\nAnd you deserve to be appreciated for who you are, not just for what you achieve or what you do for others.',

    birthdayWish:
      "For this new year of your life, I hope you find more moments that make you feel proud, more people who genuinely support you, and more reasons to be excited about what's ahead.\n\nHappy Birthday, Melvina.\n\nThere are many things I appreciate about you, and I hope this little collection reminds you of at least a few of them.",

    senderName: 'Arzaniel',
    backgroundMusic: '',
  },
};
