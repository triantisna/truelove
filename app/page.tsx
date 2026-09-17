'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import GlowOrbs from '@/components/motion/GlowOrbs';
import { categories } from '@/config/categories';
import { packages } from '@/config/packages';
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

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('ORDER_CREATE_FAILED');

      const whatsappText = `Halo admin Truelove! Saya ${name}, mau pesan paket ${selectedPackage.name} untuk acara ${selectedOccasion.name}.`;
      window.open(
        `https://wa.me/6287804835801?text=${encodeURIComponent(whatsappText)}`,
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
            <Link href="/for-melvina">Demo Interaktif</Link>
          </div>
        </nav>
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">STUDIO HADIAH DIGITAL INTERAKTIF</p>
            <h1>
              Berikan mereka kejutan manis
              <br />
              melalui sebuah link.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hero-lead">
              TRUELOVE merangkai nama, foto, kata-kata, dan musik menjadi
              pengalaman romantis yang personal dan tak terlupakan.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="hero-actions">
              <Link className="button primary" href="/for-melvina">
                Lihat Demo Interaktif
              </Link>
              <Link className="button ghost" href="#order">
                Pesan Sekarang
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 1: MOMEN SPESIAL */}
      <section className="content-section">
        <Reveal>
          <p className="eyebrow">MOMEN SPESIAL</p>
          <h2>Pilih momen, temukan desainnya.</h2>
        </Reveal>
        <div className="category-grid">
          {categories.map((item) => (
            <Reveal key={item.slug}>
              <TiltCard className="category-card">
                <span>{item.emoji}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="card-action">Eksplorasi Desain ➔</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION 2: BENTO BOX (Cara Kerja & Paket Gabung dengan BG Beda) */}
      <section className="content-section bento-section alternate-light">
        {/* Kiri: Cara Kerja */}
        <div className="bento-left">
          <Reveal>
            <p className="eyebrow">CARA KERJA</p>
            <h2>Website siap dalam 3 langkah mudah.</h2>
          </Reveal>
          <div className="steps-vertical">
            <Reveal delay={0.1}>
              <div className="step-item">
                <div className="step-num">01</div>
                <div>
                  <h4>Pilih Paket & Desain</h4>
                  <p>Temukan yang paling pas untuk momenmu.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="step-item">
                <div className="step-num">02</div>
                <div>
                  <h4>Kirim Materi via WA</h4>
                  <p>Kirim foto, teks, dan lagu favorit kalian.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="step-item">
                <div className="step-num">03</div>
                <div>
                  <h4>Link Siap Dibagikan</h4>
                  <p>Kejutan manismu siap dinikmati olehnya.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Kanan: Paket Harga (Grid 3 Kolom) */}
        <div className="bento-right">
          <Reveal>
            <p className="eyebrow">PAKET HARGA</p>
            <h2>Transparan, tanpa biaya tersembunyi.</h2>
          </Reveal>
          <div className="bento-packages">
            {packages.map((item, index) => {
              const isPopular =
                item.name.includes('Premium') ||
                item.name.includes('Pro') ||
                index === 1;
              return (
                <Reveal key={item.id} delay={0.1 * index}>
                  <div
                    className={`bento-package-card ${
                      isPopular ? 'popular' : ''
                    }`}
                  >
                    <div className="bento-package-head">
                      <h3>{item.name}</h3>
                      <span className="price">
                        Rp{money.format(item.price)}
                      </span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: FORM PEMESANAN (Dark Wine BG) */}
      <section id="order" className="content-section alternate">
        <Reveal>
          <p className="eyebrow">PESAN SEKARANG</p>
          <h2>Ciptakan momen tak terlupakan hari ini.</h2>
        </Reveal>
        <form className="order-form" onSubmit={handleOrder}>
          <label>
            Nama Lengkap
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
            />
          </label>
          <label>
            Nomor WhatsApp
            <input
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 081234567890"
            />
          </label>
          <label>
            Pilih Acara/Momen
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as OccasionSlug)}
            >
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Pilih Paket
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
            >
              {packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — Rp{money.format(item.price)}
                </option>
              ))}
            </select>
          </label>
          {orderError && <p role="alert">{orderError}</p>}
          <button
            className="button primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Mengirim…' : 'Pesan via WhatsApp'}
          </button>
        </form>
      </section>
    </main>
  );
}
