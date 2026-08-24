import type { TemplateDefinition } from "@/types/template";

export const templates: TemplateDefinition[] = [
  {
    id: "love-letter-01",
    name: "Dear You",
    category: "love-letter",
    description: "Interactive letter with a romantic reveal.",
    previewImage: "/placeholders/love-letter-01.svg",
    fields: ["sender_name", "receiver_name", "message", "photos", "music"],
    active: true
  },
  {
    id: "anniversary-01",
    name: "Forever With You",
    category: "anniversary",
    description: "Anniversary experience with memories and a date counter.",
    previewImage: "/placeholders/anniversary-01.svg",
    fields: ["sender_name", "receiver_name", "message", "event_date", "photos", "music"],
    active: true
  },
  {
    id: "apology-01",
    name: "Can We Try Again?",
    category: "apology",
    description: "A softer way to apologize and communicate intent.",
    previewImage: "/placeholders/apology-01.svg",
    fields: ["sender_name", "receiver_name", "message", "photos", "music"],
    active: false
  },
  {
    id: "birthday-01",
    name: "Your Day",
    category: "birthday",
    description: "Birthday countdown, photos, wishes, and surprise reveal.",
    previewImage: "/placeholders/birthday-01.svg",
    fields: ["sender_name", "receiver_name", "message", "event_date", "photos", "music"],
    active: false
  },
  {
    id: "proposal-01",
    name: "One Question",
    category: "proposal",
    description: "A cinematic build-up toward the proposal question.",
    previewImage: "/placeholders/proposal-01.svg",
    fields: ["sender_name", "receiver_name", "message", "event_date", "photos", "music"],
    active: false
  },
  {
    id: "date-01",
    name: "Coffee With Me?",
    category: "date-invitation",
    description: "A playful interactive invitation for a date.",
    previewImage: "/placeholders/date-01.svg",
    fields: ["sender_name", "receiver_name", "message", "event_date", "photos", "music"],
    active: false
  },
  {
    id: "our-story-01",
    name: "Our Chapters",
    category: "our-story",
    description: "Relationship timeline and memory chapters.",
    previewImage: "/placeholders/our-story-01.svg",
    fields: ["sender_name", "receiver_name", "message", "event_date", "photos", "music"],
    active: true
  }
];

export function getTemplateById(id: string) {
  return templates.find((template) => template.id === id);
}
