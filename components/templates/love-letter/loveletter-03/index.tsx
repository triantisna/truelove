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
    return value.map((item) => getMediaUrl(item)).filter((url) => Boolean(url));
  }
  if (typeof value === 'string' && value.trim() !== '') return [value];
  return [];
}

export default function LoveLetter03({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const content = (website.content ?? {}) as ContentValue;

  const bookTitle = getString(content, 'bookTitle', 'Bab Tentangmu');
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
  const dedicationQuote = getString(
    content,
    'dedicationQuote',
    'Jika hidupku adalah sebuah buku, kamu adalah bab favorit yang tidak pernah bosan kubaca berulang kali.',
  );
  const chapterTitle = getString(
    content,
    'chapterTitle',
    'Tentang Cara Kamu Membuat Semuanya Terasa Pulang',
  );
  const mainLetter = getString(
    content,
    'mainLetter',
    website.message ||
      'Ada banyak hal yang ingin kusampaikan, dan halaman ini adalah tempat terbaik untuk memulainya.',
  );
  const heroImage = getMediaUrl(content.heroImage);

  const marginNotes = getString(content, 'marginNotes', '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

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

  const closingText = getString(
    content,
    'closingText',
    'Terima kasih sudah menjadi bagian paling tenang di setiap halamanku.',
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
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [website.createdAt]);

  // Palet Organic Literary
  const c = {
    paper: '#f9f7f2',
    paperAlt: '#f2eee5',
    forest: '#2c3e35',
    forestDark: '#1f2d26',
    sand: '#dfd7c8',
    ink: '#242422',
    inkSoft: '#636059',
    accent: '#9c7c52',
  };

  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.paper,
        color: c.ink,
        fontFamily: serif,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        .chapter-dropcap::first-letter {
          float: left;
          font-size: 3.6rem;
          line-height: 0.82;
          padding-right: 10px;
          padding-top: 6px;
          color: ${c.forest};
          font-weight: 500;
        }
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE BOOK COVER --- */
          <motion.section
            key="book-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.65 }}
            style={{
              minHeight: '100svh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 20px',
              backgroundColor: c.paperAlt,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(100%, 380px)',
                backgroundColor: c.forest,
                color: c.paper,
                borderRadius: '4px 12px 12px 4px',
                padding: '44px 32px 40px 38px',
                position: 'relative',
                boxShadow:
                  '-8px 0 0 #1c2923, 0 28px 65px rgba(31, 45, 38, 0.28)',
                textAlign: 'center',
              }}
            >
              {/* Garis lipatan punggung buku */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '16px',
                  width: '1px',
                  backgroundColor: 'rgba(249, 247, 242, 0.16)',
                }}
              />

              {/* Bingkai tipis di dalam sampul */}
              <div
                style={{
                  border: '1px solid rgba(223, 215, 200, 0.28)',
                  padding: '36px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.65rem',
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: '#cbb99e',
                    marginBottom: '26px',
                  }}
                >
                  Edisi Khusus
                </span>

                <h1
                  style={{
                    fontSize: 'clamp(2.2rem, 7vw, 2.8rem)',
                    fontWeight: 400,
                    lineHeight: 1.12,
                    margin: '0 0 14px',
                    color: '#fdfbf7',
                  }}
                >
                  {bookTitle}
                </h1>

                <div
                  style={{
                    width: '36px',
                    height: '1px',
                    backgroundColor: '#cbb99e',
                    margin: '12px 0 18px',
                  }}
                />

                <p
                  style={{
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    color: '#e6dfd3',
                    margin: '0 0 36px',
                  }}
                >
                  Untuk {receiverName}
                </p>

                <motion.button
                  type="button"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: c.paper,
                    color: c.forestDark,
                    border: 'none',
                    borderRadius: '2px',
                    fontFamily: sans,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Buka Halaman Pertama →
                </motion.button>

                <p
                  style={{
                    fontFamily: sans,
                    fontSize: '0.68rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(249, 247, 242, 0.55)',
                    margin: '36px 0 0',
                  }}
                >
                  Ditulis oleh {senderName}
                </p>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 05: ISI BUKU --- */
          <motion.div
            key="book-pages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              padding: '0 22px 88px',
            }}
          >
            {/* Running Header ala Buku */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 0',
                borderBottom: `1px solid ${c.sand}`,
                fontFamily: sans,
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: c.inkSoft,
              }}
            >
              <span>{bookTitle}</span>
              <span>Untuk {receiverName}</span>
            </header>

            {/* 02: HALAMAN DEDIKASI */}
            <section
              style={{
                padding: '84px 12px 76px',
                textAlign: 'center',
                borderBottom: `1px solid ${c.sand}`,
              }}
            >
              <p
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: c.accent,
                  margin: '0 0 22px',
                }}
              >
                Dedikasi
              </p>
              <blockquote
                style={{
                  margin: '0 auto',
                  maxWidth: '500px',
                  fontSize: 'clamp(1.45rem, 4.5vw, 1.95rem)',
                  fontStyle: 'italic',
                  lineHeight: 1.55,
                  color: c.forest,
                }}
              >
                “{dedicationQuote}”
              </blockquote>
            </section>

            {/* 03: BAB I — SURAT UTAMA */}
            <article style={{ padding: '72px 0 64px' }}>
              <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.7rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: c.accent,
                  }}
                >
                  Bab I
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.9rem, 5vw, 2.6rem)',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: c.forest,
                    margin: '12px 0 0',
                  }}
                >
                  {chapterTitle}
                </h2>
              </div>

              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={idx === 0 ? 'chapter-dropcap' : undefined}
                  style={{
                    fontSize: '1.22rem',
                    lineHeight: 1.9,
                    color: c.ink,
                    margin: '0 0 24px',
                  }}
                >
                  {p}
                </p>
              ))}

              {/* Foto Utama Editorial */}
              {heroImage && (
                <motion.figure
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75 }}
                  style={{
                    margin: '44px 0 0',
                    padding: '12px',
                    backgroundColor: '#fff',
                    border: `1px solid ${c.sand}`,
                  }}
                >
                  <img
                    src={heroImage}
                    alt={`Kenangan bersama ${receiverName}`}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <figcaption
                    style={{
                      paddingTop: '12px',
                      fontFamily: sans,
                      fontSize: '0.72rem',
                      letterSpacing: '0.1em',
                      color: c.inkSoft,
                      textAlign: 'center',
                    }}
                  >
                    Gbr. 01 — Salah satu halaman favoritku bersamamu
                  </figcaption>
                </motion.figure>
              )}
            </article>

            {/* 04: CATATAN PINGGIR (MARGIN NOTES) */}
            {marginNotes.length > 0 && (
              <section
                style={{
                  padding: '56px 28px',
                  backgroundColor: c.paperAlt,
                  borderTop: `2px solid ${c.forest}`,
                  borderBottom: `1px solid ${c.sand}`,
                  marginBottom: '68px',
                }}
              >
                <p
                  style={{
                    fontFamily: sans,
                    fontSize: '0.68rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: c.accent,
                    margin: '0 0 8px',
                  }}
                >
                  Catatan Pinggir
                </p>
                <h3
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 500,
                    color: c.forest,
                    margin: '0 0 28px',
                  }}
                >
                  Hal-hal kecil yang selalu kusyukuri darimu
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  }}
                >
                  {marginNotes.map((note, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'baseline',
                        paddingBottom: '16px',
                        borderBottom:
                          idx < marginNotes.length - 1
                            ? `1px dashed ${c.sand}`
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: sans,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: c.accent,
                          flexShrink: 0,
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '1.15rem',
                          lineHeight: 1.65,
                          color: c.ink,
                        }}
                      >
                        {note}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: PENANDA HALAMAN (GALERI EDITORIAL) */}
            {gallery.length > 0 && (
              <section style={{ marginBottom: '72px' }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: '0.68rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: c.accent,
                    }}
                  >
                    Penanda Halaman
                  </span>
                  <h3
                    style={{
                      fontSize: '1.9rem',
                      fontWeight: 500,
                      color: c.forest,
                      margin: '8px 0 0',
                    }}
                  >
                    Momen yang Disimpan
                  </h3>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {gallery.map((src, i) => (
                    <motion.figure
                      key={`${src}-${i}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.07 }}
                      style={{
                        margin: 0,
                        backgroundColor: '#fff',
                        border: `1px solid ${c.sand}`,
                        padding: '10px 10px 14px',
                      }}
                    >
                      <img
                        src={src}
                        alt={galleryCaptions[i] || `Kenangan ${i + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '4 / 5',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <figcaption
                        style={{
                          paddingTop: '10px',
                          fontSize: '0.95rem',
                          fontStyle: 'italic',
                          color: c.inkSoft,
                          lineHeight: 1.45,
                        }}
                      >
                        {galleryCaptions[i] || `Halaman ${i + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* EPILOG & COLOPHON */}
            <footer
              style={{
                paddingTop: '48px',
                borderTop: `1px solid ${c.sand}`,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: c.accent,
                  margin: '0 0 16px',
                }}
              >
                Epilog
              </p>
              <p
                style={{
                  maxWidth: '480px',
                  margin: '0 auto 28px',
                  fontSize: '1.3rem',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  color: c.forest,
                }}
              >
                {closingText}
              </p>
              <p
                style={{
                  fontSize: '1.65rem',
                  fontStyle: 'italic',
                  color: c.ink,
                  margin: '0 0 40px',
                }}
              >
                — {senderName}
              </p>

              <div
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: c.inkSoft,
                  paddingTop: '20px',
                  borderTop: `1px dashed ${c.sand}`,
                }}
              >
                Dicetak khusus untuk {receiverName}
                {formattedDate ? ` · ${formattedDate}` : ''}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
