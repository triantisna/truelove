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

export default function OurStory01({ website }: { website: WebsiteRecord }) {
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

  const sinceYear = getString(content, 'sinceYear', '2022');
  const coverTagline = getString(
    content,
    'coverTagline',
    'Setiap cerita cinta itu indah, tapi cerita kita adalah yang paling ingin kusimpan.',
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
    'Halaman pertama yang tidak pernah ingin kututup.',
  );
  const prologueTitle = getString(
    content,
    'prologueTitle',
    'Bagaimana Semuanya Dimulai',
  );
  const prologueText = getString(
    content,
    'prologueText',
    website.message ||
      'Di sini aku simpan potongan-potongan cerita perjalanan kita, dari awal bertemu hingga hari ini.',
  );

  const chapters = useMemo(() => {
    return getString(content, 'chapters', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            date: parts[0],
            title: parts[1],
            story: parts.slice(2).join(' | '),
          };
        }
        if (parts.length === 2) {
          return { date: parts[0], title: parts[1], story: '' };
        }
        return { date: '', title: parts[0], story: '' };
      });
  }, [content]);

  const littleThings = useMemo(() => {
    return getString(content, 'littleThings', '')
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

  const epilogueTitle = getString(
    content,
    'epilogueTitle',
    'Masih Banyak Bab yang Ingin Kutulis Bersamamu',
  );
  const epilogueText = getString(
    content,
    'epilogueText',
    'Bab-bab berikutnya masih kosong, dan aku ingin terus mengisinya satu per satu bersamamu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const prologueParagraphs = prologueText
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

  // Palet Editorial Memoir (Kinfolk)
  const c = {
    paper: '#f7f4ef',
    stone: '#ece6dd',
    card: '#fcfaf7',
    ink: '#1e1d1b',
    muted: '#6b655e',
    terracotta: '#8c4a3c',
    line: 'rgba(30, 29, 27, 0.13)',
  };

  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const bodySerif = "'Newsreader', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.paper,
        color: c.ink,
        fontFamily: bodySerif,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE BOOK COVER --- */
          <motion.section
            key="book-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.65 }}
            style={{
              minHeight: '100svh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 20px',
              backgroundColor: c.stone,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(100%, 430px)',
                backgroundColor: c.card,
                border: `1px solid ${c.line}`,
                padding: 'clamp(32px, 7vw, 50px) clamp(24px, 6vw, 40px)',
                textAlign: 'center',
                boxShadow: '0 26px 60px rgba(30, 29, 27, 0.08)',
                position: 'relative',
              }}
            >
              {/* Inner editorial frame */}
              <div
                style={{
                  border: `1px solid ${c.line}`,
                  padding: 'clamp(28px, 6vw, 42px) clamp(18px, 4vw, 28px)',
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '18px',
                  }}
                >
                  CHAPTERS OF US {sinceYear ? `· EST. ${sinceYear}` : ''}
                </span>

                <h1
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(2.35rem, 8vw, 3.2rem)',
                    fontWeight: 500,
                    lineHeight: 1.08,
                    margin: '0 0 18px',
                    color: c.ink,
                  }}
                >
                  {coupleNames}
                </h1>

                <div
                  aria-hidden="true"
                  style={{
                    width: '36px',
                    height: '1px',
                    backgroundColor: c.terracotta,
                    margin: '0 auto 20px',
                  }}
                />

                <p
                  style={{
                    fontSize: '1.02rem',
                    fontStyle: 'italic',
                    lineHeight: 1.65,
                    color: c.muted,
                    margin: '0 0 34px',
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
                    padding: '13px 20px',
                    backgroundColor: c.ink,
                    color: c.card,
                    border: 'none',
                    fontFamily: sans,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Buka Cerita Kita →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI MEMOAR --- */
          <motion.div
            key="memoir-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              padding: '0 22px 92px',
            }}
          >
            {/* Header Editorial */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '26px 0',
                borderBottom: `1px solid ${c.line}`,
                fontFamily: sans,
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: c.muted,
              }}
            >
              <span>{coupleNames}</span>
              <span style={{ color: c.terracotta }}>
                {sinceYear ? `EST. ${sinceYear}` : 'OUR STORY'}
              </span>
            </header>

            {/* 02: PROLOGUE & HERO FRAME */}
            <section style={{ padding: '56px 0 64px' }}>
              {heroPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    margin: '0 0 44px',
                    backgroundColor: c.card,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
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
                        fontSize: '0.94rem',
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

              <div style={{ maxWidth: '620px', margin: '0 auto' }}>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  Prolog
                </span>

                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.9rem, 5.2vw, 2.6rem)',
                    fontWeight: 500,
                    lineHeight: 1.18,
                    margin: '0 0 24px',
                    color: c.ink,
                  }}
                >
                  {prologueTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1.14rem',
                    lineHeight: 1.9,
                    color: '#2d2b28',
                  }}
                >
                  {prologueParagraphs.map((p, idx) => (
                    <p key={idx} style={{ margin: '0 0 20px' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: THE CHAPTERS (TIMELINE) */}
            {chapters.length > 0 && (
              <section
                style={{
                  padding: '56px 0 64px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <div style={{ marginBottom: '36px' }}>
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: c.terracotta,
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Garis Waktu
                  </span>
                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: 'clamp(1.75rem, 4.8vw, 2.35rem)',
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    Bab-Bab Perjalanan Kita
                  </h3>
                </div>

                <div
                  style={{
                    borderLeft: `1px solid ${c.line}`,
                    paddingLeft: 'clamp(20px, 4vw, 32px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '34px',
                  }}
                >
                  {chapters.map((ch, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: idx * 0.06 }}
                      style={{ position: 'relative' }}
                    >
                      {/* Titik penanda bab */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: 'calc(-1 * clamp(20px, 4vw, 32px) - 4.5px)',
                          top: '7px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: c.terracotta,
                        }}
                      />

                      <div
                        style={{
                          fontFamily: sans,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: c.terracotta,
                          marginBottom: '6px',
                        }}
                      >
                        Bab {String(idx + 1).padStart(2, '0')}
                        {ch.date ? ` · ${ch.date}` : ''}
                      </div>

                      <h4
                        style={{
                          fontFamily: serif,
                          fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
                          fontWeight: 500,
                          margin: '0 0 8px',
                          color: c.ink,
                        }}
                      >
                        {ch.title}
                      </h4>

                      {ch.story && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1.05rem',
                            lineHeight: 1.75,
                            color: c.muted,
                          }}
                        >
                          {ch.story}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 04: LITTLE THINGS ABOUT US */}
            {littleThings.length > 0 && (
              <section
                style={{
                  padding: '52px 0 60px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: c.muted,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Arsip Kecil
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 500,
                    margin: '0 0 26px',
                  }}
                >
                  Hal-Hal Kecil Tentang Kita
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {littleThings.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.card,
                        border: `1px solid ${c.line}`,
                        padding: '20px 22px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: sans,
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: c.terracotta,
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        {item.label}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '1.04rem',
                          lineHeight: 1.55,
                          color: c.ink,
                        }}
                      >
                        {item.value || '—'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: COLLECTED FRAMES (GALERI KENANGAN) */}
            {gallery.length > 0 && (
              <section
                style={{
                  padding: '52px 0 64px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Collected Frames
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 500,
                    margin: '0 0 26px',
                  }}
                >
                  Potongan Momen yang Kusimpan
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
                        backgroundColor: c.card,
                        border: `1px solid ${c.line}`,
                        padding: '10px',
                      }}
                    >
                      <img
                        src={src}
                        alt={galleryCaptions[idx] || `Kenangan ${idx + 1}`}
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
                          fontSize: '0.92rem',
                          fontStyle: 'italic',
                          lineHeight: 1.45,
                          color: c.muted,
                        }}
                      >
                        {galleryCaptions[idx] || `Momen #${idx + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* 06: STILL WRITING (EPILOG PENUTUP) */}
            <footer
              style={{
                paddingTop: '56px',
                borderTop: `1px solid ${c.line}`,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: c.terracotta,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Epilog · Still Writing
              </span>

              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.75rem, 4.8vw, 2.3rem)',
                  fontWeight: 500,
                  margin: '0 0 18px',
                  color: c.ink,
                }}
              >
                {epilogueTitle}
              </h3>

              <p
                style={{
                  maxWidth: '500px',
                  margin: '0 auto 30px',
                  fontSize: '1.14rem',
                  fontStyle: 'italic',
                  lineHeight: 1.78,
                  color: c.muted,
                }}
              >
                “{epilogueText}”
              </p>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.75rem',
                  fontStyle: 'italic',
                  color: c.ink,
                  margin: '0 0 36px',
                }}
              >
                — {coupleNames}
              </p>

              <div
                style={{
                  fontFamily: sans,
                  fontSize: '0.66rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  paddingTop: '18px',
                  borderTop: `1px dashed ${c.line}`,
                }}
              >
                Chapters of Us · {coupleNames}
                {formattedDate ? ` · ${formattedDate}` : ''}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
