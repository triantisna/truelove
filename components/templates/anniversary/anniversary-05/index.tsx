'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';

/* ------------------------------------------------------------------ */
/*  Helpers wajib                                                      */
/* ------------------------------------------------------------------ */

type Content = Record<string, any>;

function getString(
  content: Content | undefined | null,
  key: string,
  fallback: string = '',
): string {
  const value = content?.[key];
  if (typeof value === 'string' && value.trim() !== '') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function getImage(content: Content | undefined | null, key: string): string {
  const value = content?.[key];
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return value.url || value.src || '';
  return '';
}

function getMediaList(
  content: Content | undefined | null,
  key: string,
): string[] {
  const value = content?.[key];
  if (Array.isArray(value)) {
    return value
      .map((item: any) =>
        typeof item === 'string' ? item : item?.url || item?.src || '',
      )
      .filter((item: string) => Boolean(item));
  }
  if (typeof value === 'string' && value.trim() !== '') return [value];
  return [];
}

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const ALABASTER = '#fafafa';
const BLACK = '#111111';
const MARBLE = '#e5e5e5';
const MUTED = '#6b6b6b';
const WHITE = '#ffffff';

const SERIF =
  "'Cormorant Garamond', 'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS =
  "'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SCRIPT =
  "'Mrs Saint Delafield', 'Snell Roundhand', 'Brush Script MT', cursive";

const PAINTING_SHADOW =
  '0 40px 70px -28px rgba(0,0,0,0.3), 0 14px 26px -12px rgba(0,0,0,0.14), 0 2px 5px rgba(0,0,0,0.06)';
const PLACARD_SHADOW =
  '0 10px 24px -14px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.05)';

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Instrument+Sans:wght@400;500;600&family=Mrs+Saint+Delafield&display=swap');";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SLOW = 1.5;

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

function useViewportWidth(): number {
  const [width, setWidth] = useState(1024);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

type Placard = { title: string; medium: string; description: string };

function parsePlacards(text: string): Placard[] {
  return text.split('\n').map((line) => {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length >= 3) {
      return {
        title: parts[0],
        medium: parts[1],
        description: parts.slice(2).join(' | '),
      };
    }
    if (parts.length === 2) {
      return { title: parts[0], medium: '', description: parts[1] };
    }
    return { title: parts[0] || '', medium: '', description: '' };
  });
}

function extractYear(value: string): string {
  const match = value.match(/\d{4}/);
  return match ? match[0] : value || String(new Date().getFullYear());
}

/* ------------------------------------------------------------------ */
/*  Reveal: fade-in + slide-up pelan                                   */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  y = 28,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{
        duration: reduce ? 0.01 : SLOW,
        ease: EASE,
        delay: reduce ? 0 : delay,
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function RoomHeading({
  room,
  title,
  caption,
  isMobile,
  align = 'left',
}: {
  room: string;
  title: string;
  caption?: string;
  isMobile: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal style={{ textAlign: align, marginBottom: isMobile ? 40 : 72 }}>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 13,
          color: MUTED,
          marginBottom: 14,
        }}
      >
        {room}
      </div>
      <h2
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: isMobile ? 40 : 64,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          margin: 0,
          color: BLACK,
        }}
      >
        {title}
      </h2>
      {caption && (
        <p
          style={{
            fontFamily: SANS,
            fontSize: isMobile ? 14 : 15,
            lineHeight: 1.7,
            color: MUTED,
            margin: align === 'center' ? '18px auto 0' : '18px 0 0',
            maxWidth: 460,
          }}
        >
          {caption}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 0: The VIP Pass                                              */
/* ------------------------------------------------------------------ */

function VipPass({
  isMobile,
  receiver,
  sender,
  title,
  subtitle,
  year,
  onEnter,
}: {
  isMobile: boolean;
  receiver: string;
  sender: string;
  title: string;
  subtitle: string;
  year: string;
  onEnter: () => void;
}) {
  const row: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 16,
    padding: '12px 0',
    borderTop: `1px solid ${MARBLE}`,
  };
  const rowLabel: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 12.5,
    color: MUTED,
    flex: '0 0 auto',
  };
  const rowValue: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: isMobile ? 18 : 20,
    color: BLACK,
    textAlign: 'right',
  };

  return (
    <motion.div
      key="vip-pass"
      exit={{ opacity: 0, transition: { duration: 1.3, ease: 'easeInOut' } }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: ALABASTER,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '40px 20px' : '56px 24px',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -50,
            transition: { duration: 1.1, ease: EASE },
          }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 420,
            background: WHITE,
            border: `1px solid ${MARBLE}`,
            boxShadow: PAINTING_SHADOW,
            padding: isMobile ? '44px 26px 28px' : '56px 40px 32px',
            boxSizing: 'border-box',
          }}
        >
          {/* Lubang lanyard */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 18,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 56,
              height: 9,
              borderRadius: 6,
              background: ALABASTER,
              border: `1px solid ${MARBLE}`,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
            }}
          />

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: SANS, fontSize: 13, color: MUTED }}>
              Pass VIP, pameran privat
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: isMobile ? 40 : 50,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: BLACK,
                margin: '16px 0 10px',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: isMobile ? 17 : 19,
                  lineHeight: 1.45,
                  color: MUTED,
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div style={row}>
            <span style={rowLabel}>Tamu kehormatan</span>
            <span style={rowValue}>{receiver}</span>
          </div>
          <div style={row}>
            <span style={rowLabel}>Kurator</span>
            <span style={rowValue}>{sender}</span>
          </div>
          <div style={row}>
            <span style={rowLabel}>Tahun pameran</span>
            <span style={rowValue}>{year}</span>
          </div>
          <div style={{ ...row, paddingBottom: 0 }}>
            <span style={rowLabel}>Akses</span>
            <span style={rowValue}>Satu pengunjung</span>
          </div>

          {/* Barcode */}
          <div
            aria-hidden
            style={{
              marginTop: 26,
              height: 34,
              backgroundImage: `repeating-linear-gradient(90deg, ${BLACK} 0px, ${BLACK} 2px, transparent 2px, transparent 5px, ${BLACK} 5px, ${BLACK} 6px, transparent 6px, transparent 9px, ${BLACK} 9px, ${BLACK} 12px, transparent 12px, transparent 14px)`,
              opacity: 0.85,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          transition={{ duration: 1.6, delay: 1.2 }}
          style={{ textAlign: 'center', marginTop: isMobile ? 32 : 40 }}
        >
          <motion.button
            type="button"
            onClick={onEnter}
            whileHover={{ backgroundColor: '#2a2a2a' }}
            whileTap={{ scale: 0.98 }}
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 15,
              color: ALABASTER,
              background: BLACK,
              border: 'none',
              padding: isMobile ? '16px 40px' : '17px 52px',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            Enter Gallery
          </motion.button>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 12.5,
              color: MUTED,
              margin: '16px 0 0',
            }}
          >
            Musik akan mengiringi kunjungan Anda
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 1: The Foyer                                                 */
/* ------------------------------------------------------------------ */

