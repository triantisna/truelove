import dearYou from '@/components/templates/love-letter/dear-you/config';
import birthdaySurprise from '@/components/templates/birthday/surprise-01/config';

import type { TemplateDefinition } from '@/types/template';

export const templates: TemplateDefinition[] = [dearYou, birthdaySurprise];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find((template) => template.id === id);
}
