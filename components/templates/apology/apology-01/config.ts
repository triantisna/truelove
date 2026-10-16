import { TemplateDefinition, TemplateSchema } from '@/types/template';
import schemaJson from './schema.json';

type ApologyConfig = TemplateDefinition & { mockData?: any };

export const apology01Config: ApologyConfig = {
  id: 'apology-01',
  name: "I'm Sorry - Sincere Letter",
  category: 'apology',
  description:
    'Template permintaan maaf yang tenang, elegan, dan tulus. Menampilkan amplop interaktif dan tipografi serif tanpa elemen yang memaksa atau berlebihan.',
  previewImage: '/previews/apology-01.jpg',
  active: true,
  schema: schemaJson as TemplateSchema,

  mockData: {
    receiverName: 'Melvina',
    envelopeQuote: 'For Melvina, with sincerity.',

    openingStatement:
      "Before anything else, there's something I want you to know.\n\nI'm sorry.\n\nNot because things feel different between us right now. Not because I'm afraid of what might happen next. But because I've been thinking about what happened, and I know I could have handled things better.",

    acknowledgment:
      "I know my words and actions affected you in ways I may not have fully understood in that moment.\n\nYou deserved patience when I was frustrated. You deserved to be heard when you were trying to tell me how you felt. And you deserved kindness, even when we didn't see things the same way.\n\nI'm sorry for the part I played in making things harder for you.",

    // Dipisah dengan Enter untuk dirender jadi list/card interaktif nantinya
    reflections:
      "I should have listened before reacting.\nI should have tried to understand instead of immediately explaining myself.\nI should have remembered that being right about something doesn't give me the right to make you feel small or unheard.\nI'm learning that a sincere apology isn't about finding the perfect words. It's about being honest enough to recognize where I went wrong.",

    mainLetter:
      "Dear Melvina,\n\nYou matter to me, and that's exactly why I don't want to brush this aside as if nothing happened.\n\nI can't change the moment that hurt you. I can't ask you to forget it just because I've said I'm sorry. What I can do is take responsibility for my part, listen to what you need me to understand, and work on the things I should have handled differently.\n\nI'm not writing this because I expect everything to be okay immediately. I'm writing because you deserve an apology that doesn't come with excuses.\n\nI'm sorry. Truly.",

    // Dipisah dengan Enter untuk list komitmen
    commitments:
      'I want to be more mindful of my words.\nI want to listen without preparing a defense in my head.\nAnd when I make a mistake, I want to be brave enough to acknowledge it instead of waiting for the distance between us to speak for me.\nI know that words are only a beginning. I want my actions to show you that I mean them.',

    closingText:
      "You don't owe me an immediate response, and you don't have to make your feelings smaller to make this easier for me.\n\nI just wanted to say this properly.\n\nI'm sorry for hurting you. And thank you for taking the time to read this.",

    senderName: 'Arzaniel',
    backgroundMusic: '', // Dikosongkan agar lebih intimate dan hening sesuai konsep
  },
};