function Foyer({
  isMobile,
  title,
  subtitle,
  year,
  receiver,
  sender,
  note,
}: {
  isMobile: boolean;
  title: string;
  subtitle: string;
  year: string;
  receiver: string;
  sender: string;
  note: string;
}) {
  const paragraphs = splitParagraphs(note);

  return (
    <>
      {/* Judul pameran */}
      <header
        style={{
          minHeight: isMobile ? '78vh' : '88vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isMobile ? '22px 20px 36px' : '28px 56px 48px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
            fontFamily: SANS,
            fontSize: 13,
            color: MUTED,
            paddingBottom: 16,
            borderBottom: `1px solid ${MARBLE}`,
          }}
        >
          <span>The Masterpiece</span>
          <span>Pameran privat {year}</span>
        </div>

        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, ease: EASE, delay: 1.1 }}
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: isMobile ? 54 : 128,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: BLACK,
              margin: '0 auto',
              maxWidth: 1100,
            }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 2 }}
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: isMobile ? 19 : 28,
                color: MUTED,
                margin: '28px auto 0',
                maxWidth: 640,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.6 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'baseline',
            gap: isMobile ? 6 : 12,
            fontFamily: SANS,
            fontSize: 14,
            color: BLACK,
            paddingTop: 16,
            borderTop: `1px solid ${MARBLE}`,
          }}
        >
          <span>
            Karya {sender} untuk {receiver}
          </span>
          <span style={{ color: MUTED }}>Gulir pelan untuk masuk ke dalam</span>
        </motion.div>
      </header>

      {/* Curator's note */}
      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: isMobile ? '64px 20px 80px' : '112px 56px 140px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 28 : 72,
          }}
        >
          <Reveal style={{ flex: isMobile ? 'none' : '0 0 240px' }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: MUTED,
                marginBottom: 14,
              }}
            >
              Ruang 1
            </div>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: isMobile ? 38 : 48,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                margin: 0,
                color: BLACK,
              }}
            >
              The Foyer
            </h2>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 20,
                color: MUTED,
                margin: '14px 0 0',
              }}
            >
              Curator&rsquo;s Note
            </p>
            <div
              style={{
                width: 48,
                height: 1,
                background: BLACK,
                margin: '26px 0 14px',
              }}
            />
            <div style={{ fontFamily: SANS, fontSize: 13.5, color: BLACK }}>
              {sender}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12.5,
                color: MUTED,
                marginTop: 2,
              }}
            >
              Kurator pameran
            </div>
          </Reveal>

          <Reveal delay={0.15} style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                columnCount: isMobile ? 1 : 2,
                columnGap: 48,
                columnRule: isMobile ? 'none' : `1px solid ${MARBLE}`,
              }}
            >
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: SERIF,
                    fontSize: isMobile ? 18.5 : 20,
                    lineHeight: 1.75,
                    color: BLACK,
                    textAlign: 'justify',
                    hyphens: 'auto',
                    WebkitHyphens: 'auto',
                    margin: '0 0 22px',
                    breakInside: 'avoid-column',
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 2: Hall of Classics                                          */
/* ------------------------------------------------------------------ */

