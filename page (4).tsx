import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import GlowOrbs from "@/components/motion/GlowOrbs";
import { categories } from "@/config/categories";
import { packages } from "@/config/packages";
import { templates } from "@/config/templates";

const money = new Intl.NumberFormat("id-ID");

export default function HomePage() {
  return (
    <main>
      <section className="hero motion-hero">
        <GlowOrbs />
        <nav className="public-nav">
          <Link href="/" className="brand">TRUELOVE<span>.</span></Link>
          <div className="nav-actions"><Link href="/for-melvina">Demo</Link><Link href="/admin" className="button small ghost">Admin</Link></div>
        </nav>
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">INTERACTIVE DIGITAL GIFT STUDIO</p>
            <h1>Give them a link<br />they&apos;ll remember.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hero-lead">TRUELOVE turns names, photos, words, and music into personalized romantic experiences.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="hero-actions">
              <Link className="button primary" href="/for-melvina">Open animated demo</Link>
              <Link className="button ghost" href="/admin/websites/create">Open generator</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="content-section">
        <Reveal><p className="eyebrow">OCCASIONS</p><h2>One platform, different moments.</h2></Reveal>
        <div className="category-grid">
          {categories.map((item) => (
            <Reveal key={item.slug}>
              <TiltCard className="category-card">
                <span>{item.emoji}</span><h3>{item.name}</h3><p>{item.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-section alternate">
        <Reveal><p className="eyebrow">TEMPLATE REGISTRY</p><h2>Templates are components, not separate websites.</h2></Reveal>
        <div className="template-list">
          {templates.map((template, index) => (
            <Reveal key={template.id} delay={Math.min(index * 0.035, 0.2)}>
              <div className="template-row">
                <div><span className="tiny-label">{template.category}</span><h3>{template.name}</h3></div>
                <p>{template.description}</p>
                <span className={template.active ? "badge active" : "badge"}>{template.active ? "Active" : "Planned"}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-section">
        <Reveal><p className="eyebrow">PACKAGES</p><h2>Simple choices. One engine underneath.</h2></Reveal>
        <div className="package-grid">
          {packages.map((item) => (
            <Reveal key={item.id}>
              <TiltCard className="package-card">
                <span className="price">Rp{money.format(item.price)}</span><h3>{item.name}</h3><p>{item.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
