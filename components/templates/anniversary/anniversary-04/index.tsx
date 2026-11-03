'use client';

import React, { useEffect, useRef, useState } from 'react';
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

const BG = '#0c0c0e';
const CARD = '#16161a';
const GOLD = '#d4af37';
const IVORY = '#f4f4f5';
const MUTED = 'rgba(244,244,245,0.64)';
const LINE = 'rgba(212,175,55,0.3)';
const CURTAIN = '#3a0a14';

const SERIF =
  "'Bodoni Moda', 'Playfair Display', Georgia, 'Times New Roman', serif";
const MONO = "'Courier Prime', 'Courier New', Courier, monospace";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400&family=Courier+Prime:wght@400;700&display=swap');";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
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

function formatDate(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getRunningTime(value: string): { days: number; label: string } | null {
  if (!value) return null;
  const start = new Date(value);
  if (isNaN(start.getTime())) return null;
  const now = new Date();
  const days = Math.max(
    0,
    Math.floor((now.getTime() - start.getTime()) / 86400000),
  );
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  years = Math.max(0, years);
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} tahun`);
  if (months > 0) parts.push(`${months} bulan`);
  if (parts.length === 0) parts.push(`${days} hari`);
  return { days, label: parts.join(' ') };
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function SceneHeading({
  scene,
  title,
  isMobile,
  align = 'left',
}: {
  scene: string;
  title: string;
  isMobile: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ textAlign: align, marginBottom: isMobile ? 28 : 44 }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: isMobile ? 12 : 13,
          color: GOLD,
          letterSpacing: '0.18em',
          marginBottom: 14,
        }}
      >
        {scene}
      </div>
      <h2
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: isMobile ? 30 : 46,
          lineHeight: 1.15,
          margin: 0,
          color: IVORY,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          width: 72,
          height: 1,
          background: GOLD,
          margin: align === 'center' ? '20px auto 0' : '20px 0 0',
          opacity: 0.8,
        }}
      />
    </motion.div>
  );
}

function Sparkles() {
  const items = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 120,
        overflow: 'hidden',
      }}
    >
      {items.map((i) => {
        const left = (i * 37) % 100;
        const size = 5 + ((i * 7) % 7);
        const delay = ((i * 13) % 10) / 10;
        const drift = ((i * 11) % 60) - 30;
        return (
          <motion.span
            key={i}
            initial={{ y: -30, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: '105vh',
              x: drift,
              opacity: [0, 1, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 3.2 + ((i * 3) % 20) / 10,
              delay,
              ease: 'easeIn',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              background: i % 3 === 0 ? IVORY : GOLD,
              borderRadius: 1,
              display: 'block',
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 0: Opening                                                   */
/* ------------------------------------------------------------------ */

function OpeningScene({
  isMobile,
  receiver,
  sender,
  title,
  tagline,
  dateText,
  onPlay,
}: {
  isMobile: boolean;
  receiver: string;
  sender: string;
  title: string;
  tagline: string;
  dateText: string;
  onPlay: () => void;
}) {
  const curtainBase: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50.5%',
    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%), repeating-linear-gradient(90deg, ${CURTAIN} 0px, #5a1524 26px, ${CURTAIN} 52px, #2a0710 70px)`,
    boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)',
  };

  const stubBarcode: React.CSSProperties = {
    width: isMobile ? '100%' : 54,
    height: isMobile ? 34 : 120,
    backgroundImage: `repeating-linear-gradient(${isMobile ? 90 : 0}deg, ${IVORY} 0px, ${IVORY} 2px, transparent 2px, transparent 5px, ${IVORY} 5px, ${IVORY} 6px, transparent 6px, transparent 10px)`,
    opacity: 0.8,
  };

  const cutout: React.CSSProperties = {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: BG,
    border: `1px solid ${LINE}`,
  };

  return (
    <motion.div
      key="opening"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* Tirai kiri & kanan */}
      <motion.div
        initial={{ x: 0 }}
        exit={{
          x: '-102%',
          transition: { duration: 1.7, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
        }}
        style={{ ...curtainBase, left: 0, borderRight: `2px solid ${GOLD}` }}
      />
      <motion.div
        initial={{ x: 0 }}
        exit={{
          x: '102%',
          transition: { duration: 1.7, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
        }}
        style={{ ...curtainBase, right: 0, borderLeft: `2px solid ${GOLD}` }}
      />

      {/* Valance atas */}
      <motion.div
        exit={{
          y: '-100%',
          transition: { duration: 1.2, delay: 0.9, ease: EASE },
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isMobile ? 34 : 48,
          background: `linear-gradient(180deg, #1c0409, ${CURTAIN})`,
          borderBottom: `2px solid ${GOLD}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      />

      {/* Tiket + tombol */}
      <motion.div
        exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.6 } }}
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '64px 18px 32px' : '72px 24px 40px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -1.2 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: isMobile ? 360 : 640,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            background: CARD,
            border: `1px solid ${GOLD}`,
            borderRadius: 6,
            boxShadow:
              '0 30px 80px rgba(0,0,0,0.7), 0 0 0 6px rgba(12,12,14,0.55)',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              flex: 1,
              padding: isMobile ? '28px 22px 24px' : '36px 36px 32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: GOLD,
                letterSpacing: '0.2em',
              }}
            >
              The Cinema of Us
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: MUTED,
                marginTop: 6,
              }}
            >
              Admit two. Seat A1 dan A2
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: isMobile ? 31 : 44,
                lineHeight: 1.12,
                color: IVORY,
                margin: isMobile ? '22px 0 14px' : '26px 0 16px',
              }}
            >
              {title}
            </h1>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: isMobile ? 18 : 22,
                color: GOLD,
              }}
            >
              {receiver} &amp; {sender}
            </div>
            <p
              style={{
                fontFamily: MONO,
                fontSize: isMobile ? 12 : 13,
                color: MUTED,
                lineHeight: 1.6,
                margin: '18px 0 0',
              }}
            >
              {tagline}
              {dateText ? ` | Tayang perdana ${dateText}` : ''}
            </p>
          </div>

          {/* Perforasi */}
          <div
            style={{
              position: 'relative',
              flex: '0 0 auto',
              width: isMobile ? '100%' : 0,
              height: isMobile ? 0 : 'auto',
              borderTop: isMobile ? `2px dashed ${LINE}` : 'none',
              borderLeft: isMobile ? 'none' : `2px dashed ${LINE}`,
            }}
          >
            {isMobile ? (
              <>
                <span style={{ ...cutout, left: -14, top: -14 }} />
                <span style={{ ...cutout, right: -14, top: -14 }} />
              </>
            ) : (
              <>
                <span style={{ ...cutout, top: -14, left: -14 }} />
                <span style={{ ...cutout, bottom: -14, left: -14 }} />
              </>
            )}
          </div>

          {/* Stub */}
          <div
            style={{
              flex: '0 0 auto',
              width: isMobile ? '100%' : 120,
              boxSizing: 'border-box',
              padding: isMobile ? '18px 22px 22px' : '24px 18px',
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: MUTED,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              Babak
              <div style={{ fontFamily: SERIF, fontSize: 28, color: GOLD }}>
                IV
              </div>
              Pemutaran spesial
            </div>
            <div style={stubBarcode} />
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={onPlay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            marginTop: isMobile ? 34 : 44,
            padding: isMobile ? '16px 30px' : '18px 40px',
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: isMobile ? 16 : 18,
            color: BG,
            background: GOLD,
            border: 'none',
            borderRadius: 999,
            cursor: 'pointer',
            boxShadow:
              '0 0 0 6px rgba(212,175,55,0.18), 0 12px 40px rgba(212,175,55,0.35)',
          }}
        >
          Play Our Movie 🎬
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: IVORY,
            margin: '16px 0 0',
            textAlign: 'center',
            textShadow: '0 1px 6px rgba(0,0,0,0.8)',
          }}
        >
          Nyalakan suara untuk pengalaman terbaik
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 1: Act I                                                     */
/* ------------------------------------------------------------------ */

function ActOne({
  isMobile,
  title,
  location,
  story,
  quote,
  image,
  receiver,
  sender,
}: {
  isMobile: boolean;
  title: string;
  location: string;
  story: string;
  quote: string;
  image: string;
  receiver: string;
  sender: string;
}) {
  const paragraphs = splitParagraphs(story);
  return (
    <section
      style={{
        padding: isMobile ? '72px 20px' : '120px 40px',
        maxWidth: 1120,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <SceneHeading
        scene="Act I | The Meet Cute"
        title={title}
        isMobile={isMobile}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 32 : 64,
          alignItems: isMobile ? 'stretch' : 'center',
        }}
      >
        {/* Film still */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          style={{
            flex: isMobile ? 'none' : '0 0 44%',
            width: isMobile ? '100%' : undefined,
          }}
        >
          <div
            style={{
              background: '#000',
              padding: isMobile ? '22px 0' : '30px 0',
              border: `1px solid ${LINE}`,
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                background: CARD,
                overflow: 'hidden',
              }}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'sepia(0.25) contrast(1.05) saturate(0.9)',
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: MONO,
                    color: MUTED,
                    fontSize: 13,
                  }}
                >
                  Foto adegan pertama
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 14px 0',
                fontFamily: MONO,
                fontSize: 11,
                color: MUTED,
              }}
            >
              <span>Take 1</span>
              <span>Kamera A</span>
            </div>
          </div>
        </motion.div>

        {/* Narasi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          style={{ flex: 1 }}
        >
          {location && (
            <div
              style={{
                fontFamily: MONO,
                fontSize: isMobile ? 13 : 14,
                color: GOLD,
                marginBottom: 22,
                lineHeight: 1.6,
              }}
            >
              INT. {location} | SORE
            </div>
          )}
          {paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: SERIF,
                fontSize: isMobile ? 17 : 19,
                lineHeight: 1.85,
                color: i === 0 ? IVORY : MUTED,
                margin: '0 0 20px',
              }}
            >
              {p}
            </p>
          ))}
          {quote && (
            <blockquote
              style={{
                margin: '30px 0 0',
                padding: '4px 0 4px 20px',
                borderLeft: `2px solid ${GOLD}`,
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: isMobile ? 21 : 26,
                lineHeight: 1.45,
                color: GOLD,
              }}
            >
              {quote}
              <footer
                style={{
                  fontFamily: MONO,
                  fontStyle: 'normal',
                  fontSize: 12,
                  color: MUTED,
                  marginTop: 12,
                }}
              >
                {receiver} &amp; {sender}
              </footer>
            </blockquote>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 2: Act II Film Strip                                         */
/* ------------------------------------------------------------------ */

function FilmStrip({
  isMobile,
  title,
  photos,
  captions,
}: {
  isMobile: boolean;
  title: string;
  photos: string[];
  captions: string[];
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const frameWidth = isMobile ? 220 : 290;

  const scrollByFrame = (dir: 1 | -1) => {
    scroller.current?.scrollBy({
      left: dir * (frameWidth + 8) * (isMobile ? 1 : 2),
      behavior: 'smooth',
    });
  };

  const sprocket: React.CSSProperties = {
    height: 22,
    width: '100%',
    backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 9px, rgba(244,244,245,0.88) 9px, rgba(244,244,245,0.88) 25px, transparent 25px, transparent 34px)`,
    backgroundSize: '34px 12px',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: '0 center',
  };

  const arrowStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: `1px solid ${GOLD}`,
    background: 'transparent',
    color: GOLD,
    fontFamily: MONO,
    fontSize: 18,
    cursor: 'pointer',
  };

  return (
    <section
      style={{
        padding: isMobile ? '72px 0' : '120px 0',
        background: `linear-gradient(180deg, ${BG} 0%, #111114 50%, ${BG} 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: isMobile ? '0 20px' : '0 40px',
        }}
      >
        <SceneHeading
          scene="Act II | Favorite Scenes"
          title={title}
          isMobile={isMobile}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: EASE }}
        style={{ transform: 'rotate(-1deg)' }}
      >
        <div
          ref={scroller}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            padding: '14px 0',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              minWidth: '100%',
              background: '#050505',
              borderTop: '1px solid #222',
              borderBottom: '1px solid #222',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}
          >
            <div style={sprocket} />
            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: '6px 16px',
                alignItems: 'stretch',
              }}
            >
              {photos.length === 0 && (
                <div
                  style={{
                    width: frameWidth,
                    height: frameWidth * 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: MONO,
                    fontSize: 13,
                    color: MUTED,
                  }}
                >
                  Belum ada foto
                </div>
              )}
              {photos.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  style={{
                    flex: `0 0 ${frameWidth}px`,
                    width: frameWidth,
                    scrollSnapAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#0a0a0b',
                    padding: '10px 10px 12px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4 / 5',
                      overflow: 'hidden',
                      background: CARD,
                      border: '1px solid #2a2a2e',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={captions[i] || `Adegan ${i + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: 'sepia(0.22) contrast(1.05)',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: MONO,
                      fontSize: 11,
                      color: GOLD,
                      padding: '8px 2px 0',
                    }}
                  >
                    <span>▶ {String(i + 1).padStart(2, '0')}A</span>
                    <span>Scene {i + 1}</span>
                  </div>
                  <p
                    style={{
                      fontFamily: MONO,
                      fontSize: isMobile ? 12 : 13,
                      lineHeight: 1.55,
                      color: IVORY,
                      margin: '8px 2px 0',
                      minHeight: isMobile ? 56 : 62,
                    }}
                  >
                    {captions[i] || ''}
                  </p>
                </div>
              ))}
            </div>
            <div style={sprocket} />
          </div>
        </div>
      </motion.div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
          marginTop: 28,
        }}
      >
        <button
          type="button"
          aria-label="Frame sebelumnya"
          onClick={() => scrollByFrame(-1)}
          style={arrowStyle}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Frame berikutnya"
          onClick={() => scrollByFrame(1)}
          style={arrowStyle}
        >
          ›
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 3: Act III Soundtrack                                        */
/* ------------------------------------------------------------------ */