function PaintingFrame({
  src,
  alt,
  isMobile,
}: {
  src: string;
  alt: string;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        background: WHITE,
        padding: isMobile ? 10 : 16,
        border: `1px solid ${MARBLE}`,
        boxShadow: PAINTING_SHADOW,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          background: MARBLE,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SANS,
              fontSize: 13,
              color: MUTED,
            }}
          >
            Karya sedang dipersiapkan
          </div>
        )}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.12)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

function PlacardCard({
  placard,
  index,
  year,
  isMobile,
}: {
  placard: Placard;
  index: number;
  year: string;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        background: WHITE,
        border: `1px solid ${MARBLE}`,
        boxShadow: PLACARD_SHADOW,
        padding: isMobile ? '20px 20px 18px' : '26px 26px 22px',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 360,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 12,
          color: MUTED,
          marginBottom: 12,
        }}
      >
        Karya no. {String(index + 1).padStart(2, '0')}
      </div>
      <h3
        style={{
          fontFamily: SERIF,
          fontWeight: 500,
          fontSize: isMobile ? 25 : 29,
          lineHeight: 1.15,
          margin: 0,
          color: BLACK,
        }}
      >
        {placard.title}
      </h3>
      {placard.medium && (
        <div
          style={{
            fontFamily: SANS,
            fontStyle: 'italic',
            fontSize: 13,
            lineHeight: 1.5,
            color: MUTED,
            margin: '8px 0 0',
          }}
        >
          {placard.medium}
        </div>
      )}
      {placard.description && (
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14,
            lineHeight: 1.75,
            color: '#2b2b2b',
            margin: '16px 0 0',
          }}
        >
          {placard.description}
        </p>
      )}
      <div
        style={{
          fontFamily: SANS,
          fontSize: 12,
          color: MUTED,
          marginTop: 18,
          paddingTop: 12,
          borderTop: `1px solid ${MARBLE}`,
        }}
      >
        Koleksi pribadi, {year}
      </div>
    </div>
  );
}

function HallOfClassics({
  isMobile,
  photos,
  placards,
  year,
  title,
}: {
  isMobile: boolean;
  photos: string[];
  placards: Placard[];
  year: string;
  title: string;
}) {
  const count = Math.max(photos.length, placards.length);
  const indexes = Array.from({ length: count }, (_, i) => i);

  return (
    <section
      style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: isMobile ? '24px 20px 80px' : '40px 56px 120px',
        boxSizing: 'border-box',
        borderTop: `1px solid ${MARBLE}`,
        paddingTop: isMobile ? 72 : 120,
      }}
    >
      <RoomHeading
        room="Ruang 2"
        title="Hall of Classics"
        caption={`Koleksi tetap pameran ${title}. Setiap karya dilengkapi plakat dari kurator.`}
        isMobile={isMobile}
      />

      {count === 0 && (
        <p style={{ fontFamily: SANS, fontSize: 14, color: MUTED }}>
          Koleksi sedang dipersiapkan.
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 72 : 140,
        }}
      >
        {indexes.map((i) => {
          const reversed = i % 2 === 1;
          const placard = placards[i] || {
            title: `Karya tanpa judul ${i + 1}`,
            medium: '',
            description: '',
          };
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: isMobile
                  ? 'column'
                  : reversed
                    ? 'row-reverse'
                    : 'row',
                alignItems: isMobile ? 'stretch' : 'flex-end',
                gap: isMobile ? 26 : 64,
              }}
            >
              <Reveal
                y={36}
                style={{
                  flex: isMobile ? 'none' : '0 0 54%',
                  width: isMobile ? '100%' : undefined,
                }}
              >
                <PaintingFrame
                  src={photos[i] || ''}
                  alt={placard.title}
                  isMobile={isMobile}
                />
              </Reveal>
              <Reveal
                delay={0.35}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  justifyContent: isMobile
                    ? 'flex-start'
                    : reversed
                      ? 'flex-end'
                      : 'flex-start',
                  paddingBottom: isMobile ? 0 : 20,
                }}
              >
                <PlacardCard
                  placard={placard}
                  index={i}
                  year={year}
                  isMobile={isMobile}
                />
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 3: Abstract Room                                             */
/* ------------------------------------------------------------------ */

