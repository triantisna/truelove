import { databaseDiagnostics } from "@/lib/db-health";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const db = await databaseDiagnostics();
  const hasDirectUrl = Boolean(process.env.DIRECT_URL);

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">PHASE 2B</p>
          <h1>Database Setup</h1>
          <p>Checklist koneksi Prisma → Supabase PostgreSQL untuk TRUELOVE.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>DATABASE_URL</span>
          <strong>{db.configured ? "SET" : "MISSING"}</strong>
          <small>runtime / Vercel</small>
        </div>
        <div className="stat-card">
          <span>DIRECT_URL</span>
          <strong>{hasDirectUrl ? "SET" : "MISSING"}</strong>
          <small>Prisma migrate / seed</small>
        </div>
        <div className="stat-card">
          <span>Database</span>
          <strong>{db.connected ? "ONLINE" : "OFFLINE"}</strong>
          <small>{db.connected ? "Prisma query OK" : "check connection"}</small>
        </div>
        <div className="stat-card">
          <span>Seed</span>
          <strong>{db.seeded ? "READY" : "WAITING"}</strong>
          <small>{db.counts.templates} templates · {db.counts.packages} packages</small>
        </div>
      </div>

      <section className="admin-panel">
        <div className="panel-title">
          <h2>Connection diagnostics</h2>
          <p>{db.message}</p>
        </div>
        <div className="check-grid">
          <span>{db.configured ? "✓" : "○"} Runtime DATABASE_URL</span>
          <span>{hasDirectUrl ? "✓" : "○"} Migration DIRECT_URL</span>
          <span>{db.connected ? "✓" : "○"} Prisma can query PostgreSQL</span>
          <span>{db.seeded ? "✓" : "○"} Template + Package seed</span>
          <span>{db.connected ? `✓ ${db.counts.websites} website records` : "○ Website records"}</span>
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-title">
          <h2>Urutan aktivasi</h2>
          <p>Lakukan sekali untuk database baru.</p>
        </div>
        <div className="check-grid">
          <span>1. Buat project Supabase</span>
          <span>2. Buat role `prisma` + permission</span>
          <span>3. Isi DIRECT_URL lokal</span>
          <span>4. Jalankan npm run db:migrate</span>
          <span>5. Jalankan npm run db:seed</span>
          <span>6. Isi DATABASE_URL di Vercel</span>
          <span>7. Redeploy dan buka halaman ini</span>
          <span>8. Test Create Website → Publish</span>
        </div>
      </section>
    </main>
  );
}
