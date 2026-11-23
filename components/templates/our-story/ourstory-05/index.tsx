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

export default function OurStory05({ website }: { website: WebsiteRecord }) {
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

  const editionMeta = getString(
    content,
    'editionMeta',
    'VOL. 05 · SPECIAL ISSUE',
  );
  const coverSubheadline = getString(
    content,
    'coverSubheadline',
    'All the little moments worth printing, kept in one special edition.',
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
    'Dokumentasi utama dari hari-hari terbaik yang pernah kita lalui.',
  );
  const leadTitle = getString(
    content,
    'leadTitle',
    'Bagaimana Hari-Hari Biasa Berubah Jadi Cerita Favorit',
  );
  const leadStory = getString(
    content,
    'leadStory',
    website.message ||
      'Edisi khusus ini dicetak untuk merayakan setiap momen kecil dan besar yang sudah kita lalui bersama.',
  );

  const chronicle = useMemo(() => {
    return getString(content, 'chronicle', '')
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

  const quickFacts = useMemo(() => {
    return getString(content, 'quickFacts', '')
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

  const editorsNoteTitle = getString(
    content,
    'editorsNoteTitle',
    'Catatan untuk Edisi-Edisi Berikutnya',
  );
  const editorsNoteText = getString(
    content,
    'editorsNoteText',
    'Terima kasih sudah menjadi bagian terbaik dari setiap halaman hidupku.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const leadParagraphs = leadStory
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

  // Palet Newsprint & Crisp Ink
  const c = {
    newsprint: '#f3f1eb',
    paper: '#faf9f5',
    ink: '#161615',
    muted: '#5e5d58',
    forest: '#2b4c3f',
    line: 'rgba(22, 22, 21, 0.16)',
    strongLine: 'rgba(22, 22, 21, 0.78)',
  };

  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const bodySerif = "'Newsreader', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.newsprint,
        color: c.ink,
        fontFamily: bodySerif,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .se5-dropcap::first-letter {
          float: left;
          font-family: ${serif};
          font-size: 3.4rem;
          line-height: 0.85;
          padding-right: 10px;
          padding-top: 4px;
          font-weight: 600;
          color: ${c.forest};
        }
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE FRONT PAGE (OPENING SCREEN) --- */
          <motion.section
            key="front-page"
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
                width: 'min(100%, 480px)',
                backgroundColor: c.paper,
                border: `1px solid ${c.line}`,
                padding: 'clamp(26px, 6vw, 42px)',
                boxShadow: '0 24px 56px rgba(22, 22, 21, 0.08)',
                textAlign: 'center',
              }}
            >
              {/* Masthead */}
              <div
                style={{
                  borderBottom: `3px double ${c.strongLine}`,
                  paddingBottom: '12px',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.35rem, 4.8vw, 1.85rem)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: c.ink,
                    display: 'block',
                  }}
                >
                  The Sunday Edition
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '6px',
                  fontFamily: mono,
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  paddingBottom: '12px',
                  borderBottom: `1px solid ${c.line}`,
                  marginBottom: '28px',
                }}
              >
                <span>{editionMeta}</span>
                <span style={{ color: c.forest }}>EDISI KHUSUS</span>
              </div>

              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: c.forest,
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                HEADLINE UTAMA
              </span>

              <h1
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(2.2rem, 7.5vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: c.ink,
                  margin: '0 0 16px',
                }}
              >
                {coupleNames}
              </h1>

              <p
                style={{
                  fontSize: '1.04rem',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  color: c.muted,
                  margin: '0 0 32px',
                }}
              >
                {coverSubheadline}
              </p>

              <motion.button
                type="button"
                onClick={() => setOpened(true)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: c.ink,
                  color: c.paper,
                  border: 'none',
                  fontFamily: sans,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Buka Edisi Lengkap →
              </motion.button>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI KORAN EDISI KHUSUS --- */
          <motion.div
            key="broadsheet-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: '24px 20px 88px',
            }}
          >
            {/* Broadsheet Masthead */}
            <header style={{ textAlign: 'center', marginBottom: '44px' }}>
              <div
                style={{
                  borderTop: `1px solid ${c.strongLine}`,
                  borderBottom: `3px double ${c.strongLine}`,
                  padding: '16px 0',
                }}
              >
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    margin: 0,
                    color: c.ink,
                  }}
                >
                  The Sunday Edition
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '10px 0',
                  borderBottom: `1px solid ${c.line}`,
                  fontFamily: mono,
                  fontSize: '0.66rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: c.muted,
                }}
              >
                <span>{editionMeta}</span>
                <span style={{ color: c.forest, fontWeight: 600 }}>
                  {coupleNames}
                </span>
                <span>{formattedDate || 'SPECIAL PRINT'}</span>
              </div>
            </header>

            {/* 02: LEAD STORY (FOTO UTAMA & ARTIKEL UTAMA) */}
            <article style={{ marginBottom: '56px' }}>
              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: c.forest,
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                01 · LEAD STORY
              </span>

              <h2
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.9rem, 5.5vw, 2.8rem)',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: c.ink,
                  margin: '0 0 12px',
                }}
              >
                {leadTitle}
              </h2>

              <p
                style={{
                  fontFamily: mono,
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  margin: '0 0 28px',
                }}
              >
                DITULIS OLEH {senderName} · UNTUK {receiverName}
              </p>

              {heroPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{
                    margin: '0 0 32px',
                    backgroundColor: c.paper,
                    border: `1px solid ${c.line}`,
                    padding: '10px',
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
                        marginTop: '10px',
                        fontSize: '0.92rem',
                        fontStyle: 'italic',
                        color: c.muted,
                        lineHeight: 1.5,
                      }}
                    >
                      {heroCaption}
                    </figcaption>
                  )}
                </motion.figure>
              )}

              <div
                style={{
                  backgroundColor: c.paper,
                  border: `1px solid ${c.line}`,
                  padding: 'clamp(24px, 5vw, 40px)',
                  fontSize: '1.14rem',
                  lineHeight: 1.88,
                  color: '#252422',
                }}
              >
                {leadParagraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={idx === 0 ? 'se5-dropcap' : undefined}
                    style={{
                      margin: idx < leadParagraphs.length - 1 ? '0 0 20px' : 0,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </article>

            {/* 03: THE CHRONICLE (KILAS BALIK PERJALANAN) */}
            {chronicle.length > 0 && (
              <section
                style={{
                  paddingTop: '44px',
                  marginBottom: '56px',
                  borderTop: `3px double ${c.strongLine}`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.forest,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  02 · THE CHRONICLE
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.8vw, 2.2rem)',
                    fontWeight: 600,
                    margin: '0 0 28px',
                  }}
                >
                  Arsip Perjalanan Kita
                </h3>

                <div
                  style={{
                    backgroundColor: c.paper,
                    border: `1px solid ${c.line}`,
                    padding: '6px clamp(20px, 4vw, 32px)',
                  }}
                >
                  {chronicle.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        padding: '22px 0',
                        borderBottom:
                          idx < chronicle.length - 1
                            ? `1px solid ${c.line}`
                            : 'none',
                      }}
                    >
                      {item.date && (
                        <span
                          style={{
                            fontFamily: mono,
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: c.forest,
                            display: 'block',
                            marginBottom: '6px',
                          }}
                        >
                          {item.date}
                        </span>
                      )}

                      <h4
                        style={{
                          fontFamily: serif,
                          fontSize: '1.38rem',
                          fontWeight: 600,
                          margin: '0 0 8px',
                          color: c.ink,
                        }}
                      >
                        {item.title}
                      </h4>

                      {item.story && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1.04rem',
                            lineHeight: 1.74,
                            color: c.muted,
                          }}
                        >
                          {item.story}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 04: QUICK FACTS (BY THE NUMBERS) */}
            {quickFacts.length > 0 && (
              <section
                style={{
                  paddingTop: '44px',
                  marginBottom: '56px',
                  borderTop: `1px solid ${c.strongLine}`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.forest,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  03 · QUICK FACTS
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.8vw, 2.2rem)',
                    fontWeight: 600,
                    margin: '0 0 24px',
                  }}
                >
                  Fakta Singkat Tentang Kita
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {quickFacts.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.paper,
                        border: `1px solid ${c.line}`,
                        borderTop: `3px solid ${c.forest}`,
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
                          color: c.forest,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        {item.label}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: sans,
                          fontSize: '0.96rem',
                          fontWeight: 500,
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

            {/* 05: PHOTO ESSAY (GALERI FOTO JURNALISTIK) */}
            {gallery.length > 0 && (
              <section
                style={{
                  paddingTop: '44px',
                  marginBottom: '60px',
                  borderTop: `1px solid ${c.strongLine}`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.forest,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  04 · PHOTO ESSAY
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.8vw, 2.2rem)',
                    fontWeight: 600,
                    margin: '0 0 26px',
                  }}
                >
                  Dokumentasi Momen Terbaik
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
                        backgroundColor: c.paper,
                        border: `1px solid ${c.line}`,
                        padding: '10px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: mono,
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                          color: c.forest,
                          marginBottom: '8px',
                        }}
                      >
                        FIG. {String(idx + 1).padStart(2, '0')}
                      </div>
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
                          fontSize: '0.92rem',
                          fontStyle: 'italic',
                          lineHeight: 1.48,
                          color: c.muted,
                        }}
                      >
                        {galleryCaptions[idx] || `Dokumentasi #${idx + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* 06: EDITOR'S NOTE (PENUTUP) */}
            <footer
              style={{
                backgroundColor: c.paper,
                borderTop: `3px double ${c.strongLine}`,
                borderBottom: `1px solid ${c.strongLine}`,
                borderLeft: `1px solid ${c.line}`,
                borderRight: `1px solid ${c.line}`,
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
                  color: c.forest,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                EDITOR’S NOTE
              </span>

              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                  fontWeight: 600,
                  color: c.ink,
                  margin: '0 0 16px',
                }}
              >
                {editorsNoteTitle}
              </h3>

              <p
                style={{
                  maxWidth: '500px',
                  margin: '0 auto 28px',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  lineHeight: 1.78,
                  color: c.muted,
                }}
              >
                “{editorsNoteText}”
              </p>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.7rem',
                  fontStyle: 'italic',
                  color: c.ink,
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
                  color: c.muted,
                  paddingTop: '16px',
                  borderTop: `1px dashed ${c.line}`,
                }}
              >
                THE SUNDAY EDITION · UNTUK {receiverName}
                {formattedDate ? ` · ${formattedDate}` : ''}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