function AbstractRoom({
  isMobile,
  quotes,
}: {
  isMobile: boolean;
  quotes: string[];
}) {
  const reduce = useReducedMotion();
  if (quotes.length === 0) return null;

  return (
    <section
      style={{
        background: WHITE,
        borderTop: `1px solid ${MARBLE}`,
        borderBottom: `1px solid ${MARBLE}`,
        padding: isMobile ? '72px 20px 40px' : '120px 56px 60px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <RoomHeading
          room="Ruang 3"
          title="Abstract Room"
          caption="Tidak ada lukisan di ruangan ini. Hanya kata-kata yang tidak sempat diucapkan dengan lantang."
          isMobile={isMobile}
        />

        {quotes.map((quote, i) => {
          const align = i % 3 === 0 ? 'left' : i % 3 === 1 ? 'center' : 'right';
          return (
            <div
              key={i}
              style={{
                minHeight: isMobile ? '58vh' : '78vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  align === 'left'
                    ? 'flex-start'
                    : align === 'center'
                      ? 'center'
                      : 'flex-end',
              }}
            >
              <motion.blockquote
                initial={{
                  opacity: 0,
                  y: reduce ? 0 : 44,
                  filter: reduce ? 'blur(0px)' : 'blur(8px)',
                }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.55 }}
                transition={{ duration: reduce ? 0.01 : 1.8, ease: EASE }}
                style={{
                  margin: 0,
                  maxWidth: isMobile ? '100%' : 860,
                  textAlign: align,
                  fontFamily: SERIF,
                  fontStyle: i % 2 === 0 ? 'normal' : 'italic',
                  fontWeight: 400,
                  fontSize: isMobile ? 38 : 84,
                  lineHeight: 1.08,
                  letterSpacing: '-0.015em',
                  color: BLACK,
                }}
              >
                {quote}
              </motion.blockquote>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 4: The Grand Unveil                                          */
/* ------------------------------------------------------------------ */

function GrandUnveil({
  isMobile,
  wish,
  receiver,
  sender,
}: {
  isMobile: boolean;
  wish: string;
  receiver: string;
  sender: string;
}) {
  const [unveiled, setUnveiled] = useState(false);
  const paragraphs = splitParagraphs(wish);
  const doorTransition = {
    duration: 2.4,
    ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    delay: 0.35,
  };

  const doorStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50.2%',
    background: `linear-gradient(180deg, #151515 0%, ${BLACK} 100%)`,
    zIndex: 2,
  };

  return (
    <section
      style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: isMobile ? '88px 20px 88px' : '140px 56px 140px',
        boxSizing: 'border-box',
      }}
    >
      <RoomHeading
        room="Ruang 4"
        title="The Grand Unveil"
        caption="Karya terakhir disimpan terpisah dari koleksi lainnya. Hanya satu orang yang boleh melihatnya."
        isMobile={isMobile}
        align="center"
      />

      <Reveal y={36}>
        <div
          style={{
            position: 'relative',
            border: `${isMobile ? 12 : 18}px solid ${BLACK}`,
            boxShadow: PAINTING_SHADOW,
            background: ALABASTER,
            overflow: 'hidden',
            minHeight: isMobile ? 460 : 560,
          }}
        >
          {/* Karya di dalam bingkai */}
          <motion.div
            aria-hidden={!unveiled}
            initial={{ opacity: 0 }}
            animate={{ opacity: unveiled ? 1 : 0 }}
            transition={{ duration: 2, delay: unveiled ? 1.4 : 0 }}
            style={{
              position: 'relative',
              zIndex: 1,
              padding: isMobile ? '48px 24px 44px' : '84px 96px 72px',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: MUTED,
                marginBottom: 18,
              }}
            >
              The Masterpiece, {receiver} &amp; {sender}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: isMobile ? 34 : 54,
                lineHeight: 1.1,
                color: BLACK,
                marginBottom: isMobile ? 28 : 40,
              }}
            >
              Untukmu, {receiver}
            </div>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: SERIF,
                    fontSize: isMobile ? 19 : 23,
                    lineHeight: 1.75,
                    color: BLACK,
                    margin: '0 0 22px',
                    textAlign: isMobile ? 'left' : 'center',
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Pintu bingkai */}
          <motion.div
            aria-hidden
            initial={{ x: 0 }}
            animate={{ x: unveiled ? '-102%' : 0 }}
            transition={doorTransition}
            style={{ ...doorStyle, left: 0, borderRight: '1px solid #2e2e2e' }}
          />
          <motion.div
            aria-hidden
            initial={{ x: 0 }}
            animate={{ x: unveiled ? '102%' : 0 }}
            transition={doorTransition}
            style={{ ...doorStyle, right: 0, borderLeft: '1px solid #2e2e2e' }}
          />

          {/* Label dan tombol */}
          <AnimatePresence>
            {!unveiled && (
              <motion.div
                key="classified"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.7 } }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0 20px',
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    color: 'rgba(250,250,250,0.6)',
                    marginBottom: 18,
                  }}
                >
                  Tidak untuk umum
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 400,
                    fontSize: isMobile ? 40 : 72,
                    lineHeight: 1.05,
                    letterSpacing: '-0.01em',
                    color: ALABASTER,
                  }}
                >
                  Classified
                  <br />
                  Masterpiece
                </div>
                <div
                  style={{
                    width: 56,
                    height: 1,
                    background: 'rgba(250,250,250,0.5)',
                    margin: '28px 0',
                  }}
                />
                <motion.button
                  type="button"
                  onClick={() => setUnveiled(true)}
                  whileHover={{ backgroundColor: ALABASTER, color: BLACK }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    fontFamily: SANS,
                    fontWeight: 500,
                    fontSize: 15,
                    color: ALABASTER,
                    background: 'transparent',
                    border: `1px solid ${ALABASTER}`,
                    padding: isMobile ? '14px 28px' : '15px 40px',
                    cursor: 'pointer',
                    borderRadius: 2,
                  }}
                >
                  Unveil The Masterpiece
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 5: Guestbook                                                 */
/* ------------------------------------------------------------------ */

