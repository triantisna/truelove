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

export default function Apology05({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const content = (website.content ?? {}) as ContentValue;

  const receiverName = getString(
    content,
    'receiverName',
    website.receiverName || 'Kamu',
  );
  const senderName = getString(
    content,
    'senderName',
    website.senderName || 'Aku',
  );
  const invitationLine = getString(
    content,
    'invitationLine',
    'Boleh kita duduk sebentar dan bicara pelan-pelan?',
  );
  const whatIDid = getString(
    content,
    'whatIDid',
    'Aku terlalu cepat tersulut emosi dan tidak mendengarkanmu dengan tenang kemarin.',
  );
  const whatIShouldHaveDone = getString(
    content,
    'whatIShouldHaveDone',
    'Seharusnya aku menaruh egoku di samping dan menyelesaikan masalahnya bersama.',
  );
  const letterHeadline = getString(
    content,
    'letterHeadline',
    'Maaf sudah membuat ruang di antara kita terasa dingin',
  );
  const mainLetter = getString(
    content,
    'mainLetter',
    website.message ||
      'Aku menulis ini untuk meminta maaf dengan tulus dan mengajak kita bicara baik-baik.',
  );

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

  const peaceOfferingTitle = getString(
    content,
    'peaceOfferingTitle',
    'Kopi, Makan Enak & Obrolan Tenang',
  );
  const peaceOfferingDetail = getString(
    content,
    'peaceOfferingDetail',
    '1x traktir kopi dan makanan favoritmu di tempat pilihanmu, plus aku yang mendengarkan semua ceritamu tanpa menyela.',
  );
  const closingText = getString(
    content,
    'closingText',
    'Kursi di seberangku selalu kosong untukmu. Kabari aku kapan pun kamu siap bicara.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
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

  // Palet Warm Espresso & Oat
  const c = {
    oat: '#f5f0e6',
    cream: '#fbf8f2',
    espresso: '#2c221e',
    muted: '#6e6058',
    eucalyptus: '#5c6e58',
    terracotta: '#b36a5e',
    line: 'rgba(44, 34, 30, 0.14)',
  };

  const serif = "'Fraunces', Georgia, 'Times New Roman', serif";
  const bodySerif = "'Newsreader', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.oat,
        color: c.espresso,
        fontFamily: bodySerif,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE INVITATION (RESERVATION CARD) --- */
          <motion.section
            key="reservation-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -18 }}
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
                backgroundColor: c.cream,
                border: `1px solid ${c.line}`,
                padding: 'clamp(28px, 6vw, 42px)',
                textAlign: 'center',
                boxShadow: '0 24px 54px rgba(44, 34, 30, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: sans,
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  paddingBottom: '14px',
                  borderBottom: `1px dashed ${c.line}`,
                  marginBottom: '28px',
                }}
              >
                <span>TABLE FOR TWO</span>
                <span style={{ color: c.eucalyptus }}>OVER COFFEE</span>
              </div>

              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: c.terracotta,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Untuk {receiverName}
              </span>

              <h1
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.8rem, 6vw, 2.35rem)',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  margin: '0 0 16px',
                  color: c.espresso,
                }}
              >
                {invitationLine}
              </h1>

              <p
                style={{
                  fontSize: '0.98rem',
                  fontStyle: 'italic',
                  color: c.muted,
                  lineHeight: 1.6,
                  margin: '0 0 32px',
                }}
              >
                Dua kursi, secangkir kopi hangat, dan permintaan maaf yang tulus
                dari {senderName}.
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
                  fontFamily: sans,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Duduk &amp; Baca →
              </motion.button>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI HALAMAN --- */
          <motion.div
            key="coffee-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '740px',
              margin: '0 auto',
              padding: '0 20px 88px',
            }}
          >
            {/* Top Bar */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 0',
                borderBottom: `1px solid ${c.line}`,
                fontFamily: sans,
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: c.muted,
              }}
            >
              <span>OVER COFFEE</span>
              <span style={{ color: c.eucalyptus }}>
                {senderName} → {receiverName}
              </span>
            </header>

            {/* 02: TWO SIDES OF THE MOMENT (REFLEKSI 2 KOLOM) */}
            <section style={{ padding: '56px 0 48px' }}>
              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: c.terracotta,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                01 · Refleksi Jujur
              </span>
              <h2
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.6rem, 4.8vw, 2.15rem)',
                  fontWeight: 500,
                  margin: '0 0 24px',
                }}
              >
                Melihat ulang apa yang terjadi
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    backgroundColor: c.cream,
                    border: `1px solid ${c.line}`,
                    borderTop: `3px solid ${c.terracotta}`,
                    padding: '22px 24px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: sans,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: c.terracotta,
                      margin: '0 0 12px',
                    }}
                  >
                    Yang Kulakukan Kemarin
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.02rem',
                      lineHeight: 1.7,
                      color: c.espresso,
                    }}
                  >
                    {whatIDid}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: c.cream,
                    border: `1px solid ${c.line}`,
                    borderTop: `3px solid ${c.eucalyptus}`,
                    padding: '22px 24px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: sans,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: c.eucalyptus,
                      margin: '0 0 12px',
                    }}
                  >
                    Yang Seharusnya Kulakukan
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.02rem',
                      lineHeight: 1.7,
                      color: c.espresso,
                    }}
                  >
                    {whatIShouldHaveDone}
                  </p>
                </div>
              </div>
            </section>

            {/* 03: THE HONEST LETTER */}
            <article
              style={{
                padding: '48px clamp(22px, 5vw, 44px)',
                backgroundColor: c.cream,
                border: `1px solid ${c.line}`,
                marginBottom: '56px',
              }}
            >
              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                02 · Surat Untukmu
              </span>

              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.7rem, 4.8vw, 2.25rem)',
                  fontWeight: 500,
                  lineHeight: 1.22,
                  margin: '0 0 28px',
                  color: c.espresso,
                }}
              >
                {letterHeadline}
              </h3>

              <div
                style={{
                  fontSize: '1.14rem',
                  lineHeight: 1.88,
                  color: '#352a25',
                }}
              >
                {paragraphs.map((p, idx) => (
                  <p key={idx} style={{ margin: '0 0 20px' }}>
                    {p}
                  </p>
                ))}
              </div>
            </article>

            {/* 04: WORTH FIGHTING FOR (GALERI KENANGAN) */}
            {gallery.length > 0 && (
              <section style={{ marginBottom: '60px' }}>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: c.eucalyptus,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  03 · Worth Fighting For
                </span>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.55rem, 4.5vw, 2rem)',
                    fontWeight: 500,
                    margin: '0 0 24px',
                  }}
                >
                  Hal-hal baik yang tidak ingin kulepas
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '18px',
                  }}
                >
                  {gallery.map((src, i) => (
                    <motion.figure
                      key={`${src}-${i}`}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      style={{
                        margin: 0,
                        backgroundColor: c.cream,
                        border: `1px solid ${c.line}`,
                        padding: '10px',
                      }}
                    >
                      <img
                        src={src}
                        alt={galleryCaptions[i] || `Kenangan ${i + 1}`}
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
                          lineHeight: 1.45,
                          color: c.muted,
                        }}
                      >
                        {galleryCaptions[i] || `Kenangan #${i + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* 05: THE PEACE OFFERING (VOUCHER DAMAI) */}
            <section style={{ marginBottom: '64px' }}>
              <div
                style={{
                  backgroundColor: c.espresso,
                  color: c.cream,
                  padding: 'clamp(26px, 5vw, 40px)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    border: '1px dashed rgba(251, 248, 242, 0.28)',
                    padding: 'clamp(20px, 4vw, 32px)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      fontFamily: sans,
                      fontSize: '0.66rem',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#d8c3a5',
                      marginBottom: '16px',
                    }}
                  >
                    <span>PEACE OFFERING · VOUCHER</span>
                    <span>VALID ANYTIME</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                      fontWeight: 500,
                      margin: '0 0 12px',
                      color: c.cream,
                    }}
                  >
                    {peaceOfferingTitle}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      color: 'rgba(251, 248, 242, 0.85)',
                    }}
                  >
                    {peaceOfferingDetail}
                  </p>
                </div>
              </div>
            </section>

            {/* 06: THE OPEN SEAT (PENUTUP) */}
            <footer
              style={{
                textAlign: 'center',
                paddingTop: '40px',
                borderTop: `1px solid ${c.line}`,
              }}
            >
              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: c.eucalyptus,
                  display: 'block',
                  marginBottom: '14px',
                }}
              >
                The Open Seat
              </span>

              <p
                style={{
                  maxWidth: '480px',
                  margin: '0 auto 28px',
                  fontSize: '1.16rem',
                  fontStyle: 'italic',
                  lineHeight: 1.75,
                  color: c.espresso,
                }}
              >
                “{closingText}”
              </p>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.7rem',
                  fontStyle: 'italic',
                  margin: '0 0 32px',
                }}
              >
                — {senderName}
              </p>

              <div
                style={{
                  fontFamily: sans,
                  fontSize: '0.66rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: c.muted,
                }}
              >
                Over Coffee · Untuk {receiverName}
                {formattedDate ? ` · ${formattedDate}` : ''}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
