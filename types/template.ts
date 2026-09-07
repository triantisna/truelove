export type OccasionSlug =
  | 'anniversary'
  | 'love-letter'
  | 'apology'
  | 'birthday'
  | 'proposal'
  | 'date-invitation'
  | 'our-story';

export type TemplateFieldType =
  'text' | 'textarea' | 'date' | 'media' | 'music';

export type TemplateField = {
  key: string;

  label: string;

  type: TemplateFieldType;

  description?: string;

  placeholder?: string;

  required?: boolean;

  multiple?: boolean;
};

export type TemplateSchema = {
  fields: TemplateField[];
};

export type TemplateConfig = {
  id: string;

  name: string;

  category: OccasionSlug;

  description: string;

  previewImage: string;

  active: boolean;
};

export type TemplateDefinition = TemplateConfig & {
  schema: TemplateSchema;
};

/**
 * JSON-safe value used by dynamic template content.
 *
 * A template may store:
 * - text
 * - numbers
 * - booleans
 * - null
 * - arrays
 * - nested objects
 */
export type TemplateContentValue =
  | string
  | number
  | boolean
  | null
  | TemplateContentValue[]
  | {
      [key: string]: TemplateContentValue;
    };

/**
 * Dynamic content stored inside WebsiteRecord.content.
 *
 * The keys are intentionally dynamic because every template
 * may define different fields through schema.json.
 */
export type TemplateContent = Record<string, TemplateContentValue>;

export function getTemplateFields(
  template: TemplateDefinition | undefined,
): TemplateField[] {
  return template?.schema.fields ?? [];
}