function Guestbook({
  isMobile,
  sender,
  receiver,
  message,
  year,
}: {
  isMobile: boolean;
  sender: string;
  receiver: string;
  message: string;
  year: string;
}) {
  const reduce = useReducedMotion();
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 12.5,
    color: MUTED,
  };

  return (
    <section
      style={{
        borderTop: `1px solid ${MARBLE}`,
        padding: isMobile ? '80px 20px 64px' : '130px 56px 96px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <RoomHeading
          room="Ruang 5"
          title="Guestbook"
          caption={`Setiap pengunjung diminta meninggalkan tanda tangan sebelum pulang. ${receiver}, ini halaman khusus untuk kunjungan terakhirmu hari ini.`}
          isMobile={isMobile}
          align="center"
        />

        <Reveal y={32}>
          <div
            style={{
              background: WHITE,
              border: `1px solid ${MARBLE}`,
              boxShadow: PAINTING_SHADOW,
              padding: isMobile ? '32px 22px 28px' : '56px 64px 48px',
              boxSizing: 'border-box',
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 35px, ${MARBLE} 35px, ${MARBLE} 36px)`,
              backgroundPosition: '0 ' + (isMobile ? '120px' : '150px'),
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
                paddingBottom: 14,
                borderBottom: `1px solid ${BLACK}`,
                background: WHITE,
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: isMobile ? 22 : 26,
                  color: BLACK,
                }}
              >
                Buku Tamu
              </span>
              <span style={label}>Tahun {year}</span>
            </div>

            <div style={{ padding: isMobile ? '20px 0 0' : '28px 0 0' }}>
              <div style={{ ...label, marginBottom: 4 }}>Pengunjung</div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: isMobile ? 22 : 26,
                  color: BLACK,
                  lineHeight: 1.4,
                }}
              >
                {sender}
              </div>

              <div style={{ ...label, margin: '26px 0 4px' }}>
                Kesan dan pesan
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: isMobile ? 19 : 22,
                  lineHeight: 1.6,
                  color: BLACK,
                }}
              >
                {message}
              </div>

              <div style={{ ...label, margin: '30px 0 0' }}>Tanda tangan</div>
              <motion.div
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.2 }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: reduce ? 0.01 : 2.8,
                  ease: 'easeInOut',
                  delay: 0.6,
                }}
                style={{
                  fontFamily: SCRIPT,
                  fontSize: isMobile ? 62 : 92,
                  lineHeight: 1.1,
                  color: BLACK,
                  padding: '4px 12px 8px 0',
                  display: 'inline-block',
                }}
              >
                {sender}
              </motion.div>
            </div>
          </div>
        </Reveal>

        <Reveal
          delay={0.2}
          style={{ textAlign: 'center', marginTop: isMobile ? 56 : 80 }}
        >
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: isMobile ? 21 : 26,
              color: BLACK,
              margin: '0 0 12px',
            }}
          >
            Pameran ini tidak pernah ditutup.
          </p>
          <p
            style={{ fontFamily: SANS, fontSize: 13, color: MUTED, margin: 0 }}
          >
            The Masterpiece, {sender} &amp; {receiver}, {year}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Anniversary05({
  website,
  content: contentProp,
}: {
  website: any;
  content?: Content;
}) {
  const content: Content = contentProp || website?.content || {};

  const [isOpened, setIsOpened] = useState(false);
  const width = useViewportWidth();
  const isMobile = width < 700;

  // Musik
  let rawMusicUrl =
    (website as any)?.music?.url ||
    website?.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // Konten
  const receiver = getString(content, 'receiverName', 'Sayang');
  const sender = getString(content, 'senderName', 'Kekasihmu');
  const title = getString(content, 'anniversaryTitle', 'Retrospektif Kita');
  const subtitle = getString(
    content,
    'exhibitionSubtitle',
    'Pameran tunggal tentang kita berdua',
  );
  const year = extractYear(getString(content, 'anniversaryDate', ''));

  const curatorNote = getString(
    content,
    'curatorNote',
    'Selamat datang di pameran privat yang hanya dibuka untuk satu pengunjung.\n\nSetiap karya di dalamnya adalah kenangan yang kukumpulkan dengan hati-hati, supaya kamu tahu betapa berartinya kamu bagiku.',
  );

  const photos = getMediaList(content, 'gallery');
  const placards = parsePlacards(getString(content, 'museumPlacards', ''));
  const quotes = splitLines(getString(content, 'abstractInstallations', ''));

  const wish = getString(
    content,
    'masterpieceWish',
    `${receiver}, karya terbaik di pameran ini adalah hari-hari yang kita lewati bersama.\n\nTerima kasih sudah memilih tinggal. Selamat ulang tahun hubungan kita.`,
  );
  const guestbookMessage = getString(
    content,
    'guestbookMessage',
    'Pameran terindah yang pernah kukunjungi, dan aku ingin kembali setiap hari.',
  );

  const handleEnter = () => {
    setIsOpened(true);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isOpened ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened]);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: ALABASTER,
        color: BLACK,
        fontFamily: SANS,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />

      <FloatingMusicPlayer url={musicUrl} isOpened={isOpened} />

      <AnimatePresence>
        {!isOpened && (
          <VipPass
            key="vip-pass"
            isMobile={isMobile}
            receiver={receiver}
            sender={sender}
            title={title}
            subtitle={subtitle}
            year={year}
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {isOpened && (
        <main style={{ position: 'relative', zIndex: 1 }}>
          <Foyer
            isMobile={isMobile}
            title={title}
            subtitle={subtitle}
            year={year}
            receiver={receiver}
            sender={sender}
            note={curatorNote}
          />

          <HallOfClassics
            isMobile={isMobile}
            photos={photos}
            placards={placards}
            year={year}
            title={title}
          />

          <AbstractRoom isMobile={isMobile} quotes={quotes} />

          <GrandUnveil
            isMobile={isMobile}
            wish={wish}
            receiver={receiver}
            sender={sender}
          />

          <Guestbook
            isMobile={isMobile}
            sender={sender}
            receiver={receiver}
            message={guestbookMessage}
            year={year}
          />
        </main>
      )}
    </div>
  );
}
