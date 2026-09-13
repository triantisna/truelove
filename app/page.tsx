'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import GlowOrbs from '@/components/motion/GlowOrbs';
import { categories } from '@/config/categories';
import { packages } from '@/config/packages';
import { templates } from '@/config/templates';
import type { OccasionSlug } from '@/types/template';

const money = new Intl.NumberFormat('id-ID');

export default function HomePage() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [occasion, setOccasion] = useState(categories[0]?.slug ?? '');
  const [packageId, setPackageId] = useState(packages[0]?.id ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  async function handleOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setOrderError('');

    const selectedPackage = packages.find((item) => item.id === packageId);
    const selectedOccasion = categories.find((item) => item.slug === occasion);

    if (!selectedPackage || !selectedOccasion) {
      setOrderError('Paket atau acara belum dipilih.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        customerName: name,
        customerWhatsapp: whatsapp,
        occasion: selectedOccasion.name,
        packageId: selectedPackage.id,
        price: Number(selectedPackage.price),
      };

      console.log('Sending payload:', payload);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('ORDER_CREATE_FAILED');
      }

      const whatsappText = `Halo admin Truelove! Saya ${name}, mau pesan paket ${selectedPackage.name} untuk acara ${selectedOccasion.name}.`;
      const encodedText = encodeURIComponent(whatsappText);

      window.open(
        `https://wa.me/6287804835801?text=${encodedText}`,
        '_blank',
      );
    } catch {
      setOrderError('Pesanan gagal dibuat. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="hero motion-hero">
        <GlowOrbs />
        <nav className="public-nav">
          <Link href="/" className="brand">
            TRUELOVE<span>.</span>
          </Link>
          <div className="nav-actions">
            <Link href="/for-melvina">Demo</Link>
            <Link href="/admin" className="button small ghost">
              Admin
            </Link>
          </div>
        </nav>
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">INTERACTIVE DIGITAL GIFT STUDIO</p>
            <h1>
              Give them a link
              <br />
              they&apos;ll remember.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hero-lead">
              TRUELOVE turns names, photos, words, and music into personalized
              romantic experiences.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="hero-actions">
              <Link className="button primary" href="/for-melvina">
                Open animated demo
              </Link>
              <Link className="button ghost" href="/admin/websites/create">
                Open generator
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="content-section">
        <Reveal>
          <p className="eyebrow">OCCASIONS</p>
          <h2>One platform, different moments.</h2>
        </Reveal>
        <div className="category-grid">
          {categories.map((item) => (
            <Reveal key={item.slug}>
              <TiltCard className="category-card">
                <span>{item.emoji}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-section alternate">
        <Reveal>
          <p className="eyebrow">TEMPLATE REGISTRY</p>
          <h2>Templates are components, not separate websites.</h2>
        </Reveal>
        <div className="template-list">
          {templates.map((template, index) => (
            <Reveal key={template.id} delay={Math.min(index * 0.035, 0.2)}>
              <div className="template-row">
                <div>
                  <span className="tiny-label">{template.category}</span>
                  <h3>{template.name}</h3>
                </div>
                <p>{template.description}</p>
                <span className={template.active ? 'badge active' : 'badge'}>
                  {template.active ? 'Active' : 'Planned'}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-section">
        <Reveal>
          <p className="eyebrow">PACKAGES</p>
          <h2>Simple choices. One engine underneath.</h2>
        </Reveal>
        <div className="package-grid">
          {packages.map((item) => (
            <Reveal key={item.id}>
              <TiltCard className="package-card">
                <span className="price">Rp{money.format(item.price)}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-section alternate">
        <Reveal>
          <p className="eyebrow">ORDER NOW</p>
          <h2>Make your moment unforgettable.</h2>
        </Reveal>
        <form className="order-form" onSubmit={handleOrder}>
          <label>
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </label>
          <label>
            WhatsApp
            <input
              required
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </label>
          <label>
            Occasion
            <select
              value={occasion}
              onChange={(event) =>
                setOccasion(event.target.value as OccasionSlug)
              }
            >
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Package
            <select value={packageId} onChange={(event) => setPackageId(event.target.value)}>
              {packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — Rp{money.format(item.price)}
                </option>
              ))}
            </select>
          </label>
          {orderError ? <p role="alert">{orderError}</p> : null}
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Pesan via WhatsApp'}
          </button>
        </form>
      </section>
    </main>
  );
}
