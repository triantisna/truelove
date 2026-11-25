'use client';

import { useMemo, useState } from 'react';
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

export default function Date02({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);

  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as Record<
    string,
    unknown
  >;
  const [claimed, setClaimed] = useState(
    isPublished && Boolean(savedResponse.rsvpConfirmed),
  );

  const handleClaim = () => {
    setClaimed(true);
    if (isPublished) {
      void saveWebsiteResponse(website.id, {
        rsvpConfirmed: true,
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
  const orderNumber = getString(
    content,
    'orderNumber',
    'ORDER #02 · DATE PASS',
  );
  const coverTagline = getString(
    content,
    'coverTagline',
    'No fancy dress code—just good coffee, slow walks, and you.',
  );

  const moodPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.moodPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.moodPhoto, website.media]);

  const moodCaption = getString(
    content,
    'moodCaption',
    'Sore santai tanpa buru-buru pulang.',
  );
  const noteTitle = getString(
    content,
    'noteTitle',
    'Yuk Kabur Sebentar dari Rutinitas',
  );
  const casualNote = getString(
    content,
    'casualNote',
    website.message ||
      'Gimana kalau akhir pekan ini kita ngopi santai dan jalan sore bareng tanpa perlu buru-buru?',
  );

  const dateText = getString(content, 'dateText', 'Akhir Pekan Ini');
  const timeText = getString(content, 'timeText', '15.30 WIB – Santai');
  const locationText = getString(
    content,
    'locationText',
    'Coffee Shop Favorit',
  );
  const outfitVibe = getString(content, 'outfitVibe', 'Casual & Nyaman');

  const gamePlan = useMemo(() => {
    return getString(content, 'gamePlan', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            time: parts[0],
            title: parts[1],
            note: parts.slice(2).join(' | '),
          };
        }
        if (parts.length === 2) {
          return { time: parts[0], title: parts[1], note: '' };
        }
        return { time: '', title: parts[0], note: '' };
      });
  }, [content]);

  const perks = useMemo(() => {
    return getString(content, 'perks', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }, [content]);

  const closingNote = getString(
    content,
    'closingNote',
    'Cukup datang bawa badan dan mood santai—semuanya on me hari itu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const noteParagraphs = casualNote
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Café Paper & Cobalt Ink
  const c = {
    butter: '#f3efe4',
    paper: '#faf8f3',
    white: '#ffffff',
    cobalt: '#1e40af',
    tangerine: '#d95d39',
    ink: '#1f2430',
    slate: '#5c6475',
    line: 'rgba(30, 64, 175, 0.16)',
    tangerineSoft: 'rgba(217, 93, 57, 0.14)',
  };

  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  const receiptRows = [
    { label: 'HARI / TANGGAL', value: dateText },
    { label: 'JAM', value: timeText },
    { label: 'LOKASI', value: locationText },
    { label: 'OUTFIT / VIBE', value: outfitVibe },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.butter,
        color: c.ink,
        fontFamily: sans,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE ORDER TICKET (OPENING SCREEN) --- */
          <motion.section
            key="order-ticket"
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
                width: 'min(100%, 420px)',
                backgroundColor: c.paper,
                border: `1.5px solid ${c.cobalt}`,
                borderRadius: '10px',
                padding: 'clamp(24px, 6vw, 34px)',
                boxShadow: '0 20px 44px rgba(30, 64, 175, 0.08)',
              }}
            >
              {/* Receipt Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  paddingBottom: '14px',
                  borderBottom: `1.5px dashed ${c.line}`,
                  marginBottom: '20px',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: c.cobalt,
                  }}
                >
                  {orderNumber}
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    backgroundColor: c.tangerineSoft,
                    color: c.tangerine,
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  FOR TWO
                </span>
              </div>

              <div
                style={{
                  fontFamily: mono,
                  fontSize: '0.68rem',
                  color: c.slate,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  marginBottom: '22px',
                }}
              >
                <span>CUSTOMER : {receiverName.toUpperCase()}</span>
                <span>PREPARED BY : {senderName.toUpperCase()}</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.85rem, 6.5vw, 2.35rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                  color: c.cobalt,
                  margin: '0 0 12px',
                }}
              >
                Coffee &amp; Stroll
              </h1>

              <p
                style={{
                  fontSize: '0.96rem',
                  lineHeight: 1.65,
                  color: c.slate,
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
                  padding: '14px 18px',
                  backgroundColor: c.cobalt,
                  color: c.white,
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: mono,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Lihat Pesanan Kencan →
              </motion.button>

              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: `1.5px dashed ${c.line}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: mono,
                  fontSize: '0.62rem',
                  color: c.slate,
                }}
              >
                <span>STATUS: READY</span>
                <span style={{ color: c.tangerine }}>
                  PAID BY {senderName.toUpperCase()}
                </span>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI TIKET KENCAN --- */
          <motion.div
            key="date-pass-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              padding: '0 20px 84px',
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
                borderBottom: `1.5px dashed ${c.line}`,
                fontFamily: mono,
                fontSize: '0.66rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: c.cobalt, fontWeight: 700 }}>
                COFFEE &amp; STROLL · {senderName} &amp; {receiverName}
              </span>
              <span style={{ color: c.tangerine, fontWeight: 600 }}>
                {orderNumber}
              </span>
            </header>

            {/* 02: MOOD PHOTO & CASUAL NOTE */}
            <section style={{ padding: '40px 0 48px' }}>
              {moodPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{
                    margin: '0 0 32px',
                    backgroundColor: c.paper,
                    border: `1.5px solid ${c.line}`,
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img
                    src={moodPhoto}
                    alt={moodCaption}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      display: 'block',
                    }}
                  />
                  {moodCaption && (
                    <figcaption
                      style={{
                        paddingTop: '10px',
                        fontSize: '0.88rem',
                        color: c.slate,
                        textAlign: 'center',
                      }}
                    >
                      {moodCaption}
                    </figcaption>
                  )}
                </motion.figure>
              )}

              <div
                style={{
                  backgroundColor: c.paper,
                  border: `1.5px solid ${c.line}`,
                  borderRadius: '10px',
                  padding: 'clamp(22px, 5vw, 34px)',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: c.tangerine,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  01 // NOTE FOR {receiverName.toUpperCase()}
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.22,
                    color: c.cobalt,
                    margin: '0 0 18px',
                  }}
                >
                  {noteTitle}
                </h2>

                <div
                  style={{
                    fontSize: '0.98rem',
                    lineHeight: 1.8,
                    color: c.ink,
                  }}
                >
                  {noteParagraphs.map((p, idx) => (
                    <p
                      key={idx}
                      style={{
                        margin:
                          idx < noteParagraphs.length - 1 ? '0 0 16px' : 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: WHAT'S ON THE MENU (DETAIL JADWAL ALA STRUK) */}
            <section style={{ paddingBottom: '48px' }}>
              <div
                style={{
                  backgroundColor: c.paper,
                  border: `1.5px solid ${c.cobalt}`,
                  borderRadius: '10px',
                  padding: 'clamp(22px, 5vw, 32px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    paddingBottom: '14px',
                    borderBottom: `1.5px dashed ${c.line}`,
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: c.cobalt,
                    }}
                  >
                    02 // WHAT’S ON THE MENU
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '0.64rem',
                      color: c.tangerine,
                      fontWeight: 600,
                    }}
                  >
                    DATE RECEIPT
                  </span>
                </div>

                <div>
                  {receiptRows.map((row, idx) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: '8px 16px',
                        padding: '13px 0',
                        borderBottom:
                          idx < receiptRows.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          color: c.slate,
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.96rem',
                          fontWeight: 600,
                          color: c.ink,
                          textAlign: 'right',
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 04: THE GAME PLAN (RUTE JALAN KITA) */}
            {gamePlan.length > 0 && (
              <section style={{ paddingBottom: '48px' }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: c.tangerine,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  03 // THE GAME PLAN
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.4rem, 4.2vw, 1.85rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: c.cobalt,
                    margin: '0 0 20px',
                  }}
                >
                  Rute Jalan Santai Kita
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {gamePlan.map((stop, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.paper,
                        border: `1.5px solid ${c.line}`,
                        borderRadius: '10px',
                        padding: '18px 20px',
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
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ color: c.tangerine }}>
                          STOP {String(idx + 1).padStart(2, '0')}
                        </span>
                        {stop.time && (
                          <span style={{ color: c.cobalt }}>{stop.time}</span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 700,
                          color: c.ink,
                          margin: '0 0 6px',
                        }}
                      >
                        {stop.title}
                      </h4>

                      {stop.note && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.93rem',
                            lineHeight: 1.65,
                            color: c.slate,
                          }}
                        >
                          {stop.note}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: COMPLIMENTARY PERKS (BONUS KENCAN) */}
            {perks.length > 0 && (
              <section style={{ paddingBottom: '48px' }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: c.tangerine,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  04 // COMPLIMENTARY PERKS
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.4rem, 4.2vw, 1.85rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: c.cobalt,
                    margin: '0 0 18px',
                  }}
                >
                  Bonus Gratis Khusus Buat Kamu
                </h3>

                <div
                  style={{
                    backgroundColor: c.paper,
                    border: `1.5px dashed ${c.cobalt}`,
                    borderRadius: '10px',
                    padding: '8px 20px',
                  }}
                >
                  {perks.map((perk, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 0',
                        borderBottom:
                          idx < perks.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.55,
                          color: c.ink,
                          fontWeight: 500,
                        }}
                      >
                        {perk}
                      </span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          color: c.tangerine,
                          flexShrink: 0,
                        }}
                      >
                        FREE
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 06: CLAIM YOUR PASS (PENUTUP + STEMPEL KONFIRMASI) */}
            <footer
              style={{
                backgroundColor: c.paper,
                border: `1.5px solid ${c.cobalt}`,
                borderRadius: '10px',
                padding: 'clamp(28px, 6vw, 42px) 22px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: c.tangerine,
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                CLAIM YOUR PASS
              </span>

              <p
                style={{
                  maxWidth: '460px',
                  margin: '0 auto 18px',
                  fontSize: '1rem',
                  lineHeight: 1.72,
                  color: c.slate,
                }}
              >
                “{closingNote}”
              </p>

              <p
                style={{
                  fontFamily: mono,
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: c.cobalt,
                  margin: '0 0 26px',
                }}
              >
                — {senderName}
              </p>

              {!claimed ? (
                <motion.button
                  type="button"
                  onClick={handleClaim}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: c.tangerine,
                    color: c.white,
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: mono,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Gas, Aku Ikut!
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    maxWidth: '380px',
                    margin: '0 auto',
                    backgroundColor: c.tangerineSoft,
                    border: `2px solid ${c.tangerine}`,
                    borderRadius: '10px',
                    padding: '18px 20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: c.tangerine,
                      display: 'block',
                      marginBottom: '12px',
                    }}
                  >
                    ✓ PASS CLAIMED · ON ME
                  </span>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      paddingTop: '12px',
                      borderTop: `1.5px dashed ${c.tangerine}`,
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.58rem',
                          color: c.slate,
                          display: 'block',
                        }}
                      >
                        DITRAKTIR OLEH
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: c.ink }}>
                        {senderName}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.58rem',
                          color: c.slate,
                          display: 'block',
                        }}
                      >
                        TANGGAL
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: c.ink }}>
                        {dateText}
                      </strong>
                    </div>
                  </div>
                </motion.div>
              )}

              <div
                style={{
                  marginTop: '30px',
                  paddingTop: '14px',
                  borderTop: `1.5px dashed ${c.line}`,
                  fontFamily: mono,
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  color: c.slate,
                }}
              >
                THANK YOU FOR COMING · {orderNumber}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
