export type OccasionSlug =
  | "anniversary"
  | "love-letter"
  | "apology"
  | "birthday"
  | "proposal"
  | "date-invitation"
  | "our-story";

export type TemplateFieldType =
  | "text"
  | "textarea"
  | "date"
  | "media"
  | "music";

export type TemplateFieldKey =
  | "sender_name"
  | "receiver_name"
  | "title"
  | "message"
  | "event_date"
  | "photos"
  | "music";

export interface TemplateField {
  key: TemplateFieldKey;
  type: TemplateFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
}

export interface TemplateSchema {
  fields: TemplateField[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: OccasionSlug;
  description: string;
  previewImage: string;
  schema: TemplateSchema;
  active: boolean;
}

export function getTemplateFields(
  template: TemplateDefinition | undefined
): TemplateField[] {
  return template?.schema.fields ?? [];
}