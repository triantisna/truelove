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

export default function OurStory06({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [openArtifacts, setOpenArtifacts] = useState<Record<number, boolean>>({
    0: true,
  });
  const [activeRoom, setActiveRoom] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [futureOpened, setFutureOpened] = useState(false);

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

  const catalogNumber = getString(
    content,
    'catalogNumber',
    'EXH-06 · PRIVATE VIEWING',
  );
  const openingLine = getString(
    content,
    'openingLine',
    'Andai aku bisa membangun museum dari semua hal yang kucintai, setiap ruangannya tentangmu.',
  );
  const writtenDate = getString(content, 'writtenDate', '');

  const artifacts = useMemo(() => {
    return [1, 2, 3, 4]
      .map((n) => ({
        code: `ARTIFACT 0${n}`,
        label: getString(content, `artifact${n}Label`),
        meta: getString(content, `artifact${n}Meta`),
        story: getString(content, `artifact${n}Story`),
      }))
      .filter((a) => a.label || a.story);
  }, [content]);

  const curatorTitle = getString(
    content,
    'curatorTitle',
    'Catatan Kurator untuk Ruang yang Paling Kujaga',
  );
  const letterBody = getString(
    content,
    'letterBody',
    website.message ||
      'Malam ini pintu pameran ini dibuka hanya untukmu—menyimpan setiap langkah dan momen terbaik yang pernah kita lalui bersama.',
  );
  const letterParagraphs = useMemo(
    () =>
      letterBody
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    [letterBody],
  );

  const rooms = useMemo(() => {
    return [1, 2, 3, 4]
      .map((n) => ({
        number: `0${n}`,
        when: getString(content, `room${n}When`),
        title: getString(content, `room${n}Title`),
        story: getString(content, `room${n}Story`),
      }))
      .filter((r) => r.title || r.story);
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
    'Karya Utama No. 01 — Momen yang tidak pernah ingin kuakhiri.',
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
        label: 'CENTERPIECE · NO. 01',
      });
    }
    galleryPhotos.forEach((src, idx) => {
      const num = String(idx + (mainPhoto ? 2 : 1)).padStart(2, '0');
      items.push({
        src,
        caption: galleryCaptions[idx] || `Koleksi No. ${num}`,
        label: `PLATE NO. ${num}`,
      });
    });
    return items;
  }, [mainPhoto, mainPhotoCaption, galleryPhotos, galleryCaptions]);

  const signature = getString(content, 'signature', senderName);
  const futureWingTitle = getString(
    content,
    'futureWingTitle',
    'Sayap yang Masih Sengaja Kubiarkan Kosong',
  );
  const futureWingText = getString(
    content,
    'futureWingText',
    'Masih ada ruang luas di ujung pameran ini untuk semua perjalanan baru dan tahun-tahun tenang yang ingin terus kupajang bersamamu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const toggleArtifact = (idx: number) => {
    setOpenArtifacts((prev) => ({ ...prev, [idx]: !prev[idx] }));
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

  const safeActiveRoom = activeRoom < rooms.length ? activeRoom : 0;

  return (
    <main className="pe6-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: PRIVATE VIEWING PASS (OPENING SCREEN) --- */
          <motion.section
            key="pe6-pass"
            className="pe6-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
          >
            <div className="pe6-spotlight" aria-hidden="true" />

            <motion.div
              className="pe6-pass-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pe6-pass-inner">
                <div className="pe6-pass-top">
                  <span>{catalogNumber}</span>
                  <span>ADMIT ONE</span>
                </div>

                <p className="pe6-pass-kicker">THE PRIVATE EXHIBITION</p>
                <h1 className="pe6-pass-title">{coupleNames}</h1>

                <div className="pe6-gold-rule" aria-hidden="true" />

                <p className="pe6-pass-line">{openingLine}</p>

                <div className="pe6-pass-meta">
                  <div>
                    <span className="pe6-meta-label">TAMU KEHORMATAN</span>
                    <span className="pe6-meta-val">{receiverName}</span>
                  </div>
                  <div>
                    <span className="pe6-meta-label">KURATOR</span>
                    <span className="pe6-meta-val">{senderName}</span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  className="pe6-btn-primary"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Masuk ke Ruang Pameran →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: RUANG PAMERAN UTAMA --- */
          <motion.div
            key="pe6-gallery"
            className="pe6-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85 }}
          >
            <div className="pe6-ambient-glow" aria-hidden="true" />

            <div className="pe6-container">
              {/* Top Exhibition Header */}
              <header className="pe6-header">
                <span className="pe6-header-brand">{coupleNames}</span>
                <span className="pe6-header-code">{catalogNumber}</span>
              </header>

              {/* Hero Intro */}
              <section className="pe6-hero-intro">
                <span className="pe6-eyebrow">AFTER-HOURS PRIVATE VIEWING</span>
                <h1 className="pe6-hero-title">The Private Exhibition</h1>
                <p className="pe6-hero-sub">{openingLine}</p>
              </section>

              {/* 02: CURATED ARTIFACTS (INTERACTIVE PLAQUES) */}
              {artifacts.length > 0 && (
                <section className="pe6-section">
                  <div className="pe6-sec-head">
                    <span className="pe6-eyebrow">01 · CURATED ARTIFACTS</span>
                    <h2 className="pe6-sec-title">
                      Artefak Kecil yang Kusimpan
                    </h2>
                    <p className="pe6-sec-desc">
                      Ketuk setiap plakat untuk menyalakan lampu sorot dan
                      membaca cerita di baliknya.
                    </p>
                  </div>

                  <div className="pe6-artifact-grid">
                    {artifacts.map((art, idx) => {
                      const isOpen = !!openArtifacts[idx];
                      return (
                        <div
                          key={art.code}
                          className={`pe6-artifact-card ${isOpen ? 'is-open' : ''}`}
                        >
                          <button
                            type="button"
                            className="pe6-artifact-trigger"
                            onClick={() => toggleArtifact(idx)}
                            aria-expanded={isOpen}
                          >
                            <div className="pe6-artifact-top">
                              <span className="pe6-artifact-code">
                                {art.code}
                              </span>
                              <span className="pe6-artifact-state">
                                {isOpen ? 'TUTUP −' : 'BUKA +'}
                              </span>
                            </div>
                            <span className="pe6-artifact-title">
                              {art.label}
                            </span>
                            {art.meta && (
                              <span className="pe6-artifact-meta">
                                {art.meta}
                              </span>
                            )}
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && art.story && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className="pe6-artifact-body">
                                  <p>{art.story}</p>
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

              {/* 03: THE CURATOR'S NOTE (MUSEUM IVORY LETTER) */}
              <section className="pe6-section">
                <div className="pe6-ivory-sheet">
                  <div className="pe6-ivory-inner">
                    <div className="pe6-ivory-top">
                      <span>02 · THE CURATOR’S NOTE</span>
                      {writtenDate && <span>{writtenDate}</span>}
                    </div>

                    <h2 className="pe6-ivory-title">{curatorTitle}</h2>
                    <p className="pe6-ivory-salutation">
                      Untuk {receiverName},
                    </p>

                    <div className="pe6-ivory-body">
                      {letterParagraphs.map((p, idx) => (
                        <p
                          key={idx}
                          className={idx === 0 ? 'pe6-dropcap' : undefined}
                        >
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="pe6-ivory-sign">
                      <span>Dengan seluruh ketenangan,</span>
                      <strong>{signature}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* 04: EXHIBITION ROOMS (INTERACTIVE TABS) */}
              {rooms.length > 0 && (
                <section className="pe6-section">
                  <div className="pe6-sec-head">
                    <span className="pe6-eyebrow">03 · EXHIBITION ROOMS</span>
                    <h2 className="pe6-sec-title">
                      Menyusuri Ruang Demi Ruang
                    </h2>
                  </div>

                  <div
                    className="pe6-room-tabs"
                    role="tablist"
                    aria-label="Ruang Pameran"
                  >
                    {rooms.map((room, idx) => {
                      const active = idx === safeActiveRoom;
                      return (
                        <button
                          key={room.number}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`pe6-room-tab ${active ? 'is-active' : ''}`}
                          onClick={() => setActiveRoom(idx)}
                        >
                          Ruang {room.number}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pe6-room-stage">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={safeActiveRoom}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="pe6-room-panel"
                      >
                        {rooms[safeActiveRoom].when && (
                          <span className="pe6-room-when">
                            {rooms[safeActiveRoom].when}
                          </span>
                        )}
                        <h3 className="pe6-room-title">
                          {rooms[safeActiveRoom].title}
                        </h3>
                        <p className="pe6-room-story">
                          {rooms[safeActiveRoom].story}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* 05: THE MAIN WING (GALLERY MATBOARD + LIGHTBOX) */}
              {allPhotos.length > 0 && (
                <section className="pe6-section">
                  <div className="pe6-sec-head">
                    <span className="pe6-eyebrow">04 · THE MAIN WING</span>
                    <h2 className="pe6-sec-title">Koleksi Bingkai Utama</h2>
                    <p className="pe6-sec-desc">
                      Ketuk foto mana saja untuk melihat detailnya secara penuh.
                    </p>
                  </div>

                  {/* Centerpiece */}
                  {mainPhoto && (
                    <button
                      type="button"
                      className="pe6-matboard pe6-matboard-hero"
                      onClick={() => setLightboxIndex(0)}
                    >
                      <div className="pe6-matboard-frame">
                        <img
                          src={mainPhoto}
                          alt={mainPhotoCaption}
                          className="pe6-matboard-img-hero"
                        />
                      </div>
                      <div className="pe6-plaque">
                        <span className="pe6-plaque-code">
                          CENTERPIECE · NO. 01
                        </span>
                        <span className="pe6-plaque-caption">
                          {mainPhotoCaption}
                        </span>
                      </div>
                    </button>
                  )}

                  {/* Remaining Gallery Grid */}
                  {galleryPhotos.length > 0 && (
                    <div className="pe6-gallery-grid">
                      {galleryPhotos.map((src, idx) => {
                        const globalIdx = mainPhoto ? idx + 1 : idx;
                        const item = allPhotos[globalIdx];
                        return (
                          <button
                            key={`${src}-${idx}`}
                            type="button"
                            className="pe6-matboard"
                            onClick={() => setLightboxIndex(globalIdx)}
                          >
                            <div className="pe6-matboard-frame">
                              <img
                                src={src}
                                alt={
                                  item?.caption || `Koleksi ${globalIdx + 1}`
                                }
                                loading="lazy"
                                className="pe6-matboard-img"
                              />
                            </div>
                            <div className="pe6-plaque">
                              <span className="pe6-plaque-code">
                                {item?.label}
                              </span>
                              <span className="pe6-plaque-caption">
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

              {/* 06: THE UNFINISHED WING (PENUTUP INTERAKTIF) */}
              <footer className="pe6-footer">
                <span className="pe6-eyebrow">05 · THE UNFINISHED WING</span>
                <p className="pe6-footer-sign">— {signature}</p>

                {!futureOpened ? (
                  <motion.button
                    type="button"
                    className="pe6-btn-outline"
                    onClick={() => setFutureOpened(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Buka Ruang Masa Depan
                  </motion.button>
                ) : (
                  <motion.div
                    className="pe6-future-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="pe6-future-badge">
                      RUANG MASA DEPAN · TERBUKA
                    </span>
                    <h3 className="pe6-future-title">{futureWingTitle}</h3>
                    <p className="pe6-future-text">{futureWingText}</p>
                  </motion.div>
                )}

                <div className="pe6-colophon">
                  THE PRIVATE EXHIBITION · {coupleNames} · {catalogNumber}
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
            className="pe6-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Detail Foto Pameran"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div
              className="pe6-lightbox-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pe6-lightbox-bar">
                <span className="pe6-lightbox-counter">
                  {allPhotos[lightboxIndex].label} ({lightboxIndex + 1}/
                  {allPhotos.length})
                </span>
                <button
                  type="button"
                  className="pe6-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Tutup"
                >
                  TUTUP ✕
                </button>
              </div>

              <div className="pe6-lightbox-stage">
                <img
                  src={allPhotos[lightboxIndex].src}
                  alt={allPhotos[lightboxIndex].caption}
                  className="pe6-lightbox-img"
                />
              </div>

              <p className="pe6-lightbox-caption">
                {allPhotos[lightboxIndex].caption}
              </p>

              {allPhotos.length > 1 && (
                <div className="pe6-lightbox-nav">
                  <button
                    type="button"
                    className="pe6-lightbox-nav-btn"
                    onClick={prevPhoto}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="pe6-lightbox-nav-btn"
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

  .pe6-root {
    min-height: 100vh;
    background-color: #0e0e0d;
    color: #efece6;
    font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    position: relative;
  }

  .pe6-root * {
    box-sizing: border-box;
  }

  /* Cover / Pass */
  .pe6-cover {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 18px;
    position: relative;
    overflow: hidden;
  }

  .pe6-spotlight {
    position: absolute;
    inset: -20% 0 auto 0;
    height: 70vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(216, 188, 140, 0.16), transparent 68%);
    pointer-events: none;
  }

  .pe6-pass-card {
    width: min(100%, 460px);
    background-color: #161513;
    border: 1px solid rgba(216, 188, 140, 0.28);
    padding: 12px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.65);
    position: relative;
    z-index: 1;
  }

  .pe6-pass-inner {
    border: 1px solid rgba(216, 188, 140, 0.16);
    padding: clamp(26px, 6vw, 40px) clamp(20px, 5vw, 34px);
    text-align: center;
  }

  .pe6-pass-top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    color: #d8bc8c;
    padding-bottom: 16px;
    border-bottom: 1px dashed rgba(216, 188, 140, 0.25);
    margin-bottom: 28px;
  }

  .pe6-pass-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.22em;
    color: #9c968d;
    margin: 0 0 12px;
  }

  .pe6-pass-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.25rem, 8vw, 3.1rem);
    font-weight: 500;
    line-height: 1.08;
    color: #efece6;
    margin: 0 0 18px;
  }

  .pe6-gold-rule {
    width: 42px;
    height: 1px;
    background-color: #d8bc8c;
    margin: 0 auto 20px;
  }

  .pe6-pass-line {
    font-size: 1.02rem;
    font-style: italic;
    line-height: 1.65;
    color: #c7c1b7;
    margin: 0 0 28px;
  }

  .pe6-pass-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 16px 0;
    border-top: 1px solid rgba(239, 236, 230, 0.1);
    border-bottom: 1px solid rgba(239, 236, 230, 0.1);
    margin-bottom: 28px;
    text-align: left;
  }

  .pe6-meta-label {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.56rem;
    letter-spacing: 0.14em;
    color: #9c968d;
    margin-bottom: 4px;
  }

  .pe6-meta-val {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.15rem;
    color: #efece6;
  }

  .pe6-btn-primary {
    width: 100%;
    padding: 14px 20px;
    background-color: #d8bc8c;
    color: #141311;
    border: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  /* Main Gallery Shell */
  .pe6-shell {
    position: relative;
    min-height: 100vh;
  }

  .pe6-ambient-glow {
    position: fixed;
    top: -15%;
    left: 50%;
    transform: translateX(-50%);
    width: min(920px, 100vw);
    height: 55vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(216, 188, 140, 0.11), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .pe6-container {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 20px 96px;
    position: relative;
    z-index: 1;
  }

  .pe6-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 26px 0;
    border-bottom: 1px solid rgba(239, 236, 230, 0.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .pe6-header-brand {
    color: #efece6;
  }

  .pe6-header-code {
    color: #d8bc8c;
  }

  .pe6-hero-intro {
    text-align: center;
    padding: 64px 0 56px;
  }

  .pe6-eyebrow {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #d8bc8c;
    margin-bottom: 12px;
  }

  .pe6-hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.4rem, 7vw, 3.6rem);
    font-weight: 500;
    line-height: 1.08;
    color: #efece6;
    margin: 0 0 18px;
  }

  .pe6-hero-sub {
    max-width: 540px;
    margin: 0 auto;
    font-size: 1.12rem;
    font-style: italic;
    line-height: 1.7;
    color: #b5afa5;
  }

  .pe6-section {
    padding: 56px 0;
    border-top: 1px solid rgba(239, 236, 230, 0.1);
  }

  .pe6-sec-head {
    margin-bottom: 30px;
  }

  .pe6-sec-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.5rem);
    font-weight: 500;
    color: #efece6;
    margin: 0 0 10px;
  }

  .pe6-sec-desc {
    margin: 0;
    font-size: 0.98rem;
    color: #9c968d;
    line-height: 1.6;
  }

  /* Artifacts */
  .pe6-artifact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  .pe6-artifact-card {
    background-color: #181715;
    border: 1px solid rgba(239, 236, 230, 0.12);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .pe6-artifact-card.is-open {
    border-color: rgba(216, 188, 140, 0.55);
    box-shadow: 0 12px 32px rgba(216, 188, 140, 0.07);
  }

  .pe6-artifact-trigger {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 20px 22px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #efece6;
  }

  .pe6-artifact-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
  }

  .pe6-artifact-code {
    color: #d8bc8c;
  }

  .pe6-artifact-state {
    color: #9c968d;
  }

  .pe6-artifact-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.48rem;
    font-weight: 500;
    color: #efece6;
    line-height: 1.2;
  }

  .pe6-artifact-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.1em;
    color: #9c968d;
  }

  .pe6-artifact-body {
    padding: 0 22px 22px;
    border-top: 1px dashed rgba(216, 188, 140, 0.2);
  }

  .pe6-artifact-body p {
    margin: 16px 0 0;
    font-size: 1rem;
    line-height: 1.72;
    color: #d3cdc3;
  }

  /* Museum Ivory Letter */
  .pe6-ivory-sheet {
    background-color: #f5f2eb;
    color: #22201d;
    padding: 12px;
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.45);
  }

  .pe6-ivory-inner {
    border: 1px solid rgba(34, 32, 29, 0.14);
    padding: clamp(28px, 6vw, 54px) clamp(22px, 5vw, 48px);
  }

  .pe6-ivory-top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #7c6744;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(34, 32, 29, 0.12);
    margin-bottom: 28px;
  }

  .pe6-ivory-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.5rem);
    font-weight: 600;
    line-height: 1.15;
    color: #1b1917;
    margin: 0 0 24px;
  }

  .pe6-ivory-salutation {
    font-size: 1.12rem;
    font-style: italic;
    color: #5b554d;
    margin: 0 0 20px;
  }

  .pe6-ivory-body p {
    font-size: 1.12rem;
    line-height: 1.9;
    color: #262420;
    margin: 0 0 20px;
  }

  .pe6-dropcap::first-letter {
    float: left;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 3.6rem;
    line-height: 0.82;
    padding-right: 10px;
    padding-top: 4px;
    color: #9e8459;
    font-weight: 600;
  }

  .pe6-ivory-sign {
    margin-top: 34px;
    padding-top: 20px;
    border-top: 1px dashed rgba(34, 32, 29, 0.16);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pe6-ivory-sign span {
    font-size: 0.94rem;
    font-style: italic;
    color: #6b645b;
  }

  .pe6-ivory-sign strong {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.85rem;
    font-weight: 500;
    font-style: italic;
    color: #1b1917;
  }

  /* Exhibition Rooms Tabs */
  .pe6-room-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .pe6-room-tab {
    padding: 10px 18px;
    background-color: #181715;
    color: #b5afa5;
    border: 1px solid rgba(239, 236, 230, 0.14);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pe6-room-tab.is-active {
    background-color: #d8bc8c;
    color: #141311;
    border-color: #d8bc8c;
    font-weight: 600;
  }

  .pe6-room-stage {
    background-color: #181715;
    border: 1px solid rgba(216, 188, 140, 0.24);
    padding: clamp(24px, 5vw, 38px);
    min-height: 200px;
  }

  .pe6-room-when {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    letter-spacing: 0.16em;
    color: #d8bc8c;
    margin-bottom: 10px;
  }

  .pe6-room-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4.5vw, 2.15rem);
    font-weight: 500;
    color: #efece6;
    margin: 0 0 14px;
  }

  .pe6-room-story {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.82;
    color: #ccc6bc;
  }

  /* Gallery Matboard */
  .pe6-matboard {
    display: block;
    width: 100%;
    text-align: left;
    background-color: #f5f2eb;
    border: none;
    padding: 12px;
    cursor: pointer;
    transition: transform 0.25s ease;
    color: #22201d;
  }

  .pe6-matboard:hover {
    transform: translateY(-2px);
  }

  .pe6-matboard-hero {
    margin-bottom: 18px;
  }

  .pe6-matboard-frame {
    overflow: hidden;
    background-color: #e6e1d6;
  }

  .pe6-matboard-img-hero {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
  }

  .pe6-matboard-img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .pe6-plaque {
    padding: 14px 4px 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pe6-plaque-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #7c6744;
  }

  .pe6-plaque-caption {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 0.96rem;
    font-style: italic;
    line-height: 1.48;
    color: #22201d;
  }

  .pe6-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
  }

  /* Footer / Future Wing */
  .pe6-footer {
    padding-top: 60px;
    border-top: 1px solid rgba(216, 188, 140, 0.22);
    text-align: center;
  }

  .pe6-footer-sign {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-style: italic;
    color: #efece6;
    margin: 0 0 28px;
  }

  .pe6-btn-outline {
    padding: 14px 28px;
    background-color: transparent;
    color: #d8bc8c;
    border: 1px solid #d8bc8c;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .pe6-future-card {
    max-width: 560px;
    margin: 0 auto;
    background-color: #181715;
    border: 1px solid rgba(216, 188, 140, 0.38);
    padding: clamp(26px, 5vw, 40px);
  }

  .pe6-future-badge {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    color: #d8bc8c;
    margin-bottom: 12px;
  }

  .pe6-future-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4.5vw, 2.1rem);
    font-weight: 500;
    color: #efece6;
    margin: 0 0 14px;
  }

  .pe6-future-text {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.8;
    color: #ccc6bc;
  }

  .pe6-colophon {
    margin-top: 52px;
    padding-top: 20px;
    border-top: 1px dashed rgba(239, 236, 230, 0.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #857f76;
  }

  /* Lightbox */
  .pe6-lightbox {
    position: fixed;
    inset: 0;
    z-index: 60;
    background-color: rgba(10, 10, 9, 0.92);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .pe6-lightbox-inner {
    width: min(100%, 860px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .pe6-lightbox-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .pe6-lightbox-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: #d8bc8c;
  }

  .pe6-lightbox-close {
    background-color: #1f1e1c;
    color: #efece6;
    border: 1px solid rgba(239, 236, 230, 0.24);
    padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    cursor: pointer;
  }

  .pe6-lightbox-stage {
    background-color: #f5f2eb;
    padding: 10px;
  }

  .pe6-lightbox-img {
    width: 100%;
    max-height: 68vh;
    object-fit: contain;
    display: block;
    background-color: #141311;
  }

  .pe6-lightbox-caption {
    margin: 0;
    text-align: center;
    font-size: 1rem;
    font-style: italic;
    color: #efece6;
  }

  .pe6-lightbox-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .pe6-lightbox-nav-btn {
    background-color: #1f1e1c;
    color: #d8bc8c;
    border: 1px solid rgba(216, 188, 140, 0.35);
    padding: 10px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .pe6-matboard,
    .pe6-artifact-card,
    .pe6-room-tab {
      transition: none !important;
    }
  }
`;
