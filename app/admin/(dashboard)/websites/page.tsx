import Link from 'next/link';

import { listWebsites } from '@/lib/websites';

export const dynamic = 'force-dynamic';

export default async function WebsitesPage() {
  const websites = await listWebsites();

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">CONTENT</p>

          <h1>Websites</h1>

          <p>Manage drafts and published customer websites.</p>
        </div>

        <Link className="button primary" href="/admin/websites/create">
          + Create Website
        </Link>
      </div>

      <section className="admin-panel table-panel">
        <div className="data-table">
          <div className="data-row data-head">
            <span>Slug</span>

            <span>Template</span>

            <span>Receiver</span>

            <span>Status</span>

            <span>Actions</span>
          </div>

          {websites.map((site) => (
            <div className="data-row" key={site.id}>
              <strong>/{site.slug}</strong>

              <span>{site.templateId}</span>

              <span>{site.receiverName}</span>

              <span
                className={`badge ${
                  site.status === 'published' ? 'active' : ''
                }`}
              >
                {site.status}
              </span>

              <span className="table-actions">
                <Link href={`/admin/websites/${site.id}/edit`}>Edit</Link>

                {site.status === 'published' ? (
                  <Link href={`/${site.slug}`} target="_blank">
                    View ↗
                  </Link>
                ) : (
                  <span className="muted">Draft</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
