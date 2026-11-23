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

export default function OurStory02({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
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
  const rollCode = getString(content, 'rollCode', 'ROLL 02 · ISO 400 · 35MM');
  const coverTagline = getString(
    content,
    'coverTagline',
    'Some moments are too good to fade—so I kept them on film.',
  );

  const heroPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.heroPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.heroPhoto, website.media]);

  const heroMeta = getString(content, 'heroMeta', 'FRAME 00A · 35MM');
  const introTitle = getString(
    content,
    'introTitle',
    'Frame Pertama yang Mengubah Segalanya',
  );
  const introText = getString(
    content,
    'introText',
    website.message ||
      'Setiap potongan di gulungan ini adalah kenangan yang tidak pernah ingin kulupakan.',
  );

  const exposures = useMemo(() => {
    return getString(content, 'exposures', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            meta: parts[0],
            title: parts[1],
            story: parts.slice(2).join(' | '),
          };
        }
        if (parts.length === 2) {
          return { meta: parts[0], title: parts[1], story: '' };
        }
        return { meta: '', title: parts[0], story: '' };
      });
  }, [content]);

  const productionNotes = useMemo(() => {
    return getString(content, 'productionNotes', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split('|');
        return {
          label: label.trim(),
          value: rest.join('|').trim(),
        };
      })
      .filter((item) => item.label);
  }, [content]);

  const gallery = useMemo(() => {
    const fromContent = getMediaList(content, 'gallery');
    if (fromContent.length > 0) return fromContent.slice(0, 6);
    return (website.media ?? [])
      .filter((item) => item.type === 'image')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 6)
      .map((item) => item.url);
  }, [content, website.media]);

  const galleryCaptions = getString(content, 'galleryCaptions', '')
    .split('\n')
    .map((c) => c.trim());

  const closingTitle = getString(
    content,
    'closingTitle',
    'Gulungan Berikutnya Masih Menunggu Kita',
  );
  const closingText = getString(
    content,
    'closingText',
    'Masih banyak tempat, tawa, dan roll film baru yang ingin kuhabiskan bersamamu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const introParagraphs = introText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Darkroom & Kodak Amber
  const c = {
    bg: '#141413',
    surface: '#1d1c1a',
    card: '#23221f',
    ivory: '#f2efe9',
    silver: '#9a958c',
    amber: '#e09f3e',
    line: 'rgba(242, 239, 233, 0.12)',
    amberSoft: 'rgba(224, 159, 62, 0.28)',
  };

  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.bg,
        color: c.ivory,
        fontFamily: sans,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE FILM LEADER (OPENING SCREEN) --- */
          <motion.section
            key="film-leader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
            style={{
              minHeight: '100svh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(100%, 440px)',
                backgroundColor: c.surface,
                border: `1px solid ${c.line}`,
                padding: 'clamp(28px, 6vw, 42px)',
                position: 'relative',
              }}
            >
              {/* Film sprocket dots top */}
              <div
                aria-hidden="true"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '26px',
                  opacity: 0.4,
                }}
              >
                {Array.from({ length: 8 }).map((_, idx) => (
                  <span
                    key={idx}
                    style={{
                      width: '14px',
                      height: '8px',
                      borderRadius: '2px',
                      backgroundColor: c.bg,
                      border: `1px solid ${c.line}`,
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  fontFamily: mono,
                  fontSize: '0.68rem',
                  letterSpacing: '0.16em',
                  color: c.amber,
                  textTransform: 'uppercase',
                  marginBottom: '18px',
                }}
              >
                {rollCode}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 7vw, 2.85rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.12,
                  margin: '0 0 14px',
                  color: c.ivory,
                }}
              >
                {coupleNames}
              </h1>

              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.65,
                  color: c.silver,
                  margin: '0 0 32px',
                }}
              >
                {coverTagline}
              </p>

              <motion.button
                type="button"
                onClick={() => setOpened(true)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: c.amber,
                  color: '#141413',
                  border: 'none',
                  fontFamily: mono,
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Buka Gulungan Film →
              </motion.button>

              <div
                style={{
                  marginTop: '22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  color: c.silver,
                  opacity: 0.75,
                }}
              >
                <span>KODAK PORTRA 400</span>
                <span>36 EXP</span>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: CONTACT SHEET CONTENT --- */
          <motion.div
            key="film-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              padding: '0 20px 88px',
            }}
          >
            {/* Top Film Bar */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '24px 0',
                borderBottom: `1px solid ${c.line}`,
                fontFamily: mono,
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: c.silver,
              }}
            >
              <span>35MM OF US · {coupleNames}</span>
              <span style={{ color: c.amber }}>{rollCode}</span>
            </header>

            {/* 02: FRAME 00A (HERO & INTRO) */}
            <section style={{ padding: '52px 0 60px' }}>
              {heroPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  style={{
                    margin: '0 0 40px',
                    backgroundColor: c.surface,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: mono,
                      fontSize: '0.64rem',
                      color: c.amber,
                      letterSpacing: '0.14em',
                      marginBottom: '10px',
                    }}
                  >
                    <span>FRAME 00A</span>
                    <span>{heroMeta}</span>
                  </div>
                  <img
                    src={heroPhoto}
                    alt={introTitle}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </motion.figure>
              )}

              <div style={{ maxWidth: '640px' }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.68rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.amber,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  01 // OPENING SCENE
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(1.7rem, 5vw, 2.35rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: '0 0 22px',
                    color: c.ivory,
                  }}
                >
                  {introTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.82,
                    color: '#d6d2ca',
                  }}
                >
                  {introParagraphs.map((p, idx) => (
                    <p key={idx} style={{ margin: '0 0 18px' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: THE CONTACT SHEET (TIMELINE EXPOSURES) */}
            {exposures.length > 0 && (
              <section
                style={{
                  padding: '52px 0 60px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.68rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.amber,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  02 // THE CONTACT SHEET
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    margin: '0 0 28px',
                  }}
                >
                  Catatan Perjalanan per Exposure
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {exposures.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.surface,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.amber}`,
                        padding: '20px 22px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontFamily: mono,
                          fontSize: '0.68rem',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: c.amber,
                          marginBottom: '10px',
                        }}
                      >
                        <span>EXP {String(idx + 1).padStart(2, '0')}A</span>
                        {exp.meta && (
                          <span style={{ color: c.silver }}>{exp.meta}</span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: '1.18rem',
                          fontWeight: 600,
                          margin: '0 0 8px',
                          color: c.ivory,
                        }}
                      >
                        {exp.title}
                      </h4>

                      {exp.story && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.96rem',
                            lineHeight: 1.7,
                            color: c.silver,
                          }}
                        >
                          {exp.story}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 04: PRODUCTION NOTES (CREDITS) */}
            {productionNotes.length > 0 && (
              <section
                style={{
                  padding: '52px 0 60px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.68rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.amber,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  03 // PRODUCTION NOTES
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    margin: '0 0 24px',
                  }}
                >
                  Credits Tentang Kita
                </h3>

                <div
                  style={{
                    backgroundColor: c.surface,
                    border: `1px solid ${c.line}`,
                    padding: '8px 22px',
                  }}
                >
                  {productionNotes.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(120px, 180px) 1fr',
                        gap: '12px',
                        padding: '16px 0',
                        borderBottom:
                          idx < productionNotes.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                        alignItems: 'baseline',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.7rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: c.amber,
                        }}
                      >
                        {note.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.98rem',
                          lineHeight: 1.55,
                          color: c.ivory,
                        }}
                      >
                        {note.value || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: DARKROOM PRINTS (GALERI) */}
            {gallery.length > 0 && (
              <section
                style={{
                  padding: '52px 0 64px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.68rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.amber,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  04 // DARKROOM PRINTS
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    margin: '0 0 26px',
                  }}
                >
                  Cetakan Kenangan
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '18px',
                  }}
                >
                  {gallery.map((src, idx) => (
                    <motion.figure
                      key={`${src}-${idx}`}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.06 }}
                      style={{
                        margin: 0,
                        backgroundColor: c.surface,
                        border: `1px solid ${c.line}`,
                        padding: '10px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: mono,
                          fontSize: '0.62rem',
                          color: c.amber,
                          letterSpacing: '0.14em',
                          marginBottom: '8px',
                        }}
                      >
                        FRAME {String(idx + 1).padStart(2, '0')}A
                      </div>
                      <img
                        src={src}
                        alt={galleryCaptions[idx] || `Frame ${idx + 1}`}
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
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                          color: c.silver,
                        }}
                      >
                        {galleryCaptions[idx] || `Exposed moment #${idx + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* 06: END OF ROLL (PENUTUP) */}
            <footer
              style={{
                paddingTop: '52px',
                borderTop: `1px solid ${c.amberSoft}`,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: c.amber,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                END OF ROLL · NEXT ROLL LOADING
              </span>

              <h3
                style={{
                  fontSize: 'clamp(1.55rem, 4.5vw, 2.1rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  margin: '0 0 16px',
                  color: c.ivory,
                }}
              >
                {closingTitle}
              </h3>

              <p
                style={{
                  maxWidth: '500px',
                  margin: '0 auto 28px',
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  color: c.silver,
                }}
              >
                {closingText}
              </p>

              <p
                style={{
                  fontFamily: mono,
                  fontSize: '0.9rem',
                  color: c.amber,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '0 0 32px',
                }}
              >
                — {coupleNames}
              </p>

              <div
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: c.silver,
                  opacity: 0.7,
                  paddingTop: '18px',
                  borderTop: `1px dashed ${c.line}`,
                }}
              >
                35MM OF US · {rollCode}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
