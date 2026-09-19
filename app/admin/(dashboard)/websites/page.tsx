import Link from 'next/link';
import { listWebsites } from '@/lib/websites';
// 1. IMPORT KOMPONEN BARU DI SINI
import QRModalAction from '@/components/admin/QRModalAction';

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
          <div className="data-row websites-row data-head">
            <span>Slug</span>
            <span>Template</span>
            <span>Receiver</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {websites.map((site) => (
            <div className="data-row websites-row" key={site.id}>
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
              <span
                className="table-actions"
                style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
              >
                {/* 2. PASANG TOMBOL QR DI SEBELAH KIRI EDIT */}
                <QRModalAction slug={site.slug} />

                <Link
                  href={`/admin/websites/${site.id}/edit`}
                  style={{ fontWeight: '600', textDecoration: 'underline' }}
                >
                  Edit
                </Link>
                {site.status === 'published' ? (
                  <Link href={`/${site.slug}`} target="_blank">
                    View ↗
                  </Link>
                ) : (
                  <span className="muted" style={{ fontSize: '0.85rem' }}>
                    (Draft)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
