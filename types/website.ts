export type WebsiteStatus = "draft" | "preview" | "published" | "expired" | "archived";

export interface WebsiteRecord {
  id: string;
  slug: string;
  templateId: string;
  packageId: string;
  senderName: string;
  receiverName: string;
  title: string;
  message: string;
  eventDate?: string;
  musicUrl?: string;
  theme?: string;
  status: WebsiteStatus;
  expiresAt?: string;
  createdAt: string;
  content?: Record<string, unknown>;
  media?: WebsiteMedia[];
}

export interface WebsiteMedia {
  id: string;
  websiteId: string;
  type: "image" | "video" | "audio";
  url: string;
  caption?: string;
  sortOrder: number;
}
