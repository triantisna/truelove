import schema from './schema.json';

import type { TemplateDefinition, TemplateSchema } from '@/types/template';

const typedSchema = schema as TemplateSchema;

const config: TemplateDefinition = {
  id: 'love-letter-01',

  name: 'Dear You',

  category: 'love-letter',

  description: 'An intimate interactive love letter with a romantic reveal.',

  previewImage: '/placeholders/love-letter-01.svg',

  active: true,

  schema: typedSchema,
};

export default config;
