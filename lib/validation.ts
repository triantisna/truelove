import { z } from 'zod';
import { getTemplateById } from '@/config/templates';

/**
 * JSON value accepted by the TRUELOVE dynamic content field.
 * Keeping this JSON-safe prevents Prisma Json fields from receiving
 * arbitrary values such as functions, Date objects, or undefined.
 */
export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const mediaContentSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  resourceType: z.string().min(1).optional(),
  caption: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

function buildTemplateContentSchema(
  templateId: string,
  status: string,
): z.ZodType {
  const template = getTemplateById(templateId);

  if (!template) {
    throw new Error('TEMPLATE_NOT_FOUND');
  }

  const shape: Record<string, z.ZodType> = {};

  for (const field of template.schema.fields) {
    let fieldSchema: z.ZodType =
      field.type === 'media'
        ? field.multiple
          ? z.array(mediaContentSchema)
          : mediaContentSchema
        : field.type === 'music'
          ? z.string().url()
          : z.string();

    if (status === 'draft') {
      if (field.type !== 'media') {
        fieldSchema = fieldSchema.or(z.literal(''));
      }

      fieldSchema = fieldSchema.nullable().optional();
    } else if (field.required) {
      if (field.type !== 'media') {
        fieldSchema = fieldSchema.pipe(z.string().trim().min(1));
      }
    } else {
      if (field.type === 'media' && !field.multiple) {
        fieldSchema = fieldSchema.nullable();
      } else if (field.type === 'music') {
        fieldSchema = z.string().url().or(z.literal(''));
      }

      fieldSchema = fieldSchema.optional();
    }

    shape[field.key] = fieldSchema;
  }

  return z.object(shape).passthrough();
}

function validateContentForTemplate(
  templateId: string,
  content: Record<string, JsonValue>,
  status: string,
  context: z.RefinementCtx,
) {
  try {
    buildTemplateContentSchema(templateId, status).parse(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      for (const issue of error.issues) {
        context.addIssue({
          code: 'custom',
          path: ['content', ...issue.path],
          message: issue.message,
        });
      }
      return;
    }

    context.addIssue({
      code: 'custom',
      path: ['templateId'],
      message: 'Template is not registered.',
    });
  }
}

export const websiteInputSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  templateId: z.string().min(1),
  packageId: z.string().min(1),
  senderName: z.string().min(1).max(80),
  receiverName: z.string().min(1).max(80),
  title: z.string().min(1).max(140),
  message: z.string().max(5000).optional().default(''),
  eventDate: z.string().optional().nullable(),
  musicUrl: z.string().url().optional().nullable().or(z.literal('')),
  theme: z.string().max(40).optional().default('romantic'),
  content: z.record(z.string(), jsonValueSchema).optional().default({}),
  status: z.enum(['draft', 'preview', 'published']).default('draft'),
}).superRefine((input, context) => {
  if (!getTemplateById(input.templateId)) {
    context.addIssue({
      code: 'custom',
      path: ['templateId'],
      message: 'Template is not registered.',
    });
    return;
  }

  validateContentForTemplate(
    input.templateId,
    input.content,
    input.status,
    context,
  );
});

export type WebsiteInput = z.infer<typeof websiteInputSchema>;
