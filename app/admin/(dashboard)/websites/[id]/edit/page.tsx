import { notFound } from 'next/navigation';

import EditWebsiteForm from '@/components/admin/EditWebsiteForm';

import { getWebsiteById } from '@/lib/websites';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWebsitePage({ params }: PageProps) {
  const { id } = await params;

  const website = await getWebsiteById(id);

  if (!website) {
    notFound();
  }

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">EDIT WEBSITE</p>

          <h1>/{website.slug}</h1>

          <p>Update your draft, then publish when it is ready.</p>
        </div>
      </div>

      <EditWebsiteForm website={website} />
    </main>
  );
}
