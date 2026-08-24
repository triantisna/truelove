import Link from "next/link";
import { mockWebsites } from "@/lib/mock-data";

export default function WebsitesPage() {
  return (
    <main>
      <div className="admin-page-head"><div><p className="eyebrow">CONTENT</p><h1>Websites</h1><p>Mock data now; Supabase table will replace this list next.</p></div><Link className="button primary" href="/admin/websites/create">+ Create Website</Link></div>
      <section className="admin-panel table-panel">
        <div className="data-table">
          <div className="data-row data-head"><span>Slug</span><span>Template</span><span>Receiver</span><span>Status</span><span>Open</span></div>
          {mockWebsites.map((site) => <div className="data-row" key={site.id}><strong>/{site.slug}</strong><span>{site.templateId}</span><span>{site.receiverName}</span><span className={`badge ${site.status === "published" ? "active" : ""}`}>{site.status}</span><Link href={`/${site.slug}`}>View ↗</Link></div>)}
        </div>
      </section>
    </main>
  );
}
