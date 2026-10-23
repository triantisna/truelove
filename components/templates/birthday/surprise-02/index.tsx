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

// --- SUB-COMPONENT: CONFETTI PIECE ---
const CONFETTI_COLORS = [
  '#ffd1dc',
  '#ffb7b2',
  '#ff9aa2',
  '#e2d1f9',
  '#b5ead7',
  '#ffdac1',
];

function ConfettiPiece({ i }: { i: number }) {
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  const randomX = (Math.random() - 0.5) * window.innerWidth * 1.2;
  const randomY = (Math.random() - 1) * window.innerHeight;
  const randomRot = Math.random() * 360;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.2, 0.4],
        x: randomX,
        y: randomY,
        rotate: randomRot,
      }}
      transition={{ duration: 1.5 + Math.random() * 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: '10px',
        height: '20px',
        backgroundColor: color,
        borderRadius: '4px',
        zIndex: 100,
        top: '40%',
        left: '50%',
      }}
    />
  );
}

// --- MAIN COMPONENT ---
export default function BirthdayBox({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const introMessage = getString(content, 'introMessage');
  const birthdayWish = getString(content, 'birthdayWish');
  const memoryImage = getImage(content, 'memoryImage');
  const memoryCaption = getString(content, 'memoryCaption');
  const personalLetter = getString(content, 'personalLetter');
  const moreThingsStr = getString(content, 'moreThings');
  const closingMessage = getString(content, 'closingMessage');
  const senderName = getString(content, 'senderName', website.senderName);

  const moreThingsList = moreThingsStr
    .split('\n')
    .filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI ---
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpenGift = () => {
    setIsOpen(true);
    setShowConfetti(true);
    // Matikan confetti setelah beberapa detik agar bersih
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // PALET WARNA (Vanilla, Blush, Rose, Lilac, Plum)
  const colors = {
    bg: '#fdfbf7', // Vanilla Cream
    cardBg: '#ffffff',
    primary: '#d87093', // Pale Rose / Plum lembut
    accent: '#e2d1f9', // Lilac lembut
    textMain: '#4a4044', // Plum gelap
    textMuted: '#8c7b80',
    border: '#f3e8eb',
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
        paddingBottom: '12vh',
      }}
    >
      <FloatingMusicPlayer url={musicUrl} isOpened={isOpen} />

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
          {Array.from({ length: 70 }).map((_, i) => (
            <ConfettiPiece key={i} i={i} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* --- SCENE 1: SOMETHING FOR YOU (THE GIFT BOX) --- */
          <motion.div
            key="gift-box-scene"
            exit={{ opacity: 0, scale: 1.05 }}
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
              style={{ maxWidth: '400px', width: '100%' }}
            >
              <p
                style={{
                  fontSize: '0.85rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: colors.primary,
                  marginBottom: '16px',
                  fontWeight: 'bold',
                }}
              >
                For {receiverName}
              </p>

              {/* Gift Box Icon / Illustration Wrapper */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                style={{
                  fontSize: '5rem',
                  marginBottom: '24px',
                  filter: 'drop-shadow(0 15px 20px rgba(216, 112, 147, 0.15))',
                }}
              >
                🎁
              </motion.div>

              <div
                style={{
                  background: colors.cardBg,
                  padding: '30px 24px',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(216, 112, 147, 0.08)',
                  border: `1px solid ${colors.border}`,
                  marginBottom: '30px',
                }}
              >
                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: colors.textMain,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {introMessage}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenGift}
                style={{
                  background: 'linear-gradient(135deg, #d87093, #c75b80)',
                  color: '#fff',
                  border: 'none',
                  padding: '16px 36px',
                  borderRadius: '30px',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(216, 112, 147, 0.3)',
                }}
              >
                Open Your Gift ✨
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 2: THE UNWRAPPED SURPRISE (CONTENT FLOW) --- */
          <motion.div
            key="unwrapped-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '8vh 20px 0 20px',
            }}
          >
            {/* 1. The First Surprise */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '40px 28px',
                borderRadius: '28px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
                marginBottom: '5vh',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: colors.accent,
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#5a468c',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                Birthday Star 🎂
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '2rem',
                  color: colors.primary,
                  marginBottom: '20px',
                }}
              >
                Happy Birthday, {receiverName}!
              </h1>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: colors.textMain,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {birthdayWish}
              </p>
            </motion.div>

            {/* 2. A Little Memory */}
            {(memoryImage || memoryCaption) && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{
                  background: colors.cardBg,
                  padding: '24px 24px 32px 24px',
                  borderRadius: '28px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                  border: `1px solid ${colors.border}`,
                  marginBottom: '5vh',
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
                  A Little Memory
                </p>
                {memoryImage && (
                  <div
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      marginBottom: '20px',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.04)',
                    }}
                  >
                    <img
                      src={memoryImage}
                      alt="Memory"
                      style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                )}
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: colors.textMain,
                    whiteSpace: 'pre-wrap',
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}
                >
                  {memoryCaption}
                </p>
              </motion.div>
            )}

            {/* 3. A Gift of Words */}
            {personalLetter && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{
                  background: '#fff5f7', // Nuansa blush sangat tipis
                  padding: '40px 28px',
                  borderRadius: '28px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                  border: '1px solid #fce4ec',
                  marginBottom: '5vh',
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
                    textAlign: 'center',
                  }}
                >
                  A Gift of Words
                </p>
                <p
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.9,
                    color: colors.textMain,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {personalLetter}
                </p>
              </motion.div>
            )}

            {/* 4. More Little Things */}
            {moreThingsList.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{ marginBottom: '5vh' }}
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
                  More Little Things
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {moreThingsList.map((thing, i) => (
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
                          lineHeight: 1,
                        }}
                      >
                        ✨
                      </span>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
                          color: colors.textMain,
                        }}
                      >
                        {thing}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 5. Closing */}
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
