'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';
import type { WebsiteRecord } from '@/types/website';

type ContentValue = Record<string, unknown>;

function getString(content: ContentValue, key: string, fallback = ''): string {
  const value = content[key];
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function getMediaUrl(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object' && value !== null && 'url' in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === 'string' ? url.trim() : '';
  }
  return '';
}

function getMediaList(content: ContentValue, key: string): string[] {
  const value = content[key];
  if (Array.isArray(value)) {
    return value.map((item) => getMediaUrl(item)).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim() !== '') return [value.trim()];
  return [];
}

interface GalleryItem {
  src: string;
  caption: string;
  label: string;
}

export default function OurStory07({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [openSpecimens, setOpenSpecimens] = useState<Record<number, boolean>>({
    0: true,
  });
  const [activeSeason, setActiveSeason] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [tomorrowOpened, setTomorrowOpened] = useState(false);

  const content = (website.content ?? {}) as ContentValue;

  const senderName = getString(
    content,
    'senderName',
    website.senderName || 'Aku',
  );
  const receiverName = getString(
    content,
    'receiverName',
    website.receiverName || 'Kamu',
  );
  const coupleNames = `${senderName} & ${receiverName}`;

  const archiveNumber = getString(
    content,
    'archiveNumber',
    'ARCHIVE NO. 07 · PRESSED IN TIME',
  );
  const openingLine = getString(
    content,
    'openingLine',
    'Beberapa momen terlalu rapuh jika hanya diserahkan pada ingatan—jadi kuawetkan semuanya di sini.',
  );
  const writtenDate = getString(content, 'writtenDate', '');

  const specimens = useMemo(() => {
    return [1, 2, 3, 4]
      .map((n) => ({
        code: `SPECIMEN 0${n}`,
        label: getString(content, `specimen${n}Label`),
        meta: getString(content, `specimen${n}Meta`),
        story: getString(content, `specimen${n}Story`),
      }))
      .filter((s) => s.label || s.story);
  }, [content]);

  const letterTitle = getString(
    content,
    'letterTitle',
    'Untuk Semua Musim yang Kita Lewati Bersama',
  );
  const letterBody = getString(
    content,
    'letterBody',
    website.message ||
      'Di sini aku simpan potongan-potongan perjalanan kita agar selalu hangat setiap kali kita membacanya kembali.',
  );
  const letterParagraphs = useMemo(
    () =>
      letterBody
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    [letterBody],
  );

  const seasons = useMemo(() => {
    return [1, 2, 3, 4]
      .map((n) => ({
        number: `0${n}`,
        when: getString(content, `season${n}When`),
        title: getString(content, `season${n}Title`),
        story: getString(content, `season${n}Story`),
      }))
      .filter((s) => s.title || s.story);
  }, [content]);

  const mainPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.mainPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.mainPhoto, website.media]);

  const mainPhotoCaption = getString(
    content,
    'mainPhotoCaption',
    'Arsip Utama No. 01 — Momen hangat yang selalu ingin kuulang.',
  );

  const galleryPhotos = useMemo(() => {
    const fromContent = getMediaList(content, 'galleryPhotos');
    if (fromContent.length > 0) return fromContent.slice(0, 6);
    return (website.media ?? [])
      .filter((item) => item.type === 'image')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(mainPhoto ? 1 : 0, mainPhoto ? 7 : 6)
      .map((item) => item.url);
  }, [content, website.media, mainPhoto]);

  const galleryCaptions = useMemo(
    () =>
      getString(content, 'galleryCaptions', '')
        .split('\n')
        .map((c) => c.trim()),
    [content],
  );

  const allPhotos: GalleryItem[] = useMemo(() => {
    const items: GalleryItem[] = [];
    if (mainPhoto) {
      items.push({
        src: mainPhoto,
        caption: mainPhotoCaption,
        label: 'FOLIO NO. 01',
      });
    }
    galleryPhotos.forEach((src, idx) => {
      const num = String(idx + (mainPhoto ? 2 : 1)).padStart(2, '0');
      items.push({
        src,
        caption: galleryCaptions[idx] || `Lembar No. ${num}`,
        label: `FOLIO NO. ${num}`,
      });
    });
    return items;
  }, [mainPhoto, mainPhotoCaption, galleryPhotos, galleryCaptions]);

  const signature = getString(content, 'signature', senderName);
  const tomorrowTitle = getString(
    content,
    'tomorrowTitle',
    'Benih Kecil untuk Musim-Musim Berikutnya',
  );
  const tomorrowText = getString(
    content,
    'tomorrowText',
    'Masih banyak halaman kosong di buku arsip ini yang ingin terus kuisi bersamamu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const toggleSpecimen = (idx: number) => {
    setOpenSpecimens((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || allPhotos.length === 0) return null;
      return (prev - 1 + allPhotos.length) % allPhotos.length;
    });
  }, [allPhotos.length]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || allPhotos.length === 0) return null;
      return (prev + 1) % allPhotos.length;
    });
  }, [allPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, closeLightbox, prevPhoto, nextPhoto]);

  const safeActiveSeason = activeSeason < seasons.length ? activeSeason : 0;

  return (
    <main className="pt7-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE LINEN BINDING (OPENING SCREEN) --- */
          <motion.section
            key="pt7-cover"
            className="pt7-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.65 }}
          >
            <motion.div
              className="pt7-book-card"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Pita Sage Vertikal Halus */}
              <div className="pt7-ribbon-line" aria-hidden="true" />

              <div className="pt7-book-inner">
                <span className="pt7-archive-code">{archiveNumber}</span>

                <h1 className="pt7-cover-title">{coupleNames}</h1>

                <div className="pt7-clay-dot" aria-hidden="true" />

                <p className="pt7-cover-line">{openingLine}</p>

                <div className="pt7-cover-meta">
                  <span>UNTUK {receiverName}</span>
                  <span>·</span>
                  <span>DARI {senderName}</span>
                </div>

                <motion.button
                  type="button"
                  className="pt7-btn-sage"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Lepas Pita &amp; Buka Arsip →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI ARSIP HERBARIUM --- */
          <motion.div
            key="pt7-content"
            className="pt7-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="pt7-container">
              {/* Top Header */}
              <header className="pt7-header">
                <span className="pt7-header-names">{coupleNames}</span>
                <span className="pt7-header-code">{archiveNumber}</span>
              </header>

              {/* Hero Title */}
              <section className="pt7-hero">
                <span className="pt7-eyebrow">SUNLIT BOTANICAL ARCHIVE</span>
                <h1 className="pt7-hero-title">Pressed in Time</h1>
                <p className="pt7-hero-sub">{openingLine}</p>
              </section>

              {/* 02: PRESSED SPECIMENS (INTERACTIVE CARDS) */}
              {specimens.length > 0 && (
                <section className="pt7-section">
                  <div className="pt7-sec-head">
                    <span className="pt7-eyebrow">01 · PRESSED SPECIMENS</span>
                    <h2 className="pt7-sec-title">
                      Potongan Kecil yang Diawetkan
                    </h2>
                    <p className="pt7-sec-desc">
                      Ketuk setiap kartu indeks untuk membuka cerita yang
                      tersimpan di dalamnya.
                    </p>
                  </div>

                  <div className="pt7-specimen-grid">
                    {specimens.map((sp, idx) => {
                      const isOpen = !!openSpecimens[idx];
                      return (
                        <div
                          key={sp.code}
                          className={`pt7-specimen-card ${isOpen ? 'is-open' : ''}`}
                        >
                          <button
                            type="button"
                            className="pt7-specimen-trigger"
                            onClick={() => toggleSpecimen(idx)}
                            aria-expanded={isOpen}
                          >
                            <div className="pt7-specimen-top">
                              <span className="pt7-specimen-code">
                                {sp.code}
                              </span>
                              <span className="pt7-specimen-toggle">
                                {isOpen ? 'TUTUP −' : 'BUKA +'}
                              </span>
                            </div>
                            <span className="pt7-specimen-label">
                              {sp.label}
                            </span>
                            {sp.meta && (
                              <span className="pt7-specimen-meta">
                                {sp.meta}
                              </span>
                            )}
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && sp.story && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className="pt7-specimen-body">
                                  <p>{sp.story}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 03: THE ARCHIVE LETTER */}
              <section className="pt7-section">
                <div className="pt7-letter-sheet">
                  <div className="pt7-letter-inner">
                    <div className="pt7-letter-top">
                      <span>02 · THE ARCHIVE LETTER</span>
                      {writtenDate && <span>{writtenDate}</span>}
                    </div>

                    <h2 className="pt7-letter-title">{letterTitle}</h2>
                    <p className="pt7-letter-salutation">
                      Untuk {receiverName},
                    </p>

                    <div className="pt7-letter-body">
                      {letterParagraphs.map((p, idx) => (
                        <p
                          key={idx}
                          className={idx === 0 ? 'pt7-dropcap' : undefined}
                        >
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="pt7-letter-sign">
                      <span>Dengan hangat yang sama,</span>
                      <strong>{signature}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* 04: SEASONS OF US (INTERACTIVE TABS) */}
              {seasons.length > 0 && (
                <section className="pt7-section">
                  <div className="pt7-sec-head">
                    <span className="pt7-eyebrow">03 · SEASONS OF US</span>
                    <h2 className="pt7-sec-title">
                      Musim-Musim yang Kita Lewati
                    </h2>
                  </div>

                  <div
                    className="pt7-season-tabs"
                    role="tablist"
                    aria-label="Musim Perjalanan"
                  >
                    {seasons.map((season, idx) => {
                      const active = idx === safeActiveSeason;
                      return (
                        <button
                          key={season.number}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`pt7-season-tab ${active ? 'is-active' : ''}`}
                          onClick={() => setActiveSeason(idx)}
                        >
                          Musim {season.number}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt7-season-stage">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={safeActiveSeason}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        {seasons[safeActiveSeason].when && (
                          <span className="pt7-season-when">
                            {seasons[safeActiveSeason].when}
                          </span>
                        )}
                        <h3 className="pt7-season-title">
                          {seasons[safeActiveSeason].title}
                        </h3>
                        <p className="pt7-season-story">
                          {seasons[safeActiveSeason].story}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* 05: SUNLIT FRAMES (GALLERY + LIGHTBOX) */}
              {allPhotos.length > 0 && (
                <section className="pt7-section">
                  <div className="pt7-sec-head">
                    <span className="pt7-eyebrow">04 · SUNLIT FRAMES</span>
                    <h2 className="pt7-sec-title">Lembaran Foto Katalog</h2>
                    <p className="pt7-sec-desc">
                      Ketuk foto mana saja untuk melihatnya lebih dekat.
                    </p>
                  </div>

                  {mainPhoto && (
                    <button
                      type="button"
                      className="pt7-frame pt7-frame-hero"
                      onClick={() => setLightboxIndex(0)}
                    >
                      <div className="pt7-frame-media">
                        <img
                          src={mainPhoto}
                          alt={mainPhotoCaption}
                          className="pt7-img-hero"
                        />
                      </div>
                      <div className="pt7-frame-meta">
                        <span className="pt7-frame-code">FOLIO NO. 01</span>
                        <span className="pt7-frame-caption">
                          {mainPhotoCaption}
                        </span>
                      </div>
                    </button>
                  )}

                  {galleryPhotos.length > 0 && (
                    <div className="pt7-gallery-grid">
                      {galleryPhotos.map((src, idx) => {
                        const globalIdx = mainPhoto ? idx + 1 : idx;
                        const item = allPhotos[globalIdx];
                        return (
                          <button
                            key={`${src}-${idx}`}
                            type="button"
                            className="pt7-frame"
                            onClick={() => setLightboxIndex(globalIdx)}
                          >
                            <div className="pt7-frame-media">
                              <img
                                src={src}
                                alt={item?.caption || `Lembar ${globalIdx + 1}`}
                                loading="lazy"
                                className="pt7-img-grid"
                              />
                            </div>
                            <div className="pt7-frame-meta">
                              <span className="pt7-frame-code">
                                {item?.label}
                              </span>
                              <span className="pt7-frame-caption">
                                {item?.caption}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* 06: A SEED FOR TOMORROW (CLOSING CARD) */}
              <footer className="pt7-footer">
                <span className="pt7-eyebrow">05 · A SEED FOR TOMORROW</span>
                <p className="pt7-footer-sign">— {signature}</p>

                {!tomorrowOpened ? (
                  <motion.button
                    type="button"
                    className="pt7-btn-outline"
                    onClick={() => setTomorrowOpened(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Buka Pesan untuk Musim Berikutnya
                  </motion.button>
                ) : (
                  <motion.div
                    className="pt7-tomorrow-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="pt7-tomorrow-badge">
                      UNTUK MUSIM BERIKUTNYA
                    </span>
                    <h3 className="pt7-tomorrow-title">{tomorrowTitle}</h3>
                    <p className="pt7-tomorrow-text">{tomorrowText}</p>
                  </motion.div>
                )}

                <div className="pt7-colophon">
                  PRESSED IN TIME · {coupleNames} · {archiveNumber}
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && allPhotos[lightboxIndex] && (
          <motion.div
            className="pt7-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Detail Foto Arsip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div
              className="pt7-lightbox-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt7-lightbox-bar">
                <span className="pt7-lightbox-counter">
                  {allPhotos[lightboxIndex].label} ({lightboxIndex + 1}/
                  {allPhotos.length})
                </span>
                <button
                  type="button"
                  className="pt7-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Tutup"
                >
                  TUTUP ✕
                </button>
              </div>

              <div className="pt7-lightbox-stage">
                <img
                  src={allPhotos[lightboxIndex].src}
                  alt={allPhotos[lightboxIndex].caption}
                  className="pt7-lightbox-img"
                />
              </div>

              <p className="pt7-lightbox-caption">
                {allPhotos[lightboxIndex].caption}
              </p>

              {allPhotos.length > 1 && (
                <div className="pt7-lightbox-nav">
                  <button
                    type="button"
                    className="pt7-lightbox-nav-btn"
                    onClick={prevPhoto}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="pt7-lightbox-nav-btn"
                    onClick={nextPhoto}
                  >
                    Berikutnya →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap');

  .pt7-root {
    min-height: 100vh;
    background-color: #f8f5ef;
    color: #252421;
    font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .pt7-root * {
    box-sizing: border-box;
  }

  /* Cover */
  .pt7-cover {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 18px;
    background: radial-gradient(circle at 50% 0%, #fffdf9 0%, #f4efe6 100%);
  }

  .pt7-book-card {
    width: min(100%, 460px);
    background-color: #fdfbf7;
    border: 1px solid rgba(61, 82, 69, 0.18);
    padding: 12px;
    box-shadow: 0 28px 64px rgba(37, 36, 33, 0.08);
    position: relative;
  }

  .pt7-ribbon-line {
    position: absolute;
    top: 0;
    left: 28px;
    width: 10px;
    height: 100%;
    background-color: rgba(61, 82, 69, 0.14);
    pointer-events: none;
  }

  .pt7-book-inner {
    border: 1px solid rgba(61, 82, 69, 0.14);
    padding: clamp(30px, 6vw, 46px) clamp(22px, 5vw, 36px);
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .pt7-archive-code {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #3d5245;
    margin-bottom: 22px;
  }

  .pt7-cover-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.3rem, 8vw, 3.15rem);
    font-weight: 500;
    line-height: 1.08;
    color: #252421;
    margin: 0 0 18px;
  }

  .pt7-clay-dot {
    width: 36px;
    height: 1px;
    background-color: #b57b6c;
    margin: 0 auto 20px;
  }

  .pt7-cover-line {
    font-size: 1.04rem;
    font-style: italic;
    line-height: 1.68;
    color: #5e5a53;
    margin: 0 0 24px;
  }

  .pt7-cover-meta {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6b7b66;
    padding: 14px 0;
    border-top: 1px dashed rgba(61, 82, 69, 0.2);
    border-bottom: 1px dashed rgba(61, 82, 69, 0.2);
    margin-bottom: 28px;
  }

  .pt7-btn-sage {
    width: 100%;
    padding: 14px 20px;
    background-color: #3d5245;
    color: #fdfbf7;
    border: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  /* Main Shell */
  .pt7-shell {
    min-height: 100vh;
  }

  .pt7-container {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 20px 96px;
  }

  .pt7-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 26px 0;
    border-bottom: 1px solid rgba(61, 82, 69, 0.16);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .pt7-header-names {
    color: #252421;
    font-weight: 600;
  }

  .pt7-header-code {
    color: #3d5245;
  }

  .pt7-hero {
    text-align: center;
    padding: 64px 0 56px;
  }

  .pt7-eyebrow {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #3d5245;
    margin-bottom: 12px;
  }

  .pt7-hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.5rem, 7.5vw, 3.6rem);
    font-weight: 500;
    line-height: 1.08;
    color: #252421;
    margin: 0 0 16px;
  }

  .pt7-hero-sub {
    max-width: 540px;
    margin: 0 auto;
    font-size: 1.12rem;
    font-style: italic;
    line-height: 1.72;
    color: #625e57;
  }

  .pt7-section {
    padding: 56px 0;
    border-top: 1px solid rgba(61, 82, 69, 0.14);
  }

  .pt7-sec-head {
    margin-bottom: 30px;
  }

  .pt7-sec-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 500;
    color: #252421;
    margin: 0 0 10px;
  }

  .pt7-sec-desc {
    margin: 0;
    font-size: 0.98rem;
    color: #68645d;
    line-height: 1.6;
  }

  /* Specimens */
  .pt7-specimen-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  .pt7-specimen-card {
    background-color: #fdfbf7;
    border: 1px solid rgba(61, 82, 69, 0.16);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .pt7-specimen-card.is-open {
    border-color: #3d5245;
    box-shadow: 0 14px 32px rgba(61, 82, 69, 0.08);
  }

  .pt7-specimen-trigger {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 20px 22px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #252421;
  }

  .pt7-specimen-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
  }

  .pt7-specimen-code {
    color: #b57b6c;
    font-weight: 600;
  }

  .pt7-specimen-toggle {
    color: #3d5245;
  }

  .pt7-specimen-label {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #252421;
    line-height: 1.2;
  }

  .pt7-specimen-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: #6b7b66;
  }

  .pt7-specimen-body {
    padding: 0 22px 22px;
    border-top: 1px dashed rgba(61, 82, 69, 0.18);
  }

  .pt7-specimen-body p {
    margin: 16px 0 0;
    font-size: 1.02rem;
    line-height: 1.74;
    color: #42403b;
  }

  /* Letter Sheet */
  .pt7-letter-sheet {
    background-color: #fdfbf7;
    border: 1px solid rgba(61, 82, 69, 0.18);
    padding: 12px;
    box-shadow: 0 20px 54px rgba(37, 36, 33, 0.06);
  }

  .pt7-letter-inner {
    border: 1px solid rgba(61, 82, 69, 0.12);
    padding: clamp(28px, 6vw, 54px) clamp(22px, 5vw, 48px);
  }

  .pt7-letter-top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #3d5245;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(61, 82, 69, 0.14);
    margin-bottom: 28px;
  }

  .pt7-letter-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 600;
    line-height: 1.15;
    color: #252421;
    margin: 0 0 22px;
  }

  .pt7-letter-salutation {
    font-size: 1.12rem;
    font-style: italic;
    color: #625e57;
    margin: 0 0 20px;
  }

  .pt7-letter-body p {
    font-size: 1.12rem;
    line-height: 1.9;
    color: #2b2926;
    margin: 0 0 20px;
  }

  .pt7-dropcap::first-letter {
    float: left;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 3.6rem;
    line-height: 0.82;
    padding-right: 10px;
    padding-top: 4px;
    color: #3d5245;
    font-weight: 600;
  }

  .pt7-letter-sign {
    margin-top: 34px;
    padding-top: 20px;
    border-top: 1px dashed rgba(61, 82, 69, 0.18);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pt7-letter-sign span {
    font-size: 0.94rem;
    font-style: italic;
    color: #68645d;
  }

  .pt7-letter-sign strong {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.85rem;
    font-weight: 500;
    font-style: italic;
    color: #252421;
  }

  /* Seasons Tabs */
  .pt7-season-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .pt7-season-tab {
    padding: 10px 18px;
    background-color: #fdfbf7;
    color: #4f5c52;
    border: 1px solid rgba(61, 82, 69, 0.22);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pt7-season-tab.is-active {
    background-color: #3d5245;
    color: #fdfbf7;
    border-color: #3d5245;
    font-weight: 600;
  }

  .pt7-season-stage {
    background-color: #fdfbf7;
    border: 1px solid rgba(61, 82, 69, 0.18);
    border-left: 3px solid #b57b6c;
    padding: clamp(24px, 5vw, 38px);
    min-height: 196px;
  }

  .pt7-season-when {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #b57b6c;
    margin-bottom: 10px;
  }

  .pt7-season-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4.5vw, 2.15rem);
    font-weight: 600;
    color: #252421;
    margin: 0 0 14px;
  }

  .pt7-season-story {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.82;
    color: #4a4742;
  }

  /* Gallery Frames */
  .pt7-frame {
    display: block;
    width: 100%;
    text-align: left;
    background-color: #fdfbf7;
    border: 1px solid rgba(61, 82, 69, 0.16);
    padding: 12px;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    color: #252421;
  }

  .pt7-frame:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(37, 36, 33, 0.07);
  }

  .pt7-frame-hero {
    margin-bottom: 18px;
  }

  .pt7-frame-media {
    overflow: hidden;
    background-color: #ece7dc;
  }

  .pt7-img-hero {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
  }

  .pt7-img-grid {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .pt7-frame-meta {
    padding: 14px 4px 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pt7-frame-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #3d5245;
  }

  .pt7-frame-caption {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 0.96rem;
    font-style: italic;
    line-height: 1.48;
    color: #252421;
  }

  .pt7-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
  }

  /* Footer */
  .pt7-footer {
    padding-top: 60px;
    border-top: 1px solid rgba(61, 82, 69, 0.18);
    text-align: center;
  }

  .pt7-footer-sign {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-style: italic;
    color: #252421;
    margin: 0 0 28px;
  }

  .pt7-btn-outline {
    padding: 14px 28px;
    background-color: #fdfbf7;
    color: #3d5245;
    border: 1px solid #3d5245;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .pt7-tomorrow-card {
    max-width: 560px;
    margin: 0 auto;
    background-color: #fdfbf7;
    border: 1px solid rgba(61, 82, 69, 0.24);
    border-top: 3px solid #3d5245;
    padding: clamp(26px, 5vw, 40px);
    box-shadow: 0 18px 44px rgba(37, 36, 33, 0.06);
  }

  .pt7-tomorrow-badge {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #b57b6c;
    margin-bottom: 12px;
  }

  .pt7-tomorrow-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4.5vw, 2.1rem);
    font-weight: 600;
    color: #252421;
    margin: 0 0 14px;
  }

  .pt7-tomorrow-text {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.8;
    color: #4a4742;
  }

  .pt7-colophon {
    margin-top: 52px;
    padding-top: 20px;
    border-top: 1px dashed rgba(61, 82, 69, 0.18);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #77726a;
  }

  /* Lightbox */
  .pt7-lightbox {
    position: fixed;
    inset: 0;
    z-index: 60;
    background-color: rgba(24, 26, 24, 0.9);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .pt7-lightbox-inner {
    width: min(100%, 860px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .pt7-lightbox-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .pt7-lightbox-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: #d9e2d8;
  }

  .pt7-lightbox-close {
    background-color: #fdfbf7;
    color: #252421;
    border: none;
    padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    cursor: pointer;
  }

  .pt7-lightbox-stage {
    background-color: #fdfbf7;
    padding: 10px;
  }

  .pt7-lightbox-img {
    width: 100%;
    max-height: 68vh;
    object-fit: contain;
    display: block;
    background-color: #1c1d1b;
  }

  .pt7-lightbox-caption {
    margin: 0;
    text-align: center;
    font-size: 1rem;
    font-style: italic;
    color: #fdfbf7;
  }

  .pt7-lightbox-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .pt7-lightbox-nav-btn {
    background-color: #3d5245;
    color: #fdfbf7;
    border: none;
    padding: 10px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .pt7-frame,
    .pt7-specimen-card,
    .pt7-season-tab {
      transition: none !important;
    }
  }
`;
