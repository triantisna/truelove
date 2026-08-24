import Link from "next/link";
import { categories } from "@/config/categories";
import { packages } from "@/config/packages";
import { templates } from "@/config/templates";

const money = new Intl.NumberFormat("id-ID");

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <nav className="public-nav">
          <Link href="/" className="brand">TRUELOVE<span>.</span></Link>
          <div className="nav-actions"><Link href="/for-melvina">Demo</Link><Link href="/admin" className="button small ghost">Admin</Link></div>
        </nav>
        <div className="hero-copy">
          <p className="eyebrow">INTERACTIVE DIGITAL GIFT STUDIO</p>
          <h1>Give them a link<br />they&apos;ll remember.</h1>
          <p>TRUELOVE turns names, photos, words, and music into personalized romantic experiences.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/for-melvina">Open engine demo</Link>
            <Link className="button ghost" href="/admin/websites/create">Open generator</Link>
          </div>
        </div>
      </section>

      <section className="content-section">
        <p className="eyebrow">OCCASIONS</p>
        <h2>One platform, different moments.</h2>
        <div className="category-grid">
          {categories.map((item) => <article className="category-card" key={item.slug}><span>{item.emoji}</span><h3>{item.name}</h3><p>{item.description}</p></article>)}
        </div>
      </section>

      <section className="content-section alternate">
        <p className="eyebrow">TEMPLATE REGISTRY</p>
        <h2>Templates are components, not separate websites.</h2>
        <div className="template-list">
          {templates.map((template) => (
            <div className="template-row" key={template.id}>
              <div><span className="tiny-label">{template.category}</span><h3>{template.name}</h3></div>
              <p>{template.description}</p>
              <span className={template.active ? "badge active" : "badge"}>{template.active ? "Active" : "Planned"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <p className="eyebrow">PACKAGES</p>
        <h2>Pricing lives in config.</h2>
        <div className="package-grid">
          {packages.map((item) => <article className="package-card" key={item.id}><span className="price">Rp{money.format(item.price)}</span><h3>{item.name}</h3><p>{item.description}</p></article>)}
        </div>
      </section>
    </main>
  );
}
