import type { WebsiteRecord } from "@/types/website";

export const mockWebsites: WebsiteRecord[] = [
  {
    id: "demo-001",
    slug: "for-melvina",
    templateId: "love-letter-01",
    packageId: "paket-murah",
    senderName: "Arzaniel",
    receiverName: "Melvina",
    title: "A little thing for you",
    message: "I wanted to make something that feels more personal than a normal message. Thank you for making ordinary days feel special.",
    eventDate: "2026-08-24",
    status: "published",
    createdAt: "2026-08-24T00:00:00.000Z",
    media: []
  },
  {
    id: "demo-002",
    slug: "our-demo-story",
    templateId: "our-story-01",
    packageId: "paket-effort",
    senderName: "A",
    receiverName: "B",
    title: "Our Story",
    message: "Every story starts somewhere. This one is ours.",
    eventDate: "2024-08-20",
    status: "preview",
    createdAt: "2026-08-24T00:00:00.000Z",
    media: []
  }
];

export async function getWebsiteBySlug(slug: string) {
  return mockWebsites.find((website) => website.slug === slug) ?? null;
}
