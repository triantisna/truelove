import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand light" href="/">TRUELOVE<span>.</span></Link>
        <p className="sidebar-label">ADMIN PANEL</p>
        <nav>
          <Link href="/admin">Overview</Link>
          <Link href="/admin/websites">Websites</Link>
          <Link href="/admin/websites/create">Create Website</Link>
          <Link href="/admin/setup">Database Setup</Link>
          <span className="disabled-link">Orders · next</span>
          <span className="disabled-link">Templates · next</span>
          <span className="disabled-link">Settings · next</span>
        </nav>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
