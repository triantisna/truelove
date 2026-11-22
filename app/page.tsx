'use client';

// @ts-expect-error CSS side-effect imports are handled by Next.js.
import './landing.css';
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

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l.9-4.2A8 8 0 1 1 20 12z" />
    </svg>
  );
}

/* Elemen visual utama hero: amplop yang terbuka saat segelnya diketuk */
function HeroEnvelope() {
  const [open, setOpen] = useState(false);

  return (
    <div className="tl-env-stage">
      <button
        type="button"
        className={`tl-env ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-pressed={open}
        aria-label={open ? 'Tutup amplop' : 'Buka amplop'}
      >
        <span className="tl-env-back" />
        <span className="tl-env-paper">
          <span className="tl-paper-title">
            Untuk kamu, yang paling kusayang
          </span>
          <span className="tl-paper-body">
            Ada kejutan kecil yang kusiapkan, hanya untukmu.
          </span>
          <span className="tl-paper-heart">♥</span>
        </span>
        <span className="tl-env-front" />
        <span className="tl-env-flap" />
        <span className="tl-env-seal">♥</span>
      </button>
      <p className="tl-env-hint" aria-live="polite">
        {open ? 'Ketuk untuk menutup kembali' : 'Ketuk segelnya untuk membuka'}
      </p>
    </div>
  );
}

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

  // Harga terendah (hanya turunan dari data paket, untuk catatan di hero)
  const minPrice = packages.length
    ? Math.min(...packages.map((p) => Number(p.price)))
    : 0;

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
    <main className="tl">
      {/* ============ NAV + HERO ============ */}
      <header className="tl-nav">
        <div className="tl-wrap tl-nav-inner">
          <Link href="/" className="tl-brand">
            TRUELOVE<span>.</span>
          </Link>
          <nav className="tl-nav-links" aria-label="Navigasi utama">
            <a href="#momen">Momen</a>
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#paket">Paket</a>
          </nav>
          <div className="tl-nav-actions">
            <Link
              className="tl-btn tl-btn-ghost tl-btn-sm tl-hide-sm"
              href="/for-melvina"
            >
              Demo Interaktif
            </Link>
            <Link className="tl-btn tl-btn-primary tl-btn-sm" href="#order">
              Pesan
            </Link>
          </div>
        </div>
      </header>

      <section className="tl-hero">
        <GlowOrbs />
        <div className="tl-wrap tl-hero-grid">
          <div className="tl-hero-copy">
            <Reveal>
              <p className="tl-kicker">Studio hadiah digital interaktif</p>
              <h1>Berikan mereka kejutan manis melalui sebuah link.</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="tl-lead">
                TRUELOVE merangkai nama, foto, kata-kata, dan musik menjadi
                pengalaman romantis yang personal dan tak terlupakan.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="tl-hero-actions">
                <Link className="tl-btn tl-btn-primary" href="/for-melvina">
                  Lihat Demo Interaktif
                </Link>
                <Link className="tl-btn tl-btn-ghost" href="#order">
                  Pesan Sekarang
                </Link>
              </div>
              {minPrice > 0 && (
                <p className="tl-price-note">
                  Paket mulai dari <strong>Rp{money.format(minPrice)}</strong>
                </p>
              )}
            </Reveal>
          </div>
          <Reveal delay={0.25} className="tl-hero-visual">
            <HeroEnvelope />
          </Reveal>
        </div>
      </section>

      {/* ============ MOMEN ============ */}
      <section id="momen" className="tl-section">
        <div className="tl-wrap">
          <Reveal>
            <p className="tl-kicker">Momen spesial</p>
            <h2 className="tl-h2">Pilih momen, temukan desainnya.</h2>
          </Reveal>
          <div className="tl-cat-grid">
            {categories.map((item) => (
              <Link href={`/explore/${item.slug}`} key={item.slug}>
                <Reveal className="tl-fill">
                  <TiltCard className="tl-cat-card">
                    <div className="tl-cat-top">
                      <span className="tl-cat-emoji">{item.emoji}</span>
                      <span className="tl-cat-go" aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </div>
                    <div className="tl-cat-body">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <span className="tl-cat-cta">Eksplorasi Desain</span>
                    </div>
                  </TiltCard>
                </Reveal>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CARA KERJA ============ */}
      <section id="cara-kerja" className="tl-section tl-steps-section">
        <div className="tl-wrap">
          <Reveal>
            <p className="tl-kicker">Cara kerja</p>
            <h2 className="tl-h2">Website siap dalam 3 langkah mudah.</h2>
          </Reveal>
          <div className="tl-steps">
            <Reveal delay={0.1} className="tl-fill">
              <div className="tl-step">
                <div className="tl-step-num">1</div>
                <h4>Pilih Paket & Desain</h4>
                <p>Temukan yang paling pas untuk momenmu.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2} className="tl-fill">
              <div className="tl-step">
                <div className="tl-step-num">2</div>
                <h4>Kirim Materi via WA</h4>
                <p>Kirim foto, teks, dan lagu favorit kalian.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3} className="tl-fill">
              <div className="tl-step">
                <div className="tl-step-num">3</div>
                <h4>Link Siap Dibagikan</h4>
                <p>Kejutan manismu siap dinikmati olehnya.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ PAKET ============ */}
      <section id="paket" className="tl-section">
        <div className="tl-wrap">
          <Reveal>
            <p className="tl-kicker">Paket harga</p>
            <h2 className="tl-h2">Transparan, tanpa biaya tersembunyi.</h2>
          </Reveal>

          <div className="tl-pack-grid">
            {packages.map((item, index) => {
              const isPopular = item.id === 'paket-murah';
              const isSelected = packageId === item.id;

              return (
                <Reveal key={item.id} delay={0.08 * index} className="tl-fill">
                  <div
                    className={`tl-pack ${isPopular ? 'popular' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                  >
                    {isPopular && (
                      <span className="tl-pack-badge">Paling diminati</span>
                    )}

                    <h3>{item.name}</h3>

                    <span className="tl-pack-price">
                      Rp{money.format(item.price)}
                    </span>

                    <p className="tl-pack-desc">{item.description}</p>

                    {item.features && item.features.length > 0 && (
                      <ul className="tl-pack-features">
                        {item.features.map((feature: string) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    )}

                    <Link
                      href="#order"
                      className="tl-pack-cta"
                      onClick={() => setPackageId(item.id)}
                    >
                      {isSelected ? 'Paket terpilih' : 'Pilih paket ini'}
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FORM PEMESANAN ============ */}
      <section id="order" className="tl-section tl-order">
        <div className="tl-wrap tl-order-grid">
          <Reveal className="tl-order-intro">
            <p className="tl-kicker">Pesan sekarang</p>
            <h2 className="tl-h2">Ciptakan momen tak terlupakan hari ini.</h2>
            <p className="tl-order-lead">
              Isi data singkat di samping. Setelah itu kamu akan diarahkan ke
              WhatsApp admin untuk info pembayaran dan pengiriman materi.
            </p>
          </Reveal>

          <form className="tl-form" onSubmit={handleOrder}>
            <label className="tl-field">
              <span className="tl-label">Nama</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                autoComplete="name"
              />
            </label>
            <label className="tl-field">
              <span className="tl-label">Nomor WhatsApp</span>
              <input
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 081234567890"
                inputMode="tel"
                autoComplete="tel"
              />
            </label>

            <label className="tl-field">
              <span className="tl-label">Pilih Acara/Momen</span>
              <select value={occasion} onChange={handleOccasionChange}>
                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="tl-field">
              <span className="tl-label">Desain Terpilih (Opsional)</span>
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

            <label className="tl-field tl-full">
              <span className="tl-label">Pilih Paket Dasar</span>
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

            {/* Rincian Harga Dinamis */}
            <div className="tl-summary tl-full">
              <div className="tl-sum-row">
                <span>Paket Dasar ({selectedPackage?.name})</span>
                <span>Rp{money.format(basePrice)}</span>
              </div>
              {isPremiumTemplate && (
                <div className="tl-sum-row tl-sum-premium">
                  <span>Add-on Desain Premium</span>
                  <span>+ Rp{money.format(premiumFee)}</span>
                </div>
              )}
              <div className="tl-sum-total">
                <span>Total Estimasi Pembayaran</span>
                <strong>Rp{money.format(totalPrice)}</strong>
              </div>
            </div>

            {orderError && (
              <p className="tl-error tl-full" role="alert">
                {orderError}
              </p>
            )}
            <button
              className="tl-btn tl-btn-primary tl-submit tl-full"
              type="submit"
              disabled={submitting}
            >
              <ChatIcon />
              {submitting ? 'Mengirim…' : 'Pesan via WhatsApp'}
            </button>
          </form>
        </div>
      </section>

      <footer className="tl-footer">
        <div className="tl-wrap tl-footer-inner">
          <span className="tl-brand">
            TRUELOVE<span>.</span>
          </span>
          <p>Hadiah digital untuk orang tersayang.</p>
        </div>
      </footer>
    </main>
  );
}
