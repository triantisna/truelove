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

export default function Date05({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
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
  const tripCode = getString(content, 'tripCode', 'TRIP NO. 05 · FIRST CLASS');
  const routeFrom = getString(content, 'routeFrom', 'HOME').toUpperCase();
  const routeTo = getString(content, 'routeTo', 'ESCAPE').toUpperCase();
  const coverTagline = getString(
    content,
    'coverTagline',
    'Pack light—we’re escaping the routine for a while.',
  );

  const destinationPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.destinationPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.destinationPhoto, website.media]);

  const destinationCaption = getString(
    content,
    'destinationCaption',
    'Satu hari penuh di luar kota tanpa perlu terburu-buru.',
  );
  const briefTitle = getString(
    content,
    'briefTitle',
    'Waktunya Kabur Sebentar dari Rutinitas',
  );
  const briefMessage = getString(
    content,
    'briefMessage',
    website.message ||
      'Akhir pekan ini aku ingin mengajakmu jalan santai keluar kota untuk ganti suasana berdua.',
  );

  const dateText = getString(content, 'dateText', 'Akhir Pekan Ini');
  const timeText = getString(content, 'timeText', '08.00 WIB – Malam');
  const destinationText = getString(
    content,
    'destinationText',
    'Destinasi Short Escape Kita',
  );
  const packingNote = getString(
    content,
    'packingNote',
    'Outfit nyaman & jaket tipis',
  );

  const routeWaypoints = useMemo(() => {
    return getString(content, 'routeWaypoints', '')
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

  const onboardPerks = useMemo(() => {
    return getString(content, 'onboardPerks', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }, [content]);

  const closingNote = getString(
    content,
    'closingNote',
    'Kursi depan sudah siap atas namamu—tinggal duduk manis dan nikmati perjalanan kita.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const briefParagraphs = briefMessage
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Crisp Aviation & Boarding Amber
  const c = {
    mist: '#f3f5f8',
    card: '#ffffff',
    navy: '#162436',
    teal: '#256d7b',
    tealSoft: 'rgba(37, 109, 123, 0.1)',
    amber: '#d97706',
    amberSoft: 'rgba(217, 119, 6, 0.12)',
    slate: '#5b6778',
    line: 'rgba(22, 36, 54, 0.12)',
  };

  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  const departureItems = [
    { label: 'HARI & TANGGAL', value: dateText },
    { label: 'JAM JEMPUT', value: timeText },
    { label: 'RUTE / TUJUAN', value: destinationText },
    { label: 'BAWAAN / DRESS CODE', value: packingNote },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.mist,
        color: c.navy,
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
          /* --- 01: THE BOARDING PASS (OPENING SCREEN) --- */
          <motion.section
            key="boarding-pass"
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
                backgroundColor: c.card,
                border: `1px solid ${c.line}`,
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 24px 56px rgba(22, 36, 54, 0.1)',
              }}
            >
              {/* Navy Top Strip */}
              <div
                style={{
                  backgroundColor: c.navy,
                  color: c.card,
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                }}
              >
                <span>BOARDING PASS</span>
                <span style={{ color: '#fbbf24' }}>{tripCode}</span>
              </div>

              <div style={{ padding: 'clamp(24px, 6vw, 34px)' }}>
                {/* Route Display */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    paddingBottom: '22px',
                    borderBottom: `1.5px dashed ${c.line}`,
                    marginBottom: '22px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: mono,
                        fontSize: '0.58rem',
                        letterSpacing: '0.14em',
                        color: c.slate,
                        marginBottom: '4px',
                      }}
                    >
                      FROM
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 'clamp(1.35rem, 5vw, 1.75rem)',
                        fontWeight: 700,
                        color: c.navy,
                      }}
                    >
                      {routeFrom}
                    </span>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'center',
                      color: c.teal,
                      fontFamily: mono,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        height: '1px',
                        borderTop: `1.5px dashed ${c.teal}`,
                      }}
                    />
                    <span>→</span>
                    <span
                      style={{
                        flex: 1,
                        height: '1px',
                        borderTop: `1.5px dashed ${c.teal}`,
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: mono,
                        fontSize: '0.58rem',
                        letterSpacing: '0.14em',
                        color: c.slate,
                        marginBottom: '4px',
                      }}
                    >
                      TO
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 'clamp(1.35rem, 5vw, 1.75rem)',
                        fontWeight: 700,
                        color: c.teal,
                      }}
                    >
                      {routeTo}
                    </span>
                  </div>
                </div>

                {/* Passenger & Host */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: mono,
                        fontSize: '0.58rem',
                        letterSpacing: '0.14em',
                        color: c.slate,
                        marginBottom: '4px',
                      }}
                    >
                      PASSENGER
                    </span>
                    <span
                      style={{
                        fontSize: '1.04rem',
                        fontWeight: 700,
                        color: c.navy,
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
                        fontSize: '0.58rem',
                        letterSpacing: '0.14em',
                        color: c.slate,
                        marginBottom: '4px',
                      }}
                    >
                      HOST / PILOT
                    </span>
                    <span
                      style={{
                        fontSize: '1.04rem',
                        fontWeight: 700,
                        color: c.navy,
                      }}
                    >
                      {senderName}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    color: c.slate,
                    margin: '0 0 26px',
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
                    backgroundColor: c.teal,
                    color: c.card,
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Check-In & Buka Tiket →
                </motion.button>

                <div
                  style={{
                    marginTop: '18px',
                    paddingTop: '14px',
                    borderTop: `1.5px dashed ${c.line}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: mono,
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    color: c.slate,
                  }}
                >
                  <span>SEAT: 01A (FRONT)</span>
                  <span style={{ color: c.amber, fontWeight: 700 }}>
                    BOARDING SOON
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI UNDANGAN SHORT ESCAPE --- */
          <motion.div
            key="boarding-content"
            initial={{ opacity: 0, y: 18 }}
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
                borderBottom: `1px solid ${c.line}`,
                fontFamily: mono,
                fontSize: '0.66rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: c.navy, fontWeight: 700 }}>
                {routeFrom} → {routeTo} · {senderName} & {receiverName}
              </span>
              <span style={{ color: c.teal, fontWeight: 600 }}>{tripCode}</span>
            </header>

            {/* 02: DESTINATION BRIEF */}
            <section style={{ padding: '40px 0 48px' }}>
              {destinationPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{
                    margin: '0 0 32px',
                    backgroundColor: c.card,
                    border: `1px solid ${c.line}`,
                    borderRadius: '12px',
                    padding: '10px',
                    boxShadow: '0 12px 30px rgba(22, 36, 54, 0.05)',
                  }}
                >
                  <img
                    src={destinationPhoto}
                    alt={destinationCaption}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                  {destinationCaption && (
                    <figcaption
                      style={{
                        paddingTop: '10px',
                        fontSize: '0.88rem',
                        color: c.slate,
                        textAlign: 'center',
                      }}
                    >
                      {destinationCaption}
                    </figcaption>
                  )}
                </motion.figure>
              )}

              <div
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.line}`,
                  borderTop: `3px solid ${c.teal}`,
                  borderRadius: '12px',
                  padding: 'clamp(22px, 5vw, 36px)',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: c.amber,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  01 // DESTINATION BRIEF
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.22,
                    color: c.navy,
                    margin: '0 0 18px',
                  }}
                >
                  {briefTitle}
                </h2>

                <div
                  style={{
                    fontSize: '0.98rem',
                    lineHeight: 1.82,
                    color: '#2c3a4c',
                  }}
                >
                  {briefParagraphs.map((p, idx) => (
                    <p
                      key={idx}
                      style={{
                        margin:
                          idx < briefParagraphs.length - 1 ? '0 0 16px' : 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 03: DEPARTURE DETAILS */}
            <section style={{ paddingBottom: '48px' }}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: c.amber,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                02 // DEPARTURE DETAILS
              </span>
              <h3
                style={{
                  fontSize: 'clamp(1.4rem, 4.2vw, 1.85rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: c.navy,
                  margin: '0 0 20px',
                }}
              >
                Detail Keberangkatan Kita
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px',
                }}
              >
                {departureItems.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      backgroundColor: c.card,
                      border: `1px solid ${c.line}`,
                      borderRadius: '10px',
                      padding: '18px 20px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: c.teal,
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      {item.label}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.96rem',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        color: c.navy,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 04: THE ROUTE (WAYPOINTS) */}
            {routeWaypoints.length > 0 && (
              <section style={{ paddingBottom: '48px' }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: c.amber,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  03 // THE ROUTE
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.4rem, 4.2vw, 1.85rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: c.navy,
                    margin: '0 0 20px',
                  }}
                >
                  Rute Perjalanan Kita
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {routeWaypoints.map((wp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.card,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.teal}`,
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
                        <span style={{ color: c.teal }}>
                          WAYPOINT {String(idx + 1).padStart(2, '0')}
                        </span>
                        {wp.time && (
                          <span style={{ color: c.amber }}>{wp.time}</span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 700,
                          color: c.navy,
                          margin: '0 0 6px',
                        }}
                      >
                        {wp.title}
                      </h4>

                      {wp.note && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.93rem',
                            lineHeight: 1.65,
                            color: c.slate,
                          }}
                        >
                          {wp.note}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: ON-BOARD PERKS */}
            {onboardPerks.length > 0 && (
              <section style={{ paddingBottom: '48px' }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: c.amber,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  04 // ON-BOARD PERKS
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.4rem, 4.2vw, 1.85rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: c.navy,
                    margin: '0 0 18px',
                  }}
                >
                  Fasilitas Khusus Penumpang VIP
                </h3>

                <div
                  style={{
                    backgroundColor: c.card,
                    border: `1.5px dashed ${c.teal}`,
                    borderRadius: '10px',
                    padding: '8px 20px',
                  }}
                >
                  {onboardPerks.map((perk, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 0',
                        borderBottom:
                          idx < onboardPerks.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.55,
                          color: c.navy,
                          fontWeight: 500,
                        }}
                      >
                        {perk}
                      </span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: c.teal,
                          backgroundColor: c.tealSoft,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          flexShrink: 0,
                        }}
                      >
                        VIP
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 06: READY FOR BOARDING (PENUTUP + STEMPEL CHECK-IN) */}
            <footer
              style={{
                backgroundColor: c.navy,
                color: c.card,
                borderRadius: '14px',
                padding: 'clamp(30px, 6vw, 44px) 22px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: '#fbbf24',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                READY FOR BOARDING
              </span>

              <p
                style={{
                  maxWidth: '470px',
                  margin: '0 auto 18px',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: 'rgba(255, 255, 255, 0.82)',
                }}
              >
                “{closingNote}”
              </p>

              <p
                style={{
                  fontFamily: mono,
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#fbbf24',
                  margin: '0 0 28px',
                }}
              >
                — {senderName}
              </p>

              {!checkedIn ? (
                <motion.button
                  type="button"
                  onClick={() => setCheckedIn(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: c.amber,
                    color: c.card,
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: mono,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Konfirmasi Check-In
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    maxWidth: '410px',
                    margin: '0 auto',
                    backgroundColor: c.amberSoft,
                    border: `1.5px solid #fbbf24`,
                    borderRadius: '10px',
                    padding: '16px 20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: '#fbbf24',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    CHECK-IN CONFIRMED · SEAT 01A
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: c.card,
                      lineHeight: 1.55,
                    }}
                  >
                    Penumpang {receiverName} terdaftar untuk rute {routeFrom} →{' '}
                    {routeTo} pada {dateText}.
                  </p>
                </motion.div>
              )}

              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '14px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
                  fontFamily: mono,
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                BOARDING PASS FOR TWO · {tripCode}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
