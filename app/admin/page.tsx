import Link from "next/link";
import { integrationsReady } from "@/lib/env";
import { mockWebsites } from "@/lib/mock-data";

export default function AdminDashboard() {
  return (
    <main>
      <div className="admin-page-head"><div><p className="eyebrow">TRUELOVE ADMIN</p><h1>Overview</h1><p>Platform foundation is ready for the generator workflow.</p></div><Link className="button primary" href="/admin/websites/create">+ Create Website</Link></div>
      <div className="stat-grid">
        <div className="stat-card"><span>Websites</span><strong>{mockWebsites.length}</strong><small>mock mode</small></div>
        <div className="stat-card"><span>Published</span><strong>{mockWebsites.filter((item) => item.status === "published").length}</strong><small>ready to open</small></div>
        <div className="stat-card"><span>Supabase</span><strong>{integrationsReady.supabase ? "ON" : "OFF"}</strong><small>{integrationsReady.supabase ? "connected" : "using mock data"}</small></div>
        <div className="stat-card"><span>Cloudinary</span><strong>{integrationsReady.cloudinary ? "ON" : "OFF"}</strong><small>{integrationsReady.cloudinary ? "connected" : "media phase next"}</small></div>
      </div>
      <section className="admin-panel">
        <div className="panel-title"><div><h2>Architecture checkpoint</h2><p>What is already wired in this setup.</p></div></div>
        <div className="check-grid">
          <span>✓ Next.js App Router</span><span>✓ Dynamic /[slug]</span><span>✓ Admin layout</span><span>✓ Template Registry</span><span>✓ Package config</span><span>✓ Renderer map</span><span>✓ Supabase adapters</span><span>✓ Cloudinary adapter</span><span>✓ Mock fallback mode</span>
        </div>
      </section>
    </main>
  );
}
