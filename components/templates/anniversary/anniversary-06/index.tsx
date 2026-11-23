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

export default function Anniversary06({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [onRepeat, setOnRepeat] = useState(false);
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
  const yearLabel = getString(content, 'yearLabel', 'YEAR 01');
  const catalogCode = getString(
    content,
    'catalogCode',
    'LP-06 · ANNIVERSARY EDITION',
  );
  const albumTitle = getString(content, 'albumTitle', 'Side A / Side B');
  const coverTagline = getString(
    content,
    'coverTagline',
    'Every year with you is my favorite record to play on repeat.',
  );

  const linerNotesTitle = getString(
    content,
    'linerNotesTitle',
    'Catatan di Balik Sampul Tahun Ini',
  );
  const linerNotesBody = getString(
    content,
    'linerNotesBody',
    website.message ||
      'Terima kasih sudah menemani setiap langkah sepanjang tahun ini. Semoga kita selalu punya banyak alasan untuk merayakan tahun-tahun berikutnya bersama.',
  );

  const sideATracks = useMemo(() => {
    return getString(content, 'sideATracks', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            date: parts[0],
            title: parts[1],
            note: parts.slice(2).join(' | '),
          };
        }
        if (parts.length === 2) {
          return { date: parts[0], title: parts[1], note: '' };
        }
        return { date: '', title: parts[0], note: '' };
      });
  }, [content]);

  const sideBThings = useMemo(() => {
    return getString(content, 'sideBThings', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }, [content]);

  const snapshotPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.snapshotPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.snapshotPhoto, website.media]);

  const snapshotCaption = getString(
    content,
    'snapshotCaption',
    'Salah satu momen paling tenang yang selalu ingin kuulang bersamamu.',
  );
  const closingNote = getString(
    content,
    'closingNote',
    'Terima kasih sudah menjadi rekan perjalanan terbaik. Mari putar tahun berikutnya bersama.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const noteParagraphs = linerNotesBody
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Warm Vinyl Sleeve & Terracotta
  const c = {
    sand: '#f4efe6',
    cream: '#fbf8f2',
    espresso: '#231d19',
    terracotta: '#b84a39',
    terracottaSoft: 'rgba(184, 74, 57, 0.12)',
    olive: '#556350',
    muted: '#6e635a',
    line: 'rgba(35, 29, 25, 0.14)',
  };

  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.sand,
        color: c.espresso,
        fontFamily: sans,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
        {!opened ? (
          /* --- 01: THE VINYL SLEEVE (OPENING SCREEN) --- */
          <motion.section
            key="vinyl-sleeve"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55 }}
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
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(100%, 440px)',
                backgroundColor: c.cream,
                border: `1.5px solid ${c.espresso}`,
                boxShadow: '10px 10px 0px rgba(35, 29, 25, 0.12)',
                padding: 'clamp(24px, 6vw, 36px)',
                textAlign: 'center',
              }}
            >
              {/* Top Catalog Strip */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  paddingBottom: '14px',
                  borderBottom: `1px solid ${c.line}`,
                  marginBottom: '26px',
                  fontFamily: mono,
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                }}
              >
                <span style={{ color: c.olive }}>{catalogCode}</span>
                <span
                  style={{
                    backgroundColor: c.terracottaSoft,
                    color: c.terracotta,
                    padding: '3px 8px',
                  }}
                >
                  {yearLabel}
                </span>
              </div>

              {/* Minimalist Vinyl Disc Emblem */}
              <div
                aria-hidden="true"
                style={{
                  width: '108px',
                  height: '108px',
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  background: `radial-gradient(circle at center, ${c.cream} 0 8%, ${c.terracotta} 8% 34%, ${c.espresso} 34% 100%)`,
                  boxShadow:
                    'inset 0 0 0 10px rgba(255,255,255,0.04), inset 0 0 0 22px rgba(255,255,255,0.03), 0 10px 24px rgba(35, 29, 25, 0.18)',
                }}
              />

              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                {senderName} &amp; {receiverName}
              </span>

              <h1
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(2.1rem, 7vw, 2.75rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: c.espresso,
                  margin: '0 0 14px',
                }}
              >
                {albumTitle}
              </h1>

              <p
                style={{
                  fontSize: '0.96rem',
                  lineHeight: 1.65,
                  color: c.muted,
                  margin: '0 0 28px',
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
                  backgroundColor: c.espresso,
                  color: c.cream,
                  border: 'none',
                  fontFamily: mono,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Putar Album Kenangan →
              </motion.button>

              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: `1px dashed ${c.line}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: mono,
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  color: c.muted,
                }}
              >
                <span>33⅓ RPM · STEREO</span>
                <span style={{ color: c.terracotta }}>SIDE A / SIDE B</span>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI ALBUM KENANGAN --- */
          <motion.div
            key="vinyl-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              maxWidth: '740px',
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
                borderBottom: `1.5px solid ${c.espresso}`,
                fontFamily: mono,
                fontSize: '0.66rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: c.espresso, fontWeight: 700 }}>
                {albumTitle} · {senderName} &amp; {receiverName}
              </span>
              <span style={{ color: c.terracotta, fontWeight: 600 }}>
                {yearLabel}
              </span>
            </header>

            {/* 02: LINER NOTES (SURAT ANNIVERSARY) */}
            <section style={{ padding: '44px 0 52px' }}>
              <div
                style={{
                  backgroundColor: c.cream,
                  border: `1px solid ${c.line}`,
                  borderTop: `3px solid ${c.terracotta}`,
                  padding: 'clamp(24px, 5vw, 40px)',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  01 // LINER NOTES
                </span>

                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.75rem, 5vw, 2.3rem)',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: c.espresso,
                    margin: '0 0 20px',
                  }}
                >
                  {linerNotesTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.85,
                    color: '#302822',
                  }}
                >
                  {noteParagraphs.map((p, idx) => (
                    <p
                      key={idx}
                      style={{
                        margin:
                          idx < noteParagraphs.length - 1 ? '0 0 18px' : 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: SIDE A — THE TRACKLIST (MOMEN PENTING TAHUN INI) */}
            {sideATracks.length > 0 && (
              <section
                style={{
                  padding: '44px 0 52px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  02 // SIDE A · THE TRACKLIST
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.espresso,
                    margin: '0 0 24px',
                  }}
                >
                  Momen Penting Tahun Ini
                </h3>

                <div
                  style={{
                    backgroundColor: c.cream,
                    border: `1px solid ${c.line}`,
                    padding: '6px clamp(20px, 4vw, 30px)',
                  }}
                >
                  {sideATracks.map((track, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        padding: '20px 0',
                        borderBottom:
                          idx < sideATracks.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontFamily: mono,
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                          marginBottom: '6px',
                        }}
                      >
                        <span style={{ color: c.terracotta }}>
                          TRACK {String(idx + 1).padStart(2, '0')}
                        </span>
                        {track.date && (
                          <span style={{ color: c.olive }}>{track.date}</span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontFamily: serif,
                          fontSize: '1.3rem',
                          fontWeight: 600,
                          color: c.espresso,
                          margin: '0 0 6px',
                        }}
                      >
                        {track.title}
                      </h4>

                      {track.note && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.94rem',
                            lineHeight: 1.68,
                            color: c.muted,
                          }}
                        >
                          {track.note}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 04: SIDE B — LITTLE THINGS I LOVE */}
            {sideBThings.length > 0 && (
              <section
                style={{
                  padding: '44px 0 52px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  03 // SIDE B · LITTLE THINGS I LOVE
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.espresso,
                    margin: '0 0 22px',
                  }}
                >
                  Hal-Hal Kecil yang Paling Kusyukuri
                </h3>

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {sideBThings.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        backgroundColor: c.cream,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.olive}`,
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '14px',
                        fontSize: '0.96rem',
                        lineHeight: 1.6,
                        color: c.espresso,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          color: c.terracotta,
                          flexShrink: 0,
                        }}
                      >
                        B{idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 05: ALBUM SNAPSHOT (1 FOTO FAVORIT) */}
            {snapshotPhoto && (
              <section
                style={{
                  padding: '44px 0 52px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  04 // ALBUM SNAPSHOT
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.espresso,
                    margin: '0 0 22px',
                  }}
                >
                  Potret Favorit Tahun Ini
                </h3>

                <figure
                  style={{
                    margin: 0,
                    backgroundColor: c.cream,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                    boxShadow: '0 14px 36px rgba(35, 29, 25, 0.06)',
                  }}
                >
                  <img
                    src={snapshotPhoto}
                    alt={snapshotCaption}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {snapshotCaption && (
                    <figcaption
                      style={{
                        paddingTop: '12px',
                        fontSize: '0.92rem',
                        fontStyle: 'italic',
                        color: c.muted,
                        textAlign: 'center',
                      }}
                    >
                      {snapshotCaption}
                    </figcaption>
                  )}
                </figure>
              </section>
            )}

            {/* 06: ON REPEAT (PENUTUP + STEMPEL KONFIRMASI) */}
            <footer
              style={{
                backgroundColor: c.cream,
                border: `1.5px solid ${c.espresso}`,
                padding: 'clamp(30px, 6vw, 46px) 22px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: c.terracotta,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                ON REPEAT
              </span>

              <p
                style={{
                  maxWidth: '470px',
                  margin: '0 auto 18px',
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  color: c.muted,
                }}
              >
                “{closingNote}”
              </p>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.85rem',
                  fontStyle: 'italic',
                  color: c.espresso,
                  margin: '0 0 28px',
                }}
              >
                — {senderName}
              </p>

              {!onRepeat ? (
                <motion.button
                  type="button"
                  onClick={() => setOnRepeat(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: c.terracotta,
                    color: c.cream,
                    border: 'none',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Putar Tahun Berikutnya
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    maxWidth: '420px',
                    margin: '0 auto',
                    backgroundColor: c.terracottaSoft,
                    border: `2px solid ${c.terracotta}`,
                    padding: '16px 20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: c.terracotta,
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    ON REPEAT · STILL PLAYING TOGETHER
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.92rem',
                      color: c.espresso,
                      lineHeight: 1.55,
                    }}
                  >
                    Happy Anniversary {senderName} &amp; {receiverName} — sampai
                    jumpa di rekaman tahun berikutnya.
                  </p>
                </motion.div>
              )}

              <div
                style={{
                  marginTop: '34px',
                  paddingTop: '16px',
                  borderTop: `1px dashed ${c.line}`,
                  fontFamily: mono,
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: c.muted,
                }}
              >
                {albumTitle} · {catalogCode}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
