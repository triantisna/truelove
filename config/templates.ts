import dearYou from '@/components/templates/love-letter/dear-you/config';

import type { TemplateDefinition } from '@/types/template';

export const templates: TemplateDefinition[] = [dearYou];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find((template) => template.id === id);
}
