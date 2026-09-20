import { notFound } from 'next/navigation';
import { getTemplateById } from '@/config/templates';
import { WebsiteRenderer } from '@/lib/website-renderer';
import type { WebsiteRecord } from '@/types/website';

export default async function DemoPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    notFound();
  }

  // Kita suntikkan "Dummy Data" biar tampilannya langsung cantik
  const mockWebsite: WebsiteRecord = {
    id: 'demo-123',
    slug: `demo-${template.id}`,
    templateId: template.id,
    packageId: 'premium',
    status: 'published',
    senderName: 'Arzaniel',
    receiverName: 'Melvina',
    title: 'A Special Gift',
    message:
      'This is a demo message. In the real website, this will be replaced with your heartfelt words.',
    theme: 'romantic',
    createdAt: new Date().toISOString(),
    media: [],
    content: (template as any).mockData || {},
  };

  return <WebsiteRenderer website={mockWebsite} />;
}