function Soundtrack({
  isMobile,
  title,
  song,
  artist,
  message,
}: {
  isMobile: boolean;
  title: string;
  song: string;
  artist: string;
  message: string;
}) {
  const reduce = useReducedMotion();
  const paragraphs = splitParagraphs(message);
  const discSize = isMobile ? 220 : 300;

  return (
    <section
      style={{
        padding: isMobile ? '72px 20px' : '120px 40px',
        maxWidth: 1120,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <SceneHeading
        scene="Act III | The Soundtrack of Us"
        title={title}
        isMobile={isMobile}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: EASE }}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? 32 : 64,
          background: CARD,
          border: `1px solid ${LINE}`,
          borderRadius: 4,
          padding: isMobile ? '32px 22px' : '56px 56px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Piringan hitam */}
        <div
          style={{
            position: 'relative',
            flex: '0 0 auto',
            width: discSize,
            height: discSize,
          }}
        >
          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundImage:
                'repeating-radial-gradient(circle at center, #0a0a0b 0px, #0a0a0b 3px, #18181c 4px, #0a0a0b 5px)',
              border: '2px solid #000',
              boxShadow: '0 18px 50px rgba(0,0,0,0.7), inset 0 0 0 6px #111',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background:
                  'conic-gradient(from 20deg, transparent 0deg, rgba(255,255,255,0.08) 40deg, transparent 90deg, transparent 200deg, rgba(255,255,255,0.06) 240deg, transparent 290deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '34%',
                height: '34%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: GOLD,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.25)',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: BG,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Teks */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: GOLD,
              marginBottom: 10,
            }}
          >
            Sedang diputar
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: isMobile ? 28 : 38,
              lineHeight: 1.15,
              margin: '0 0 6px',
              color: IVORY,
            }}
          >
            {song}
          </h3>
          {artist && (
            <div
              style={{
                fontFamily: MONO,
                fontSize: 14,
                color: MUTED,
                marginBottom: 24,
              }}
            >
              {artist}
            </div>
          )}
          {paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: SERIF,
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.85,
                color: i === 0 ? IVORY : MUTED,
                margin: '0 0 16px',
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene 4: Epilogue & Credits                                        */
/* ------------------------------------------------------------------ */

function Credits({
  isMobile,
  title,
  receiver,
  sender,
  directedBy,
  extraCredits,
  running,
  buttonText,
  onOpenLetter,
}: {
  isMobile: boolean;
  title: string;
  receiver: string;
  sender: string;
  directedBy: string;
  extraCredits: { role: string; name: string }[];
  running: { days: number; label: string } | null;
  buttonText: string;
  onOpenLetter: () => void;
}) {
  const roleStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: isMobile ? 12 : 13,
    color: GOLD,
    marginBottom: 8,
  };
  const nameStyle: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: isMobile ? 24 : 34,
    color: IVORY,
    lineHeight: 1.25,
  };

  const lines: { role: string; name: string }[] = [
    { role: 'Starring', name: `${receiver} & ${sender}` },
    { role: 'Directed by', name: directedBy },
    ...extraCredits,
  ];

  return (
    <section
      style={{
        padding: isMobile ? '88px 20px 96px' : '140px 40px 140px',
        background: `linear-gradient(180deg, ${BG} 0%, #050506 40%, #000 100%)`,
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SceneHeading
          scene="Epilogue"
          title={title}
          isMobile={isMobile}
          align="center"
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 34 : 48,
            marginTop: 24,
          }}
        >
          {lines.map((line, i) => (
            <motion.div
              key={`${line.role}-${i}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div style={roleStyle}>{line.role}</div>
              <div
                style={
                  i === 0
                    ? {
                        ...nameStyle,
                        fontSize: isMobile ? 30 : 48,
                        fontStyle: 'italic',
                      }
                    : nameStyle
                }
              >
                {line.name}
              </div>
            </motion.div>
          ))}
        </div>

        {running && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{
              margin: isMobile ? '56px auto 0' : '72px auto 0',
              padding: '22px 20px',
              border: `1px solid ${LINE}`,
              maxWidth: 420,
              fontFamily: MONO,
              color: MUTED,
              fontSize: isMobile ? 13 : 14,
              lineHeight: 1.8,
            }}
          >
            Durasi film: <span style={{ color: GOLD }}>{running.label}</span>
            <br />
            Sudah {running.days.toLocaleString('id-ID')} hari tayang, dan masih
            berlanjut
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{ marginTop: isMobile ? 48 : 64 }}
        >
          <motion.button
            type="button"
            onClick={onOpenLetter}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: isMobile ? '15px 28px' : '17px 38px',
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: isMobile ? 15 : 17,
              color: BG,
              background: GOLD,
              border: 'none',
              borderRadius: 999,
              cursor: 'pointer',
              boxShadow:
                '0 0 0 6px rgba(212,175,55,0.16), 0 10px 34px rgba(212,175,55,0.3)',
            }}
          >
            {buttonText}
          </motion.button>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: MUTED,
              marginTop: 56,
            }}
          >
            Dibuat dengan cinta. Tidak ada adegan yang diulang.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LetterModal({
  isMobile,
  letter,
  signature,
  receiver,
  onClose,
}: {
  isMobile: boolean;
  letter: string;
  signature: string;
  receiver: string;
  onClose: () => void;
}) {
  const paragraphs = splitParagraphs(letter);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(0,0,0,0.88)',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: isMobile ? '24px 14px' : '48px 24px',
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Surat untuk ${receiver}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 620,
          margin: 'auto',
          background: CARD,
          border: `1px solid ${GOLD}`,
          borderRadius: 4,
          padding: isMobile ? '40px 24px 32px' : '60px 56px 48px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.8)',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup surat"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `1px solid ${LINE}`,
            background: 'transparent',
            color: GOLD,
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: GOLD,
            textAlign: 'center',
            marginBottom: 26,
          }}
        >
          Surat terakhir untuk {receiver}
        </div>
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.25, duration: 0.7 }}
            style={{
              fontFamily: SERIF,
              fontSize: isMobile ? 17 : 19,
              lineHeight: 1.9,
              color: i === 0 ? GOLD : IVORY,
              fontStyle: i === 0 ? 'italic' : 'normal',
              margin: '0 0 20px',
              whiteSpace: 'pre-line',
            }}
          >
            {p}
          </motion.p>
        ))}
        {signature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.6 + paragraphs.length * 0.25,
              duration: 0.8,
            }}
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: isMobile ? 20 : 24,
              color: GOLD,
              textAlign: 'right',
              marginTop: 28,
            }}
          >
            {signature}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Anniversary04({
  website,
  content: contentProp,
}: {
  website: any;
  content?: Content;
}) {
  const content: Content = contentProp || website?.content || {};

  const [isOpened, setIsOpened] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [running, setRunning] = useState<{
    days: number;
    label: string;
  } | null>(null);
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
  const title = getString(content, 'anniversaryTitle', 'Film Kita');
  const rawDate = getString(content, 'anniversaryDate', '');
  const tagline = getString(
    content,
    'openingTagline',
    'Sebuah kisah cinta dalam empat babak',
  );

  const act1Title = getString(content, 'act1Title', 'Pertemuan Pertama');
  const act1Location = getString(content, 'act1Location', '');
  const act1Story = getString(
    content,
    'act1Story',
    'Setiap film besar dimulai dari satu adegan sederhana. Milik kita dimulai ketika dua orang asing saling menoleh pada waktu yang tepat.',
  );
  const act1Quote = getString(content, 'act1Quote', '');
  const coverImage = getImage(content, 'coverImage');

  const galleryTitle = getString(
    content,
    'galleryTitle',
    'Adegan Favorit Kita',
  );
  const photos = getMediaList(content, 'gallery');
  const captions = getString(content, 'galleryCaptions', '')
    .split('\n')
    .map((c) => c.trim());

  const soundtrackTitle = getString(
    content,
    'soundtrackTitle',
    'Lagu yang Selalu Kita Putar',
  );
  const soundtrackSong = getString(content, 'soundtrackSong', 'Lagu Kita');
  const soundtrackArtist = getString(content, 'soundtrackArtist', '');
  const soundtrackMessage = getString(
    content,
    'soundtrackMessage',
    'Setiap hubungan punya lagunya sendiri. Ini adalah lagu kita.',
  );

  const epilogueTitle = getString(
    content,
    'epilogueTitle',
    'Bersambung ke Selamanya',
  );
  const directedBy = getString(content, 'directedBy', 'Cinta');
  const finalButtonText = getString(
    content,
    'finalButtonText',
    'Buka Surat Terakhir 💌',
  );
  const finalLetter = getString(content, 'finalLetter', '');
  const finalSignature = getString(content, 'finalSignature', '');

  const extraCredits = getString(content, 'creditsList', '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [role, ...rest] = line.split('|');
      return { role: (role || '').trim(), name: rest.join('|').trim() };
    })
    .filter((item) => item.role && item.name);

  useEffect(() => {
    setRunning(getRunningTime(rawDate));
  }, [rawDate]);

  const handlePlay = () => {
    setIsOpened(true);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const handleOpenLetter = () => {
    setLetterOpen(true);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 6000);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = !isOpened || letterOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened, letterOpen]);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: BG,
        color: IVORY,
        fontFamily: SERIF,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />

      {/* Vignette halus di seluruh layar */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 5,
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      <FloatingMusicPlayer url={musicUrl} isOpened={isOpened} />

      <AnimatePresence>
        {!isOpened && (
          <OpeningScene
            key="opening"
            isMobile={isMobile}
            receiver={receiver}
            sender={sender}
            title={title}
            tagline={tagline}
            dateText={formatDate(rawDate)}
            onPlay={handlePlay}
          />
        )}
      </AnimatePresence>

      {isOpened && (
        <main style={{ position: 'relative', zIndex: 1 }}>
          {/* Judul pembuka sebelum Act I */}
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.6 }}
            style={{
              minHeight: isMobile ? '52vh' : '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: isMobile ? '88px 20px 24px' : '110px 40px 40px',
              boxSizing: 'border-box',
              background: `radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.16) 0%, transparent 60%)`,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 13,
                color: GOLD,
                letterSpacing: '0.2em',
                marginBottom: 22,
              }}
            >
              The Cinema of Us
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: isMobile ? 38 : 76,
                lineHeight: 1.08,
                margin: 0,
                maxWidth: 900,
                color: IVORY,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: isMobile ? 18 : 24,
                color: MUTED,
                margin: '22px 0 0',
              }}
            >
              {receiver} &amp; {sender}
            </p>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: GOLD,
                marginTop: 30,
              }}
            >
              Gulir ke bawah untuk memulai Babak I
            </div>
          </motion.header>

          <ActOne
            isMobile={isMobile}
            title={act1Title}
            location={act1Location}
            story={act1Story}
            quote={act1Quote}
            image={coverImage}
            receiver={receiver}
            sender={sender}
          />

          <FilmStrip
            isMobile={isMobile}
            title={galleryTitle}
            photos={photos}
            captions={captions}
          />

          <Soundtrack
            isMobile={isMobile}
            title={soundtrackTitle}
            song={soundtrackSong}
            artist={soundtrackArtist}
            message={soundtrackMessage}
          />

          <Credits
            isMobile={isMobile}
            title={epilogueTitle}
            receiver={receiver}
            sender={sender}
            directedBy={directedBy}
            extraCredits={extraCredits}
            running={running}
            buttonText={finalButtonText}
            onOpenLetter={handleOpenLetter}
          />
        </main>
      )}

      <AnimatePresence>
        {letterOpen && (
          <LetterModal
            key="letter"
            isMobile={isMobile}
            letter={
              finalLetter ||
              `${receiver} sayang,\n\nTerima kasih sudah menjadi pemeran utama dalam hidupku. Film kita belum selesai, dan aku ingin menulis adegan berikutnya bersamamu.`
            }
            signature={finalSignature}
            receiver={receiver}
            onClose={() => setLetterOpen(false)}
          />
        )}
      </AnimatePresence>

      {celebrate && <Sparkles />}
    </div>
  );
}
