'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';
import type { WebsiteRecord } from '@/types/website';

type GalleryItem = { url: string; caption?: string };
type ContentValue = Record<string, unknown>;

// --- HELPER FUNCTIONS ---
function getString(content: ContentValue, key: string, fallback = ''): string {
  const value = content[key];
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function getMediaUrl(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'url' in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === 'string' ? url : '';
  }
  return '';
}

function getGallery(content: ContentValue): GalleryItem[] {
  if (!Array.isArray(content.gallery)) return [];
  return content.gallery
    .map((item): GalleryItem | null => {
      if (typeof item === 'string' && item) return { url: item };
      if (typeof item === 'object' && item !== null && 'url' in item) {
        const photo = item as { url?: unknown; caption?: unknown };
        if (typeof photo.url === 'string' && photo.url) {
          return {
            url: photo.url,
            caption:
              typeof photo.caption === 'string' ? photo.caption : undefined,
          };
        }
      }
      return null;
    })
    .filter((item): item is GalleryItem => item !== null);
}

// --- MAIN COMPONENT ---
export default function LoveLetter02({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const content = (website.content ?? {}) as ContentValue;

  const senderName = getString(
    content,
    'senderName',
    website.senderName || 'Someone who loves you',
  );
  const receiverName = getString(
    content,
    'receiverName',
    website.receiverName || 'My Dearest',
  );
  const openingText = getString(
    content,
    'openingText',
    'To someone who means more than words could ever explain.',
  );
  const mainMessage = getString(
    content,
    'mainMessage',
    website.message ||
      'There are so many things I have been meaning to tell you.',
  );
  const closingText = getString(
    content,
    'closingText',
    'Until words become memories, and memories become forever.',
  );
  const heroImage = getMediaUrl(content.heroImage);

  const gallery = useMemo(() => {
    const fromContent = getGallery(content);
    if (fromContent.length > 0) return fromContent.slice(0, 6);
    return (website.media ?? [])
      .filter((item) => item.type === 'image')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 6)
      .map((item) => ({ url: item.url, caption: item.caption || undefined }));
  }, [content, website.media]);

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as any).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const hasGreeting = mainMessage.trim().toLowerCase().startsWith('dear ');

  // PALET WARNA (Warm Ivory, Muted Burgundy, Antique Gold)
  const c = {
    bg: '#f4eee3',
    paper: '#fcf9f2',
    envelope: '#e9dcc8',
    envelopeDark: '#dcc8ab',
    ink: '#46332d',
    inkSoft: '#7a665c',
    wine: '#7d3842',
    gold: '#b28b58',
    border: 'rgba(158, 124, 86, 0.25)',
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: c.bg,
        backgroundImage:
          'radial-gradient(circle at 50% 0%, #fbf7ef 0%, #f1e8d9 100%)',
        color: c.ink,
        fontFamily: "Georgia, 'Times New Roman', serif",
        overflowX: 'hidden',
      }}
    >
      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          /* --- 01: ENVELOPE OPENING SCREEN --- */
          <motion.section
            key="envelope-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
            transition={{ duration: 0.7 }}
            style={{
              minHeight: '100svh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 20px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.26em',
                color: c.gold,
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              A Letter For You
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 7vw, 3.2rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                margin: '0 0 12px',
                color: c.ink,
              }}
            >
              The Letter <em style={{ color: c.wine }}>I Kept</em>
            </h1>
            <p
              style={{
                fontSize: '0.92rem',
                color: c.inkSoft,
                maxWidth: '320px',
                lineHeight: 1.7,
                margin: '0 0 36px',
              }}
            >
              Someone has written something special for you.
            </p>

            {/* Amplop Interaktif */}
            <motion.button
              type="button"
              onClick={() => setOpened(true)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Open your letter"
              style={{
                position: 'relative',
                width: 'min(100%, 320px)',
                aspectRatio: '1.6 / 1',
                background: `linear-gradient(160deg, ${c.envelope}, ${c.envelopeDark})`,
                border: `1px solid ${c.border}`,
                borderRadius: '6px',
                boxShadow: '0 20px 45px rgba(70, 51, 45, 0.14)',
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              {/* Lipatan Atas Amplop */}
              <div
                style={{
                  position: 'absolute',
                  inset: '0 0 auto 0',
                  height: '58%',
                  background: `linear-gradient(180deg, #efe4d2, ${c.envelopeDark})`,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  borderBottom: `1px solid ${c.border}`,
                }}
              />
              {/* Wax Seal */}
              <div
                style={{
                  position: 'absolute',
                  top: '52%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 30%, #a5525c, ${c.wine} 75%)`,
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 12px rgba(71, 31, 34, 0.3)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#f7dec3',
                  fontSize: '1.1rem',
                }}
              >
                ♥
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: 0,
                  right: 0,
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  color: c.ink,
                }}
              >
                For {receiverName}
              </span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: '32px',
                padding: '13px 28px',
                backgroundColor: c.wine,
                color: '#fff8ee',
                border: 'none',
                borderRadius: '999px',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.8rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(125, 56, 66, 0.25)',
              }}
            >
              Open Your Letter ↗
            </motion.button>
          </motion.section>
        ) : (
          /* --- 02 - 05: UNFOLDED LETTER CONTENT --- */
          <motion.div
            key="letter-content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              maxWidth: '620px',
              margin: '0 auto',
              padding: '56px 20px 80px',
            }}
          >
            {/* Header Kecil */}
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.68rem',
                  letterSpacing: '0.25em',
                  color: c.gold,
                  fontWeight: 700,
                }}
              >
                AN UNSPOKEN LOVE, FINALLY WRITTEN
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 6vw, 3.1rem)',
                  fontWeight: 400,
                  margin: '10px 0 0',
                  color: c.ink,
                }}
              >
                The Letter <em style={{ color: c.wine }}>I Kept.</em>
              </h1>
            </header>

            {/* Kertas Surat Utama */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              style={{
                backgroundColor: c.paper,
                border: `1px solid ${c.border}`,
                borderRadius: '4px',
                padding: 'clamp(28px, 6vw, 52px)',
                boxShadow: '0 20px 55px rgba(70, 51, 45, 0.08)',
              }}
            >
              {!hasGreeting && (
                <p
                  style={{
                    fontSize: '1.65rem',
                    fontStyle: 'italic',
                    color: c.wine,
                    margin: '0 0 14px',
                  }}
                >
                  Dear {receiverName},
                </p>
              )}

              <p
                style={{
                  fontSize: '0.98rem',
                  fontStyle: 'italic',
                  color: c.inkSoft,
                  lineHeight: 1.85,
                  margin: '0 0 28px',
                  paddingBottom: '20px',
                  borderBottom: `1px solid ${c.border}`,
                }}
              >
                {openingText}
              </p>

              {/* Foto Utama (Opsional) */}
              {heroImage && (
                <figure
                  style={{
                    margin: '0 0 32px',
                    padding: '10px 10px 16px',
                    backgroundColor: '#fff',
                    border: `1px solid ${c.border}`,
                    boxShadow: '0 8px 24px rgba(70, 51, 45, 0.08)',
                    transform: 'rotate(-1deg)',
                  }}
                >
                  <img
                    src={heroImage}
                    alt={`Memory for ${receiverName}`}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'saturate(0.88) sepia(0.08)',
                    }}
                  />
                  <figcaption
                    style={{
                      marginTop: '10px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontStyle: 'italic',
                      color: c.inkSoft,
                    }}
                  >
                    A little piece of us, worth keeping.
                  </figcaption>
                </figure>
              )}

              {/* Isi Surat */}
              <div
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 2,
                  color: c.ink,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {mainMessage}
              </div>

              {/* Penutup & Tanda Tangan */}
              <div
                style={{
                  marginTop: '42px',
                  paddingTop: '28px',
                  borderTop: `1px solid ${c.border}`,
                }}
              >
                <p
                  style={{
                    fontSize: '1.05rem',
                    fontStyle: 'italic',
                    color: c.wine,
                    lineHeight: 1.7,
                    margin: '0 0 24px',
                  }}
                >
                  {closingText}
                </p>
                <p
                  style={{
                    fontSize: '0.88rem',
                    fontStyle: 'italic',
                    color: c.inkSoft,
                    margin: 0,
                  }}
                >
                  With all my love,
                </p>
                <p
                  style={{
                    fontSize: '1.85rem',
                    fontStyle: 'italic',
                    color: c.wine,
                    margin: '6px 0 0',
                  }}
                >
                  {senderName}.
                </p>
              </div>
            </motion.article>

            {/* 04: A MEMORY TO KEEP (POLAROID GALLERY) */}
            {gallery.length > 0 && (
              <section style={{ marginTop: '64px', textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.24em',
                    color: c.gold,
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  A MEMORY TO KEEP
                </p>
                <h2
                  style={{
                    fontSize: '1.9rem',
                    fontWeight: 400,
                    margin: '0 0 32px',
                  }}
                >
                  Moments <em style={{ color: c.wine }}>worth keeping.</em>
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '22px',
                  }}
                >
                  {gallery.map((photo, i) => (
                    <motion.figure
                      key={`${photo.url}-${i}`}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6, rotate: 0, scale: 1.03 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      style={{
                        width: 'min(220px, 44%)',
                        margin: 0,
                        padding: '8px 8px 16px',
                        backgroundColor: '#fff',
                        border: `1px solid ${c.border}`,
                        boxShadow: '0 10px 26px rgba(70, 51, 45, 0.1)',
                        transform: `rotate(${i % 2 === 0 ? '-2.5deg' : '2.5deg'})`,
                      }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || `Memory ${i + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '1 / 1.05',
                          objectFit: 'cover',
                          display: 'block',
                          filter: 'saturate(0.85) sepia(0.08)',
                        }}
                      />
                      <figcaption
                        style={{
                          marginTop: '10px',
                          fontSize: '0.78rem',
                          fontStyle: 'italic',
                          color: c.inkSoft,
                          lineHeight: 1.4,
                        }}
                      >
                        {photo.caption || `Memory #${i + 1}`}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer
              style={{
                marginTop: '64px',
                paddingTop: '28px',
                borderTop: `1px solid ${c.border}`,
                textAlign: 'center',
                color: c.inkSoft,
              }}
            >
              <span style={{ color: c.wine, fontSize: '1.1rem' }}>♥</span>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  margin: '10px 0 0',
                }}
              >
                WRITTEN FOR {receiverName.toUpperCase()} · KEPT FOREVER
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
