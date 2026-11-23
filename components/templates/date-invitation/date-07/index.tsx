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

const TREAT_OPTIONS = [
  'Iced Latte / Matcha',
  'Fresh Mocktail / Juice',
  'Pastry & Dessert',
];

export default function Date07({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [openPromises, setOpenPromises] = useState<Record<number, boolean>>({
    0: true,
  });
  const [activeChapter, setActiveChapter] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedTreat, setSelectedTreat] = useState<string>(TREAT_OPTIONS[0]);
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);

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

  const editionCode = getString(
    content,
    'editionCode',
    'EDITION NO. 07 · SUNLIT INVITE',
  );
  const openingLine = getString(
    content,
    'openingLine',
    'Sunlight, slow conversations, and an afternoon reserved just for us.',
  );

  const promises = useMemo(() => {
    return [1, 2, 3]
      .map((n) => ({
        code: `JANJI 0${n}`,
        title: getString(content, `promise${n}Title`),
        text: getString(content, `promise${n}Text`),
      }))
      .filter((item) => item.title || item.text);
  }, [content]);

  const dateText = getString(content, 'dateText', 'Akhir Pekan Ini');
  const timeText = getString(content, 'timeText', '11.30 WIB – Golden Hour');
  const locationText = getString(
    content,
    'locationText',
    'Glasshouse Brunch & Terrace',
  );
  const dressCode = getString(
    content,
    'dressCode',
    'Sunlit Linen · Putih atau Biru Muda',
  );

  const letterTitle = getString(
    content,
    'letterTitle',
    'Satu Sore Cerah yang Ingin Kuhabiskan Bersamamu',
  );
  const letterBody = getString(
    content,
    'letterBody',
    website.message ||
      'Akhir pekan ini aku menyiapkan satu siang yang cerah dan tenang khusus untuk kita berdua.',
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
    return [1, 2, 3]
      .map((n) => ({
        number: `0${n}`,
        time: getString(content, `chapter${n}Time`),
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
    'Cahaya siang yang hangat, meja berdua, dan waktu yang berjalan pelan.',
  );

  const moodboardPhotos = useMemo(() => {
    const fromContent = getMediaList(content, 'moodboardPhotos');
    if (fromContent.length > 0) return fromContent.slice(0, 4);
    return (website.media ?? [])
      .filter((item) => item.type === 'image')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(mainPhoto ? 1 : 0, mainPhoto ? 5 : 4)
      .map((item) => item.url);
  }, [content, website.media, mainPhoto]);

  const moodboardCaptions = useMemo(
    () =>
      getString(content, 'moodboardCaptions', '')
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
        label: 'FOLIO 01 · CENTERPIECE',
      });
    }
    moodboardPhotos.forEach((src, idx) => {
      const num = String(idx + (mainPhoto ? 2 : 1)).padStart(2, '0');
      items.push({
        src,
        caption: moodboardCaptions[idx] || `Suasana Sore #${num}`,
        label: `FOLIO ${num}`,
      });
    });
    return items;
  }, [mainPhoto, mainPhotoCaption, moodboardPhotos, moodboardCaptions]);

  const signature = getString(content, 'signature', senderName);
  const closingNote = getString(
    content,
    'closingNote',
    'Pilih welcome treat favoritmu terlebih dahulu, lalu konfirmasi kehadiranmu agar Sunlit Pass-mu aktif.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const togglePromise = (idx: number) => {
    setOpenPromises((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
    <main className="lda7-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE VILLA INVITATION (OPENING SCREEN) --- */
          <motion.section
            key="lda7-cover"
            className="lda7-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.65 }}
          >
            <motion.div
              className="lda7-villa-card"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Mediterranean Tile Top Accent */}
              <div className="lda7-tile-strip" aria-hidden="true" />

              <div className="lda7-villa-inner">
                <div className="lda7-cover-top">
                  <span>{editionCode}</span>
                  <span>FOR TWO</span>
                </div>

                <p className="lda7-cover-kicker">UNDANGAN SORE UNTUK</p>
                <h1 className="lda7-cover-name">{receiverName}</h1>

                <div className="lda7-citrus-rule" aria-hidden="true" />

                <p className="lda7-cover-line">{openingLine}</p>

                <motion.button
                  type="button"
                  className="lda7-btn-azure"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Buka Undangan Sore →
                </motion.button>

                <p className="lda7-cover-from">DISIAPKAN OLEH {senderName}</p>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI UNDANGAN LA DOLCE AFTERNOON --- */
          <motion.div
            key="lda7-content"
            className="lda7-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="lda7-container">
              {/* Top Header */}
              <header className="lda7-header">
                <span className="lda7-header-brand">{coupleNames}</span>
                <span className="lda7-header-code">{editionCode}</span>
              </header>

              {/* Hero Intro */}
              <section className="lda7-hero">
                <span className="lda7-eyebrow">A SUNLIT AFTERNOON FOR TWO</span>
                <h1 className="lda7-hero-title">La Dolce Afternoon</h1>
                <p className="lda7-hero-sub">{openingLine}</p>
              </section>

              {/* 02: THREE LITTLE PROMISES (INTERACTIVE CARDS) */}
              {promises.length > 0 && (
                <section className="lda7-section">
                  <div className="lda7-sec-head">
                    <span className="lda7-eyebrow">
                      01 · THREE LITTLE PROMISES
                    </span>
                    <h2 className="lda7-sec-title">
                      Tiga Janji Kecil untuk Sore Kita
                    </h2>
                    <p className="lda7-sec-desc">
                      Ketuk setiap kartu untuk membuka detail kecil yang sudah
                      kusiapkan.
                    </p>
                  </div>

                  <div className="lda7-promise-grid">
                    {promises.map((item, idx) => {
                      const isOpen = !!openPromises[idx];
                      return (
                        <div
                          key={item.code}
                          className={`lda7-promise-card ${isOpen ? 'is-open' : ''}`}
                        >
                          <button
                            type="button"
                            className="lda7-promise-trigger"
                            onClick={() => togglePromise(idx)}
                            aria-expanded={isOpen}
                          >
                            <div className="lda7-promise-top">
                              <span className="lda7-promise-code">
                                {item.code}
                              </span>
                              <span className="lda7-promise-state">
                                {isOpen ? 'TUTUP −' : 'BUKA +'}
                              </span>
                            </div>
                            <span className="lda7-promise-title">
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
                                <div className="lda7-promise-body">
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

              {/* 03: THE SUNLIT LETTER & DETAILS */}
              <section className="lda7-section">
                <div className="lda7-letter-sheet">
                  <div className="lda7-letter-inner">
                    <div className="lda7-letter-top">
                      <span>02 · THE SUNLIT LETTER</span>
                      <span>{dateText}</span>
                    </div>

                    <h2 className="lda7-letter-title">{letterTitle}</h2>

                    {/* Details Strip */}
                    <div className="lda7-detail-grid">
                      <div className="lda7-detail-box">
                        <span className="lda7-detail-label">
                          HARI &amp; TANGGAL
                        </span>
                        <span className="lda7-detail-val">{dateText}</span>
                      </div>
                      <div className="lda7-detail-box">
                        <span className="lda7-detail-label">WAKTU</span>
                        <span className="lda7-detail-val">{timeText}</span>
                      </div>
                      <div className="lda7-detail-box">
                        <span className="lda7-detail-label">LOKASI</span>
                        <span className="lda7-detail-val">{locationText}</span>
                      </div>
                      <div className="lda7-detail-box">
                        <span className="lda7-detail-label">DRESS CODE</span>
                        <span className="lda7-detail-val">{dressCode}</span>
                      </div>
                    </div>

                    <p className="lda7-letter-salutation">
                      Untuk {receiverName},
                    </p>

                    <div className="lda7-letter-body">
                      {letterParagraphs.map((p, idx) => (
                        <p
                          key={idx}
                          className={idx === 0 ? 'lda7-dropcap' : undefined}
                        >
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="lda7-letter-sign">
                      <span>Sampai bertemu di bawah cahaya sore,</span>
                      <strong>{signature}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* 04: AFTERNOON CHAPTERS (INTERACTIVE TABS) */}
              {chapters.length > 0 && (
                <section className="lda7-section">
                  <div className="lda7-sec-head">
                    <span className="lda7-eyebrow">
                      03 · AFTERNOON CHAPTERS
                    </span>
                    <h2 className="lda7-sec-title">Rangkaian Sore Kita</h2>
                  </div>

                  <div
                    className="lda7-chapter-tabs"
                    role="tablist"
                    aria-label="Babak Acara"
                  >
                    {chapters.map((ch, idx) => {
                      const active = idx === safeActiveChapter;
                      return (
                        <button
                          key={ch.number}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`lda7-chapter-tab ${active ? 'is-active' : ''}`}
                          onClick={() => setActiveChapter(idx)}
                        >
                          Babak {ch.number}
                        </button>
                      );
                    })}
                  </div>

                  <div className="lda7-chapter-stage">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={safeActiveChapter}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        {chapters[safeActiveChapter].time && (
                          <span className="lda7-chapter-time">
                            {chapters[safeActiveChapter].time}
                          </span>
                        )}
                        <h3 className="lda7-chapter-title">
                          {chapters[safeActiveChapter].title}
                        </h3>
                        <p className="lda7-chapter-story">
                          {chapters[safeActiveChapter].story}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* 05: SUNLIT MOODBOARD (GALLERY + LIGHTBOX) */}
              {allPhotos.length > 0 && (
                <section className="lda7-section">
                  <div className="lda7-sec-head">
                    <span className="lda7-eyebrow">04 · SUNLIT MOODBOARD</span>
                    <h2 className="lda7-sec-title">
                      Suasana yang Menanti Kita
                    </h2>
                    <p className="lda7-sec-desc">
                      Ketuk foto mana saja untuk melihatnya lebih jelas.
                    </p>
                  </div>

                  {mainPhoto && (
                    <button
                      type="button"
                      className="lda7-frame lda7-frame-hero"
                      onClick={() => setLightboxIndex(0)}
                    >
                      <div className="lda7-frame-media">
                        <img
                          src={mainPhoto}
                          alt={mainPhotoCaption}
                          className="lda7-img-hero"
                        />
                      </div>
                      <div className="lda7-plaque">
                        <span className="lda7-plaque-code">
                          FOLIO 01 · CENTERPIECE
                        </span>
                        <span className="lda7-plaque-caption">
                          {mainPhotoCaption}
                        </span>
                      </div>
                    </button>
                  )}

                  {moodboardPhotos.length > 0 && (
                    <div className="lda7-gallery-grid">
                      {moodboardPhotos.map((src, idx) => {
                        const globalIdx = mainPhoto ? idx + 1 : idx;
                        const item = allPhotos[globalIdx];
                        return (
                          <button
                            key={`${src}-${idx}`}
                            type="button"
                            className="lda7-frame"
                            onClick={() => setLightboxIndex(globalIdx)}
                          >
                            <div className="lda7-frame-media">
                              <img
                                src={src}
                                alt={
                                  item?.caption || `Suasana ${globalIdx + 1}`
                                }
                                loading="lazy"
                                className="lda7-img-grid"
                              />
                            </div>
                            <div className="lda7-plaque">
                              <span className="lda7-plaque-code">
                                {item?.label}
                              </span>
                              <span className="lda7-plaque-caption">
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

              {/* 06: INTERACTIVE RSVP & TREAT SELECTOR */}
              <footer className="lda7-footer">
                <span className="lda7-eyebrow">05 · SUNLIT RSVP</span>
                <h2 className="lda7-footer-title">Konfirmasi Kehadiranmu</h2>
                <p className="lda7-footer-note">{closingNote}</p>

                {!rsvpConfirmed ? (
                  <div className="lda7-rsvp-box">
                    <span className="lda7-treat-label">
                      PILIH WELCOME TREAT FAVORITMU:
                    </span>
                    <div className="lda7-treat-list">
                      {TREAT_OPTIONS.map((treat) => {
                        const active = selectedTreat === treat;
                        return (
                          <button
                            key={treat}
                            type="button"
                            className={`lda7-treat-btn ${active ? 'is-active' : ''}`}
                            onClick={() => setSelectedTreat(treat)}
                          >
                            {treat}
                          </button>
                        );
                      })}
                    </div>

                    <motion.button
                      type="button"
                      className="lda7-btn-azure"
                      onClick={() => setRsvpConfirmed(true)}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      Konfirmasi Kehadiran →
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    className="lda7-sunlit-pass"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="lda7-tile-strip" aria-hidden="true" />
                    <div className="lda7-pass-inner">
                      <span className="lda7-pass-badge">
                        RSVP CONFIRMED · SEE YOU IN THE SUN
                      </span>
                      <h3 className="lda7-pass-names">{coupleNames}</h3>
                      <p className="lda7-pass-detail">
                        {dateText} · {timeText}
                      </p>
                      <p className="lda7-pass-loc">{locationText}</p>
                      <div className="lda7-pass-treat">
                        WELCOME TREAT: {selectedTreat.toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="lda7-colophon">
                  LA DOLCE AFTERNOON · {coupleNames} · {editionCode}
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
            className="lda7-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Detail Foto Moodboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div
              className="lda7-lightbox-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lda7-lightbox-bar">
                <span className="lda7-lightbox-counter">
                  {allPhotos[lightboxIndex].label} ({lightboxIndex + 1}/
                  {allPhotos.length})
                </span>
                <button
                  type="button"
                  className="lda7-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Tutup"
                >
                  TUTUP ✕
                </button>
              </div>

              <div className="lda7-lightbox-stage">
                <img
                  src={allPhotos[lightboxIndex].src}
                  alt={allPhotos[lightboxIndex].caption}
                  className="lda7-lightbox-img"
                />
              </div>

              <p className="lda7-lightbox-caption">
                {allPhotos[lightboxIndex].caption}
              </p>

              {allPhotos.length > 1 && (
                <div className="lda7-lightbox-nav">
                  <button
                    type="button"
                    className="lda7-lightbox-nav-btn"
                    onClick={prevPhoto}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="lda7-lightbox-nav-btn"
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

  .lda7-root {
    min-height: 100vh;
    background-color: #f9f6f0;
    color: #1e293b;
    font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .lda7-root * {
    box-sizing: border-box;
  }

  .lda7-tile-strip {
    height: 10px;
    background: repeating-linear-gradient(
      90deg,
      #1d4e89 0px,
      #1d4e89 14px,
      #f9f6f0 14px,
      #f9f6f0 20px,
      #d49b38 20px,
      #d49b38 24px,
      #f9f6f0 24px,
      #f9f6f0 30px
    );
  }

  /* Cover */
  .lda7-cover {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 18px;
    background: radial-gradient(circle at 50% 0%, #ffffff 0%, #f5f0e6 100%);
  }

  .lda7-villa-card {
    width: min(100%, 460px);
    background-color: #ffffff;
    border: 1px solid rgba(29, 78, 137, 0.22);
    box-shadow: 0 28px 64px rgba(29, 78, 137, 0.09);
    overflow: hidden;
  }

  .lda7-villa-inner {
    padding: clamp(28px, 6vw, 42px) clamp(22px, 5vw, 36px);
    text-align: center;
  }

  .lda7-cover-top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #1d4e89;
    padding-bottom: 16px;
    border-bottom: 1px dashed rgba(29, 78, 137, 0.22);
    margin-bottom: 28px;
  }

  .lda7-cover-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    color: #5b6472;
    margin: 0 0 10px;
  }

  .lda7-cover-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.35rem, 8vw, 3.2rem);
    font-weight: 600;
    line-height: 1.08;
    color: #1d4e89;
    margin: 0 0 18px;
  }

  .lda7-citrus-rule {
    width: 40px;
    height: 2px;
    background-color: #d49b38;
    margin: 0 auto 20px;
  }

  .lda7-cover-line {
    font-size: 1.04rem;
    font-style: italic;
    line-height: 1.68;
    color: #4b5563;
    margin: 0 0 30px;
  }

  .lda7-btn-azure {
    width: 100%;
    padding: 14px 20px;
    background-color: #1d4e89;
    color: #ffffff;
    border: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .lda7-cover-from {
    margin: 20px 0 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #5b6472;
  }

  /* Main Shell */
  .lda7-shell {
    min-height: 100vh;
  }

  .lda7-container {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 20px 96px;
  }

  .lda7-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 26px 0;
    border-bottom: 1px solid rgba(29, 78, 137, 0.16);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .lda7-header-brand {
    color: #1e293b;
    font-weight: 600;
  }

  .lda7-header-code {
    color: #1d4e89;
  }

  .lda7-hero {
    text-align: center;
    padding: 64px 0 56px;
  }

  .lda7-eyebrow {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #d49b38;
    margin-bottom: 12px;
  }

  .lda7-hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.5rem, 7.5vw, 3.6rem);
    font-weight: 600;
    line-height: 1.08;
    color: #1d4e89;
    margin: 0 0 16px;
  }

  .lda7-hero-sub {
    max-width: 540px;
    margin: 0 auto;
    font-size: 1.12rem;
    font-style: italic;
    line-height: 1.72;
    color: #5b6472;
  }

  .lda7-section {
    padding: 56px 0;
    border-top: 1px solid rgba(29, 78, 137, 0.14);
  }

  .lda7-sec-head {
    margin-bottom: 30px;
  }

  .lda7-sec-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 600;
    color: #1d4e89;
    margin: 0 0 10px;
  }

  .lda7-sec-desc {
    margin: 0;
    font-size: 0.98rem;
    color: #5b6472;
    line-height: 1.6;
  }

  /* Three Little Promises */
  .lda7-promise-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .lda7-promise-card {
    background-color: #ffffff;
    border: 1px solid rgba(29, 78, 137, 0.18);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .lda7-promise-card.is-open {
    border-color: #1d4e89;
    box-shadow: 0 14px 32px rgba(29, 78, 137, 0.08);
  }

  .lda7-promise-trigger {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 20px 22px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #1e293b;
  }

  .lda7-promise-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
  }

  .lda7-promise-code {
    color: #d49b38;
    font-weight: 600;
  }

  .lda7-promise-state {
    color: #1d4e89;
  }

  .lda7-promise-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.2;
  }

  .lda7-promise-body {
    padding: 0 22px 22px;
    border-top: 1px dashed rgba(29, 78, 137, 0.18);
  }

  .lda7-promise-body p {
    margin: 16px 0 0;
    font-size: 1rem;
    line-height: 1.72;
    color: #334155;
  }

  /* Sunlit Letter Sheet */
  .lda7-letter-sheet {
    background-color: #ffffff;
    border: 1px solid rgba(29, 78, 137, 0.2);
    padding: 12px;
    box-shadow: 0 20px 54px rgba(29, 78, 137, 0.06);
  }

  .lda7-letter-inner {
    border: 1px solid rgba(29, 78, 137, 0.14);
    padding: clamp(28px, 6vw, 52px) clamp(22px, 5vw, 46px);
  }

  .lda7-letter-top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #1d4e89;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(29, 78, 137, 0.14);
    margin-bottom: 26px;
  }

  .lda7-letter-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 600;
    line-height: 1.15;
    color: #1e293b;
    margin: 0 0 24px;
  }

  .lda7-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 12px;
    padding: 18px 0;
    border-top: 1px dashed rgba(29, 78, 137, 0.2);
    border-bottom: 1px dashed rgba(29, 78, 137, 0.2);
    margin-bottom: 28px;
  }

  .lda7-detail-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .lda7-detail-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #d49b38;
  }

  .lda7-detail-val {
    font-size: 0.98rem;
    font-weight: 500;
    color: #1e293b;
    line-height: 1.45;
  }

  .lda7-letter-salutation {
    font-size: 1.12rem;
    font-style: italic;
    color: #5b6472;
    margin: 0 0 18px;
  }

  .lda7-letter-body p {
    font-size: 1.1rem;
    line-height: 1.88;
    color: #1e293b;
    margin: 0 0 18px;
  }

  .lda7-dropcap::first-letter {
    float: left;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 3.5rem;
    line-height: 0.82;
    padding-right: 10px;
    padding-top: 4px;
    color: #1d4e89;
    font-weight: 600;
  }

  .lda7-letter-sign {
    margin-top: 32px;
    padding-top: 18px;
    border-top: 1px dashed rgba(29, 78, 137, 0.18);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .lda7-letter-sign span {
    font-size: 0.94rem;
    font-style: italic;
    color: #5b6472;
  }

  .lda7-letter-sign strong {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.85rem;
    font-weight: 500;
    font-style: italic;
    color: #1d4e89;
  }

  /* Afternoon Chapters Tabs */
  .lda7-chapter-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .lda7-chapter-tab {
    padding: 10px 18px;
    background-color: #ffffff;
    color: #334155;
    border: 1px solid rgba(29, 78, 137, 0.24);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .lda7-chapter-tab.is-active {
    background-color: #1d4e89;
    color: #ffffff;
    border-color: #1d4e89;
    font-weight: 600;
  }

  .lda7-chapter-stage {
    background-color: #ffffff;
    border: 1px solid rgba(29, 78, 137, 0.18);
    border-left: 3px solid #d49b38;
    padding: clamp(24px, 5vw, 38px);
    min-height: 190px;
  }

  .lda7-chapter-time {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #d49b38;
    margin-bottom: 10px;
  }

  .lda7-chapter-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4.5vw, 2.15rem);
    font-weight: 600;
    color: #1d4e89;
    margin: 0 0 14px;
  }

  .lda7-chapter-story {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.82;
    color: #334155;
  }

  /* Moodboard Frames */
  .lda7-frame {
    display: block;
    width: 100%;
    text-align: left;
    background-color: #ffffff;
    border: 1px solid rgba(29, 78, 137, 0.16);
    padding: 12px;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    color: #1e293b;
  }

  .lda7-frame:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(29, 78, 137, 0.08);
  }

  .lda7-frame-hero {
    margin-bottom: 18px;
  }

  .lda7-frame-media {
    overflow: hidden;
    background-color: #edf1f5;
  }

  .lda7-img-hero {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
  }

  .lda7-img-grid {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .lda7-plaque {
    padding: 14px 4px 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .lda7-plaque-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #1d4e89;
  }

  .lda7-plaque-caption {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 0.96rem;
    font-style: italic;
    line-height: 1.48;
    color: #1e293b;
  }

  .lda7-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  /* Sunlit RSVP Footer */
  .lda7-footer {
    padding-top: 60px;
    border-top: 1px solid rgba(29, 78, 137, 0.18);
    text-align: center;
  }

  .lda7-footer-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.9rem, 5vw, 2.5rem);
    font-weight: 600;
    color: #1d4e89;
    margin: 0 0 12px;
  }

  .lda7-footer-note {
    max-width: 480px;
    margin: 0 auto 28px;
    font-size: 1.02rem;
    color: #5b6472;
    line-height: 1.7;
  }

  .lda7-rsvp-box {
    max-width: 520px;
    margin: 0 auto;
    background-color: #ffffff;
    border: 1px solid rgba(29, 78, 137, 0.2);
    padding: clamp(22px, 5vw, 32px);
    box-shadow: 0 16px 40px rgba(29, 78, 137, 0.06);
  }

  .lda7-treat-label {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #1d4e89;
    margin-bottom: 14px;
  }

  .lda7-treat-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  .lda7-treat-btn {
    padding: 9px 14px;
    background-color: #f9f6f0;
    color: #334155;
    border: 1px solid rgba(29, 78, 137, 0.22);
    font-family: 'Newsreader', Georgia, serif;
    font-size: 0.94rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .lda7-treat-btn.is-active {
    background-color: rgba(29, 78, 137, 0.1);
    color: #1d4e89;
    border-color: #1d4e89;
    font-weight: 600;
  }

  .lda7-sunlit-pass {
    max-width: 500px;
    margin: 0 auto;
    background-color: #ffffff;
    border: 1px solid #1d4e89;
    box-shadow: 0 20px 50px rgba(29, 78, 137, 0.1);
    overflow: hidden;
  }

  .lda7-pass-inner {
    padding: clamp(26px, 5vw, 38px) 22px;
  }

  .lda7-pass-badge {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #d49b38;
    margin-bottom: 12px;
  }

  .lda7-pass-names {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.9rem, 5.5vw, 2.45rem);
    font-weight: 600;
    color: #1d4e89;
    margin: 0 0 10px;
  }

  .lda7-pass-detail {
    margin: 0 0 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: #1d4e89;
  }

  .lda7-pass-loc {
    margin: 0 0 18px;
    font-size: 0.98rem;
    color: #4b5563;
  }

  .lda7-pass-treat {
    display: inline-block;
    padding: 8px 14px;
    background-color: rgba(212, 155, 56, 0.14);
    border: 1px dashed #d49b38;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #1e293b;
  }

  .lda7-colophon {
    margin-top: 52px;
    padding-top: 20px;
    border-top: 1px dashed rgba(29, 78, 137, 0.18);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #64748b;
  }

  /* Lightbox */
  .lda7-lightbox {
    position: fixed;
    inset: 0;
    z-index: 60;
    background-color: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .lda7-lightbox-inner {
    width: min(100%, 860px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .lda7-lightbox-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .lda7-lightbox-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: #e2e8f0;
  }

  .lda7-lightbox-close {
    background-color: #ffffff;
    color: #1e293b;
    border: none;
    padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    cursor: pointer;
  }

  .lda7-lightbox-stage {
    background-color: #ffffff;
    padding: 10px;
  }

  .lda7-lightbox-img {
    width: 100%;
    max-height: 68vh;
    object-fit: contain;
    display: block;
    background-color: #0f172a;
  }

  .lda7-lightbox-caption {
    margin: 0;
    text-align: center;
    font-size: 1rem;
    font-style: italic;
    color: #f8fafc;
  }

  .lda7-lightbox-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .lda7-lightbox-nav-btn {
    background-color: #1d4e89;
    color: #ffffff;
    border: none;
    padding: 10px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .lda7-frame,
    .lda7-promise-card,
    .lda7-chapter-tab,
    .lda7-treat-btn {
      transition: none !important;
    }
  }
`;
