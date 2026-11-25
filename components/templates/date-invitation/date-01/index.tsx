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

export default function Date01({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);

  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as Record<
    string,
    unknown
  >;
  const [confirmed, setConfirmed] = useState(
    isPublished && Boolean(savedResponse.rsvpConfirmed),
  );

  const handleConfirm = () => {
    setConfirmed(true);
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
  const reservationCode = getString(
    content,
    'reservationCode',
    'TABLE FOR TWO · NO. 01',
  );
  const coverTagline = getString(
    content,
    'coverTagline',
    'Kosongkan jadwalmu akhir pekan ini—sisanya sudah kuurus semua.',
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
    'Satu malam tenang, tanpa terburu-buru.',
  );
  const inviteTitle = getString(
    content,
    'inviteTitle',
    'Luangkan Satu Malam Untuk Kita Berdua',
  );
  const inviteMessage = getString(
    content,
    'inviteMessage',
    website.message ||
      'Aku ingin mengajakmu meluangkan satu malam yang tenang untuk makan malam dan mengobrol santai berdua.',
  );

  const dateText = getString(content, 'dateText', 'Akhir Pekan Ini');
  const timeText = getString(content, 'timeText', '19.00 WIB – Selesai');
  const locationText = getString(
    content,
    'locationText',
    'Tempat Favorit Kita',
  );
  const dressCode = getString(content, 'dressCode', 'Casual & Nyaman');

  const itinerary = useMemo(() => {
    return getString(content, 'itinerary', '')
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

  const littleNotes = useMemo(() => {
    return getString(content, 'littleNotes', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }, [content]);

  const closingNote = getString(
    content,
    'closingNote',
    'Tidak sabar melihatmu malam itu. Sampai ketemu di meja kita.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const inviteParagraphs = inviteMessage
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Bistro Linen & Espresso
  const c = {
    cream: '#f7f3ec',
    card: '#fdfbf7',
    espresso: '#2b211c',
    burgundy: '#6e2c2c',
    taupe: '#7a6f66',
    line: 'rgba(43, 33, 28, 0.14)',
    burgundySoft: 'rgba(110, 44, 44, 0.22)',
  };

  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  const detailItems = [
    { label: 'Hari & Tanggal', value: dateText },
    { label: 'Waktu', value: timeText },
    { label: 'Lokasi', value: locationText },
    { label: 'Dress Code', value: dressCode },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.cream,
        color: c.espresso,
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
          /* --- 01: THE RESERVATION CARD (OPENING SCREEN) --- */
          <motion.section
            key="reservation-cover"
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
                width: 'min(100%, 450px)',
                backgroundColor: c.card,
                border: `1px solid ${c.line}`,
                padding: '12px',
                boxShadow: '0 24px 56px rgba(43, 33, 28, 0.08)',
              }}
            >
              <div
                style={{
                  border: `1px solid ${c.burgundySoft}`,
                  padding: 'clamp(28px, 6vw, 44px) clamp(20px, 5vw, 34px)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.burgundy,
                    display: 'block',
                    marginBottom: '18px',
                  }}
                >
                  {reservationCode}
                </span>

                <p
                  style={{
                    fontFamily: mono,
                    fontSize: '0.66rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.taupe,
                    margin: '0 0 8px',
                  }}
                >
                  UNDANGAN KHUSUS UNTUK
                </p>

                <h1
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(2.35rem, 8vw, 3.2rem)',
                    fontWeight: 600,
                    lineHeight: 1.08,
                    color: c.espresso,
                    margin: '0 0 18px',
                  }}
                >
                  {receiverName}
                </h1>

                <div
                  aria-hidden="true"
                  style={{
                    width: '38px',
                    height: '1px',
                    backgroundColor: c.burgundy,
                    margin: '0 auto 20px',
                  }}
                />

                <p
                  style={{
                    fontSize: '0.98rem',
                    lineHeight: 1.65,
                    color: c.taupe,
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
                  Buka Undangan →
                </motion.button>

                <p
                  style={{
                    margin: '20px 0 0',
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: c.taupe,
                  }}
                >
                  DARI {senderName}
                </p>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI UNDANGAN KENCAN --- */
          <motion.div
            key="reservation-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
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
                borderBottom: `1px solid ${c.line}`,
                fontFamily: mono,
                fontSize: '0.66rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: c.taupe,
              }}
            >
              <span style={{ color: c.espresso, fontWeight: 600 }}>
                {senderName} &amp; {receiverName}
              </span>
              <span style={{ color: c.burgundy }}>{reservationCode}</span>
            </header>

            {/* 02: THE NOTE & MOOD FRAME */}
            <section style={{ padding: '48px 0 56px' }}>
              {moodPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  style={{
                    margin: '0 0 38px',
                    backgroundColor: c.card,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                    boxShadow: '0 14px 36px rgba(43, 33, 28, 0.05)',
                  }}
                >
                  <img
                    src={moodPhoto}
                    alt={moodCaption}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {moodCaption && (
                    <figcaption
                      style={{
                        paddingTop: '12px',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        color: c.taupe,
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
                  backgroundColor: c.card,
                  border: `1px solid ${c.line}`,
                  borderTop: `3px solid ${c.burgundy}`,
                  padding: 'clamp(24px, 5vw, 40px)',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.burgundy,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  01 · THE INVITATION
                </span>

                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.85rem, 5vw, 2.45rem)',
                    fontWeight: 600,
                    lineHeight: 1.18,
                    color: c.espresso,
                    margin: '0 0 20px',
                  }}
                >
                  {inviteTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.82,
                    color: '#3a2f2a',
                  }}
                >
                  {inviteParagraphs.map((p, idx) => (
                    <p key={idx} style={{ margin: '0 0 18px' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: THE DETAILS (WAKTU, TEMPAT & DRESS CODE) */}
            <section
              style={{
                padding: '48px 0 56px',
                borderTop: `1px solid ${c.line}`,
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: c.burgundy,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                02 · THE DETAILS
              </span>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                  fontWeight: 600,
                  color: c.espresso,
                  margin: '0 0 24px',
                }}
              >
                Detail Reservasi Kita
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px',
                }}
              >
                {detailItems.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      backgroundColor: c.card,
                      border: `1px solid ${c.line}`,
                      padding: '20px 22px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: c.burgundy,
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {item.label}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        color: c.espresso,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 04: THE ITINERARY (RENCANA KITA) */}
            {itinerary.length > 0 && (
              <section
                style={{
                  padding: '48px 0 56px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.burgundy,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  03 · THE ITINERARY
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.espresso,
                    margin: '0 0 26px',
                  }}
                >
                  Rangkaian Rencana Malam Itu
                </h3>

                <div
                  style={{
                    backgroundColor: c.card,
                    border: `1px solid ${c.line}`,
                    padding: '6px clamp(20px, 4vw, 30px)',
                  }}
                >
                  {itinerary.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        padding: '20px 0',
                        borderBottom:
                          idx < itinerary.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      {step.time && (
                        <span
                          style={{
                            fontFamily: mono,
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            letterSpacing: '0.14em',
                            color: c.burgundy,
                            display: 'block',
                            marginBottom: '6px',
                          }}
                        >
                          {step.time}
                        </span>
                      )}

                      <h4
                        style={{
                          fontFamily: serif,
                          fontSize: '1.38rem',
                          fontWeight: 600,
                          color: c.espresso,
                          margin: '0 0 6px',
                        }}
                      >
                        {step.title}
                      </h4>

                      {step.note && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            lineHeight: 1.68,
                            color: c.taupe,
                          }}
                        >
                          {step.note}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: LITTLE NOTES */}
            {littleNotes.length > 0 && (
              <section
                style={{
                  padding: '48px 0 56px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.burgundy,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  04 · LITTLE NOTES
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.espresso,
                    margin: '0 0 22px',
                  }}
                >
                  Catatan Kecil Sebelum Berangkat
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
                  {littleNotes.map((note, idx) => (
                    <li
                      key={idx}
                      style={{
                        backgroundColor: c.card,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.burgundy}`,
                        padding: '16px 20px',
                        fontSize: '0.96rem',
                        lineHeight: 1.65,
                        color: c.espresso,
                      }}
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 06: SAVE THE DATE (PENUTUP + KONFIRMASI) */}
            <footer
              style={{
                backgroundColor: c.card,
                border: `1px solid ${c.line}`,
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  border: `1px solid ${c.burgundySoft}`,
                  padding: 'clamp(30px, 6vw, 46px) 22px',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.burgundy,
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  SAVE THE DATE
                </span>

                <p
                  style={{
                    maxWidth: '480px',
                    margin: '0 auto 22px',
                    fontSize: '1.04rem',
                    lineHeight: 1.75,
                    color: c.taupe,
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

                {!confirmed ? (
                  <motion.button
                    type="button"
                    onClick={handleConfirm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: c.burgundy,
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
                    Aku Ikut — Sampai Ketemu!
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                    style={{
                      maxWidth: '400px',
                      margin: '0 auto',
                      backgroundColor: c.cream,
                      border: `1.5px solid ${c.burgundy}`,
                      padding: '20px 22px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        color: c.burgundy,
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      ✓ RESERVATION CONFIRMED
                    </span>
                    <div
                      style={{
                        fontFamily: serif,
                        fontSize: '1.45rem',
                        fontStyle: 'italic',
                        color: c.espresso,
                        marginBottom: '12px',
                      }}
                    >
                      {senderName} &amp; {receiverName}
                    </div>
                    <div
                      style={{
                        paddingTop: '10px',
                        borderTop: `1px dashed ${c.burgundySoft}`,
                        fontFamily: mono,
                        fontSize: '0.68rem',
                        letterSpacing: '0.12em',
                        color: c.taupe,
                      }}
                    >
                      TABLE FOR TWO · {dateText}
                    </div>
                  </motion.div>
                )}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
