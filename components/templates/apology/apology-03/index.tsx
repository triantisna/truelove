'use client';

import { useState, useRef } from 'react';
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

// --- SUB-COMPONENT: CONFETTI ---
const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A8E6CF'];

function ConfettiPiece({ i }: { i: number }) {
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
  const randomY = (Math.random() - 1) * window.innerHeight * 1.2;
  const randomRot = Math.random() * 360;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.2, 0.5],
        x: randomX,
        y: randomY,
        rotate: randomRot,
      }}
      transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
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
export default function Apology03({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const heroTitle = getString(content, 'heroTitle', 'Okay, hear me out...');
  const heroImage = getImage(content, 'heroImage');
  const introMessage = getString(content, 'introMessage');
  const theCrime = getString(content, 'theCrime');
  const myExcuse = getString(content, 'myExcuse');
  const theVerdict = getString(content, 'theVerdict');
  const peaceOfferingsStr = getString(content, 'peaceOfferings');
  const questionText = getString(
    content,
    'questionText',
    'So... are we good now?',
  );
  const yesButtonText = getString(content, 'yesButtonText', 'Iya dimaafin!');
  const noButtonTextsStr = getString(
    content,
    'noButtonTexts',
    'Masih ngambek\nYakin?',
  );
  const successImage = getImage(content, 'successImage');
  const successMessage = getString(content, 'successMessage');
  const senderName = getString(content, 'senderName', website.senderName);

  const peaceOfferings = peaceOfferingsStr
    .split('\n')
    .filter((t) => t.trim() !== '');
  const noButtonTexts = noButtonTextsStr
    .split('\n')
    .filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI ---
  const [isEntered, setIsEntered] = useState(false); // 👈 State baru buat layar pembuka
  const [isForgiven, setIsForgiven] = useState(false);

  // State untuk pergerakan tombol NO
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Logika saat tombol NO didekati / disentuh
  const handleNoInteraction = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();

    // Lompatan maksimal 120px ke kiri/kanan dan 80px ke atas/bawah
    const randomX = (Math.random() - 0.5) * 240;
    const randomY = (Math.random() - 0.5) * 160;

    setNoPosition({ x: randomX, y: randomY });
    setNoHoverCount((prev) => prev + 1);
  };

  const currentNoText =
    noButtonTexts.length > 0
      ? noButtonTexts[noHoverCount % noButtonTexts.length]
      : 'No';

  const [showConfetti, setShowConfetti] = useState(false);

  const handleYesClick = () => {
    setIsForgiven(true);
    setShowConfetti(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#fffdf0',
        color: '#4a4a4a',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        overflowX: 'hidden',
        position: 'relative',
        paddingBottom: '10vh',
      }}
    >
      {/* 👈 Musik baru nyala kalau isEntered = true */}
      <FloatingMusicPlayer url={musicUrl} isOpened={isEntered} />

      <AnimatePresence mode="wait">
        {!isEntered ? (
          /* --- SCENE 0: THE ENTRANCE (Memicu Musik) --- */
          <motion.div
            key="entrance"
            exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              backgroundColor: '#fffdf0',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <p
                style={{
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  color: '#ff9f43',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                Special message for
              </p>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#ff6b6b',
                  marginBottom: '40px',
                }}
              >
                {receiverName}
              </h2>

              <button
                onClick={() => setIsEntered(true)}
                style={{
                  background: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(255,107,107,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '0 auto',
                }}
              >
                Buka Dulu.. 🥺
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 1 ONWARDS: MAIN CONTENT --- */
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Confetti Explosion Layer */}
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

            <div
              style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '10vh 20px 5vh 20px',
              }}
            >
              {/* --- 1. THE CONFESSION (HERO) --- */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
                style={{ textAlign: 'center', marginBottom: '8vh' }}
              >
                <h1
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: '#ff6b6b',
                    marginBottom: '24px',
                    lineHeight: 1.2,
                  }}
                >
                  {heroTitle}
                </h1>

                {heroImage && (
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: -2 }}
                    style={{
                      background: '#fff',
                      padding: '12px 12px 24px 12px',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                      transform: 'rotate(3deg)',
                      margin: '0 auto 30px',
                      width: '80%',
                      maxWidth: '280px',
                    }}
                  >
                    <img
                      src={heroImage}
                      alt="Sorry face"
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '4px',
                        marginTop: '12px',
                      }}
                    >
                      <span style={{ color: '#ff6b6b' }}>🩹</span>
                      <span style={{ color: '#ff6b6b' }}>🏳️</span>
                    </div>
                  </motion.div>
                )}

                <p
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    color: '#636e72',
                    padding: '0 10px',
                  }}
                >
                  {introMessage}
                </p>
              </motion.div>

              {/* --- 2. THE INCIDENT REPORT --- */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  padding: '30px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.04)',
                  marginBottom: '8vh',
                  border: '2px dashed #ffeaa7',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#4a4a4a',
                  }}
                >
                  📝 Incident Report
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#ff9f43',
                        textTransform: 'uppercase',
                      }}
                    >
                      The Crime
                    </p>
                    <p
                      style={{
                        fontSize: '1rem',
                        color: '#4a4a4a',
                        marginTop: '4px',
                      }}
                    >
                      {theCrime}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#ff9f43',
                        textTransform: 'uppercase',
                      }}
                    >
                      My Excuse
                    </p>
                    <p
                      style={{
                        fontSize: '1rem',
                        color: '#4a4a4a',
                        marginTop: '4px',
                        fontStyle: 'italic',
                      }}
                    >
                      "{myExcuse}"
                    </p>
                  </div>
                  <div
                    style={{
                      background: '#fff3ea',
                      padding: '12px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #ff6b6b',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#ff6b6b',
                        textTransform: 'uppercase',
                      }}
                    >
                      The Verdict
                    </p>
                    <p
                      style={{
                        fontSize: '1rem',
                        color: '#4a4a4a',
                        marginTop: '4px',
                        fontWeight: 'bold',
                      }}
                    >
                      {theVerdict}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* --- 3. PEACE OFFERINGS --- */}
              {peaceOfferings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ marginBottom: '10vh' }}
                >
                  <h2
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      textAlign: 'center',
                      marginBottom: '24px',
                      color: '#4a4a4a',
                    }}
                  >
                    🎁 Peace Offerings
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {peaceOfferings.map((offer, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02, x: 5 }}
                        style={{
                          background: '#fff',
                          padding: '16px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          border: '1px solid #f1f2f6',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#4ecdc4',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </div>
                        <p style={{ fontSize: '0.95rem', color: '#4a4a4a' }}>
                          {offer}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* --- 4. THE TRAP (THE ULTIMATUM) --- */}
              <AnimatePresence mode="wait">
                {!isForgiven ? (
                  <motion.div
                    key="the-trap"
                    exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', padding: '40px 0' }}
                    ref={containerRef}
                  >
                    <h2
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: '#4a4a4a',
                        marginBottom: '40px',
                      }}
                    >
                      {questionText}
                    </h2>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        position: 'relative',
                        height: '60px',
                        alignItems: 'center',
                      }}
                    >
                      {/* YES BUTTON */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleYesClick}
                        style={{
                          background: '#4ecdc4',
                          color: '#fff',
                          border: 'none',
                          padding: '14px 32px',
                          borderRadius: '30px',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: '0 10px 20px rgba(78,205,196,0.3)',
                          zIndex: 10,
                        }}
                      >
                        {yesButtonText}
                      </motion.button>

                      {/* NO BUTTON (THE RUNAWAY) */}
                      <motion.button
                        animate={{ x: noPosition.x, y: noPosition.y }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        onMouseEnter={handleNoInteraction}
                        onTouchStart={handleNoInteraction}
                        onClick={handleNoInteraction}
                        style={{
                          background: '#ff7675',
                          color: '#fff',
                          border: 'none',
                          padding: '14px 24px',
                          borderRadius: '30px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 20,
                          boxShadow: '0 5px 15px rgba(255,118,117,0.3)',
                        }}
                      >
                        {currentNoText}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  /* --- 5. THE CELEBRATION (SUCCESS) --- */
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
                    style={{ textAlign: 'center', paddingTop: '40px' }}
                  >
                    <h2
                      style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: '#4ecdc4',
                        marginBottom: '24px',
                      }}
                    >
                      MISSION ACCOMPLISHED! 🎉
                    </h2>

                    {successImage && (
                      <div
                        style={{
                          background: '#fff',
                          padding: '12px',
                          borderRadius: '16px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          marginBottom: '30px',
                          display: 'inline-block',
                        }}
                      >
                        <img
                          src={successImage}
                          alt="Happy"
                          style={{
                            width: '100%',
                            maxWidth: '280px',
                            borderRadius: '12px',
                            display: 'block',
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        background: '#4ecdc4',
                        padding: '24px',
                        borderRadius: '24px',
                        color: '#fff',
                        boxShadow: '0 15px 30px rgba(78,205,196,0.3)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '1.1rem',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          fontWeight: 600,
                        }}
                      >
                        {successMessage}
                      </p>
                      <div
                        style={{
                          marginTop: '20px',
                          fontSize: '1.2rem',
                          fontStyle: 'italic',
                          fontWeight: 'bold',
                        }}
                      >
                        - {senderName} -
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
