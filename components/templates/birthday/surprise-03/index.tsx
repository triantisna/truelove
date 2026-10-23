'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// --- SUB-COMPONENT: CONFETTI PIECE ---
const CONFETTI_COLORS = [
  '#ffb7b2',
  '#ffdac1',
  '#e2f0cb',
  '#b5ead7',
  '#c7ceea',
  '#f3c68f',
];

function ConfettiPiece({ i }: { i: number }) {
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  const randomX = (Math.random() - 0.5) * window.innerWidth * 1.3;
  const randomY = (Math.random() - 1) * window.innerHeight * 1.2;
  const randomRot = Math.random() * 360;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.4, 0.5],
        x: randomX,
        y: randomY,
        rotate: randomRot,
      }}
      transition={{ duration: 1.8 + Math.random() * 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: '12px',
        height: '24px',
        backgroundColor: color,
        borderRadius: '4px',
        zIndex: 100,
        top: '50%',
        left: '50%',
      }}
    />
  );
}

// --- MAIN COMPONENT ---
export default function TodayIsYours({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const heroTitle = getString(content, 'heroTitle', 'Today Is Yours');
  const heroSubtitle = getString(content, 'heroSubtitle');
  const introMessage = getString(content, 'introMessage');
  const mainWish = getString(content, 'mainWish');
  const wishText = getString(content, 'wishText');
  const reflectionMessage = getString(content, 'reflectionMessage');
  const blessingsStr = getString(content, 'blessingsList');
  const gallery = getMediaList(content, 'gallery');
  const galleryCaptionsStr = getString(content, 'galleryCaptions');
  const captionsList = galleryCaptionsStr
    .split('\n')
    .filter((t) => t.trim() !== '');
  const closingMessage = getString(content, 'closingMessage');
  const senderName = getString(content, 'senderName', website.senderName);

  const blessingsList = blessingsStr.split('\n').filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI ---
  const [isEntered, setIsEntered] = useState(false);
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleBlowCandle = () => {
    setIsCandleBlown(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  // COLOR PALETTE (Warm Cream, Soft Pink, Butter, Mint, Lavender)
  const colors = {
    bg: '#fbf9f5',
    cardBg: '#ffffff',
    primary: '#e07a5f', // Terracotta / Warm Rose
    secondary: '#81b29a', // Sage / Mint lembut
    accent: '#f4f1de', // Cream hangat
    textMain: '#3d405b', // Slate gelap
    textMuted: '#6c757d',
    border: '#ede8df',
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        color: colors.textMain,
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        position: 'relative',
        overflowX: 'hidden',
        paddingBottom: '15vh',
      }}
    >
      <FloatingMusicPlayer url={musicUrl} isOpened={isEntered} />

      {/* Confetti Explosion */}
      {showConfetti && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 80 }).map((_, i) => (
            <ConfettiPiece key={i} i={i} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isEntered ? (
          /* --- SCENE 0: ENTRANCE SCREEN (Memicu Musik & Perayaan) --- */
          <motion.div
            key="entrance-party"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              backgroundColor: colors.bg,
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ maxWidth: '420px', width: '100%' }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: 'easeInOut',
                }}
                style={{ fontSize: '4.5rem', marginBottom: '20px' }}
              >
                🎉
              </motion.div>

              <p
                style={{
                  fontSize: '0.85rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: colors.primary,
                  marginBottom: '10px',
                  fontWeight: 'bold',
                }}
              >
                A Special Celebration for
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '2.5rem',
                  color: colors.textMain,
                  marginBottom: '20px',
                }}
              >
                {receiverName}
              </h1>

              <p
                style={{
                  fontSize: '0.95rem',
                  color: colors.textMuted,
                  marginBottom: '35px',
                  lineHeight: 1.6,
                }}
              >
                Pesta kecil ini disiapkan khusus untuk menyambut hari spesialmu.
                Siap untuk merayakannya?
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEntered(true)}
                style={{
                  background: 'linear-gradient(135deg, #e07a5f, #d2694e)',
                  color: '#fff',
                  border: 'none',
                  padding: '16px 36px',
                  borderRadius: '30px',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(224, 122, 95, 0.3)',
                }}
              >
                Masuk ke Perayaan ✨
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 1 ONWARDS: THE PARTY FLOW --- */
          <motion.div
            key="party-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '8vh 20px 0 20px',
            }}
          >
            {/* HERO SECTION */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center', marginBottom: '8vh' }}
            >
              <span
                style={{
                  background: '#f4f1de',
                  padding: '6px 18px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: colors.primary,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                ✨ {heroTitle} ✨
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '2.8rem',
                  color: colors.textMain,
                  marginTop: '16px',
                  marginBottom: '12px',
                  lineHeight: 1.1,
                }}
              >
                {receiverName}
              </h1>
              <p
                style={{
                  fontSize: '1.05rem',
                  color: colors.textMuted,
                  fontStyle: 'italic',
                  maxWidth: '380px',
                  margin: '0 auto',
                }}
              >
                "{heroSubtitle}"
              </p>
            </motion.div>

            {/* 1. THE CELEBRATION BEGINS */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '36px 28px',
                borderRadius: '28px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                border: `1px solid ${colors.border}`,
                marginBottom: '6vh',
              }}
            >
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: colors.textMain,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {introMessage}
              </p>
            </motion.div>

            {/* 2. IT'S YOUR DAY (MAIN WISH) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: '#f4f1de',
                padding: '40px 28px',
                borderRadius: '28px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                border: '1px solid #e9e3ce',
                marginBottom: '6vh',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎂</div>
              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.9,
                  color: colors.textMain,
                  whiteSpace: 'pre-wrap',
                  fontWeight: 500,
                }}
              >
                {mainWish}
              </p>
            </motion.div>

            {/* 3. MAKE A WISH (INTERACTIVE CAKE & CANDLE) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '40px 28px',
                borderRadius: '28px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                border: `1px solid ${colors.border}`,
                marginBottom: '6vh',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: colors.primary,
                  marginBottom: '16px',
                  fontWeight: 'bold',
                }}
              >
                Make a Wish
              </p>

              {/* Animated Cake & Candle Graphic */}
              <div
                style={{
                  fontSize: '4.5rem',
                  marginBottom: '16px',
                  position: 'relative',
                }}
              >
                🍰
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.8rem',
                  }}
                >
                  {!isCandleBlown ? '🕯️' : '💨'}
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: colors.textMuted,
                  whiteSpace: 'pre-wrap',
                  marginBottom: '24px',
                }}
              >
                {wishText}
              </p>

              {!isCandleBlown ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBlowCandle}
                  style={{
                    background: colors.secondary,
                    color: '#fff',
                    border: 'none',
                    padding: '14px 30px',
                    borderRadius: '30px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(129, 178, 154, 0.3)',
                  }}
                >
                  Tiup Lilin ✨
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: '#f0f7f4',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid #d3e5dc',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.95rem',
                      color: colors.secondary,
                      fontWeight: 'bold',
                    }}
                  >
                    ✨ Lilin telah ditiup! Semoga semua harapan baikmu terkabul
                    tahun ini.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* 4. A YEAR WORTH CELEBRATING */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '36px 28px',
                borderRadius: '28px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                border: `1px solid ${colors.border}`,
                marginBottom: '6vh',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                  marginBottom: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                A Year Worth Celebrating
              </p>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: colors.textMain,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {reflectionMessage}
              </p>
            </motion.div>

            {/* 5. BIRTHDAY BLESSINGS (CARDS) */}
            {blessingsList.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{ marginBottom: '6vh' }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: colors.textMuted,
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Birthday Blessings
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {blessingsList.map((blessing, i) => (
                    <div
                      key={i}
                      style={{
                        background: colors.cardBg,
                        padding: '20px 24px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.02)',
                        border: `1px solid ${colors.border}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                      }}
                    >
                      <span
                        style={{
                          color: colors.primary,
                          fontSize: '1.2rem',
                          lineHeight: 1.7, // Disesuaikan dengan line-height teks di bawahnya agar presisi
                          flexShrink: 0,
                          marginTop: '1px', // Penyesuaian mikro vertikal
                        }}
                      >
                        🌿
                      </span>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
                          color: colors.textMain,
                          margin: 0,
                        }}
                      >
                        {blessing}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 6. PHOTO GALLERY (POLAROID STYLE) */}
            {gallery.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{ marginBottom: '6vh', textAlign: 'center' }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: colors.textMuted,
                    marginBottom: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  Moments to Remember
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '20px',
                  }}
                >
                  {gallery.map((photo: any, i: number) => {
                    const randomRot = i % 2 === 0 ? '2deg' : '-2deg';
                    const currentCaption =
                      captionsList[i] || `Memory #${i + 1}`;
                    return (
                      <div
                        key={i}
                        style={{
                          background: '#fff',
                          padding: '10px 10px 20px 10px',
                          borderRadius: '6px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                          border: '1px solid #eae5dc',
                          width: '160px',
                          transform: `rotate(${randomRot})`,
                        }}
                      >
                        <img
                          src={photo.url}
                          alt={`Gallery ${i}`}
                          style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            display: 'block',
                          }}
                        />
                        <div
                          style={{
                            marginTop: '10px',
                            fontSize: '0.8rem',
                            color: colors.textMuted,
                            fontStyle: 'italic',
                            padding: '0 4px',
                            wordBreak: 'break-word',
                          }}
                        >
                          {currentCaption}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 7. CLOSING / LET THE CELEBRATION CONTINUE */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '40px 28px',
                borderRadius: '28px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: colors.textMain,
                  whiteSpace: 'pre-wrap',
                  marginBottom: '30px',
                }}
              >
                {closingMessage}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '1.4rem',
                  color: colors.primary,
                  fontStyle: 'italic',
                }}
              >
                {senderName}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
