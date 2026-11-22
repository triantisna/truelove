'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';
import type { WebsiteRecord } from '@/types/website';

type ContentValue = Record<string, unknown>;

function getString(content: ContentValue, key: string, fallback = ''): string {
  const value = content[key];
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function getMediaUrl(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'url' in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === 'string' ? url : '';
  }
  return '';
}

function getMediaList(content: ContentValue, key: string): string[] {
  const value = content[key];
  if (Array.isArray(value)) {
    return value.map((item) => getMediaUrl(item)).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim() !== '') return [value];
  return [];
}

export default function LoveLetter04({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const content = (website.content ?? {}) as ContentValue;

  const albumTitle = getString(content, 'albumTitle', 'For You, Always');
  const receiverName = getString(
    content,
    'receiverName',
    website.receiverName || 'Kamu',
  );
  const senderName = getString(
    content,
    'senderName',
    website.senderName || 'Seseorang',
  );
  const coverImage = getMediaUrl(content.coverImage);
  const letterHeadline = getString(
    content,
    'letterHeadline',
    'Catatan di Balik Lagu yang Selalu Mengingatkanku Padamu',
  );
  const mainLetter = getString(
    content,
    'mainLetter',
    website.message ||
      'Setiap lagu yang kudengar selalu membawaku kembali ke momen-momen bersamamu.',
  );

  const tracklist = useMemo(() => {
    return getString(content, 'tracklist', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, ...rest] = line.split('|');
        return {
          title: title.trim(),
          note: rest.join('|').trim(),
        };
      });
  }, [content]);

  const gallery = useMemo(() => {
    const fromContent = getMediaList(content, 'gallery');
    if (fromContent.length > 0) return fromContent.slice(0, 8);
    return (website.media ?? [])
      .filter((item) => item.type === 'image')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 8)
      .map((item) => item.url);
  }, [content, website.media]);

  const galleryCaptions = getString(content, 'galleryCaptions', '')
    .split('\n')
    .map((c) => c.trim());

  const outroText = getString(
    content,
    'outroText',
    'Terima kasih sudah menjadi melodi paling tenang di hari-hariku.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as any).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const paragraphs = mainLetter
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const formattedDate = useMemo(() => {
    const d = website.createdAt ? new Date(website.createdAt) : new Date();
    if (Number.isNaN(d.getTime())) return '2026';
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [website.createdAt]);

  // Palet Modern Record Sleeve
  const c = {
    stone: '#eceae4',
    paper: '#f7f5f0',
    charcoal: '#1c1b1a',
    muted: '#6e6a64',
    rust: '#b85d43',
    line: 'rgba(28, 27, 26, 0.14)',
  };

  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
  const serif = "'Newsreader', Georgia, 'Times New Roman', serif";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.stone,
        color: c.charcoal,
        fontFamily: sans,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE RECORD SLEEVE (OPENING) --- */
          <motion.section
            key="record-sleeve"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6 }}
            style={{
              minHeight: '100svh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(100%, 400px)',
                backgroundColor: c.paper,
                border: `1px solid ${c.line}`,
                padding: '20px',
                boxShadow: '0 24px 60px rgba(28, 27, 26, 0.1)',
              }}
            >
              {/* Top Sleeve Metadata */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: mono,
                  fontSize: '0.68rem',
                  letterSpacing: '0.08em',
                  color: c.muted,
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                }}
              >
                <span>CAT. NO. TL-04</span>
                <span>SIDE A / B</span>
              </div>

              {/* 1:1 Album Artwork */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  backgroundColor: c.charcoal,
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: '20px',
                }}
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={albumTitle}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'contrast(1.03) saturate(0.9)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: c.paper,
                      fontFamily: mono,
                      fontSize: '0.8rem',
                      letterSpacing: '0.2em',
                    }}
                  >
                    LINER NOTES
                  </div>
                )}
              </div>

              {/* Album Title & Dedication */}
              <div style={{ marginBottom: '22px' }}>
                <h1
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    margin: '0 0 6px',
                    color: c.charcoal,
                  }}
                >
                  {albumTitle}
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontFamily: mono,
                    fontSize: '0.75rem',
                    color: c.muted,
                  }}
                >
                  FOR {receiverName.toUpperCase()} — BY{' '}
                  {senderName.toUpperCase()}
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => setOpened(true)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: c.charcoal,
                  color: c.paper,
                  border: 'none',
                  fontFamily: mono,
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>▶ Putar & Baca Liner Notes</span>
                <span style={{ color: c.rust }}>↗</span>
              </motion.button>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 05: BOOKLET CONTENT --- */
          <motion.div
            key="booklet-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              padding: '0 20px 88px',
            }}
          >
            {/* Top Bar Metadata */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 0',
                borderBottom: `1px solid ${c.charcoal}`,
                fontFamily: mono,
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ fontWeight: 500 }}>{albumTitle}</span>
              <span style={{ color: c.rust }}>LINER NOTES</span>
            </header>

            {/* 02: SIDE A — THE LINER NOTES */}
            <section style={{ padding: '56px 0 64px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  padding: '14px 16px',
                  backgroundColor: c.paper,
                  border: `1px solid ${c.line}`,
                  fontFamily: mono,
                  fontSize: '0.7rem',
                  marginBottom: '40px',
                }}
              >
                <div>
                  <span style={{ color: c.muted, display: 'block' }}>TO</span>
                  <strong>{receiverName}</strong>
                </div>
                <div>
                  <span style={{ color: c.muted, display: 'block' }}>FROM</span>
                  <strong>{senderName}</strong>
                </div>
                <div>
                  <span style={{ color: c.muted, display: 'block' }}>
                    RECORDED
                  </span>
                  <strong>{formattedDate}</strong>
                </div>
              </div>

              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.72rem',
                  color: c.rust,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                SIDE A · LINER NOTES
              </span>

              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.18,
                  margin: '0 0 32px',
                }}
              >
                {letterHeadline}
              </h2>

              <div
                style={{
                  fontFamily: serif,
                  fontSize: '1.18rem',
                  lineHeight: 1.9,
                  color: '#2b2927',
                }}
              >
                {paragraphs.map((p, idx) => (
                  <p key={idx} style={{ margin: '0 0 22px' }}>
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* 03: THE TRACKLIST */}
            {tracklist.length > 0 && (
              <section
                style={{
                  padding: '48px 0 56px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '28px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.7rem',
                        color: c.rust,
                        letterSpacing: '0.14em',
                      }}
                    >
                      TRACKLIST
                    </span>
                    <h3
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        margin: '6px 0 0',
                      }}
                    >
                      Hal-Hal yang Selalu Kusuka Darimu
                    </h3>
                  </div>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '0.72rem',
                      color: c.muted,
                    }}
                  >
                    {tracklist.length} TRACKS
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: c.paper,
                    border: `1px solid ${c.line}`,
                  }}
                >
                  {tracklist.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.06 }}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '18px 20px',
                        borderBottom:
                          idx < tracklist.length - 1
                            ? `1px solid ${c.line}`
                            : 'none',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.78rem',
                          color: c.rust,
                          fontWeight: 500,
                          paddingTop: '2px',
                          flexShrink: 0,
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: c.charcoal,
                          }}
                        >
                          {item.title}
                        </p>
                        {item.note && (
                          <p
                            style={{
                              margin: '4px 0 0',
                              fontSize: '0.9rem',
                              lineHeight: 1.55,
                              color: c.muted,
                            }}
                          >
                            {item.note}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 04: SIDE B — CONTACT SHEET GALLERY */}
            {gallery.length > 0 && (
              <section
                style={{
                  padding: '48px 0 64px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.7rem',
                    color: c.rust,
                    letterSpacing: '0.14em',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  SIDE B · CONTACT SHEET
                </span>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    margin: '0 0 28px',
                  }}
                >
                  Visual Archive
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '18px',
                  }}
                >
                  {gallery.map((src, i) => (
                    <motion.figure
                      key={`${src}-${i}`}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      style={{
                        margin: 0,
                        backgroundColor: c.charcoal,
                        padding: '10px 10px 14px',
                        color: c.paper,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: mono,
                          fontSize: '0.62rem',
                          color: 'rgba(247, 245, 240, 0.55)',
                          marginBottom: '8px',
                        }}
                      >
                        <span>FRAME 0{i + 1}A</span>
                        <span>35MM</span>
                      </div>
                      <img
                        src={src}
                        alt={galleryCaptions[i] || `Frame ${i + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '4 / 3',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <figcaption
                        style={{
                          marginTop: '10px',
                          fontSize: '0.82rem',
                          color: 'rgba(247, 245, 240, 0.85)',
                          lineHeight: 1.45,
                        }}
                      >
                        {galleryCaptions[i] || `Memory #${i + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* 05: OUTRO & ALBUM CREDITS */}
            <footer
              style={{
                padding: '40px 28px',
                backgroundColor: c.charcoal,
                color: c.paper,
                marginTop: '12px',
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.68rem',
                  color: c.rust,
                  letterSpacing: '0.16em',
                  display: 'block',
                  marginBottom: '14px',
                }}
              >
                OUTRO
              </span>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.35rem',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  margin: '0 0 32px',
                  maxWidth: '540px',
                }}
              >
                “{outroText}”
              </p>

              <div
                style={{
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(247, 245, 240, 0.16)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontFamily: mono,
                  fontSize: '0.68rem',
                  color: 'rgba(247, 245, 240, 0.6)',
                  textTransform: 'uppercase',
                }}
              >
                <span>WRITTEN BY {senderName}</span>
                <span>DEDICATED TO {receiverName}</span>
                <span>© {new Date().getFullYear()} TRUELOVE</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
