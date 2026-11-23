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

interface SpreadItem {
  src: string;
  caption: string;
  pageLabel: string;
}

export default function Surprise07({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [openEdits, setOpenEdits] = useState<Record<number, boolean>>({
    0: true,
  });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [voucherClaimed, setVoucherClaimed] = useState(false);

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
  const ageNumber = getString(content, 'ageNumber', '01');
  const issueDate = getString(content, 'issueDate', 'SPECIAL EDITION');

  const coverPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.coverPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.coverPhoto, website.media]);

  const coverHeadlines = useMemo(() => {
    return getString(
      content,
      'coverHeadlines',
      'COVER STORY: MERAYAKAN SATU TAHUN PENUH WARNA\nTHE EDIT: HAL-HAL KECIL YANG PALING DISUKAI\nBONUS: VOUCHER HADIAH EKSKLUSIF',
    )
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [content]);

  const stats = useMemo(
    () => [
      {
        value: getString(content, 'stat1Value', ageNumber),
        label: getString(content, 'stat1Label', 'Tahun Bersinar'),
      },
      {
        value: getString(content, 'stat2Value', '100%'),
        label: getString(content, 'stat2Label', 'Orang Favoritku'),
      },
      {
        value: getString(content, 'stat3Value', '365'),
        label: getString(content, 'stat3Label', 'Hari Penuh Cerita'),
      },
      {
        value: '★',
        label: getString(
          content,
          'superpowerText',
          'Bikin Ruangan Jadi Hangat',
        ),
      },
    ],
    [content, ageNumber],
  );

  const storyTitle = getString(
    content,
    'storyTitle',
    'Mengapa Tahun Ini Sepenuhnya Milikmu',
  );
  const pullQuote = getString(
    content,
    'pullQuote',
    'Kamu tidak pernah perlu berusaha keras untuk jadi istimewa—kehadiranmu saja sudah cukup.',
  );
  const storyBody = getString(
    content,
    'storyBody',
    website.message ||
      'Selamat ulang tahun. Edisi khusus ini kubuat untuk merayakan semua hal hebat tentang dirimu.',
  );
  const storyParagraphs = useMemo(
    () =>
      storyBody
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    [storyBody],
  );

  const edits = useMemo(() => {
    return [1, 2, 3, 4]
      .map((n) => ({
        code: `0${n}`,
        title: getString(content, `edit${n}Title`),
        text: getString(content, `edit${n}Text`),
      }))
      .filter((item) => item.title || item.text);
  }, [content]);

  const spreadPhotos = useMemo(() => {
    const fromContent = getMediaList(content, 'spreadPhotos');
    if (fromContent.length > 0) return fromContent.slice(0, 6);
    return (website.media ?? [])
      .filter((item) => item.type === 'image')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(coverPhoto ? 1 : 0, coverPhoto ? 7 : 6)
      .map((item) => item.url);
  }, [content, website.media, coverPhoto]);

  const spreadCaptions = useMemo(
    () =>
      getString(content, 'spreadCaptions', '')
        .split('\n')
        .map((c) => c.trim()),
    [content],
  );

  const allSpreadItems: SpreadItem[] = useMemo(() => {
    return spreadPhotos.map((src, idx) => {
      const page = String(idx + 1).padStart(2, '0');
      return {
        src,
        caption: spreadCaptions[idx] || `Editorial Look ${page}`,
        pageLabel: `PAGE ${page}`,
      };
    });
  }, [spreadPhotos, spreadCaptions]);

  const voucherTitle = getString(
    content,
    'voucherTitle',
    '1x Dinner & Hadiah Pilihanmu',
  );
  const voucherDetail = getString(
    content,
    'voucherDetail',
    'Bebas pilih tempat makan, menu, dan waktu kapan saja. Berlaku seumur hidup.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const toggleEdit = (idx: number) => {
    setOpenEdits((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || allSpreadItems.length === 0) return null;
      return (prev - 1 + allSpreadItems.length) % allSpreadItems.length;
    });
  }, [allSpreadItems.length]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || allSpreadItems.length === 0) return null;
      return (prev + 1) % allSpreadItems.length;
    });
  }, [allSpreadItems.length]);

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

  return (
    <main className="tbi7-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
        {!opened ? (
          /* --- 01: THE COLLECTOR'S COVER (OPENING SCREEN) --- */
          <motion.section
            key="tbi7-cover"
            className="tbi7-cover-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="tbi7-mag-cover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Meta Strip */}
              <div className="tbi7-cover-meta">
                <span>VOL. {ageNumber} · COLLECTOR’S EDITION</span>
                <span>{issueDate}</span>
              </div>

              {/* Masthead */}
              <h1 className="tbi7-masthead">THE BIRTHDAY ISSUE</h1>

              {/* Cover Photo */}
              {coverPhoto && (
                <div className="tbi7-cover-photo-box">
                  <img
                    src={coverPhoto}
                    alt={`Cover Star ${receiverName}`}
                    className="tbi7-cover-img"
                  />
                  <span className="tbi7-cover-badge">COVER STAR</span>
                </div>
              )}

              {/* Cover Star Name & Headlines */}
              <div className="tbi7-cover-body">
                <span className="tbi7-star-kicker">STARRING</span>
                <h2 className="tbi7-star-name">{receiverName}</h2>

                {coverHeadlines.length > 0 && (
                  <ul className="tbi7-cover-headlines">
                    {coverHeadlines.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}

                <motion.button
                  type="button"
                  className="tbi7-btn-vermilion"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Buka Edisi Khusus →
                </motion.button>

                <div className="tbi7-cover-foot">
                  <span>CURATED BY {senderName.toUpperCase()}</span>
                  <span>NO. 07</span>
                </div>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI MAJALAH THE BIRTHDAY ISSUE --- */
          <motion.div
            key="tbi7-content"
            className="tbi7-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75 }}
          >
            <div className="tbi7-container">
              {/* Running Magazine Header */}
              <header className="tbi7-header">
                <span className="tbi7-header-title">THE BIRTHDAY ISSUE</span>
                <span className="tbi7-header-meta">
                  VOL. {ageNumber} · {receiverName.toUpperCase()}
                </span>
              </header>

              {/* 02: BY THE NUMBERS */}
              <section className="tbi7-section tbi7-section-first">
                <div className="tbi7-sec-head">
                  <span className="tbi7-kicker">01 // BY THE NUMBERS</span>
                  <h2 className="tbi7-sec-title">{receiverName} dalam Angka</h2>
                </div>

                <div className="tbi7-stats-grid">
                  {stats.map((st, idx) => (
                    <div key={idx} className="tbi7-stat-card">
                      <span className="tbi7-stat-val">{st.value}</span>
                      <span className="tbi7-stat-label">{st.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 03: THE COVER STORY + PULL QUOTE */}
              <section className="tbi7-section">
                <div className="tbi7-story-card">
                  <div className="tbi7-story-meta">
                    <span className="tbi7-kicker">02 // THE COVER STORY</span>
                    <span className="tbi7-byline">
                      DITULIS OLEH {senderName.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="tbi7-story-title">{storyTitle}</h2>

                  {pullQuote && (
                    <blockquote className="tbi7-pullquote">
                      “{pullQuote}”
                    </blockquote>
                  )}

                  <div className="tbi7-story-body">
                    {storyParagraphs.map((p, idx) => (
                      <p
                        key={idx}
                        className={idx === 0 ? 'tbi7-dropcap' : undefined}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </section>

              {/* 04: THE EDIT (4 INTERACTIVE CURATED CARDS) */}
              {edits.length > 0 && (
                <section className="tbi7-section">
                  <div className="tbi7-sec-head">
                    <span className="tbi7-kicker">
                      03 // THE EDIT: CURATED ABOUT YOU
                    </span>
                    <h2 className="tbi7-sec-title">
                      Empat Hal yang Paling Berkesan
                    </h2>
                    <p className="tbi7-sec-desc">
                      Ketuk setiap rubrik untuk membuka catatan kurasi khusus
                      tentang dirimu.
                    </p>
                  </div>

                  <div className="tbi7-edit-grid">
                    {edits.map((item, idx) => {
                      const isOpen = !!openEdits[idx];
                      return (
                        <div
                          key={item.code}
                          className={`tbi7-edit-card ${isOpen ? 'is-open' : ''}`}
                        >
                          <button
                            type="button"
                            className="tbi7-edit-trigger"
                            onClick={() => toggleEdit(idx)}
                            aria-expanded={isOpen}
                          >
                            <div className="tbi7-edit-top">
                              <span className="tbi7-edit-code">
                                EDIT {item.code}
                              </span>
                              <span className="tbi7-edit-state">
                                {isOpen ? 'TUTUP −' : 'BACA +'}
                              </span>
                            </div>
                            <span className="tbi7-edit-title">
                              {item.title}
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && item.text && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className="tbi7-edit-body">
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

              {/* 05: THE PHOTO SPREAD (LOOKBOOK + LIGHTBOX) */}
              {allSpreadItems.length > 0 && (
                <section className="tbi7-section">
                  <div className="tbi7-sec-head">
                    <span className="tbi7-kicker">04 // THE PHOTO SPREAD</span>
                    <h2 className="tbi7-sec-title">
                      Lookbook Edisi {receiverName}
                    </h2>
                    <p className="tbi7-sec-desc">
                      Ketuk foto mana saja untuk melihatnya dalam layar penuh.
                    </p>
                  </div>

                  <div className="tbi7-spread-grid">
                    {allSpreadItems.map((item, idx) => (
                      <button
                        key={`${item.src}-${idx}`}
                        type="button"
                        className="tbi7-spread-card"
                        onClick={() => setLightboxIndex(idx)}
                      >
                        <div className="tbi7-spread-media">
                          <img
                            src={item.src}
                            alt={item.caption}
                            loading="lazy"
                            className="tbi7-spread-img"
                          />
                        </div>
                        <div className="tbi7-spread-foot">
                          <span className="tbi7-spread-page">
                            {item.pageLabel}
                          </span>
                          <span className="tbi7-spread-caption">
                            {item.caption}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* 06: THE BACK COVER — TEAR-OUT BIRTHDAY VOUCHER */}
              <footer className="tbi7-footer">
                <span className="tbi7-kicker">
                  05 // THE BACK COVER · TEAR-OUT VOUCHER
                </span>

                <div className="tbi7-voucher-box">
                  <div className="tbi7-voucher-top">
                    <span>OFFICIAL BIRTHDAY VOUCHER</span>
                    <span>VALID FOR {receiverName.toUpperCase()}</span>
                  </div>

                  <h3 className="tbi7-voucher-title">{voucherTitle}</h3>
                  <p className="tbi7-voucher-detail">{voucherDetail}</p>

                  {!voucherClaimed ? (
                    <motion.button
                      type="button"
                      className="tbi7-btn-vermilion"
                      onClick={() => setVoucherClaimed(true)}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      Klaim Voucher Ulang Tahun
                    </motion.button>
                  ) : (
                    <motion.div
                      className="tbi7-voucher-stamp"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="tbi7-stamp-badge">
                        VOUCHER CLAIMED · VALID FOREVER
                      </span>
                      <p className="tbi7-stamp-note">
                        Resmi disetujui oleh {senderName}. Tinggal screenshot
                        halaman ini dan kirim kapan pun kamu mau klaim!
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="tbi7-colophon">
                  THE BIRTHDAY ISSUE · VOL. {ageNumber} · PUBLISHED BY{' '}
                  {senderName}
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && allSpreadItems[lightboxIndex] && (
          <motion.div
            className="tbi7-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Detail Foto Lookbook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div
              className="tbi7-lightbox-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="tbi7-lightbox-bar">
                <span className="tbi7-lightbox-counter">
                  {allSpreadItems[lightboxIndex].pageLabel} ({lightboxIndex + 1}
                  /{allSpreadItems.length})
                </span>
                <button
                  type="button"
                  className="tbi7-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Tutup"
                >
                  TUTUP ✕
                </button>
              </div>

              <div className="tbi7-lightbox-stage">
                <img
                  src={allSpreadItems[lightboxIndex].src}
                  alt={allSpreadItems[lightboxIndex].caption}
                  className="tbi7-lightbox-img"
                />
              </div>

              <p className="tbi7-lightbox-caption">
                {allSpreadItems[lightboxIndex].caption}
              </p>

              {allSpreadItems.length > 1 && (
                <div className="tbi7-lightbox-nav">
                  <button
                    type="button"
                    className="tbi7-lightbox-nav-btn"
                    onClick={prevPhoto}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="tbi7-lightbox-nav-btn"
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
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .tbi7-root {
    min-height: 100vh;
    background-color: #faf8f5;
    color: #141413;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .tbi7-root * {
    box-sizing: border-box;
  }

  /* 01: Magazine Cover */
  .tbi7-cover-wrap {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 18px;
  }

  .tbi7-mag-cover {
    width: min(100%, 440px);
    background-color: #ffffff;
    border: 2px solid #141413;
    padding: clamp(20px, 5vw, 28px);
    box-shadow: 10px 10px 0px #141413;
  }

  .tbi7-cover-meta {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #55534e;
    padding-bottom: 12px;
    border-bottom: 1.5px solid #141413;
    margin-bottom: 14px;
  }

  .tbi7-masthead {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.85rem, 6.5vw, 2.35rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.02;
    text-align: center;
    color: #141413;
    margin: 0 0 18px;
  }

  .tbi7-cover-photo-box {
    position: relative;
    margin-bottom: 18px;
    border: 1px solid rgba(20, 20, 19, 0.15);
    overflow: hidden;
  }

  .tbi7-cover-img {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    display: block;
  }

  .tbi7-cover-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background-color: #c93b2b;
    color: #ffffff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    padding: 5px 10px;
  }

  .tbi7-cover-body {
    text-align: center;
  }

  .tbi7-star-kicker {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: #c93b2b;
    margin-bottom: 4px;
  }

  .tbi7-star-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.9rem, 6.5vw, 2.4rem);
    font-weight: 700;
    font-style: italic;
    color: #141413;
    margin: 0 0 16px;
  }

  .tbi7-cover-headlines {
    list-style: none;
    margin: 0 0 22px;
    padding: 14px 0;
    border-top: 1px solid rgba(20, 20, 19, 0.14);
    border-bottom: 1px solid rgba(20, 20, 19, 0.14);
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }

  .tbi7-cover-headlines li {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    line-height: 1.45;
    color: #2f2e2b;
    padding-left: 12px;
    position: relative;
  }

  .tbi7-cover-headlines li::before {
    content: '■';
    position: absolute;
    left: 0;
    color: #c93b2b;
    font-size: 0.5rem;
    top: 2px;
  }

  .tbi7-btn-vermilion {
    width: 100%;
    padding: 14px 20px;
    background-color: #c93b2b;
    color: #ffffff;
    border: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .tbi7-cover-foot {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.12em;
    color: #6b6861;
  }

  /* Main Magazine Layout */
  .tbi7-shell {
    min-height: 100vh;
  }

  .tbi7-container {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 20px 92px;
  }

  .tbi7-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 24px 0;
    border-bottom: 2px solid #141413;
  }

  .tbi7-header-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #141413;
  }

  .tbi7-header-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #c93b2b;
  }

  .tbi7-section {
    padding: 52px 0;
    border-top: 1px solid rgba(20, 20, 19, 0.14);
  }

  .tbi7-section-first {
    border-top: none;
  }

  .tbi7-sec-head {
    margin-bottom: 28px;
  }

  .tbi7-kicker {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #c93b2b;
    margin-bottom: 8px;
  }

  .tbi7-sec-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 700;
    color: #141413;
    margin: 0 0 8px;
  }

  .tbi7-sec-desc {
    margin: 0;
    font-size: 0.96rem;
    color: #55534e;
    line-height: 1.6;
  }

  /* 02: By The Numbers */
  .tbi7-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 14px;
  }

  .tbi7-stat-card {
    background-color: #ffffff;
    border: 1.5px solid #141413;
    padding: 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tbi7-stat-val {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1;
    color: #c93b2b;
  }

  .tbi7-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    font-weight: 600;
    line-height: 1.45;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #141413;
  }

  /* 03: The Cover Story */
  .tbi7-story-card {
    background-color: #ffffff;
    border: 1.5px solid #141413;
    padding: clamp(26px, 5vw, 46px);
  }

  .tbi7-story-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(20, 20, 19, 0.14);
    margin-bottom: 22px;
  }

  .tbi7-byline {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    color: #55534e;
  }

  .tbi7-story-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.9rem, 5vw, 2.55rem);
    font-weight: 700;
    line-height: 1.15;
    color: #141413;
    margin: 0 0 24px;
  }

  .tbi7-pullquote {
    margin: 0 0 28px;
    padding: 18px 22px;
    border-left: 4px solid #c93b2b;
    background-color: #faf8f5;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.18rem, 3.2vw, 1.42rem);
    font-style: italic;
    line-height: 1.55;
    color: #c93b2b;
  }

  .tbi7-story-body p {
    font-size: 1rem;
    line-height: 1.85;
    color: #242321;
    margin: 0 0 18px;
  }

  .tbi7-dropcap::first-letter {
    float: left;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 3.4rem;
    font-weight: 800;
    line-height: 0.82;
    padding-right: 10px;
    padding-top: 4px;
    color: #141413;
  }

  /* 04: The Edit */
  .tbi7-edit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  .tbi7-edit-card {
    background-color: #ffffff;
    border: 1.5px solid rgba(20, 20, 19, 0.22);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .tbi7-edit-card.is-open {
    border-color: #141413;
    box-shadow: 5px 5px 0px #c93b2b;
  }

  .tbi7-edit-trigger {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 20px 22px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #141413;
  }

  .tbi7-edit-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  .tbi7-edit-code {
    color: #c93b2b;
  }

  .tbi7-edit-state {
    color: #55534e;
  }

  .tbi7-edit-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.32rem;
    font-weight: 700;
    color: #141413;
    line-height: 1.25;
  }

  .tbi7-edit-body {
    padding: 0 22px 20px;
    border-top: 1px dashed rgba(20, 20, 19, 0.18);
  }

  .tbi7-edit-body p {
    margin: 14px 0 0;
    font-size: 0.95rem;
    line-height: 1.72;
    color: #363431;
  }

  /* 05: Photo Spread */
  .tbi7-spread-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  .tbi7-spread-card {
    display: block;
    width: 100%;
    text-align: left;
    background-color: #ffffff;
    border: 1.5px solid #141413;
    padding: 10px;
    cursor: pointer;
    transition: transform 0.2s ease;
    color: #141413;
  }

  .tbi7-spread-card:hover {
    transform: translateY(-2px);
  }

  .tbi7-spread-media {
    overflow: hidden;
    background-color: #eae6df;
  }

  .tbi7-spread-img {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    display: block;
  }

  .tbi7-spread-foot {
    padding: 12px 4px 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tbi7-spread-page {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: #c93b2b;
  }

  .tbi7-spread-caption {
    font-size: 0.9rem;
    line-height: 1.48;
    color: #141413;
  }

  /* 06: Back Cover Voucher */
  .tbi7-footer {
    padding-top: 56px;
    border-top: 2px solid #141413;
    text-align: center;
  }

  .tbi7-voucher-box {
    max-width: 540px;
    margin: 18px auto 0;
    background-color: #ffffff;
    border: 2px dashed #141413;
    padding: clamp(24px, 5vw, 36px) 22px;
  }

  .tbi7-voucher-top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: #c93b2b;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(20, 20, 19, 0.14);
    margin-bottom: 20px;
  }

  .tbi7-voucher-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.65rem, 4.8vw, 2.15rem);
    font-weight: 700;
    color: #141413;
    margin: 0 0 12px;
  }

  .tbi7-voucher-detail {
    margin: 0 0 26px;
    font-size: 0.96rem;
    line-height: 1.7;
    color: #55534e;
  }

  .tbi7-voucher-stamp {
    background-color: rgba(201, 59, 43, 0.08);
    border: 2px solid #c93b2b;
    padding: 16px 18px;
  }

  .tbi7-stamp-badge {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: #c93b2b;
    margin-bottom: 6px;
  }

  .tbi7-stamp-note {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.55;
    color: #141413;
  }

  .tbi7-colophon {
    margin-top: 48px;
    padding-top: 18px;
    border-top: 1px solid rgba(20, 20, 19, 0.14);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6b6861;
  }

  /* Lightbox */
  .tbi7-lightbox {
    position: fixed;
    inset: 0;
    z-index: 60;
    background-color: rgba(20, 20, 19, 0.92);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .tbi7-lightbox-inner {
    width: min(100%, 860px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .tbi7-lightbox-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .tbi7-lightbox-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: #faf8f5;
  }

  .tbi7-lightbox-close {
    background-color: #ffffff;
    color: #141413;
    border: none;
    padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    cursor: pointer;
  }

  .tbi7-lightbox-stage {
    background-color: #ffffff;
    padding: 10px;
  }

  .tbi7-lightbox-img {
    width: 100%;
    max-height: 68vh;
    object-fit: contain;
    display: block;
    background-color: #141413;
  }

  .tbi7-lightbox-caption {
    margin: 0;
    text-align: center;
    font-size: 0.98rem;
    color: #faf8f5;
  }

  .tbi7-lightbox-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .tbi7-lightbox-nav-btn {
    background-color: #c93b2b;
    color: #ffffff;
    border: none;
    padding: 10px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .tbi7-spread-card,
    .tbi7-edit-card {
      transition: none !important;
    }
  }
`;
