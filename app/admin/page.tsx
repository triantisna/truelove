import Link from "next/link";
import { integrationsReady } from "@/lib/env";
import { websiteStats } from "@/lib/websites";

export default async function AdminDashboard() {
  const stats = await websiteStats();

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">TRUELOVE ADMIN</p>
          <h1>Overview</h1>
          <p>Phase 2: Prisma + Supabase PostgreSQL + reusable animation system.</p>
        </div>
        <Link className="button primary" href="/admin/websites/create">+ Create Website</Link>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><span>Websites</span><strong>{stats.total}</strong><small>{stats.mode === "database" ? "database" : "mock fallback"}</small></div>
        <div className="stat-card"><span>Published</span><strong>{stats.published}</strong><small>public gifts</small></div>
        <div className="stat-card"><span>Prisma DB</span><strong>{integrationsReady.prisma ? "ON" : "OFF"}</strong><small>{integrationsReady.prisma ? "runtime ready" : "add DATABASE_URL"}</small></div>
        <div className="stat-card"><span>Cloudinary</span><strong>{integrationsReady.cloudinary ? "ON" : "OFF"}</strong><small>{integrationsReady.cloudinary ? "connected" : "upload phase next"}</small></div>
      </div>

      <section className="admin-panel">
        <div className="panel-title"><h2>Phase 2 checkpoint</h2><p>Core systems now included in this build.</p></div>
        <div className="check-grid">
          <span>✓ Prisma 7 architecture</span>
          <span>✓ Supabase PostgreSQL target</span>
          <span>✓ Runtime pooled DB URL</span>
          <span>✓ Direct migration URL</span>
          <span>✓ Database seed</span>
          <span>✓ Dynamic /[slug]</span>
          <span>✓ API create website</span>
          <span>✓ Motion component library</span>
          <span>✓ 3D template effects</span>
        </div>
      </section>
    </main>
  );
}
