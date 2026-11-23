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

export default function Date04({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
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
  const inviteCode = getString(content, 'inviteCode', 'OUTDOOR DATE · NO. 04');
  const coverTagline = getString(
    content,
    'coverTagline',
    'A soft blanket, golden sunlight, and nowhere else we need to be.',
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
    'Sore yang pelan di bawah langit hangat.',
  );
  const noteTitle = getString(
    content,
    'noteTitle',
    'Menikmati Sore Tanpa Terburu-buru',
  );
  const picnicNote = getString(
    content,
    'picnicNote',
    website.message ||
      'Minggu sore ini, aku ingin mengajakmu piknik santai di luar ruangan menikmati udara segar dan cahaya matahari sore.',
  );

  const dateText = getString(content, 'dateText', 'Minggu Sore Ini');
  const timeText = getString(content, 'timeText', '15.30 WIB – Sunset');
  const locationText = getString(content, 'locationText', 'Taman Favorit Kita');
  const outfitNote = getString(
    content,
    'outfitNote',
    'Casual santai & nyaman buat duduk lesehan',
  );

  const afternoonFlow = useMemo(() => {
    return getString(content, 'afternoonFlow', '')
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

  const picnicBasket = useMemo(() => {
    return getString(content, 'picnicBasket', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }, [content]);

  const closingNote = getString(
    content,
    'closingNote',
    'Cukup datang bawa diri dan mood santai—semua isi keranjang piknik sudah kusiapkan.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const noteParagraphs = picnicNote
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Sunlit Meadow & Picnic Terracotta
  const c = {
    oat: '#f7f4ec',
    cream: '#fdfbf6',
    sage: '#3f5946',
    terracotta: '#c86d51',
    terracottaSoft: 'rgba(200, 109, 81, 0.14)',
    ink: '#252b26',
    muted: '#616b63',
    line: 'rgba(63, 89, 70, 0.16)',
  };

  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  // Pola garis kotak-kotak (gingham) tipis khas taplak piknik
  const ginghamStripe = `
    repeating-linear-gradient(
      90deg,
      rgba(200, 109, 81, 0.28) 0px,
      rgba(200, 109, 81, 0.28) 12px,
      transparent 12px,
      transparent 24px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(63, 89, 70, 0.18) 0px,
      rgba(63, 89, 70, 0.18) 6px,
      transparent 6px,
      transparent 12px
    )
  `;

  const detailItems = [
    { label: 'Hari & Tanggal', value: dateText },
    { label: 'Waktu', value: timeText },
    { label: 'Spot Piknik', value: locationText },
    { label: 'Outfit Nyaman', value: outfitNote },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.oat,
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
          /* --- 01: THE PICNIC INVITE (OPENING SCREEN) --- */
          <motion.section
            key="picnic-cover"
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
                backgroundColor: c.cream,
                border: `1px solid ${c.line}`,
                boxShadow: '0 24px 54px rgba(63, 89, 70, 0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Aksen Gingham Atas */}
              <div
                aria-hidden="true"
                style={{
                  height: '12px',
                  background: ginghamStripe,
                  borderBottom: `1px solid ${c.line}`,
                }}
              />

              <div
                style={{
                  padding: 'clamp(28px, 6vw, 44px) clamp(22px, 5vw, 34px)',
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
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '16px',
                  }}
                >
                  {inviteCode}
                </span>

                <p
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.muted,
                    margin: '0 0 8px',
                  }}
                >
                  UNDANGAN PIKNIK UNTUK
                </p>

                <h1
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(2.35rem, 8vw, 3.15rem)',
                    fontWeight: 600,
                    lineHeight: 1.08,
                    color: c.sage,
                    margin: '0 0 16px',
                  }}
                >
                  {receiverName}
                </h1>

                <div
                  aria-hidden="true"
                  style={{
                    width: '38px',
                    height: '1px',
                    backgroundColor: c.terracotta,
                    margin: '0 auto 20px',
                  }}
                />

                <p
                  style={{
                    fontSize: '0.98rem',
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
                    backgroundColor: c.sage,
                    color: c.cream,
                    border: 'none',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Buka Undangan Piknik →
                </motion.button>

                <p
                  style={{
                    margin: '20px 0 0',
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: c.muted,
                  }}
                >
                  DISIAPKAN OLEH {senderName}
                </p>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI UNDANGAN PIKNIK --- */
          <motion.div
            key="picnic-content"
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
              }}
            >
              <span style={{ color: c.sage, fontWeight: 600 }}>
                SUNDAY IN THE PARK · {senderName} &amp; {receiverName}
              </span>
              <span style={{ color: c.terracotta }}>{inviteCode}</span>
            </header>

            {/* 02: GOLDEN HOUR NOTE */}
            <section style={{ padding: '48px 0 56px' }}>
              {moodPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  style={{
                    margin: '0 0 38px',
                    backgroundColor: c.cream,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                    boxShadow: '0 14px 36px rgba(63, 89, 70, 0.05)',
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
                        color: c.muted,
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
                  backgroundColor: c.cream,
                  border: `1px solid ${c.line}`,
                  borderTop: `3px solid ${c.sage}`,
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
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  01 · GOLDEN HOUR NOTE
                </span>

                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.85rem, 5vw, 2.45rem)',
                    fontWeight: 600,
                    lineHeight: 1.18,
                    color: c.sage,
                    margin: '0 0 20px',
                  }}
                >
                  {noteTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.82,
                    color: c.ink,
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

            {/* 03: THE SPOT & DETAILS */}
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
                  color: c.terracotta,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                02 · THE SPOT &amp; DETAILS
              </span>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                  fontWeight: 600,
                  color: c.sage,
                  margin: '0 0 24px',
                }}
              >
                Detail Piknik Sore Kita
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
                      backgroundColor: c.cream,
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
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        color: c.ink,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 04: AFTERNOON FLOW */}
            {afternoonFlow.length > 0 && (
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
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  03 · AFTERNOON FLOW
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.sage,
                    margin: '0 0 26px',
                  }}
                >
                  Alur Sore yang Santai
                </h3>

                <div
                  style={{
                    backgroundColor: c.cream,
                    border: `1px solid ${c.line}`,
                    padding: '6px clamp(20px, 4vw, 30px)',
                  }}
                >
                  {afternoonFlow.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        padding: '20px 0',
                        borderBottom:
                          idx < afternoonFlow.length - 1
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
                            color: c.terracotta,
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
                          color: c.sage,
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
                            color: c.muted,
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

            {/* 05: INSIDE THE PICNIC BASKET */}
            {picnicBasket.length > 0 && (
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
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  04 · INSIDE THE PICNIC BASKET
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.sage,
                    margin: '0 0 22px',
                  }}
                >
                  Yang Sudah Kusiapkan di Keranjang
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
                  {picnicBasket.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        backgroundColor: c.cream,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.terracotta}`,
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.96rem',
                        lineHeight: 1.6,
                        color: c.ink,
                      }}
                    >
                      <span>{item}</span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          color: c.sage,
                          flexShrink: 0,
                        }}
                      >
                        PACKED
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 06: SEE YOU ON THE GRASS (PENUTUP + KONFIRMASI) */}
            <footer
              style={{
                backgroundColor: c.cream,
                border: `1px solid ${c.line}`,
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  height: '10px',
                  background: ginghamStripe,
                  borderBottom: `1px solid ${c.line}`,
                }}
              />

              <div style={{ padding: 'clamp(30px, 6vw, 46px) 22px' }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.terracotta,
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  SEE YOU ON THE GRASS
                </span>

                <p
                  style={{
                    maxWidth: '470px',
                    margin: '0 auto 20px',
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
                    color: c.sage,
                    margin: '0 0 28px',
                  }}
                >
                  — {senderName}
                </p>

                {!confirmed ? (
                  <motion.button
                    type="button"
                    onClick={() => setConfirmed(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: c.sage,
                      color: c.cream,
                      border: 'none',
                      fontFamily: mono,
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Siap, Ketemu di Sana!
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
                      border: `1.5px solid ${c.terracotta}`,
                      padding: '18px 20px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        color: c.terracotta,
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      PICNIC SET · SEE YOU AT GOLDEN HOUR
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.92rem',
                        color: c.ink,
                        lineHeight: 1.55,
                      }}
                    >
                      Tikar piknik untuk {senderName} &amp; {receiverName} siap
                      digelar pada {dateText}.
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
                  SUNDAY IN THE PARK · {dateText}
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
