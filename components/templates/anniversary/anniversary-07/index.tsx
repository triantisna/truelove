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

export default function Anniversary07({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
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
  const chapterLabel = getString(content, 'chapterLabel', 'CHAPTER 01');
  const editionCode = getString(
    content,
    'editionCode',
    'EDITION NO. 07 · HARDCOVER',
  );
  const bookTitle = getString(content, 'bookTitle', 'Pages of Us');
  const coverTagline = getString(
    content,
    'coverTagline',
    'Every year adds a new chapter—and you are still my favorite story.',
  );

  const frontispiecePhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.frontispiecePhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.frontispiecePhoto, website.media]);

  const dedicationText = getString(
    content,
    'dedicationText',
    `Untuk ${receiverName}, yang selalu menjadi rumah di setiap bab.`,
  );

  const forewordTitle = getString(
    content,
    'forewordTitle',
    'Kata Pengantar untuk Bab Baru Kita',
  );
  const forewordBody = getString(
    content,
    'forewordBody',
    website.message ||
      'Terima kasih sudah menemani setiap halaman perjalanan kita tahun ini. Semoga bab-bab berikutnya selalu dipenuhi ketenangan dan rasa syukur.',
  );

  const bookmarkedMoments = useMemo(() => {
    return getString(content, 'bookmarkedMoments', '')
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

  const marginNotes = useMemo(() => {
    return getString(content, 'marginNotes', '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }, [content]);

  const closingNote = getString(
    content,
    'closingNote',
    'Masih banyak halaman kosong di depan kita, dan aku hanya ingin menulis semuanya bersamamu.',
  );

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const forewordParagraphs = forewordBody
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Palet Bookcloth Forest & Antique Brass
  const c = {
    paper: '#f6f3ec',
    ivory: '#fcfaf5',
    forest: '#1e352b',
    forestDeep: '#162820',
    brass: '#a68346',
    brassSoft: 'rgba(166, 131, 70, 0.14)',
    brassLine: 'rgba(166, 131, 70, 0.42)',
    ink: '#222423',
    muted: '#5e6360',
    line: 'rgba(30, 53, 43, 0.15)',
  };

  const displaySerif =
    "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  const bodySerif = "'Newsreader', Georgia, 'Times New Roman', serif";
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.paper,
        color: c.ink,
        fontFamily: bodySerif,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap');
        .pou7-dropcap::first-letter {
          float: left;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 3.4rem;
          font-weight: 600;
          line-height: 0.82;
          padding-right: 10px;
          padding-top: 4px;
          color: #1e352b;
        }
      `}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
        {!opened ? (
          /* --- 01: THE HARDCOVER (OPENING SCREEN) --- */
          <motion.section
            key="book-hardcover"
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
                width: 'min(100%, 420px)',
                backgroundColor: c.forest,
                color: c.ivory,
                padding: '14px',
                borderRadius: '3px 10px 10px 3px',
                boxShadow:
                  'inset 10px 0 18px rgba(0, 0, 0, 0.28), 0 28px 64px rgba(22, 40, 32, 0.28)',
              }}
            >
              <div
                style={{
                  border: `1px solid ${c.brassLine}`,
                  padding: 'clamp(28px, 6vw, 42px) clamp(22px, 5vw, 34px)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontFamily: mono,
                    fontSize: '0.58rem',
                    letterSpacing: '0.16em',
                    color: '#d9be8b',
                    paddingBottom: '14px',
                    borderBottom: `1px solid ${c.brassLine}`,
                    marginBottom: '28px',
                  }}
                >
                  <span>{editionCode}</span>
                  <span>{chapterLabel}</span>
                </div>

                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(252, 250, 245, 0.72)',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  {senderName} &amp; {receiverName}
                </span>

                <h1
                  style={{
                    fontFamily: displaySerif,
                    fontSize: 'clamp(2.35rem, 8vw, 3.1rem)',
                    fontWeight: 600,
                    lineHeight: 1.08,
                    color: c.ivory,
                    margin: '0 0 18px',
                  }}
                >
                  {bookTitle}
                </h1>

                <div
                  aria-hidden="true"
                  style={{
                    width: '36px',
                    height: '1px',
                    backgroundColor: c.brass,
                    margin: '0 auto 20px',
                  }}
                />

                <p
                  style={{
                    fontSize: '1.02rem',
                    fontStyle: 'italic',
                    lineHeight: 1.66,
                    color: 'rgba(252, 250, 245, 0.82)',
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
                    backgroundColor: c.brass,
                    color: c.forestDeep,
                    border: 'none',
                    fontFamily: mono,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Buka Halaman Pertama →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* --- 02 - 06: ISI BUKU KENANGAN PAGES OF US --- */
          <motion.div
            key="book-pages"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              maxWidth: '740px',
              margin: '0 auto',
              padding: '0 20px 88px',
            }}
          >
            {/* Running Book Header */}
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
                fontSize: '0.64rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: c.forest, fontWeight: 600 }}>
                {bookTitle} · {senderName} &amp; {receiverName}
              </span>
              <span style={{ color: c.brass }}>{chapterLabel}</span>
            </header>

            {/* 02: THE FRONTISPIECE (FOTO UTAMA & DEDIKASI) */}
            <section style={{ padding: '44px 0 52px', textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: c.brass,
                  display: 'block',
                  marginBottom: '18px',
                }}
              >
                PAGE 01 · FRONTISPIECE
              </span>

              {frontispiecePhoto && (
                <motion.figure
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{
                    margin: '0 auto 28px',
                    backgroundColor: c.ivory,
                    border: `1px solid ${c.line}`,
                    padding: '12px',
                    boxShadow: '0 14px 36px rgba(30, 53, 43, 0.06)',
                  }}
                >
                  <img
                    src={frontispiecePhoto}
                    alt={dedicationText}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </motion.figure>
              )}

              <p
                style={{
                  maxWidth: '500px',
                  margin: '0 auto',
                  fontFamily: displaySerif,
                  fontSize: 'clamp(1.3rem, 3.8vw, 1.65rem)',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  color: c.forest,
                }}
              >
                “{dedicationText}”
              </p>
            </section>

            {/* 03: THE FOREWORD (SURAT ANNIVERSARY) */}
            <section
              style={{
                padding: '44px 0 52px',
                borderTop: `1px solid ${c.line}`,
              }}
            >
              <div
                style={{
                  backgroundColor: c.ivory,
                  border: `1px solid ${c.line}`,
                  borderTop: `3px solid ${c.forest}`,
                  padding: 'clamp(26px, 5vw, 44px)',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    color: c.brass,
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  PAGE 02 · THE FOREWORD
                </span>

                <h2
                  style={{
                    fontFamily: displaySerif,
                    fontSize: 'clamp(1.85rem, 5vw, 2.4rem)',
                    fontWeight: 600,
                    lineHeight: 1.18,
                    color: c.forest,
                    margin: '0 0 22px',
                  }}
                >
                  {forewordTitle}
                </h2>

                <div
                  style={{
                    fontSize: '1.08rem',
                    lineHeight: 1.88,
                    color: c.ink,
                  }}
                >
                  {forewordParagraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className={idx === 0 ? 'pou7-dropcap' : undefined}
                      style={{
                        margin:
                          idx < forewordParagraphs.length - 1 ? '0 0 18px' : 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* 04: BOOKMARKED MOMENTS */}
            {bookmarkedMoments.length > 0 && (
              <section
                style={{
                  padding: '44px 0 52px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    color: c.brass,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  PAGE 03 · BOOKMARKED MOMENTS
                </span>
                <h3
                  style={{
                    fontFamily: displaySerif,
                    fontSize: 'clamp(1.75rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.forest,
                    margin: '0 0 24px',
                  }}
                >
                  Halaman yang Paling Ingin Kusimpan
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {bookmarkedMoments.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      style={{
                        backgroundColor: c.ivory,
                        border: `1px solid ${c.line}`,
                        borderLeft: `3px solid ${c.brass}`,
                        padding: '20px 22px',
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
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                          marginBottom: '6px',
                        }}
                      >
                        <span style={{ color: c.brass }}>
                          BOOKMARK {String(idx + 1).padStart(2, '0')}
                        </span>
                        {item.date && (
                          <span style={{ color: c.forest }}>{item.date}</span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontFamily: displaySerif,
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          color: c.forest,
                          margin: '0 0 6px',
                        }}
                      >
                        {item.title}
                      </h4>

                      {item.note && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.98rem',
                            lineHeight: 1.7,
                            color: c.muted,
                          }}
                        >
                          {item.note}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 05: MARGIN NOTES */}
            {marginNotes.length > 0 && (
              <section
                style={{
                  padding: '44px 0 52px',
                  borderTop: `1px solid ${c.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    color: c.brass,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  PAGE 04 · MARGIN NOTES
                </span>
                <h3
                  style={{
                    fontFamily: displaySerif,
                    fontSize: 'clamp(1.75rem, 4.8vw, 2.25rem)',
                    fontWeight: 600,
                    color: c.forest,
                    margin: '0 0 22px',
                  }}
                >
                  Catatan Kecil di Tepi Halaman
                </h3>

                <div
                  style={{
                    backgroundColor: c.ivory,
                    border: `1px dashed ${c.brassLine}`,
                    padding: '8px 22px',
                  }}
                >
                  {marginNotes.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '14px',
                        padding: '15px 0',
                        borderBottom:
                          idx < marginNotes.length - 1
                            ? `1px dashed ${c.line}`
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          color: c.brass,
                          flexShrink: 0,
                        }}
                      >
                        §{idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: '1rem',
                          lineHeight: 1.65,
                          color: c.ink,
                        }}
                      >
                        {note}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 06: TO BE CONTINUED (PENUTUP + PEMBATAS BUKU) */}
            <footer
              style={{
                backgroundColor: c.forest,
                color: c.ivory,
                padding: '12px',
              }}
            >
              <div
                style={{
                  border: `1px solid ${c.brassLine}`,
                  padding: 'clamp(30px, 6vw, 46px) 22px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    color: '#d9be8b',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  TO BE CONTINUED
                </span>

                <p
                  style={{
                    maxWidth: '470px',
                    margin: '0 auto 18px',
                    fontSize: '1.04rem',
                    fontStyle: 'italic',
                    lineHeight: 1.75,
                    color: 'rgba(252, 250, 245, 0.85)',
                  }}
                >
                  “{closingNote}”
                </p>

                <p
                  style={{
                    fontFamily: displaySerif,
                    fontSize: '1.9rem',
                    fontStyle: 'italic',
                    color: c.ivory,
                    margin: '0 0 28px',
                  }}
                >
                  — {senderName}
                </p>

                {!bookmarked ? (
                  <motion.button
                    type="button"
                    onClick={() => setBookmarked(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: c.brass,
                      color: c.forestDeep,
                      border: 'none',
                      fontFamily: mono,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Simpan Pembatas Buku
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      maxWidth: '420px',
                      margin: '0 auto',
                      backgroundColor: c.brassSoft,
                      border: `1.5px solid ${c.brass}`,
                      padding: '16px 20px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        color: '#e5cb9a',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      BOOKMARKED · TO BE CONTINUED
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.94rem',
                        color: c.ivory,
                        lineHeight: 1.55,
                      }}
                    >
                      {chapterLabel} untuk {senderName} &amp; {receiverName}{' '}
                      telah ditandai—siap melanjutkan ke bab berikutnya.
                    </p>
                  </motion.div>
                )}

                <div
                  style={{
                    marginTop: '34px',
                    paddingTop: '16px',
                    borderTop: `1px dashed ${c.brassLine}`,
                    fontFamily: mono,
                    fontSize: '0.6rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(252, 250, 245, 0.62)',
                  }}
                >
                  {bookTitle} · {editionCode}
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
