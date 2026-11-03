'use client';

import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
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
  const [occasion, setOccasion] = useState<OccasionSlug | ''>(
    categories[0]?.slug ?? '',
  );
  const [packageId, setPackageId] = useState(packages[0]?.id ?? '');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  const availableTemplates = templates.filter((t) => t.category === occasion);
  const selectedTemplateObj = templates.find((t) => t.id === selectedTemplate);

  // Kalkulasi Harga Dinamis
  const selectedPackage = packages.find((item) => item.id === packageId);
  const basePrice = selectedPackage ? Number(selectedPackage.price) : 0;
  const isPremiumTemplate = (selectedTemplateObj as any)?.tier === 'premium';
  const premiumFee = isPremiumTemplate ? 20000 : 0;
  const totalPrice = basePrice + premiumFee;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const occasionFromUrl = params.get('occasion');
    const templateFromUrl = params.get('template');

    if (occasionFromUrl && categories.some((c) => c.slug === occasionFromUrl)) {
      setOccasion(occasionFromUrl as OccasionSlug);
    }
    if (templateFromUrl) {
      setSelectedTemplate(templateFromUrl);
    }
  }, []);

  function handleOccasionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setOccasion(e.target.value as OccasionSlug);
    setSelectedTemplate('');
  }

  async function handleOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setOrderError('');

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
        price: totalPrice, // Mengirim total harga yang sudah ditambahkan biaya premium
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('ORDER_CREATE_FAILED');

      const templateText = selectedTemplateObj
        ? ` dengan desain: *${selectedTemplateObj.name}*${isPremiumTemplate ? ' (Premium)' : ''}`
        : ' (belum menentukan desain)';

      const whatsappText = `Halo admin Truelove! Saya ${name}, mau pesan paket *${selectedPackage.name}* untuk acara *${selectedOccasion.name}*${templateText}.\n\nTotal Tagihan: *Rp${money.format(totalPrice)}*.\nMohon info pembayarannya ya.`;

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

      <section className="content-section">
        <Reveal>
          <p className="eyebrow">MOMEN SPESIAL</p>
          <h2>Pilih momen, temukan desainnya.</h2>
        </Reveal>
        <div className="category-grid">
          {categories.map((item) => (
            <Link
              href={`/explore/${item.slug}`}
              key={item.slug}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Reveal>
                <TiltCard className="category-card">
                  <span>{item.emoji}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="card-action">Eksplorasi Desain ➔</div>
                </TiltCard>
              </Reveal>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section bento-section alternate-light">
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

      {/* SECTION 4: FORM PEMESANAN */}
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
            <select value={occasion} onChange={handleOccasionChange}>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Desain Terpilih (Opsional)
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">-- Pilih Nanti / Konsultasi Dulu --</option>
              {availableTemplates.map((t) => {
                const isPremium = (t as any).tier === 'premium';
                return (
                  <option key={t.id} value={t.id}>
                    {t.name} {isPremium ? '✨ (+20rb)' : ''}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            Pilih Paket Dasar
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

          {/* Kotak Rincian Harga Dinamis */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '12px',
              padding: '16px',
              margin: '16px 0',
              fontSize: '0.95rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                color: '#555',
              }}
            >
              <span>Paket Dasar ({selectedPackage?.name})</span>
              <span>Rp{money.format(basePrice)}</span>
            </div>
            {isPremiumTemplate && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  color: '#d4af37',
                  fontWeight: '500',
                }}
              >
                <span>Add-on Desain Premium</span>
                <span>+ Rp{money.format(premiumFee)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px dashed #ccc',
                fontWeight: 'bold',
                color: '#111',
              }}
            >
              <span>Total Estimasi Pembayaran</span>
              <span>Rp{money.format(totalPrice)}</span>
            </div>
          </div>

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
