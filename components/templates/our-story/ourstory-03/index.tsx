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

export default function OurStory03({ website }: { website: WebsiteRecord }) {
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

  const postmarkOrigin = getString(
    content,
    'postmarkOrigin',
    'AIRMAIL · OUR STORY',
  );
  const coverTagline = getString(
    content,
    'coverTagline',
    'Setiap tempat terasa seperti rumah selama aku menempuhnya bersamamu.',
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
    'Perjalanan terbaik selalu dimulai bersamamu.',
  );
  const openingTitle = getString(
    content,
    'openingTitle',
    'Dari Satu Perjalanan ke Perjalanan Berikutnya',
  );
  const openingLetter = getString(
    content,
    'openingLetter',
    website.message ||
      'Kumpulan kartu pos ini kusimpan untuk mengingat setiap tempat dan momen berharga yang kita lalui bersama.',
  );

  const milestones = useMemo(() => {
    return getString(content, 'milestones', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            place: parts[0],
            title: parts[1],
            story: parts.slice(2).join(' | '),
          };
        }
        if (parts.length === 2) {
          return { place: parts[0], title: parts[1], story: '' };
        }
        return { place: '', title: parts[0], story: '' };
      });
  }, [content]);

  const souvenirs = useMemo(() => {
    return getString(content, 'souvenirs', '')
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

  const nextDestinationTitle = getString(
    content,
    'nextDestinationTitle',
    'Tujuan Berikutnya: Ke Mana Pun Bersamamu',
  );
  const nextDestinationText = getString(
    content,
    'nextDestinationText',
    'Masih banyak tempat yang belum kita datangi dan banyak cerita yang belum kita tulis bersama.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const openingParagraphs = openingLetter
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

  // Palet Coastal Navy & Airmail Stamp
  const c = {
    cotton: '#f8f6f1',
    card: '#fdfcf9',
    navy: '#1b365d',
    crimson: '#b84a39',
    slate: '#5f6b7a',
    ink: '#222b36',
    line: 'rgba(27, 54, 93, 0.14)',
    crimsonSoft: 'rgba(184, 74, 57, 0.25)',
  };

  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  const airmailStripe = `repeating-linear-gradient(
    -45deg,
    ${c.navy} 0px,
    ${c.navy} 10px,
    transparent 10px,
    transparent 16px,
    ${c.crimson} 16px,
    ${c.crimson} 26px,
    transparent 26px,
    transparent 32px
  )`;

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.cotton,
        color: c.ink,
        fontFamily: sans,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE POSTMARK (OPENING SCREEN) --- */
          <motion.section
            key="postcard-cover"
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
                backgroundColor: c.card,
                border: `1px solid ${c.line}`,
                boxShadow: '0 24px 54px rgba(27, 54, 93, 0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Garis Airmail Atas */}
              <div
                aria-hidden="true"
                style={{ height: '6px', background: airmailStripe }}
              />

              <div style={{ padding: 'clamp(24px, 6vw, 38px)' }}>
                {/* Baris Stempel & Prangko */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '26px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.64rem',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: c.crimson,
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      POSTCARDS FROM US
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.66rem',
                        letterSpacing: '0.1em',
                        color: c.slate,
                      }}
                    >
                      {postmarkOrigin}
                    </span>
                  </div>

                  {/* Prangko Minimalis */}
                  <div
                    aria-hidden="true"
                    style={{
                      width: '54px',
                      height: '62px',
                      border: `1.5px dashed ${c.crimsonSoft}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: mono,
                      fontSize: '0.56rem',
                      letterSpacing: '0.1em',
                      color: c.crimson,
                      flexShrink: 0,
                    }}
                  >
                    <span>AIR</span>
                    <span style={{ fontWeight: 600, fontSize: '0.72rem' }}>
                      MAIL
                    </span>
                    <span>03</span>
                  </div>
                </div>

                {/* Alamat Penerima & Judul */}
                <div
                  style={{
                    borderTop: `1px dashed ${c.line}`,
                    borderBottom: `1px dashed ${c.line}`,
                    padding: '22px 0',
                    marginBottom: '26px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: mono,
                      fontSize: '0.66rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: c.slate,
                      margin: '0 0 8px',
                    }}
                  >
                    KEPADA: {receiverName} · DARI: {senderName}
                  </p>

                  <h1
                    style={{
                      fontFamily: serif,
                      fontSize: 'clamp(2.1rem, 7vw, 2.85rem)',
                      fontWeight: 600,
                      lineHeight: 1.1,
                      margin: '0 0 12px',
                      color: c.navy,
                    }}
                  >
                    {coupleNames}
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.96rem',
                      lineHeight: 1.65,
                      color: c.slate,
                    }}
                  >
                    {coverTagline}
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: c.navy,
                    color: c.card,
                    border: 'none',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Buka Kumpulan Kartu Pos →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI ARSIP KARTU POS --- */
          <motion.div
            key="postcard-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              maxWidth: '780px',
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
                color: c.slate,
              }}
            >
              <span style={{ color: c.navy, fontWeight: 600 }}>
                {coupleNames}
              </span>
              <span style={{ color: c.crimson }}>{postmarkOrigin}</span>
            </header>

            {/* 02: FIRST STAMP (FOTO UTAMA & SURAT PEMBUKA) */}
            <section style={{ padding: '48px 0 56px' }}>
              {heroPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  style={{
                    margin: '0 0 40px',
                    backgroundColor: c.card,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                    boxShadow: '0 14px 36px rgba(27, 54, 93, 0.05)',
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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                        fontSize: '0.9rem',
                        color: c.slate,
                      }}
                    >
                      <span style={{ fontStyle: 'italic' }}>{heroCaption}</span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.64rem',
                          letterSpacing: '0.12em',
                          color: c.crimson,
                        }}
                      >
                        STAMP NO. 01
                      </span>
                    </figcaption>
                  )}
                </motion.figure>
              )}

              <div
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.line}`,
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
                    color: c.crimson,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  01 · FIRST STAMP
                </span>

                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.85rem, 5vw, 2.45rem)',
                    fontWeight: 600,
                    lineHeight: 1.18,
                    color: c.navy,
                    margin: '0 0 22px',
                  }}
                >
                  {openingTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.85,
                    color: c.ink,
                  }}
                >
                  {openingParagraphs.map((p, idx) => (
                    <p key={idx} style={{ margin: '0 0 18px' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: PLACES & MILESTONES (JEJAK PERJALANAN) */}
            {milestones.length > 0 && (
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
                    color: c.crimson,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  02 · PLACES &amp; MILESTONES
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.navy,
                    margin: '0 0 28px',
                  }}
                >
                  Cap Perjalanan yang Kita Kumpulkan
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {milestones.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.card,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.navy}`,
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
                          fontSize: '0.66rem',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: c.crimson,
                          marginBottom: '8px',
                        }}
                      >
                        <span>{item.place || `STOP #${idx + 1}`}</span>
                        <span style={{ color: c.slate }}>
                          POSTMARK {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h4
                        style={{
                          fontFamily: serif,
                          fontSize: '1.45rem',
                          fontWeight: 600,
                          color: c.navy,
                          margin: '0 0 8px',
                        }}
                      >
                        {item.title}
                      </h4>

                      {item.story && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.96rem',
                            lineHeight: 1.72,
                            color: c.slate,
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

            {/* 04: SOUVENIRS OF US (OLEH-OLEH KECIL) */}
            {souvenirs.length > 0 && (
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
                    color: c.crimson,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  03 · SOUVENIRS OF US
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.navy,
                    margin: '0 0 24px',
                  }}
                >
                  Hal-Hal Kecil yang Selalu Kita Bawa Pulang
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {souvenirs.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.card,
                        border: `1px dashed ${c.line}`,
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
                          color: c.crimson,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        {item.label}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.98rem',
                          lineHeight: 1.55,
                          color: c.navy,
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

            {/* 05: POSTCARD GALLERY */}
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
                    color: c.crimson,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  04 · POSTCARD GALLERY
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.navy,
                    margin: '0 0 26px',
                  }}
                >
                  Kartu Pos dari Hari-Hari Terbaik
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
                        alt={galleryCaptions[idx] || `Kartu Pos ${idx + 1}`}
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
                          color: c.slate,
                        }}
                      >
                        {galleryCaptions[idx] || `Postcard #${idx + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* 06: NEXT DESTINATION (PENUTUP) */}
            <footer
              style={{
                backgroundColor: c.card,
                border: `1px solid ${c.line}`,
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              <div
                aria-hidden="true"
                style={{ height: '5px', background: airmailStripe }}
              />
              <div style={{ padding: 'clamp(32px, 6vw, 48px) 24px' }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.crimson,
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  NEXT DESTINATION
                </span>

                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.navy,
                    margin: '0 0 16px',
                  }}
                >
                  {nextDestinationTitle}
                </h3>

                <p
                  style={{
                    maxWidth: '490px',
                    margin: '0 auto 28px',
                    fontSize: '1rem',
                    lineHeight: 1.78,
                    color: c.slate,
                  }}
                >
                  {nextDestinationText}
                </p>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '1.75rem',
                    fontStyle: 'italic',
                    color: c.navy,
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
                    color: c.slate,
                    paddingTop: '16px',
                    borderTop: `1px dashed ${c.line}`,
                  }}
                >
                  POSTCARDS FROM US · UNTUK {receiverName}
                  {formattedDate ? ` · ${formattedDate}` : ''}
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
