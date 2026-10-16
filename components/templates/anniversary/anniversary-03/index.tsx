'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';
import type { WebsiteRecord } from '@/types/website';

// --- HELPER FUNCTIONS ---
function getString(
  content: Record<string, any>,
  key: string,
  fallback = '',
): string {
  const value = content[key];
  return typeof value === 'string' ? value : fallback;
}
function getImage(content: Record<string, any>, key: string): string {
  const value = content[key];
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.url) return value.url;
  return '';
}
function getMediaList(content: Record<string, any>, key: string) {
  const list = content[key];
  if (!Array.isArray(list)) return [];
  return list.filter(
    (item) =>
      typeof item === 'object' && item !== null && typeof item.url === 'string',
  );
}

// --- SUB-COMPONENT: ANIMATED COUNTER ---
function AnimatedStat({ val, label }: { val: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);
  const isNumber =
    !isNaN(Number(val.replace(/[^0-9]/g, ''))) && val.trim() !== '';
  const targetNumber = isNumber ? Number(val.replace(/[^0-9]/g, '')) : 0;

  useEffect(() => {
    if (isInView && isNumber) {
      let start = 0;
      const duration = 2000;
      const increment = targetNumber / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, isNumber, targetNumber]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: 'spring', bounce: 0.5 }}
      style={{
        background: '#fff',
        padding: '16px 12px', // Sedikit kurangi padding samping biar di HP lega
        borderRadius: '20px',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
        border: '2px solid #333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box', // Mencegah padding merusak ukuran width
        transform: `rotate(${Math.random() * 6 - 3}deg)`,
      }}
    >
      <span
        style={{
          fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', // Responsif mengecil di HP
          fontWeight: '900',
          color: '#ff6b6b',
          wordBreak: 'break-word', // Paksa patah ke bawah kalau angka terlalu panjang
          overflowWrap: 'break-word',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        {isNumber ? count : val}
      </span>
      <span
        style={{
          fontSize: '0.85rem', // Sedikit kecilkan agar pas di HP
          fontWeight: 'bold',
          color: '#333',
          textTransform: 'uppercase',
          marginTop: '6px',
          textAlign: 'center',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// --- SUB-COMPONENT: CONFETTI PIECE ---
const CONFETTI_COLORS = [
  '#ff7eb3',
  '#ff758c',
  '#4facfe',
  '#00f2fe',
  '#f6d365',
  '#fda085',
  '#a18cd1',
  '#fbc2eb',
];

function ConfettiPiece({ i }: { i: number }) {
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  const randomX = (Math.random() - 0.5) * window.innerWidth;
  const randomY = (Math.random() - 1) * window.innerHeight;
  const randomRot = Math.random() * 360;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.5, 0.5],
        x: randomX,
        y: randomY,
        rotate: randomRot,
      }}
      transition={{ duration: 1.2 + Math.random() * 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: '10px',
        height: '20px',
        backgroundColor: color,
        borderRadius: '4px',
        zIndex: 100,
      }}
    />
  );
}

// --- MAIN COMPONENT ---
export default function Anniversary03({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const heroTitle = getString(content, 'heroTitle', 'Another Year With You!');
  const heroImage = getImage(content, 'heroImage');
  const funStatsStr = getString(content, 'funStats');
  const gallery = getMediaList(content, 'gallery');
  const punchlineText = getString(
    content,
    'punchlineText',
    "And somehow... I'd still choose all of it again.",
  );
  const mainMessage = getString(content, 'mainMessage', website.message);
  const closingImage = getImage(content, 'closingImage');
  const senderName = getString(content, 'senderName', website.senderName);

  const statsList = funStatsStr.split('\n').filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI ---
  const [isOpened, setIsOpened] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  // Trigger pop effect before opening
  const handlePop = () => {
    setIsPopping(true);
    setTimeout(() => {
      setIsOpened(true);
    }, 1000);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#fcf8f2',
        color: '#333',
        overflowX: 'hidden',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
    >
      <FloatingMusicPlayer url={musicUrl} isOpened={isOpened} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* --- SCENE 1: THE POP BALLOON --- */
          <motion.div
            key="balloon-scene"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              backgroundColor: '#fcf8f2',
            }}
          >
            {isPopping && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <ConfettiPiece key={i} i={i} />
                ))}
              </div>
            )}

            <AnimatePresence>
              {!isPopping && (
                <motion.div
                  exit={{ scale: 1.5, opacity: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeInOut',
                  }}
                  style={{ textAlign: 'center', position: 'relative' }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      color: '#888',
                      marginBottom: '20px',
                      textTransform: 'uppercase',
                    }}
                  >
                    For {receiverName}
                  </p>

                  <button
                    onClick={handlePop}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '6rem',
                      cursor: 'pointer',
                      outline: 'none',
                      filter: 'drop-shadow(0 10px 15px rgba(255,107,107,0.3))',
                    }}
                  >
                    🎈
                  </button>

                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={{
                      marginTop: '20px',
                      fontWeight: '900',
                      fontSize: '1.2rem',
                      color: '#ff6b6b',
                    }}
                  >
                    TAP TO POP!
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* --- SCENE 2: THE SCRAPBOOK UNIVERSE --- */
          <motion.div
            key="scrapbook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ paddingBottom: '0' }}
          >
            {/* Playful Background Pattern */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                opacity: 0.4,
                backgroundImage:
                  'radial-gradient(#d1d5db 2px, transparent 2px)',
                backgroundSize: '30px 30px',
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '500px',
                margin: '0 auto',
                padding: '0 20px',
                paddingTop: '10vh',
              }}
            >
              {/* --- HERO SECTION (Scrapbook Cover) --- */}
              <motion.div
                initial={{ y: 100, rotate: -5, opacity: 0 }}
                animate={{ y: 0, rotate: -2, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
                style={{
                  textAlign: 'center',
                  marginBottom: '15vh',
                  position: 'relative',
                }}
              >
                <h1
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#ff6b6b',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    marginBottom: '40px',
                    textShadow: '3px 3px 0px rgba(0,0,0,0.1)',
                    transform: 'rotate(-3deg)',
                  }}
                >
                  {heroTitle}
                </h1>

                {heroImage && (
                  <div
                    style={{
                      position: 'relative',
                      background: '#fff',
                      padding: '12px',
                      borderRadius: '4px',
                      boxShadow: '5px 5px 0px rgba(0,0,0,0.8)',
                      border: '2px solid #333',
                      transform: 'rotate(2deg)',
                      margin: '0 auto',
                      width: '85%',
                      maxWidth: '300px',
                    }}
                  >
                    {/* Washi Tape */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(-4deg)',
                        width: '100px',
                        height: '30px',
                        backgroundColor: 'rgba(255, 223, 107, 0.8)',
                        mixBlendMode: 'multiply',
                      }}
                    />
                    <img
                      src={heroImage}
                      alt="Hero"
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}

                {/* Random Floating Stickers */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: 'linear',
                  }}
                  style={{
                    position: 'absolute',
                    top: '10%',
                    right: '-5%',
                    fontSize: '3rem',
                  }}
                >
                  🌻
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  style={{
                    position: 'absolute',
                    bottom: '-5%',
                    left: '0%',
                    fontSize: '2.5rem',
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>

              {/* --- FUN STATS --- */}
              {statsList.length > 0 && (
                <div style={{ marginBottom: '15vh' }}>
                  <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '900',
                      textAlign: 'center',
                      marginBottom: '40px',
                      color: '#4ecdc4',
                      transform: 'rotate(-2deg)',
                    }}
                  >
                    OUR CRAZY STATS!
                  </motion.h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px', // Gap sedikit dikurangi agar lebih aman di Mobile
                    }}
                  >
                    {statsList.map((stat, i) => {
                      const parts = stat.split('|');
                      return (
                        <AnimatedStat
                          key={i}
                          val={parts[0]?.trim() || ''}
                          label={parts[1]?.trim() || ''}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- MESSY COLLAGE --- */}
              {gallery.length > 0 && (
                <div
                  style={{
                    marginBottom: '15vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '900',
                      textAlign: 'center',
                      marginBottom: '40px',
                      color: '#ff9f43',
                      transform: 'rotate(2deg)',
                    }}
                  >
                    MESSY MEMORIES
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    {gallery.map((photo: any, i) => {
                      const randomRot = Math.floor(Math.random() * 20) - 10;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1, zIndex: 20 }}
                          transition={{ type: 'spring' }}
                          style={{
                            position: 'relative',
                            width: '140px',
                            height: '140px',
                            background: '#fff',
                            padding: '8px',
                            boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
                            border: '2px solid #333',
                            transform: `rotate(${randomRot}deg)`,
                            margin: '-10px',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '-10px',
                              left: '10px',
                              width: '50px',
                              height: '20px',
                              backgroundColor: 'rgba(255, 107, 107, 0.7)',
                              transform: `rotate(${randomRot * -2}deg)`,
                            }}
                          />
                          <img
                            src={photo.url}
                            alt={`Gallery ${i}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* --- THE SHIFT (PUNCHLINE & LETTER) --- */}
            <div
              style={{
                backgroundColor: '#fff',
                borderTop: '2px solid #e5e7eb',
                padding: '15vh 20px 10vh 20px',
                position: 'relative',
                zIndex: 20,
                boxShadow: '0 -20px 40px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1 }}
                  style={{ textAlign: 'center', marginBottom: '10vh' }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif, serif)',
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#111',
                      lineHeight: 1.4,
                    }}
                  >
                    {punchlineText}
                  </h2>
                </motion.div>

                {/* Notepad Letter */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  style={{
                    backgroundColor: '#fefffa',
                    padding: '40px 30px',
                    borderRadius: '4px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid #e5e7eb',
                    position: 'relative',
                    backgroundImage:
                      'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
                    backgroundAttachment: 'local',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif, serif)',
                      fontSize: '1.1rem',
                      lineHeight: '32px',
                      color: '#374151',
                      whiteSpace: 'pre-wrap',
                      marginTop: '-6px',
                    }}
                  >
                    {mainMessage}
                  </p>
                  <div style={{ textAlign: 'right', marginTop: '40px' }}>
                    <p
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: '#111',
                        transform: 'rotate(-2deg)',
                      }}
                    >
                      {senderName}
                    </p>
                  </div>
                </motion.div>

                {/* Closing Polaroid */}
                {closingImage && (
                  <motion.div
                    initial={{ opacity: 0, rotate: 10 }}
                    whileInView={{ opacity: 1, rotate: 4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    style={{
                      background: '#fff',
                      padding: '12px 12px 30px 12px',
                      borderRadius: '4px',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb',
                      width: '200px',
                      margin: '60px auto 0',
                    }}
                  >
                    <img
                      src={closingImage}
                      alt="Closing"
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '10px',
                        fontSize: '1.5rem',
                      }}
                    >
                      ❤️
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
