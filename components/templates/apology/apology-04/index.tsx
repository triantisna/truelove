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

export default function Apology04({ website }: { website: WebsiteRecord }) {
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
  const openingNote = getString(
    content,
    'openingNote',
    'Tidak ada pembelaan di dalam sini, hanya kejujuran.',
  );
  const acknowledgment = getString(
    content,
    'acknowledgment',
    'Aku sadar aku salah, dan aku tidak ingin mencari pembenaran apa pun atas sikapku.',
  );
  const letterHeadline = getString(
    content,
    'letterHeadline',
    'Maaf karena sudah membuatmu kecewa',
  );
  const mainLetter = getString(
    content,
    'mainLetter',
    website.message ||
      'Aku menulis ini pelan-pelan untuk meminta maaf dengan tulus.',
  );

  const memoryPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.memoryPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.memoryPhoto, website.media]);

  const memoryCaption = getString(
    content,
    'memoryCaption',
    'Hal terbaik yang tidak pernah ingin kusia-siakan.',
  );

  const commitments = useMemo(() => {
    return getString(content, 'commitments', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, ...rest] = line.split('|');
        return {
          title: title.trim(),
          detail: rest.join('|').trim(),
        };
      });
  }, [content]);

  const closingText = getString(
    content,
    'closingText',
    'Ambil waktumu sebanyak yang kamu butuh. Aku di sini kapan pun kamu siap bicara.',
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

  // Palet Warm Stone & Kintsugi Gold
  const c = {
    stone: '#f4f2ee',
    paper: '#fbfaf7',
    charcoal: '#1f1e1c',
    muted: '#6b665e',
    gold: '#b58d47',
    line: 'rgba(31, 30, 28, 0.12)',
    goldSoft: 'rgba(181, 141, 71, 0.35)',
  };

  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const bodySerif = "'Newsreader', Georgia, 'Times New Roman', serif";
  const sans = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.stone,
        color: c.charcoal,
        fontFamily: bodySerif,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: THE PAUSE (OPENING SCREEN) --- */
          <motion.section
            key="the-pause"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.65 }}
            style={{
              minHeight: '100svh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: '460px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Garis vertikal emas ala Kintsugi */}
              <div
                aria-hidden="true"
                style={{
                  width: '1px',
                  height: '56px',
                  backgroundColor: c.gold,
                  marginBottom: '28px',
                }}
              />

              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: c.gold,
                  marginBottom: '16px',
                }}
              >
                Untuk {receiverName}
              </span>

              <h1
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(2.3rem, 7.5vw, 3.2rem)',
                  fontWeight: 500,
                  lineHeight: 1.12,
                  color: c.charcoal,
                  margin: '0 0 18px',
                }}
              >
                The Quiet Mend
              </h1>

              <p
                style={{
                  fontSize: '1.08rem',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  color: c.muted,
                  margin: '0 0 38px',
                  maxWidth: '360px',
                }}
              >
                {openingNote}
              </p>

              <motion.button
                type="button"
                onClick={() => setOpened(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '13px 28px',
                  backgroundColor: c.charcoal,
                  color: c.paper,
                  border: `1px solid ${c.charcoal}`,
                  fontFamily: sans,
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Buka &amp; Baca Pelan-Pelan
              </motion.button>

              <p
                style={{
                  fontFamily: sans,
                  fontSize: '0.68rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  marginTop: '36px',
                }}
              >
                Dari {senderName}
              </p>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 05: ISI SURAT --- */
          <motion.div
            key="mend-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '660px',
              margin: '0 auto',
              padding: '0 22px 92px',
            }}
          >
            {/* Header Minimalis */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '26px 0',
                borderBottom: `1px solid ${c.line}`,
                fontFamily: sans,
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: c.muted,
              }}
            >
              <span>Untuk {receiverName}</span>
              <span style={{ color: c.gold }}>The Quiet Mend</span>
            </header>

            {/* 02: WHAT I GOT WRONG (PENGAKUAN JUJUR) */}
            <section style={{ padding: '64px 0 56px' }}>
              <div
                style={{
                  backgroundColor: c.paper,
                  border: `1px solid ${c.line}`,
                  borderLeft: `3px solid ${c.gold}`,
                  padding: 'clamp(24px, 5vw, 38px)',
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: c.gold,
                    display: 'block',
                    marginBottom: '14px',
                  }}
                >
                  01 · Pengakuan Tanpa Pembelaan
                </span>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.35rem, 4.2vw, 1.7rem)',
                    fontStyle: 'italic',
                    lineHeight: 1.55,
                    color: c.charcoal,
                    margin: 0,
                  }}
                >
                  “{acknowledgment}”
                </p>
              </div>
            </section>

            {/* Pemisah Kintsugi */}
            <div
              aria-hidden="true"
              style={{
                width: '48px',
                height: '1px',
                backgroundColor: c.gold,
                margin: '0 auto 56px',
              }}
            />

            {/* 03: THE APOLOGY (SURAT UTAMA + FOTO KENANGAN) */}
            <article style={{ marginBottom: '68px' }}>
              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: c.muted,
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                02 · Surat Untukmu
              </span>

              <h2
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(1.9rem, 5.2vw, 2.5rem)',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: c.charcoal,
                  margin: '0 0 28px',
                }}
              >
                {letterHeadline}
              </h2>

              <div
                style={{
                  fontSize: '1.14rem',
                  lineHeight: 1.9,
                  color: '#2d2b28',
                }}
              >
                {paragraphs.map((p, idx) => (
                  <p key={idx} style={{ margin: '0 0 22px' }}>
                    {p}
                  </p>
                ))}
              </div>

              {memoryPhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  style={{
                    margin: '42px 0 0',
                    backgroundColor: c.paper,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                  }}
                >
                  <img
                    src={memoryPhoto}
                    alt={memoryCaption}
                    loading="lazy"
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {memoryCaption && (
                    <figcaption
                      style={{
                        paddingTop: '12px',
                        fontSize: '0.94rem',
                        fontStyle: 'italic',
                        color: c.muted,
                        textAlign: 'center',
                      }}
                    >
                      {memoryCaption}
                    </figcaption>
                  )}
                </motion.figure>
              )}
            </article>

            {/* 04: HOW I'LL DO BETTER (KOMITMEN NYATA) */}
            {commitments.length > 0 && (
              <section
                style={{
                  padding: '48px 0 56px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: c.gold,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  03 · Langkah Perbaikan
                </span>

                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 'clamp(1.65rem, 4.5vw, 2.1rem)',
                    fontWeight: 500,
                    color: c.charcoal,
                    margin: '0 0 28px',
                  }}
                >
                  Hal yang akan kuperbaiki ke depannya
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {commitments.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.06 }}
                      style={{
                        display: 'flex',
                        gap: '18px',
                        alignItems: 'flex-start',
                        padding: '18px 20px',
                        backgroundColor: c.paper,
                        border: `1px solid ${c.line}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: sans,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: c.gold,
                          paddingTop: '3px',
                          flexShrink: 0,
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: sans,
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: c.charcoal,
                          }}
                        >
                          {item.title}
                        </p>
                        {item.detail && (
                          <p
                            style={{
                              margin: '6px 0 0',
                              fontSize: '0.98rem',
                              lineHeight: 1.6,
                              color: c.muted,
                            }}
                          >
                            {item.detail}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: TAKE YOUR TIME (PENUTUP TANPA TEKANAN) */}
            <footer
              style={{
                paddingTop: '52px',
                borderTop: `1px solid ${c.goldSoft}`,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: sans,
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: c.gold,
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                Ambil Waktumu
              </span>

              <p
                style={{
                  maxWidth: '490px',
                  margin: '0 auto 30px',
                  fontSize: '1.18rem',
                  fontStyle: 'italic',
                  lineHeight: 1.75,
                  color: c.charcoal,
                }}
              >
                {closingText}
              </p>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '1.8rem',
                  fontStyle: 'italic',
                  color: c.charcoal,
                  margin: '0 0 36px',
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
                  paddingTop: '18px',
                  borderTop: `1px dashed ${c.line}`,
                }}
              >
                Ditulis dengan tulus untuk {receiverName}
                {formattedDate ? ` · ${formattedDate}` : ''}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
