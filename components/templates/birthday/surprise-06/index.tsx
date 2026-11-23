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

export default function Surprise06({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [openToasts, setOpenToasts] = useState<Record<number, boolean>>({
    0: true,
  });
  const [activeChapter, setActiveChapter] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [toastRaised, setToastRaised] = useState(false);

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
  const ageNumber = getString(content, 'ageNumber', '');
  const sealEmblem = ageNumber || receiverName.charAt(0).toUpperCase();

  const editionCode = getString(
    content,
    'editionCode',
    'PRIVATE CELEBRATION · NO. 06',
  );
  const birthdayDate = getString(content, 'birthdayDate', '');
  const openingLine = getString(
    content,
    'openingLine',
    'Here’s to another year of you—the best chapter is only just beginning.',
  );

  const toasts = useMemo(() => {
    return [1, 2, 3]
      .map((n) => ({
        code: `TOAST 0${n}`,
        title: getString(content, `toast${n}Title`),
        text: getString(content, `toast${n}Text`),
      }))
      .filter((item) => item.title || item.text);
  }, [content]);

  const letterTitle = getString(
    content,
    'letterTitle',
    'Selamat Bertambah Usia, Orang Paling Berharga',
  );
  const letterBody = getString(
    content,
    'letterBody',
    website.message ||
      'Selamat ulang tahun. Semoga usia barumu dipenuhi ketenangan, kebahagiaan, dan segala hal baik yang pantas kamu dapatkan.',
  );
  const letterParagraphs = useMemo(
    () =>
      letterBody
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    [letterBody],
  );

  const chapters = useMemo(() => {
    return [1, 2, 3, 4]
      .map((n) => ({
        number: `0${n}`,
        tag: getString(content, `chapter${n}Tag`),
        title: getString(content, `chapter${n}Title`),
        story: getString(content, `chapter${n}Story`),
      }))
      .filter((ch) => ch.title || ch.story);
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
    'Potret Utama — Selamat memasuki usia baru yang lebih hangat.',
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
        label: 'PORTRAIT 01 · CENTERPIECE',
      });
    }
    galleryPhotos.forEach((src, idx) => {
      const num = String(idx + (mainPhoto ? 2 : 1)).padStart(2, '0');
      items.push({
        src,
        caption: galleryCaptions[idx] || `Momen ${num}`,
        label: `PORTRAIT ${num}`,
      });
    });
    return items;
  }, [mainPhoto, mainPhotoCaption, galleryPhotos, galleryCaptions]);

  const signature = getString(content, 'signature', senderName);
  const goldenWishTitle = getString(
    content,
    'goldenWishTitle',
    'Doa Terbaik untuk Babak Barumu',
  );
  const goldenWishText = getString(
    content,
    'goldenWishText',
    'Semoga kamu selalu diberi kesehatan, ketenangan, dan kebahagiaan yang utuh di setiap langkahmu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const toggleToast = (idx: number) => {
    setOpenToasts((prev) => ({ ...prev, [idx]: !prev[idx] }));
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

  const safeActiveChapter = activeChapter < chapters.length ? activeChapter : 0;

  return (
    <main className="mt6-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE GOLDEN SEAL (OPENING SCREEN) --- */
          <motion.section
            key="mt6-cover"
            className="mt6-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mt6-champagne-glow" aria-hidden="true" />

            <motion.div
              className="mt6-seal-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mt6-seal-inner">
                <div className="mt6-cover-top">
                  <span>{editionCode}</span>
                  <span>{ageNumber ? `CHAPTER ${ageNumber}` : 'BIRTHDAY'}</span>
                </div>

                {/* Golden Seal Emblem */}
                <div className="mt6-emblem" aria-hidden="true">
                  <span>{sealEmblem}</span>
                </div>

                <p className="mt6-cover-kicker">HAPPY BIRTHDAY</p>
                <h1 className="mt6-cover-name">{receiverName}</h1>

                <div className="mt6-gold-rule" aria-hidden="true" />

                <p className="mt6-cover-line">{openingLine}</p>

                <motion.button
                  type="button"
                  className="mt6-btn-gold"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Buka Perayaan Malam Ini →
                </motion.button>

                <p className="mt6-cover-from">DISIAPKAN OLEH {senderName}</p>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI PERAYAAN THE MIDNIGHT TOAST --- */
          <motion.div
            key="mt6-content"
            className="mt6-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85 }}
          >
            <div className="mt6-ambient-glow" aria-hidden="true" />

            <div className="mt6-container">
              {/* Top Header */}
              <header className="mt6-header">
                <span className="mt6-header-brand">
                  FOR {receiverName.toUpperCase()}
                </span>
                <span className="mt6-header-code">{editionCode}</span>
              </header>

              {/* Hero */}
              <section className="mt6-hero">
                <span className="mt6-eyebrow">
                  {ageNumber
                    ? `CELEBRATING CHAPTER ${ageNumber}`
                    : 'A PRIVATE BIRTHDAY CELEBRATION'}
                </span>
                <h1 className="mt6-hero-title">The Midnight Toast</h1>
                <p className="mt6-hero-sub">{openingLine}</p>
              </section>

              {/* 02: THREE TOASTS FOR YOU (INTERACTIVE CARDS) */}
              {toasts.length > 0 && (
                <section className="mt6-section">
                  <div className="mt6-sec-head">
                    <span className="mt6-eyebrow">
                      01 · THREE TOASTS FOR YOU
                    </span>
                    <h2 className="mt6-sec-title">
                      Tiga Alasan untuk Bersulang Malam Ini
                    </h2>
                    <p className="mt6-sec-desc">
                      Ketuk setiap kartu untuk membuka apresiasi khusus yang
                      kutulis untukmu.
                    </p>
                  </div>

                  <div className="mt6-toast-grid">
                    {toasts.map((item, idx) => {
                      const isOpen = !!openToasts[idx];
                      return (
                        <div
                          key={item.code}
                          className={`mt6-toast-card ${isOpen ? 'is-open' : ''}`}
                        >
                          <button
                            type="button"
                            className="mt6-toast-trigger"
                            onClick={() => toggleToast(idx)}
                            aria-expanded={isOpen}
                          >
                            <div className="mt6-toast-top">
                              <span className="mt6-toast-code">
                                {item.code}
                              </span>
                              <span className="mt6-toast-state">
                                {isOpen ? 'TUTUP −' : 'BUKA +'}
                              </span>
                            </div>
                            <span className="mt6-toast-title">
                              {item.title}
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && item.text && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className="mt6-toast-body">
                                  <p>{item.text}</p>
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

              {/* 03: THE BIRTHDAY LETTER (WARM IVORY SHEET) */}
              <section className="mt6-section">
                <div className="mt6-ivory-sheet">
                  <div className="mt6-ivory-inner">
                    <div className="mt6-ivory-top">
                      <span>02 · THE BIRTHDAY LETTER</span>
                      {birthdayDate && <span>{birthdayDate}</span>}
                    </div>

                    <h2 className="mt6-ivory-title">{letterTitle}</h2>
                    <p className="mt6-ivory-salutation">
                      Untuk {receiverName},
                    </p>

                    <div className="mt6-ivory-body">
                      {letterParagraphs.map((p, idx) => (
                        <p
                          key={idx}
                          className={idx === 0 ? 'mt6-dropcap' : undefined}
                        >
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="mt6-ivory-sign">
                      <span>Dengan seluruh rasa syukur,</span>
                      <strong>{signature}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* 04: CHAPTERS OF YOUR YEAR (INTERACTIVE TABS) */}
              {chapters.length > 0 && (
                <section className="mt6-section">
                  <div className="mt6-sec-head">
                    <span className="mt6-eyebrow">
                      03 · CHAPTERS OF YOUR YEAR
                    </span>
                    <h2 className="mt6-sec-title">
                      Hal-Hal Terbaik Tentang Dirimu
                    </h2>
                  </div>

                  <div
                    className="mt6-chapter-tabs"
                    role="tablist"
                    aria-label="Babak Tahunmu"
                  >
                    {chapters.map((ch, idx) => {
                      const active = idx === safeActiveChapter;
                      return (
                        <button
                          key={ch.number}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`mt6-chapter-tab ${active ? 'is-active' : ''}`}
                          onClick={() => setActiveChapter(idx)}
                        >
                          Babak {ch.number}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt6-chapter-stage">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={safeActiveChapter}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        {chapters[safeActiveChapter].tag && (
                          <span className="mt6-chapter-tag">
                            {chapters[safeActiveChapter].tag}
                          </span>
                        )}
                        <h3 className="mt6-chapter-title">
                          {chapters[safeActiveChapter].title}
                        </h3>
                        <p className="mt6-chapter-story">
                          {chapters[safeActiveChapter].story}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* 05: THE PORTRAIT GALLERY (GALLERY + LIGHTBOX) */}
              {allPhotos.length > 0 && (
                <section className="mt6-section">
                  <div className="mt6-sec-head">
                    <span className="mt6-eyebrow">
                      04 · THE PORTRAIT GALLERY
                    </span>
                    <h2 className="mt6-sec-title">Bingkai Kenangan Terbaik</h2>
                    <p className="mt6-sec-desc">
                      Ketuk foto mana saja untuk melihatnya lebih jelas.
                    </p>
                  </div>

                  {mainPhoto && (
                    <button
                      type="button"
                      className="mt6-frame mt6-frame-hero"
                      onClick={() => setLightboxIndex(0)}
                    >
                      <div className="mt6-frame-media">
                        <img
                          src={mainPhoto}
                          alt={mainPhotoCaption}
                          className="mt6-img-hero"
                        />
                      </div>
                      <div className="mt6-plaque">
                        <span className="mt6-plaque-code">
                          PORTRAIT 01 · CENTERPIECE
                        </span>
                        <span className="mt6-plaque-caption">
                          {mainPhotoCaption}
                        </span>
                      </div>
                    </button>
                  )}

                  {galleryPhotos.length > 0 && (
                    <div className="mt6-gallery-grid">
                      {galleryPhotos.map((src, idx) => {
                        const globalIdx = mainPhoto ? idx + 1 : idx;
                        const item = allPhotos[globalIdx];
                        return (
                          <button
                            key={`${src}-${idx}`}
                            type="button"
                            className="mt6-frame"
                            onClick={() => setLightboxIndex(globalIdx)}
                          >
                            <div className="mt6-frame-media">
                              <img
                                src={src}
                                alt={item?.caption || `Momen ${globalIdx + 1}`}
                                loading="lazy"
                                className="mt6-img-grid"
                              />
                            </div>
                            <div className="mt6-plaque">
                              <span className="mt6-plaque-code">
                                {item?.label}
                              </span>
                              <span className="mt6-plaque-caption">
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

              {/* 06: RAISE YOUR GLASS (GOLDEN TOAST CLOSING) */}
              <footer className="mt6-footer">
                <span className="mt6-eyebrow">05 · RAISE YOUR GLASS</span>
                <p className="mt6-footer-sign">— {signature}</p>

                {!toastRaised ? (
                  <motion.button
                    type="button"
                    className="mt6-btn-outline"
                    onClick={() => setToastRaised(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Angkat Gelas &amp; Buka Doa Terbaik
                  </motion.button>
                ) : (
                  <motion.div
                    className="mt6-golden-toast"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="mt6-golden-inner">
                      <span className="mt6-golden-badge">
                        CHEERS TO YOU · HAPPY BIRTHDAY{' '}
                        {receiverName.toUpperCase()}
                      </span>
                      <h3 className="mt6-golden-title">{goldenWishTitle}</h3>
                      <p className="mt6-golden-text">{goldenWishText}</p>
                    </div>
                  </motion.div>
                )}

                <div className="mt6-colophon">
                  THE MIDNIGHT TOAST · FOR {receiverName} · {editionCode}
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
            className="mt6-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Detail Foto Galeri"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div
              className="mt6-lightbox-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt6-lightbox-bar">
                <span className="mt6-lightbox-counter">
                  {allPhotos[lightboxIndex].label} ({lightboxIndex + 1}/
                  {allPhotos.length})
                </span>
                <button
                  type="button"
                  className="mt6-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Tutup"
                >
                  TUTUP ✕
                </button>
              </div>

              <div className="mt6-lightbox-stage">
                <img
                  src={allPhotos[lightboxIndex].src}
                  alt={allPhotos[lightboxIndex].caption}
                  className="mt6-lightbox-img"
                />
              </div>

              <p className="mt6-lightbox-caption">
                {allPhotos[lightboxIndex].caption}
              </p>

              {allPhotos.length > 1 && (
                <div className="mt6-lightbox-nav">
                  <button
                    type="button"
                    className="mt6-lightbox-nav-btn"
                    onClick={prevPhoto}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="mt6-lightbox-nav-btn"
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

  .mt6-root {
    min-height: 100vh;
    background-color: #0d0c0f;
    color: #f5f0e8;
    font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    position: relative;
  }

  .mt6-root * {
    box-sizing: border-box;
  }

  /* Cover */
  .mt6-cover {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 18px;
    position: relative;
    overflow: hidden;
  }

  .mt6-champagne-glow {
    position: absolute;
    inset: -15% 0 auto 0;
    height: 70vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(224, 194, 133, 0.16), transparent 68%);
    pointer-events: none;
  }

  .mt6-seal-card {
    width: min(100%, 450px);
    background-color: #17151b;
    border: 1px solid rgba(224, 194, 133, 0.3);
    padding: 12px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.7);
    position: relative;
    z-index: 1;
  }

  .mt6-seal-inner {
    border: 1px solid rgba(224, 194, 133, 0.16);
    padding: clamp(26px, 6vw, 40px) clamp(20px, 5vw, 34px);
    text-align: center;
  }

  .mt6-cover-top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    color: #e0c285;
    padding-bottom: 16px;
    border-bottom: 1px dashed rgba(224, 194, 133, 0.25);
    margin-bottom: 24px;
  }

  .mt6-emblem {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    margin: 0 auto 22px;
    background: radial-gradient(circle at 35% 30%, #f0d7a5, #b59254 68%, #826635 100%);
    box-shadow: 0 10px 26px rgba(224, 194, 133, 0.24), inset 0 0 0 3px rgba(13, 12, 15, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.65rem;
    font-weight: 600;
    color: #17151b;
  }

  .mt6-cover-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.22em;
    color: #a7a096;
    margin: 0 0 10px;
  }

  .mt6-cover-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.35rem, 8vw, 3.2rem);
    font-weight: 500;
    line-height: 1.08;
    color: #f5f0e8;
    margin: 0 0 16px;
  }

  .mt6-gold-rule {
    width: 40px;
    height: 1px;
    background-color: #e0c285;
    margin: 0 auto 18px;
  }

  .mt6-cover-line {
    font-size: 1.02rem;
    font-style: italic;
    line-height: 1.66;
    color: #ccc5ba;
    margin: 0 0 28px;
  }

  .mt6-btn-gold {
    width: 100%;
    padding: 14px 20px;
    background-color: #e0c285;
    color: #141317;
    border: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .mt6-cover-from {
    margin: 20px 0 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8f887f;
  }

  /* Main Shell */
  .mt6-shell {
    position: relative;
    min-height: 100vh;
  }

  .mt6-ambient-glow {
    position: fixed;
    top: -15%;
    left: 50%;
    transform: translateX(-50%);
    width: min(900px, 100vw);
    height: 55vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(224, 194, 133, 0.11), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .mt6-container {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 20px 96px;
    position: relative;
    z-index: 1;
  }

  .mt6-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 26px 0;
    border-bottom: 1px solid rgba(245, 240, 232, 0.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .mt6-header-brand {
    color: #f5f0e8;
  }

  .mt6-header-code {
    color: #e0c285;
  }

  .mt6-hero {
    text-align: center;
    padding: 64px 0 56px;
  }

  .mt6-eyebrow {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #e0c285;
    margin-bottom: 12px;
  }

  .mt6-hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.45rem, 7.5vw, 3.6rem);
    font-weight: 500;
    line-height: 1.08;
    color: #f5f0e8;
    margin: 0 0 16px;
  }

  .mt6-hero-sub {
    max-width: 540px;
    margin: 0 auto;
    font-size: 1.12rem;
    font-style: italic;
    line-height: 1.7;
    color: #bab3a9;
  }

  .mt6-section {
    padding: 56px 0;
    border-top: 1px solid rgba(245, 240, 232, 0.1);
  }

  .mt6-sec-head {
    margin-bottom: 30px;
  }

  .mt6-sec-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 500;
    color: #f5f0e8;
    margin: 0 0 10px;
  }

  .mt6-sec-desc {
    margin: 0;
    font-size: 0.98rem;
    color: #a19a90;
    line-height: 1.6;
  }

  /* Three Toasts */
  .mt6-toast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .mt6-toast-card {
    background-color: #17151b;
    border: 1px solid rgba(245, 240, 232, 0.12);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .mt6-toast-card.is-open {
    border-color: rgba(224, 194, 133, 0.55);
    box-shadow: 0 12px 32px rgba(224, 194, 133, 0.08);
  }

  .mt6-toast-trigger {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 20px 22px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #f5f0e8;
  }

  .mt6-toast-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
  }

  .mt6-toast-code {
    color: #e0c285;
  }

  .mt6-toast-state {
    color: #9e978e;
  }

  .mt6-toast-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.48rem;
    font-weight: 500;
    color: #f5f0e8;
    line-height: 1.22;
  }

  .mt6-toast-body {
    padding: 0 22px 22px;
    border-top: 1px dashed rgba(224, 194, 133, 0.22);
  }

  .mt6-toast-body p {
    margin: 16px 0 0;
    font-size: 1rem;
    line-height: 1.72;
    color: #d6d0c6;
  }

  /* Warm Ivory Birthday Letter */
  .mt6-ivory-sheet {
    background-color: #f7f3eb;
    color: #211f1c;
    padding: 12px;
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.5);
  }

  .mt6-ivory-inner {
    border: 1px solid rgba(33, 31, 28, 0.14);
    padding: clamp(28px, 6vw, 52px) clamp(22px, 5vw, 46px);
  }

  .mt6-ivory-top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #82693e;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(33, 31, 28, 0.12);
    margin-bottom: 26px;
  }

  .mt6-ivory-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 600;
    line-height: 1.15;
    color: #191715;
    margin: 0 0 24px;
  }

  .mt6-ivory-salutation {
    font-size: 1.12rem;
    font-style: italic;
    color: #5b554c;
    margin: 0 0 18px;
  }

  .mt6-ivory-body p {
    font-size: 1.1rem;
    line-height: 1.88;
    color: #26231f;
    margin: 0 0 18px;
  }

  .mt6-dropcap::first-letter {
    float: left;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 3.5rem;
    line-height: 0.82;
    padding-right: 10px;
    padding-top: 4px;
    color: #9e814d;
    font-weight: 600;
  }

  .mt6-ivory-sign {
    margin-top: 32px;
    padding-top: 18px;
    border-top: 1px dashed rgba(33, 31, 28, 0.16);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mt6-ivory-sign span {
    font-size: 0.94rem;
    font-style: italic;
    color: #6b645b;
  }

  .mt6-ivory-sign strong {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.85rem;
    font-weight: 500;
    font-style: italic;
    color: #191715;
  }

  /* Chapters Tabs */
  .mt6-chapter-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .mt6-chapter-tab {
    padding: 10px 18px;
    background-color: #17151b;
    color: #bab3a9;
    border: 1px solid rgba(245, 240, 232, 0.14);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mt6-chapter-tab.is-active {
    background-color: #e0c285;
    color: #141317;
    border-color: #e0c285;
    font-weight: 600;
  }

  .mt6-chapter-stage {
    background-color: #17151b;
    border: 1px solid rgba(224, 194, 133, 0.24);
    padding: clamp(24px, 5vw, 38px);
    min-height: 190px;
  }

  .mt6-chapter-tag {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.16em;
    color: #e0c285;
    margin-bottom: 10px;
  }

  .mt6-chapter-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4.5vw, 2.15rem);
    font-weight: 500;
    color: #f5f0e8;
    margin: 0 0 14px;
  }

  .mt6-chapter-story {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.82;
    color: #cfc8be;
  }

  /* Gallery Frames */
  .mt6-frame {
    display: block;
    width: 100%;
    text-align: left;
    background-color: #f7f3eb;
    border: none;
    padding: 12px;
    cursor: pointer;
    transition: transform 0.25s ease;
    color: #211f1c;
  }

  .mt6-frame:hover {
    transform: translateY(-2px);
  }

  .mt6-frame-hero {
    margin-bottom: 18px;
  }

  .mt6-frame-media {
    overflow: hidden;
    background-color: #e6e0d4;
  }

  .mt6-img-hero {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
  }

  .mt6-img-grid {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .mt6-plaque {
    padding: 14px 4px 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mt6-plaque-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #82693e;
  }

  .mt6-plaque-caption {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 0.96rem;
    font-style: italic;
    line-height: 1.48;
    color: #211f1c;
  }

  .mt6-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  /* Footer / Raise Your Glass */
  .mt6-footer {
    padding-top: 60px;
    border-top: 1px solid rgba(224, 194, 133, 0.22);
    text-align: center;
  }

  .mt6-footer-sign {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-style: italic;
    color: #f5f0e8;
    margin: 0 0 28px;
  }

  .mt6-btn-outline {
    padding: 14px 28px;
    background-color: transparent;
    color: #e0c285;
    border: 1px solid #e0c285;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .mt6-golden-toast {
    max-width: 540px;
    margin: 0 auto;
    background: linear-gradient(135deg, #251f15 0%, #17151b 60%, #251f15 100%);
    border: 1px solid #e0c285;
    padding: 10px;
    box-shadow: 0 20px 50px rgba(224, 194, 133, 0.14);
  }

  .mt6-golden-inner {
    border: 1px solid rgba(224, 194, 133, 0.28);
    padding: clamp(26px, 5vw, 38px) 22px;
  }

  .mt6-golden-badge {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #e0c285;
    margin-bottom: 12px;
  }

  .mt6-golden-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.65rem, 4.5vw, 2.2rem);
    font-weight: 500;
    color: #f5f0e8;
    margin: 0 0 14px;
  }

  .mt6-golden-text {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.8;
    color: #d6d0c6;
  }

  .mt6-colophon {
    margin-top: 52px;
    padding-top: 20px;
    border-top: 1px dashed rgba(245, 240, 232, 0.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #857f76;
  }

  /* Lightbox */
  .mt6-lightbox {
    position: fixed;
    inset: 0;
    z-index: 60;
    background-color: rgba(10, 9, 12, 0.92);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .mt6-lightbox-inner {
    width: min(100%, 860px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .mt6-lightbox-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .mt6-lightbox-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: #e0c285;
  }

  .mt6-lightbox-close {
    background-color: #211e26;
    color: #f5f0e8;
    border: 1px solid rgba(245, 240, 232, 0.24);
    padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    cursor: pointer;
  }

  .mt6-lightbox-stage {
    background-color: #f7f3eb;
    padding: 10px;
  }

  .mt6-lightbox-img {
    width: 100%;
    max-height: 68vh;
    object-fit: contain;
    display: block;
    background-color: #141317;
  }

  .mt6-lightbox-caption {
    margin: 0;
    text-align: center;
    font-size: 1rem;
    font-style: italic;
    color: #f5f0e8;
  }

  .mt6-lightbox-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .mt6-lightbox-nav-btn {
    background-color: #211e26;
    color: #e0c285;
    border: 1px solid rgba(224, 194, 133, 0.35);
    padding: 10px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .mt6-frame,
    .mt6-toast-card,
    .mt6-chapter-tab {
      transition: none !important;
    }
  }
`;
