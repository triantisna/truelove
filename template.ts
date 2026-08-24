export type OccasionSlug =
  | "anniversary"
  | "love-letter"
  | "apology"
  | "birthday"
  | "proposal"
  | "date-invitation"
  | "our-story";

export type TemplateField =
  | "sender_name"
  | "receiver_name"
  | "title"
  | "message"
  | "event_date"
  | "photos"
  | "music";

export interface TemplateDefinition {
  id: string;
  name: string;
  category: OccasionSlug;
  description: string;
  previewImage: string;
  fields: TemplateField[];
  active: boolean;
}
