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

export default function LoveLetter05({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const content = (website.content ?? {}) as ContentValue;

  const masthead = getString(content, 'masthead', 'THE SPECIAL EDITION');
  const receiverName = getString(
    content,
    'receiverName',
    website.receiverName || 'Kamu',
  );
  const senderName = getString(
    content,
    'senderName',
    website.senderName || 'Penulis',
  );
  const headline = getString(
    content,
    'headline',
    'Berita Utama: Aku Masih Jatuh Cinta Padamu Setiap Hari',
  );
  const subheadline = getString(
    content,
    'subheadline',
    'Sebuah edisi khusus yang diterbitkan secara eksklusif hanya untuk satu pembaca.',
  );
  const heroImage = getMediaUrl(content.heroImage);
  const mainLetter = getString(
    content,
    'mainLetter',
    website.message ||
      'Di tengah semua hal yang berubah cepat, memilikimu adalah kabar baik yang selalu kupegang.',
  );

  const inBriefItems = useMemo(() => {
    return getString(content, 'inBrief', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, ...rest] = line.split('|');
        return {
          title: title.trim(),
          body: rest.join('|').trim(),
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

  const personalNotice = getString(
    content,
    'personalNotice',
    `Diumumkan secara resmi bahwa hati penulis masih sepenuhnya ditempati oleh ${receiverName}.`,
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
    if (Number.isNaN(d.getTime())) return 'EDISI KHUSUS';
    return d
      .toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .toUpperCase();
  }, [website.createdAt]);

  // Palet Crisp Newsprint
  const c = {
    paper: '#f4f2ec',
    paperLight: '#faf9f5',
    ink: '#141414',
    muted: '#5c5a54',
    navy: '#23395d',
    line: '#141414',
    lineSoft: 'rgba(20, 20, 20, 0.2)',
  };

  const headlineFont = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const bodyFont = "'Newsreader', Georgia, 'Times New Roman', serif";
  const uiFont = "system-ui, -apple-system, 'Segoe UI', sans-serif";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.paper,
        color: c.ink,
        fontFamily: bodyFont,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,600;0,700;1,500&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE FRONT PAGE (OPENING) --- */
          <motion.section
            key="front-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55 }}
            style={{
              minHeight: '100svh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 18px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(100%, 540px)',
                backgroundColor: c.paperLight,
                border: `1px solid ${c.line}`,
                padding: 'clamp(22px, 5vw, 36px)',
                boxShadow: '0 22px 50px rgba(20, 20, 20, 0.08)',
              }}
            >
              {/* Masthead */}
              <div
                style={{
                  textAlign: 'center',
                  borderBottom: `3px double ${c.line}`,
                  paddingBottom: '12px',
                  marginBottom: '10px',
                }}
              >
                <h1
                  style={{
                    fontFamily: headlineFont,
                    fontSize: 'clamp(1.6rem, 5.5vw, 2.35rem)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  {masthead}
                </h1>
              </div>

              {/* Edition Strip */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                  fontFamily: uiFont,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: c.muted,
                  paddingBottom: '10px',
                  borderBottom: `1px solid ${c.lineSoft}`,
                  marginBottom: '22px',
                }}
              >
                <span>VOL. 01 · NO. 01</span>
                <span>UNTUK {receiverName.toUpperCase()}</span>
              </div>

              {/* Front Page Headline */}
              <h2
                style={{
                  fontFamily: headlineFont,
                  fontSize: 'clamp(1.45rem, 4.8vw, 2rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  margin: '0 0 12px',
                  color: c.ink,
                }}
              >
                {headline}
              </h2>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.96rem',
                  fontStyle: 'italic',
                  color: c.muted,
                  lineHeight: 1.55,
                  margin: '0 auto 22px',
                  maxWidth: '440px',
                }}
              >
                {subheadline}
              </p>

              {/* Front Page Photo */}
              {heroImage && (
                <div
                  style={{
                    border: `1px solid ${c.lineSoft}`,
                    padding: '6px',
                    backgroundColor: '#fff',
                    marginBottom: '22px',
                  }}
                >
                  <img
                    src={heroImage}
                    alt={headline}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'grayscale(18%) contrast(1.04)',
                    }}
                  />
                </div>
              )}

              <motion.button
                type="button"
                onClick={() => setOpened(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: c.navy,
                  color: '#fff',
                  border: 'none',
                  fontFamily: uiFont,
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Buka & Baca Edisi Lengkap →
              </motion.button>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 05: FULL EDITION --- */
          <motion.div
            key="full-edition"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              padding: '28px 20px 80px',
            }}
          >
            {/* Masthead Header */}
            <header
              style={{
                textAlign: 'center',
                borderTop: `2px solid ${c.line}`,
                borderBottom: `3px double ${c.line}`,
                padding: '18px 0 14px',
                marginBottom: '12px',
              }}
            >
              <h1
                style={{
                  fontFamily: headlineFont,
                  fontSize: 'clamp(1.8rem, 6vw, 2.9rem)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                {masthead}
              </h1>
            </header>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontFamily: uiFont,
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: c.muted,
                paddingBottom: '12px',
                borderBottom: `1px solid ${c.line}`,
                marginBottom: '44px',
              }}
            >
              <span>{formattedDate}</span>
              <span>EDISI EKSKLUSIF UNTUK {receiverName.toUpperCase()}</span>
            </div>

            {/* 02: LEAD STORY */}
            <article style={{ marginBottom: '56px' }}>
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: c.navy,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                LEAD STORY · MODERN LOVE
              </span>

              <h2
                style={{
                  fontFamily: headlineFont,
                  fontSize: 'clamp(1.85rem, 5vw, 2.75rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  margin: '0 0 14px',
                }}
              >
                {headline}
              </h2>

              <p
                style={{
                  fontSize: '1.15rem',
                  fontStyle: 'italic',
                  color: c.muted,
                  lineHeight: 1.55,
                  margin: '0 0 20px',
                }}
              >
                {subheadline}
              </p>

              <p
                style={{
                  fontFamily: uiFont,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: c.ink,
                  padding: '10px 0',
                  borderTop: `1px solid ${c.lineSoft}`,
                  borderBottom: `1px solid ${c.lineSoft}`,
                  margin: '0 0 28px',
                }}
              >
                Ditulis oleh {senderName}
              </p>

              {heroImage && (
                <figure style={{ margin: '0 0 32px' }}>
                  <div
                    style={{
                      border: `1px solid ${c.lineSoft}`,
                      padding: '8px',
                      backgroundColor: '#fff',
                    }}
                  >
                    <img
                      src={heroImage}
                      alt={headline}
                      style={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  <figcaption
                    style={{
                      marginTop: '8px',
                      fontFamily: uiFont,
                      fontSize: '0.72rem',
                      color: c.muted,
                    }}
                  >
                    Arsip Utama — Didedikasikan untuk {receiverName}.
                  </figcaption>
                </figure>
              )}

              <div
                style={{
                  fontSize: '1.16rem',
                  lineHeight: 1.88,
                  color: c.ink,
                }}
              >
                {paragraphs.map((p, idx) => (
                  <p key={idx} style={{ margin: '0 0 20px' }}>
                    {p}
                  </p>
                ))}
              </div>
            </article>

            {/* 03: IN BRIEF */}
            {inBriefItems.length > 0 && (
              <section
                style={{
                  padding: '36px 0 44px',
                  borderTop: `2px solid ${c.line}`,
                  marginBottom: '48px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '22px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: headlineFont,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    In Brief
                  </h3>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: '0.68rem',
                      letterSpacing: '0.14em',
                      color: c.navy,
                      fontWeight: 700,
                    }}
                  >
                    CATATAN SINGKAT
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {inBriefItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: c.paperLight,
                        border: `1px solid ${c.lineSoft}`,
                        borderTop: `2px solid ${c.navy}`,
                        padding: '18px 20px',
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: uiFont,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: c.navy,
                          margin: '0 0 8px',
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.98rem',
                          lineHeight: 1.6,
                          color: c.ink,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 04: PHOTO ESSAY */}
            {gallery.length > 0 && (
              <section
                style={{
                  padding: '36px 0 48px',
                  borderTop: `2px solid ${c.line}`,
                  marginBottom: '48px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: headlineFont,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    Photo Essay
                  </h3>
                  <span
                    style={{
                      fontFamily: uiFont,
                      fontSize: '0.68rem',
                      letterSpacing: '0.14em',
                      color: c.muted,
                      fontWeight: 600,
                    }}
                  >
                    FOTO: ARSIP KITA
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {gallery.map((src, i) => (
                    <figure
                      key={`${src}-${i}`}
                      style={{
                        margin: 0,
                        backgroundColor: c.paperLight,
                        border: `1px solid ${c.lineSoft}`,
                        padding: '10px',
                      }}
                    >
                      <img
                        src={src}
                        alt={galleryCaptions[i] || `Foto ${i + 1}`}
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
                          fontSize: '0.9rem',
                          lineHeight: 1.45,
                          color: c.muted,
                        }}
                      >
                        <strong
                          style={{
                            fontFamily: uiFont,
                            fontSize: '0.68rem',
                            color: c.ink,
                            marginRight: '6px',
                          }}
                        >
                          0{i + 1}.
                        </strong>
                        {galleryCaptions[i] || `Arsip Kenangan #${i + 1}`}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* 05: PERSONAL NOTICE (IKLAN BARIS CINTA) */}
            <footer
              style={{
                border: `4px double ${c.line}`,
                backgroundColor: c.paperLight,
                padding: 'clamp(24px, 5vw, 38px)',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: uiFont,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: c.navy,
                  display: 'inline-block',
                  paddingBottom: '6px',
                  borderBottom: `1px solid ${c.navy}`,
                  marginBottom: '18px',
                }}
              >
                PERSONAL NOTICE
              </span>

              <p
                style={{
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  maxWidth: '520px',
                  margin: '0 auto 24px',
                  color: c.ink,
                }}
              >
                “{personalNotice}”
              </p>

              <p
                style={{
                  fontFamily: headlineFont,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  margin: '0 0 24px',
                }}
              >
                — {senderName}
              </p>

              <div
                style={{
                  paddingTop: '14px',
                  borderTop: `1px solid ${c.lineSoft}`,
                  fontFamily: uiFont,
                  fontSize: '0.65rem',
                  letterSpacing: '0.16em',
                  color: c.muted,
                  textTransform: 'uppercase',
                }}
              >
                {masthead} · DICETAK KHUSUS UNTUK {receiverName}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
