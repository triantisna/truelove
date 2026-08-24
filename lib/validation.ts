import { z } from "zod";

/**
 * JSON value accepted by the TRUELOVE dynamic content field.
 * Keeping this JSON-safe prevents Prisma Json fields from receiving
 * arbitrary values such as functions, Date objects, or undefined.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema)
  ])
);

export const websiteInputSchema = z.object({
  slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  templateId: z.string().min(1),
  packageId: z.string().min(1),
  senderName: z.string().min(1).max(80),
  receiverName: z.string().min(1).max(80),
  title: z.string().min(1).max(140),
  message: z.string().max(5000).optional().default(""),
  eventDate: z.string().optional().nullable(),
  musicUrl: z.string().url().optional().nullable().or(z.literal("")),
  theme: z.string().max(40).optional().default("romantic"),
  content: z.record(z.string(), jsonValueSchema).optional().default({}),
  status: z.enum(["draft", "preview", "published"]).default("draft")
});

export type WebsiteInput = z.infer<typeof websiteInputSchema>;
