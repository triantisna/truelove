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

export default function OurStory04({ website }: { website: WebsiteRecord }) {
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

  const catalogCode = getString(
    content,
    'catalogCode',
    'LP-04 · 33 RPM · STEREO',
  );
  const coverTagline = getString(
    content,
    'coverTagline',
    'If our story were a vinyl record, I’d play every track on repeat.',
  );

  const heroPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.heroPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.heroPhoto, website.media]);

  const heroCaption = getString(
    content,
    'heroCaption',
    'Sampul depan dari hari-hari terbaik yang pernah kita jalani.',
  );
  const linerNotesTitle = getString(
    content,
    'linerNotesTitle',
    'Catatan di Balik Album Kita',
  );
  const linerNotesText = getString(
    content,
    'linerNotesText',
    website.message ||
      'Album kecil ini kusimpan sebagai pengingat dari setiap trek yang sudah kita lewati bersama.',
  );

  const tracklist = useMemo(() => {
    return getString(content, 'tracklist', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            title: parts[0],
            date: parts[1],
            story: parts.slice(2).join(' | '),
          };
        }
        if (parts.length === 2) {
          return { title: parts[0], date: parts[1], story: '' };
        }
        return { title: parts[0], date: '', story: '' };
      });
  }, [content]);

  const albumCredits = useMemo(() => {
    return getString(content, 'albumCredits', '')
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

  const hiddenTrackTitle = getString(
    content,
    'hiddenTrackTitle',
    'Hidden Track — Untuk Tahun-Tahun Berikutnya',
  );
  const hiddenTrackText = getString(
    content,
    'hiddenTrackText',
    'Side A sudah kita lewati dengan indah, dan aku tidak sabar memutar Side B bersamamu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const linerParagraphs = linerNotesText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const formattedDate = useMemo(() => {
    const d = website.createdAt ? new Date(website.createdAt) : new Date();
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [website.createdAt]);

  // Palet Warm Vinyl & Deep Burgundy
  const c = {
    cream: '#f6f2eb',
    sleeve: '#fcfaf5',
    burgundy: '#4a202a',
    vinyl: '#191817',
    brass: '#b89552',
    ink: '#24201e',
    muted: '#6c635c',
    line: 'rgba(74, 32, 42, 0.14)',
  };

  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.cream,
        color: c.ink,
        fontFamily: sans,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE ALBUM SLEEVE (OPENING SCREEN) --- */
          <motion.section
            key="album-sleeve"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
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
                width: 'min(100%, 440px)',
                position: 'relative',
              }}
            >
              {/* Siluet Piringan Hitam menyembul di atas sampul */}
              <div
                aria-hidden="true"
                style={{
                  width: '180px',
                  height: '90px',
                  margin: '0 auto -2px',
                  borderRadius: '180px 180px 0 0',
                  background: `radial-gradient(circle at 50% 100%, ${c.burgundy} 0 26px, ${c.brass} 26px 28px, ${c.vinyl} 28px 54px, #2a2826 55px, ${c.vinyl} 56px 76px, #2a2826 77px, ${c.vinyl} 78px)`,
                  position: 'relative',
                  boxShadow: '0 -8px 24px rgba(25, 24, 23, 0.16)',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: c.cream,
                  }}
                />
              </div>

              {/* Sampul Album */}
              <div
                style={{
                  backgroundColor: c.sleeve,
                  border: `1px solid ${c.line}`,
                  padding: 'clamp(28px, 6vw, 42px)',
                  textAlign: 'center',
                  boxShadow: '0 24px 56px rgba(74, 32, 42, 0.1)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.brass,
                    paddingBottom: '14px',
                    borderBottom: `1px solid ${c.line}`,
                    marginBottom: '26px',
                  }}
                >
                  <span>SIDE A &amp; SIDE B</span>
                  <span>{catalogCode}</span>
                </div>

                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.muted,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  ALBUM PERJALANAN
                </span>

                <h1
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(2.1rem, 7vw, 2.8rem)',
                    fontWeight: 600,
                    lineHeight: 1.14,
                    color: c.burgundy,
                    margin: '0 0 16px',
                  }}
                >
                  {coupleNames}
                </h1>

                <p
                  style={{
                    fontSize: '0.96rem',
                    lineHeight: 1.65,
                    color: c.muted,
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
                    backgroundColor: c.burgundy,
                    color: c.sleeve,
                    border: 'none',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Putar Cerita Kita →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI ALBUM --- */
          <motion.div
            key="vinyl-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              padding: '0 20px 88px',
            }}
          >
            {/* Header Bar */}
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
                color: c.muted,
              }}
            >
              <span style={{ color: c.burgundy, fontWeight: 600 }}>
                {coupleNames}
              </span>
              <span style={{ color: c.brass }}>{catalogCode}</span>
            </header>

            {/* 02: LINER NOTES (FOTO UTAMA & CATATAN SAMPUL) */}
            <section style={{ padding: '52px 0 60px' }}>
              {heroPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  style={{
                    margin: '0 0 42px',
                    backgroundColor: c.sleeve,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                    boxShadow: '0 14px 36px rgba(74, 32, 42, 0.06)',
                  }}
                >
                  <img
                    src={heroPhoto}
                    alt={heroCaption}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {heroCaption && (
                    <figcaption
                      style={{
                        paddingTop: '12px',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        color: c.muted,
                        textAlign: 'center',
                      }}
                    >
                      {heroCaption}
                    </figcaption>
                  )}
                </motion.figure>
              )}

              <div
                style={{
                  backgroundColor: c.sleeve,
                  border: `1px solid ${c.line}`,
                  borderTop: `3px solid ${c.burgundy}`,
                  padding: 'clamp(24px, 5vw, 40px)',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.brass,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  SIDE A · LINER NOTES
                </span>

                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.75rem, 4.8vw, 2.3rem)',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: c.burgundy,
                    margin: '0 0 22px',
                  }}
                >
                  {linerNotesTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.85,
                    color: c.ink,
                  }}
                >
                  {linerParagraphs.map((p, idx) => (
                    <p key={idx} style={{ margin: '0 0 18px' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: THE TRACKLIST (TIMELINE MOMEN) */}
            {tracklist.length > 0 && (
              <section
                style={{
                  padding: '48px 0 56px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.brass,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  SIDE A · THE TRACKLIST
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.burgundy,
                    margin: '0 0 28px',
                  }}
                >
                  Daftar Momen yang Selalu Kuputar Ulang
                </h3>

                <div
                  style={{
                    backgroundColor: c.sleeve,
                    border: `1px solid ${c.line}`,
                    padding: '8px clamp(18px, 4vw, 28px)',
                  }}
                >
                  {tracklist.map((track, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        padding: '20px 0',
                        borderBottom:
                          idx < tracklist.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '12px',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: mono,
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: c.brass,
                            }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <h4
                            style={{
                              fontFamily: serif,
                              fontSize: '1.3rem',
                              fontWeight: 600,
                              color: c.burgundy,
                              margin: 0,
                            }}
                          >
                            {track.title}
                          </h4>
                        </div>

                        {track.date && (
                          <span
                            style={{
                              fontFamily: mono,
                              fontSize: '0.68rem',
                              letterSpacing: '0.1em',
                              color: c.muted,
                              textTransform: 'uppercase',
                            }}
                          >
                            {track.date}
                          </span>
                        )}
                      </div>

                      {track.story && (
                        <p
                          style={{
                            margin: '0 0 0 28px',
                            fontSize: '0.96rem',
                            lineHeight: 1.72,
                            color: c.muted,
                          }}
                        >
                          {track.story}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 04: ALBUM CREDITS */}
            {albumCredits.length > 0 && (
              <section
                style={{
                  padding: '48px 0 56px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.brass,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  SIDE B · ALBUM CREDITS
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.burgundy,
                    margin: '0 0 24px',
                  }}
                >
                  Catatan Produksi Tentang Kita
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {albumCredits.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.sleeve,
                        border: `1px solid ${c.line}`,
                        padding: '18px 20px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: c.brass,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        {item.label}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.96rem',
                          lineHeight: 1.55,
                          color: c.ink,
                          fontWeight: 500,
                        }}
                      >
                        {item.value || '—'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: INSIDE THE SLEEVE (GALERI KENANGAN) */}
            {gallery.length > 0 && (
              <section
                style={{
                  padding: '48px 0 60px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.brass,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  SIDE B · INSIDE THE SLEEVE
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.burgundy,
                    margin: '0 0 26px',
                  }}
                >
                  Lembaran Foto di Dalam Sampul
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
                        backgroundColor: c.sleeve,
                        border: `1px solid ${c.line}`,
                        padding: '10px',
                      }}
                    >
                      <img
                        src={src}
                        alt={galleryCaptions[idx] || `Foto ${idx + 1}`}
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
                          fontStyle: 'italic',
                          lineHeight: 1.48,
                          color: c.muted,
                        }}
                      >
                        {galleryCaptions[idx] || `Track Photo #${idx + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* 06: HIDDEN TRACK (PENUTUP) */}
            <footer
              style={{
                backgroundColor: c.vinyl,
                color: c.cream,
                padding: 'clamp(32px, 6vw, 48px) 24px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: c.brass,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                BONUS · HIDDEN TRACK
              </span>

              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                  fontWeight: 500,
                  color: c.cream,
                  margin: '0 0 16px',
                }}
              >
                {hiddenTrackTitle}
              </h3>

              <p
                style={{
                  maxWidth: '490px',
                  margin: '0 auto 28px',
                  fontSize: '1rem',
                  lineHeight: 1.78,
                  color: 'rgba(246, 242, 235, 0.82)',
                }}
              >
                {hiddenTrackText}
              </p>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.7rem',
                  fontStyle: 'italic',
                  color: c.brass,
                  margin: '0 0 28px',
                }}
              >
                — {senderName}
              </p>

              <div
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(246, 242, 235, 0.55)',
                  paddingTop: '16px',
                  borderTop: '1px dashed rgba(246, 242, 235, 0.2)',
                }}
              >
                SIDE A &amp; SIDE B · UNTUK {receiverName}
                {formattedDate ? ` · ${formattedDate}` : ''}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
