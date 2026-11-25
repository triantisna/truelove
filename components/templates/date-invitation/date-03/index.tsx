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

export default function Date03({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);

  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as Record<
    string,
    unknown
  >;
  const [reserved, setReserved] = useState(
    isPublished && Boolean(savedResponse.rsvpConfirmed),
  );

  const handleReserve = () => {
    setReserved(true);
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
  const ticketCode = getString(content, 'ticketCode', 'ADMIT TWO · STUDIO 03');
  const coverTagline = getString(
    content,
    'coverTagline',
    'Two seats, one screen, and my favorite person right next to me.',
  );

  const posterPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.posterPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.posterPhoto, website.media]);

  const posterCaption = getString(
    content,
    'posterCaption',
    'Tayang eksklusif satu malam — khusus untuk kita berdua.',
  );
  const movieTitle = getString(
    content,
    'movieTitle',
    'Malam Minggu di Baris Tengah',
  );
  const synopsis = getString(
    content,
    'synopsis',
    website.message ||
      'Akhir pekan ini aku ingin mengajakmu nonton bareng dan menikmati malam yang santai berdua.',
  );

  const dateText = getString(content, 'dateText', 'Akhir Pekan Ini');
  const timeText = getString(content, 'timeText', '19.00 WIB – Selesai');
  const locationText = getString(
    content,
    'locationText',
    'Bioskop Favorit Kita',
  );
  const seatInfo = getString(content, 'seatInfo', 'Row E Seat 07–08 · Casual');

  const schedule = useMemo(() => {
    return getString(content, 'schedule', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            phase: parts[0],
            title: parts[1],
            note: parts.slice(2).join(' | '),
          };
        }
        if (parts.length === 2) {
          return { phase: parts[0], title: parts[1], note: '' };
        }
        return { phase: '', title: parts[0], note: '' };
      });
  }, [content]);

  const concessions = useMemo(() => {
    return getString(content, 'concessions', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }, [content]);

  const closingNote = getString(
    content,
    'closingNote',
    'Tiket sudah aman di tanganku—tinggal tunggu kamu duduk di kursi sebelah.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const synopsisParagraphs = synopsis
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Velvet Theater & Marquee Gold
  const c = {
    obsidian: '#121110',
    charcoal: '#1c1a18',
    card: '#23201d',
    ivory: '#f2ede4',
    ash: '#a39d93',
    gold: '#e2b857',
    crimson: '#a83232',
    crimsonBg: 'rgba(168, 50, 50, 0.16)',
    line: 'rgba(242, 237, 228, 0.12)',
    goldLine: 'rgba(226, 184, 87, 0.34)',
  };

  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  const showtimeItems = [
    { label: 'HARI & TANGGAL', value: dateText },
    { label: 'JAM TAYANG', value: timeText },
    { label: 'LOKASI / STUDIO', value: locationText },
    { label: 'KURSI / DRESS CODE', value: seatInfo },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.obsidian,
        color: c.ivory,
        fontFamily: sans,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE ADMIT TWO TICKET (OPENING SCREEN) --- */
          <motion.section
            key="cinema-ticket"
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
                width: 'min(100%, 440px)',
                backgroundColor: c.charcoal,
                border: `1px solid ${c.goldLine}`,
                boxShadow: '0 28px 64px rgba(0, 0, 0, 0.55)',
                position: 'relative',
              }}
            >
              {/* Top Ticket Stub */}
              <div
                style={{
                  padding: '18px 26px',
                  borderBottom: `1.5px dashed ${c.goldLine}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  color: c.gold,
                }}
              >
                <span>{ticketCode}</span>
                <span
                  style={{
                    backgroundColor: c.crimsonBg,
                    color: '#f28b82',
                    border: `1px solid ${c.crimson}`,
                    padding: '3px 8px',
                    fontSize: '0.58rem',
                  }}
                >
                  VIP PASS
                </span>
              </div>

              {/* Ticket Body */}
              <div
                style={{
                  padding: 'clamp(26px, 6vw, 38px) clamp(22px, 5vw, 32px)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: c.ash,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  NOW SHOWING · SPECIAL INVITATION
                </span>

                <h1
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(2.1rem, 7.5vw, 2.85rem)',
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: c.ivory,
                    margin: '0 0 14px',
                  }}
                >
                  Now Showing: Us
                </h1>

                <p
                  style={{
                    fontSize: '0.96rem',
                    lineHeight: 1.65,
                    color: c.ash,
                    margin: '0 0 26px',
                  }}
                >
                  {coverTagline}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    padding: '14px 0',
                    borderTop: `1px solid ${c.line}`,
                    borderBottom: `1px solid ${c.line}`,
                    marginBottom: '26px',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: mono,
                        fontSize: '0.56rem',
                        letterSpacing: '0.14em',
                        color: c.ash,
                        marginBottom: '4px',
                      }}
                    >
                      GUEST OF HONOR
                    </span>
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: '1.15rem',
                        color: c.gold,
                      }}
                    >
                      {receiverName}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: mono,
                        fontSize: '0.56rem',
                        letterSpacing: '0.14em',
                        color: c.ash,
                        marginBottom: '4px',
                      }}
                    >
                      HOSTED BY
                    </span>
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: '1.15rem',
                        color: c.ivory,
                      }}
                    >
                      {senderName}
                    </span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setOpened(true)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: c.gold,
                    color: '#121110',
                    border: 'none',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Ambil Tiket & Masuk Studio →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI UNDANGAN MOVIE DATE --- */
          <motion.div
            key="cinema-content"
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
              <span style={{ color: c.ivory, fontWeight: 600 }}>
                {senderName} & {receiverName}
              </span>
              <span style={{ color: c.gold }}>{ticketCode}</span>
            </header>

            {/* 02: POSTER & SYNOPSIS */}
            <section style={{ padding: '48px 0 56px' }}>
              {posterPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  style={{
                    margin: '0 0 38px',
                    backgroundColor: c.charcoal,
                    border: `1px solid ${c.goldLine}`,
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: mono,
                      fontSize: '0.62rem',
                      letterSpacing: '0.14em',
                      color: c.gold,
                      marginBottom: '10px',
                    }}
                  >
                    <span>OFFICIAL SELECTION</span>
                    <span>{dateText.toUpperCase()}</span>
                  </div>
                  <img
                    src={posterPhoto}
                    alt={posterCaption}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {posterCaption && (
                    <figcaption
                      style={{
                        paddingTop: '12px',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        color: c.ash,
                        textAlign: 'center',
                      }}
                    >
                      {posterCaption}
                    </figcaption>
                  )}
                </motion.figure>
              )}

              <div
                style={{
                  backgroundColor: c.charcoal,
                  border: `1px solid ${c.line}`,
                  borderTop: `3px solid ${c.gold}`,
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
                    color: c.gold,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  01 // SYNOPSIS
                </span>

                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
                    fontWeight: 600,
                    lineHeight: 1.18,
                    color: c.ivory,
                    margin: '0 0 20px',
                  }}
                >
                  {movieTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.82,
                    color: '#d8d2c8',
                  }}
                >
                  {synopsisParagraphs.map((p, idx) => (
                    <p
                      key={idx}
                      style={{
                        margin:
                          idx < synopsisParagraphs.length - 1 ? '0 0 18px' : 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: SHOWTIME DETAILS */}
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
                  color: c.gold,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                02 // SHOWTIME DETAILS
              </span>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                  fontWeight: 600,
                  color: c.ivory,
                  margin: '0 0 24px',
                }}
              >
                Jadwal Tayang & Kursi Kita
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px',
                }}
              >
                {showtimeItems.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      backgroundColor: c.charcoal,
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
                        color: c.gold,
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
                        color: c.ivory,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 04: THE FEATURE SCHEDULE */}
            {schedule.length > 0 && (
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
                    color: c.gold,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  03 // THE FEATURE SCHEDULE
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.ivory,
                    margin: '0 0 26px',
                  }}
                >
                  Rangkaian Acara Malam Itu
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {schedule.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.charcoal,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.gold}`,
                        padding: '20px 22px',
                      }}
                    >
                      {step.phase && (
                        <span
                          style={{
                            fontFamily: mono,
                            fontSize: '0.64rem',
                            fontWeight: 600,
                            letterSpacing: '0.14em',
                            color: c.gold,
                            display: 'block',
                            marginBottom: '6px',
                          }}
                        >
                          {step.phase}
                        </span>
                      )}

                      <h4
                        style={{
                          fontFamily: serif,
                          fontSize: '1.35rem',
                          fontWeight: 600,
                          color: c.ivory,
                          margin: '0 0 6px',
                        }}
                      >
                        {step.title}
                      </h4>

                      {step.note && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.94rem',
                            lineHeight: 1.68,
                            color: c.ash,
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

            {/* 05: CONCESSION STAND */}
            {concessions.length > 0 && (
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
                    color: c.gold,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  04 // CONCESSION STAND
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.15rem)',
                    fontWeight: 600,
                    color: c.ivory,
                    margin: '0 0 22px',
                  }}
                >
                  Snack & Fasilitas Khusus Kamu
                </h3>

                <div
                  style={{
                    backgroundColor: c.charcoal,
                    border: `1px dashed ${c.goldLine}`,
                    padding: '8px 22px',
                  }}
                >
                  {concessions.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '15px 0',
                        borderBottom:
                          idx < concessions.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.96rem',
                          lineHeight: 1.55,
                          color: c.ivory,
                        }}
                      >
                        {item}
                      </span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: c.gold,
                          flexShrink: 0,
                        }}
                      >
                        INCLUDED
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 06: RESERVE YOUR SEAT (PENUTUP + STEMPEL KURSI) */}
            <footer
              style={{
                backgroundColor: c.charcoal,
                border: `1px solid ${c.goldLine}`,
                padding: 'clamp(30px, 6vw, 46px) 22px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: c.gold,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                RESERVE YOUR SEAT
              </span>

              <p
                style={{
                  maxWidth: '470px',
                  margin: '0 auto 20px',
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  color: c.ash,
                }}
              >
                “{closingNote}”
              </p>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.8rem',
                  fontStyle: 'italic',
                  color: c.ivory,
                  margin: '0 0 28px',
                }}
              >
                — {senderName}
              </p>

              {!reserved ? (
                <motion.button
                  type="button"
                  onClick={handleReserve}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: c.gold,
                    color: '#121110',
                    border: 'none',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Konfirmasi Kursi Kita
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    backgroundColor: c.crimsonBg,
                    border: `1.5px solid ${c.crimson}`,
                    padding: '20px 22px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: '#f28b82',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    ✓ SEAT RESERVED · ENJOY THE SHOW
                  </span>
                  <div
                    style={{
                      fontFamily: serif,
                      fontSize: '1.45rem',
                      fontStyle: 'italic',
                      color: c.ivory,
                      marginBottom: '12px',
                    }}
                  >
                    {senderName} &amp; {receiverName}
                  </div>
                  <div
                    style={{
                      paddingTop: '10px',
                      borderTop: `1px dashed ${c.goldLine}`,
                      fontFamily: mono,
                      fontSize: '0.66rem',
                      letterSpacing: '0.14em',
                      color: c.gold,
                    }}
                  >
                    2 KURSI VIP · {dateText}
                  </div>
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
                  color: c.ash,
                }}
              >
                NOW SHOWING: US · {ticketCode}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
