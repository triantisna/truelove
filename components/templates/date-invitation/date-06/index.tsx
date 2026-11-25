'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';
import type { WebsiteRecord } from '@/types/website';
import { saveWebsiteResponse } from '@/lib/website-response';

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

const VIBE_OPTIONS = [
  'Siap tampil rapi',
  'Tidak sabar makan enak',
  'Yang penting berdua',
];

export default function Date06({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [openClues, setOpenClues] = useState<Record<number, boolean>>({
    0: true,
  });
  const [activeChapter, setActiveChapter] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as Record<
    string,
    unknown
  >;

  const [selectedVibe, setSelectedVibe] = useState<string>(
    isPublished && typeof savedResponse.selectedVibe === 'string'
      ? savedResponse.selectedVibe
      : VIBE_OPTIONS[0],
  );
  const [rsvpConfirmed, setRsvpConfirmed] = useState(
    isPublished && Boolean(savedResponse.rsvpConfirmed),
  );

  const handleConfirmRsvp = () => {
    setRsvpConfirmed(true);

    if (isPublished) {
      void saveWebsiteResponse(website.id, {
        rsvpConfirmed: true,
        selectedVibe,
        confirmedAt: new Date().toISOString(),
      });
    }
  };

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

  const invitationCode = getString(
    content,
    'invitationCode',
    'SOIRÉE NO. 06 · PRIVATE INVITE',
  );
  const openingLine = getString(
    content,
    'openingLine',
    'Dress up, step out—tonight belongs only to the two of us.',
  );

  const clues = useMemo(() => {
    return [1, 2, 3]
      .map((n) => ({
        code: `CLUE 0${n}`,
        title: getString(content, `clue${n}Title`),
        text: getString(content, `clue${n}Text`),
      }))
      .filter((item) => item.title || item.text);
  }, [content]);

  const dateText = getString(content, 'dateText', 'Akhir Pekan Ini');
  const timeText = getString(content, 'timeText', '19.00 WIB – Larut');
  const locationText = getString(
    content,
    'locationText',
    'Private Lounge & Bistro',
  );
  const dressCode = getString(
    content,
    'dressCode',
    'Evening Chic · Hitam atau Ivory',
  );

  const letterTitle = getString(
    content,
    'letterTitle',
    'Satu Malam yang Sengaja Kusisihkan untuk Kita',
  );
  const letterBody = getString(
    content,
    'letterBody',
    website.message ||
      'Malam ini sengaja kusiapkan khusus untuk kita berdua—tanpa terburu-buru, hanya makan malam hangat dan obrolan panjang.',
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
    'Cahaya hangat, meja untuk berdua, dan waktu yang berjalan pelan.',
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
        label: 'MOOD 01 · CENTERPIECE',
      });
    }
    moodboardPhotos.forEach((src, idx) => {
      const num = String(idx + (mainPhoto ? 2 : 1)).padStart(2, '0');
      items.push({
        src,
        caption: moodboardCaptions[idx] || `Suasana Malam #${num}`,
        label: `MOOD ${num}`,
      });
    });
    return items;
  }, [mainPhoto, mainPhotoCaption, moodboardPhotos, moodboardCaptions]);

  const signature = getString(content, 'signature', senderName);
  const closingNote = getString(
    content,
    'closingNote',
    'Pilih vibe-mu untuk malam itu, lalu konfirmasi kehadiranmu agar Golden Pass-mu aktif.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const toggleClue = (idx: number) => {
    setOpenClues((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
    <main className="ms6-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE WAX-SEALED ENVELOPE (OPENING SCREEN) --- */
          <motion.section
            key="ms6-envelope"
            className="ms6-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
          >
            <div className="ms6-candle-glow" aria-hidden="true" />

            <motion.div
              className="ms6-envelope-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ms6-envelope-inner">
                <div className="ms6-env-top">
                  <span>{invitationCode}</span>
                  <span>FOR TWO</span>
                </div>

                {/* Wax Seal Emblem */}
                <div className="ms6-wax-seal" aria-hidden="true">
                  <span>
                    {senderName.charAt(0).toUpperCase()}&amp;
                    {receiverName.charAt(0).toUpperCase()}
                  </span>
                </div>

                <p className="ms6-env-kicker">UNDANGAN MALAM EKSKLUSIF UNTUK</p>
                <h1 className="ms6-env-name">{receiverName}</h1>

                <div className="ms6-gold-rule" aria-hidden="true" />

                <p className="ms6-env-line">{openingLine}</p>

                <motion.button
                  type="button"
                  className="ms6-btn-gold"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Buka Segel &amp; Lihat Undangan →
                </motion.button>

                <p className="ms6-env-from">DISIAPKAN OLEH {senderName}</p>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI UNDANGAN THE MIDNIGHT SOIRÉE --- */
          <motion.div
            key="ms6-content"
            className="ms6-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85 }}
          >
            <div className="ms6-ambient-glow" aria-hidden="true" />

            <div className="ms6-container">
              {/* Top Bar */}
              <header className="ms6-header">
                <span className="ms6-header-brand">{coupleNames}</span>
                <span className="ms6-header-code">{invitationCode}</span>
              </header>

              {/* Hero Intro */}
              <section className="ms6-hero">
                <span className="ms6-eyebrow">AN EVENING FOR TWO</span>
                <h1 className="ms6-hero-title">The Midnight Soirée</h1>
                <p className="ms6-hero-sub">{openingLine}</p>
              </section>

              {/* 02: THREE CLUES FOR TONIGHT (INTERACTIVE CARDS) */}
              {clues.length > 0 && (
                <section className="ms6-section">
                  <div className="ms6-sec-head">
                    <span className="ms6-eyebrow">
                      01 · THREE CLUES FOR TONIGHT
                    </span>
                    <h2 className="ms6-sec-title">
                      Tiga Petunjuk Tentang Malam Kita
                    </h2>
                    <p className="ms6-sec-desc">
                      Ketuk setiap kartu untuk membuka sedikit bocoran tentang
                      rencana malam itu.
                    </p>
                  </div>

                  <div className="ms6-clue-grid">
                    {clues.map((clue, idx) => {
                      const isOpen = !!openClues[idx];
                      return (
                        <div
                          key={clue.code}
                          className={`ms6-clue-card ${isOpen ? 'is-open' : ''}`}
                        >
                          <button
                            type="button"
                            className="ms6-clue-trigger"
                            onClick={() => toggleClue(idx)}
                            aria-expanded={isOpen}
                          >
                            <div className="ms6-clue-top">
                              <span className="ms6-clue-code">{clue.code}</span>
                              <span className="ms6-clue-state">
                                {isOpen ? 'TUTUP −' : 'BUKA +'}
                              </span>
                            </div>
                            <span className="ms6-clue-title">{clue.title}</span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && clue.text && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className="ms6-clue-body">
                                  <p>{clue.text}</p>
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

              {/* 03: THE PERSONAL INVITATION (WARM IVORY SHEET + DETAILS) */}
              <section className="ms6-section">
                <div className="ms6-ivory-sheet">
                  <div className="ms6-ivory-inner">
                    <div className="ms6-ivory-top">
                      <span>02 · THE PERSONAL INVITATION</span>
                      <span>{dateText}</span>
                    </div>

                    <h2 className="ms6-ivory-title">{letterTitle}</h2>

                    {/* Details Strip inside Invitation */}
                    <div className="ms6-detail-grid">
                      <div className="ms6-detail-box">
                        <span className="ms6-detail-label">
                          HARI &amp; TANGGAL
                        </span>
                        <span className="ms6-detail-val">{dateText}</span>
                      </div>
                      <div className="ms6-detail-box">
                        <span className="ms6-detail-label">WAKTU</span>
                        <span className="ms6-detail-val">{timeText}</span>
                      </div>
                      <div className="ms6-detail-box">
                        <span className="ms6-detail-label">LOKASI</span>
                        <span className="ms6-detail-val">{locationText}</span>
                      </div>
                      <div className="ms6-detail-box">
                        <span className="ms6-detail-label">DRESS CODE</span>
                        <span className="ms6-detail-val">{dressCode}</span>
                      </div>
                    </div>

                    <p className="ms6-ivory-salutation">
                      Untuk {receiverName},
                    </p>

                    <div className="ms6-ivory-body">
                      {letterParagraphs.map((p, idx) => (
                        <p
                          key={idx}
                          className={idx === 0 ? 'ms6-dropcap' : undefined}
                        >
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="ms6-ivory-sign">
                      <span>Sampai bertemu malam itu,</span>
                      <strong>{signature}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* 04: EVENING CHAPTERS (INTERACTIVE TABS) */}
              {chapters.length > 0 && (
                <section className="ms6-section">
                  <div className="ms6-sec-head">
                    <span className="ms6-eyebrow">03 · EVENING CHAPTERS</span>
                    <h2 className="ms6-sec-title">
                      Rangkaian Babak Malam Kita
                    </h2>
                  </div>

                  <div
                    className="ms6-chapter-tabs"
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
                          className={`ms6-chapter-tab ${active ? 'is-active' : ''}`}
                          onClick={() => setActiveChapter(idx)}
                        >
                          Babak {ch.number}
                        </button>
                      );
                    })}
                  </div>

                  <div className="ms6-chapter-stage">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={safeActiveChapter}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        {chapters[safeActiveChapter].time && (
                          <span className="ms6-chapter-time">
                            {chapters[safeActiveChapter].time}
                          </span>
                        )}
                        <h3 className="ms6-chapter-title">
                          {chapters[safeActiveChapter].title}
                        </h3>
                        <p className="ms6-chapter-story">
                          {chapters[safeActiveChapter].story}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* 05: THE MOODBOARD (GALLERY + LIGHTBOX) */}
              {allPhotos.length > 0 && (
                <section className="ms6-section">
                  <div className="ms6-sec-head">
                    <span className="ms6-eyebrow">04 · THE MOODBOARD</span>
                    <h2 className="ms6-sec-title">Suasana yang Menanti Kita</h2>
                    <p className="ms6-sec-desc">
                      Ketuk foto mana saja untuk melihatnya lebih jelas.
                    </p>
                  </div>

                  {mainPhoto && (
                    <button
                      type="button"
                      className="ms6-frame ms6-frame-hero"
                      onClick={() => setLightboxIndex(0)}
                    >
                      <div className="ms6-frame-media">
                        <img
                          src={mainPhoto}
                          alt={mainPhotoCaption}
                          className="ms6-img-hero"
                        />
                      </div>
                      <div className="ms6-plaque">
                        <span className="ms6-plaque-code">
                          MOOD 01 · CENTERPIECE
                        </span>
                        <span className="ms6-plaque-caption">
                          {mainPhotoCaption}
                        </span>
                      </div>
                    </button>
                  )}

                  {moodboardPhotos.length > 0 && (
                    <div className="ms6-gallery-grid">
                      {moodboardPhotos.map((src, idx) => {
                        const globalIdx = mainPhoto ? idx + 1 : idx;
                        const item = allPhotos[globalIdx];
                        return (
                          <button
                            key={`${src}-${idx}`}
                            type="button"
                            className="ms6-frame"
                            onClick={() => setLightboxIndex(globalIdx)}
                          >
                            <div className="ms6-frame-media">
                              <img
                                src={src}
                                alt={
                                  item?.caption || `Suasana ${globalIdx + 1}`
                                }
                                loading="lazy"
                                className="ms6-img-grid"
                              />
                            </div>
                            <div className="ms6-plaque">
                              <span className="ms6-plaque-code">
                                {item?.label}
                              </span>
                              <span className="ms6-plaque-caption">
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

              {/* 06: THE GOLDEN RSVP (INTERACTIVE VIBE + PASS) */}
              <footer className="ms6-footer">
                <span className="ms6-eyebrow">05 · THE GOLDEN RSVP</span>
                <h2 className="ms6-footer-title">Konfirmasi Kehadiranmu</h2>
                <p className="ms6-footer-note">{closingNote}</p>

                {!rsvpConfirmed ? (
                  <div className="ms6-rsvp-box">
                    <span className="ms6-vibe-label">
                      PILIH VIBE-MU MALAM ITU:
                    </span>
                    <div className="ms6-vibe-list">
                      {VIBE_OPTIONS.map((vibe) => {
                        const active = selectedVibe === vibe;
                        return (
                          <button
                            key={vibe}
                            type="button"
                            className={`ms6-vibe-btn ${active ? 'is-active' : ''}`}
                            onClick={() => setSelectedVibe(vibe)}
                          >
                            {vibe}
                          </button>
                        );
                      })}
                    </div>

                    <motion.button
                      type="button"
                      className="ms6-btn-gold"
                      onClick={handleConfirmRsvp}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      Konfirmasi Kehadiran →
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    className="ms6-golden-pass"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="ms6-pass-inner">
                      <span className="ms6-pass-badge">
                        RSVP CONFIRMED · SEE YOU TONIGHT
                      </span>
                      <h3 className="ms6-pass-names">{coupleNames}</h3>
                      <p className="ms6-pass-detail">
                        {dateText} · {timeText}
                      </p>
                      <p className="ms6-pass-loc">{locationText}</p>
                      <div className="ms6-pass-vibe">
                        VIBE TERPILIH: “{selectedVibe}”
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="ms6-colophon">
                  THE MIDNIGHT SOIRÉE · {coupleNames} · {invitationCode}
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
            className="ms6-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Detail Foto Moodboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div
              className="ms6-lightbox-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ms6-lightbox-bar">
                <span className="ms6-lightbox-counter">
                  {allPhotos[lightboxIndex].label} ({lightboxIndex + 1}/
                  {allPhotos.length})
                </span>
                <button
                  type="button"
                  className="ms6-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Tutup"
                >
                  TUTUP ✕
                </button>
              </div>

              <div className="ms6-lightbox-stage">
                <img
                  src={allPhotos[lightboxIndex].src}
                  alt={allPhotos[lightboxIndex].caption}
                  className="ms6-lightbox-img"
                />
              </div>

              <p className="ms6-lightbox-caption">
                {allPhotos[lightboxIndex].caption}
              </p>

              {allPhotos.length > 1 && (
                <div className="ms6-lightbox-nav">
                  <button
                    type="button"
                    className="ms6-lightbox-nav-btn"
                    onClick={prevPhoto}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="ms6-lightbox-nav-btn"
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

  .ms6-root {
    min-height: 100vh;
    background-color: #0c0b0e;
    color: #f4efe6;
    font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    position: relative;
  }

  .ms6-root * {
    box-sizing: border-box;
  }

  /* Opening Envelope */
  .ms6-cover {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 18px;
    position: relative;
    overflow: hidden;
  }

  .ms6-candle-glow {
    position: absolute;
    inset: -15% 0 auto 0;
    height: 70vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(222, 193, 139, 0.16), transparent 68%);
    pointer-events: none;
  }

  .ms6-envelope-card {
    width: min(100%, 450px);
    background-color: #161419;
    border: 1px solid rgba(222, 193, 139, 0.3);
    padding: 12px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.7);
    position: relative;
    z-index: 1;
  }

  .ms6-envelope-inner {
    border: 1px solid rgba(222, 193, 139, 0.16);
    padding: clamp(26px, 6vw, 40px) clamp(20px, 5vw, 34px);
    text-align: center;
  }

  .ms6-env-top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    color: #dec18b;
    padding-bottom: 16px;
    border-bottom: 1px dashed rgba(222, 193, 139, 0.25);
    margin-bottom: 24px;
  }

  .ms6-wax-seal {
    width: 66px;
    height: 66px;
    border-radius: 50%;
    margin: 0 auto 22px;
    background: radial-gradient(circle at 35% 30%, #ebd2a2, #b89452 65%, #846632 100%);
    box-shadow: 0 8px 24px rgba(222, 193, 139, 0.24), inset 0 0 0 3px rgba(12, 11, 14, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: #161419;
    letter-spacing: 0.04em;
  }

  .ms6-env-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    color: #a69f96;
    margin: 0 0 10px;
  }

  .ms6-env-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.35rem, 8vw, 3.15rem);
    font-weight: 500;
    line-height: 1.08;
    color: #f4efe6;
    margin: 0 0 16px;
  }

  .ms6-gold-rule {
    width: 40px;
    height: 1px;
    background-color: #dec18b;
    margin: 0 auto 18px;
  }

  .ms6-env-line {
    font-size: 1.02rem;
    font-style: italic;
    line-height: 1.66;
    color: #cbc4b9;
    margin: 0 0 28px;
  }

  .ms6-btn-gold {
    width: 100%;
    padding: 14px 20px;
    background-color: #dec18b;
    color: #141216;
    border: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .ms6-env-from {
    margin: 20px 0 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8f887f;
  }

  /* Main Shell */
  .ms6-shell {
    position: relative;
    min-height: 100vh;
  }

  .ms6-ambient-glow {
    position: fixed;
    top: -15%;
    left: 50%;
    transform: translateX(-50%);
    width: min(900px, 100vw);
    height: 55vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(222, 193, 139, 0.11), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .ms6-container {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 20px 96px;
    position: relative;
    z-index: 1;
  }

  .ms6-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 26px 0;
    border-bottom: 1px solid rgba(244, 239, 230, 0.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .ms6-header-brand {
    color: #f4efe6;
  }

  .ms6-header-code {
    color: #dec18b;
  }

  .ms6-hero {
    text-align: center;
    padding: 64px 0 56px;
  }

  .ms6-eyebrow {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #dec18b;
    margin-bottom: 12px;
  }

  .ms6-hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.45rem, 7.5vw, 3.6rem);
    font-weight: 500;
    line-height: 1.08;
    color: #f4efe6;
    margin: 0 0 16px;
  }

  .ms6-hero-sub {
    max-width: 540px;
    margin: 0 auto;
    font-size: 1.12rem;
    font-style: italic;
    line-height: 1.7;
    color: #b9b2a8;
  }

  .ms6-section {
    padding: 56px 0;
    border-top: 1px solid rgba(244, 239, 230, 0.1);
  }

  .ms6-sec-head {
    margin-bottom: 30px;
  }

  .ms6-sec-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 500;
    color: #f4efe6;
    margin: 0 0 10px;
  }

  .ms6-sec-desc {
    margin: 0;
    font-size: 0.98rem;
    color: #a19a90;
    line-height: 1.6;
  }

  /* Three Clues */
  .ms6-clue-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .ms6-clue-card {
    background-color: #161419;
    border: 1px solid rgba(244, 239, 230, 0.12);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .ms6-clue-card.is-open {
    border-color: rgba(222, 193, 139, 0.55);
    box-shadow: 0 12px 32px rgba(222, 193, 139, 0.08);
  }

  .ms6-clue-trigger {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 20px 22px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #f4efe6;
  }

  .ms6-clue-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
  }

  .ms6-clue-code {
    color: #dec18b;
  }

  .ms6-clue-state {
    color: #9e978e;
  }

  .ms6-clue-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: #f4efe6;
    line-height: 1.2;
  }

  .ms6-clue-body {
    padding: 0 22px 22px;
    border-top: 1px dashed rgba(222, 193, 139, 0.22);
  }

  .ms6-clue-body p {
    margin: 16px 0 0;
    font-size: 1rem;
    line-height: 1.72;
    color: #d5cfc5;
  }

  /* Warm Ivory Personal Invitation */
  .ms6-ivory-sheet {
    background-color: #f7f3eb;
    color: #211f1c;
    padding: 12px;
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.5);
  }

  .ms6-ivory-inner {
    border: 1px solid rgba(33, 31, 28, 0.14);
    padding: clamp(28px, 6vw, 52px) clamp(22px, 5vw, 46px);
  }

  .ms6-ivory-top {
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

  .ms6-ivory-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 5vw, 2.45rem);
    font-weight: 600;
    line-height: 1.15;
    color: #191715;
    margin: 0 0 24px;
  }

  .ms6-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 12px;
    padding: 18px 0;
    border-top: 1px dashed rgba(33, 31, 28, 0.18);
    border-bottom: 1px dashed rgba(33, 31, 28, 0.18);
    margin-bottom: 28px;
  }

  .ms6-detail-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ms6-detail-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #82693e;
  }

  .ms6-detail-val {
    font-size: 0.98rem;
    font-weight: 500;
    color: #191715;
    line-height: 1.45;
  }

  .ms6-ivory-salutation {
    font-size: 1.12rem;
    font-style: italic;
    color: #5b554c;
    margin: 0 0 18px;
  }

  .ms6-ivory-body p {
    font-size: 1.1rem;
    line-height: 1.88;
    color: #26231f;
    margin: 0 0 18px;
  }

  .ms6-dropcap::first-letter {
    float: left;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 3.5rem;
    line-height: 0.82;
    padding-right: 10px;
    padding-top: 4px;
    color: #9e814d;
    font-weight: 600;
  }

  .ms6-ivory-sign {
    margin-top: 32px;
    padding-top: 18px;
    border-top: 1px dashed rgba(33, 31, 28, 0.16);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ms6-ivory-sign span {
    font-size: 0.94rem;
    font-style: italic;
    color: #6b645b;
  }

  .ms6-ivory-sign strong {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.85rem;
    font-weight: 500;
    font-style: italic;
    color: #191715;
  }

  /* Evening Chapters Tabs */
  .ms6-chapter-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .ms6-chapter-tab {
    padding: 10px 18px;
    background-color: #161419;
    color: #b9b2a8;
    border: 1px solid rgba(244, 239, 230, 0.14);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ms6-chapter-tab.is-active {
    background-color: #dec18b;
    color: #141216;
    border-color: #dec18b;
    font-weight: 600;
  }

  .ms6-chapter-stage {
    background-color: #161419;
    border: 1px solid rgba(222, 193, 139, 0.24);
    padding: clamp(24px, 5vw, 38px);
    min-height: 190px;
  }

  .ms6-chapter-time {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.16em;
    color: #dec18b;
    margin-bottom: 10px;
  }

  .ms6-chapter-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4.5vw, 2.15rem);
    font-weight: 500;
    color: #f4efe6;
    margin: 0 0 14px;
  }

  .ms6-chapter-story {
    margin: 0;
    font-size: 1.06rem;
    line-height: 1.82;
    color: #cfc8be;
  }

  /* Moodboard Frames */
  .ms6-frame {
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

  .ms6-frame:hover {
    transform: translateY(-2px);
  }

  .ms6-frame-hero {
    margin-bottom: 18px;
  }

  .ms6-frame-media {
    overflow: hidden;
    background-color: #e6e0d4;
  }

  .ms6-img-hero {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
  }

  .ms6-img-grid {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .ms6-plaque {
    padding: 14px 4px 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ms6-plaque-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #82693e;
  }

  .ms6-plaque-caption {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 0.96rem;
    font-style: italic;
    line-height: 1.48;
    color: #211f1c;
  }

  .ms6-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  /* Golden RSVP Footer */
  .ms6-footer {
    padding-top: 60px;
    border-top: 1px solid rgba(222, 193, 139, 0.22);
    text-align: center;
  }

  .ms6-footer-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.9rem, 5vw, 2.5rem);
    font-weight: 500;
    color: #f4efe6;
    margin: 0 0 12px;
  }

  .ms6-footer-note {
    max-width: 480px;
    margin: 0 auto 28px;
    font-size: 1.02rem;
    color: #b4ada3;
    line-height: 1.7;
  }

  .ms6-rsvp-box {
    max-width: 520px;
    margin: 0 auto;
    background-color: #161419;
    border: 1px solid rgba(222, 193, 139, 0.24);
    padding: clamp(22px, 5vw, 32px);
  }

  .ms6-vibe-label {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    color: #dec18b;
    margin-bottom: 14px;
  }

  .ms6-vibe-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  .ms6-vibe-btn {
    padding: 9px 14px;
    background-color: #211e26;
    color: #d6d0c6;
    border: 1px solid rgba(244, 239, 230, 0.16);
    font-family: 'Newsreader', Georgia, serif;
    font-size: 0.94rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ms6-vibe-btn.is-active {
    background-color: rgba(222, 193, 139, 0.18);
    color: #f4efe6;
    border-color: #dec18b;
  }

  .ms6-golden-pass {
    max-width: 500px;
    margin: 0 auto;
    background: linear-gradient(135deg, #241e14 0%, #161419 60%, #241e14 100%);
    border: 1px solid #dec18b;
    padding: 10px;
    box-shadow: 0 20px 50px rgba(222, 193, 139, 0.14);
  }

  .ms6-pass-inner {
    border: 1px solid rgba(222, 193, 139, 0.3);
    padding: clamp(24px, 5vw, 36px) 20px;
  }

  .ms6-pass-badge {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #dec18b;
    margin-bottom: 12px;
  }

  .ms6-pass-names {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.9rem, 5.5vw, 2.45rem);
    font-weight: 500;
    color: #f4efe6;
    margin: 0 0 10px;
  }

  .ms6-pass-detail {
    margin: 0 0 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: #dec18b;
  }

  .ms6-pass-loc {
    margin: 0 0 18px;
    font-size: 0.98rem;
    color: #d5cfc5;
  }

  .ms6-pass-vibe {
    display: inline-block;
    padding: 8px 14px;
    background-color: rgba(222, 193, 139, 0.12);
    border: 1px dashed rgba(222, 193, 139, 0.45);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.12em;
    color: #f4efe6;
  }

  .ms6-colophon {
    margin-top: 52px;
    padding-top: 20px;
    border-top: 1px dashed rgba(244, 239, 230, 0.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #857f76;
  }

  /* Lightbox */
  .ms6-lightbox {
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

  .ms6-lightbox-inner {
    width: min(100%, 860px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ms6-lightbox-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .ms6-lightbox-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: #dec18b;
  }

  .ms6-lightbox-close {
    background-color: #211e26;
    color: #f4efe6;
    border: 1px solid rgba(244, 239, 230, 0.24);
    padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    cursor: pointer;
  }

  .ms6-lightbox-stage {
    background-color: #f7f3eb;
    padding: 10px;
  }

  .ms6-lightbox-img {
    width: 100%;
    max-height: 68vh;
    object-fit: contain;
    display: block;
    background-color: #141216;
  }

  .ms6-lightbox-caption {
    margin: 0;
    text-align: center;
    font-size: 1rem;
    font-style: italic;
    color: #f4efe6;
  }

  .ms6-lightbox-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .ms6-lightbox-nav-btn {
    background-color: #211e26;
    color: #dec18b;
    border: 1px solid rgba(222, 193, 139, 0.35);
    padding: 10px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .ms6-frame,
    .ms6-clue-card,
    .ms6-chapter-tab,
    .ms6-vibe-btn {
      transition: none !important;
    }
  }
`;
