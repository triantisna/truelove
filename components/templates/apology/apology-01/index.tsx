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

// --- SUB-COMPONENT: SLOW FADE IN ---
// Mengatur pacing agar pembaca melambat dan meresapi setiap kata
function FadeSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// --- MAIN COMPONENT ---
export default function Apology01({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const envelopeQuote = getString(
    content,
    'envelopeQuote',
    'For you, with sincerity.',
  );
  const openingStatement = getString(content, 'openingStatement');
  const acknowledgment = getString(content, 'acknowledgment');
  const reflectionsStr = getString(content, 'reflections');
  const mainLetter = getString(content, 'mainLetter');
  const commitmentsStr = getString(content, 'commitments');
  const closingText = getString(content, 'closingText');
  const senderName = getString(content, 'senderName', website.senderName);

  const reflectionsList = reflectionsStr
    .split('\n')
    .filter((t) => t.trim() !== '');
  const commitmentsList = commitmentsStr
    .split('\n')
    .filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI ---
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    // Tunggu animasi amplop selesai sebelum pindah ke surat utama
    setTimeout(() => {
      setIsOpened(true);
    }, 1800);
  };

  // COLOR PALETTE
  const colors = {
    ivory: '#fdfbf7',
    burgundy: '#5a262a',
    ink: '#3a3535',
    sand: '#d4c5b0',
    paperShadow: 'rgba(90, 38, 42, 0.05)',
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: colors.ivory,
        color: colors.ink,
        overflowX: 'hidden',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        position: 'relative',
      }}
    >
      {/* --- PAPER TEXTURE (CSS NOISE) --- */}
      <svg style={{ display: 'none' }}>
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.03, // Sangat tipis, hanya memberi kesan tekstur matte
          filter: 'url(#noiseFilter)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />

      <FloatingMusicPlayer url={musicUrl} isOpened={isOpened} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* --- SCENE 1: THE ENVELOPE --- */
          <motion.div
            key="envelope-scene"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              backgroundColor: colors.ivory,
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}
            >
              {/* Minimalist Envelope Graphic */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  margin: '0 auto 40px',
                  perspective: '1000px',
                }}
              >
                <motion.div
                  animate={
                    isOpening ? { y: 150, opacity: 0 } : { y: 0, opacity: 1 }
                  }
                  transition={{ duration: 1.5, delay: 0.2, ease: 'easeInOut' }}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f5f0e6',
                    border: `1px solid ${colors.sand}`,
                    boxShadow: `0 20px 40px ${colors.paperShadow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <p
                    style={{
                      fontFamily:
                        'var(--font-serif, "Playfair Display", serif)',
                      fontSize: '1.2rem',
                      fontStyle: 'italic',
                      color: colors.burgundy,
                    }}
                  >
                    {envelopeQuote}
                  </p>
                </motion.div>

                {/* Letter Sliding Up Animation */}
                {isOpening && (
                  <motion.div
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -80, opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: '20px',
                      backgroundColor: '#fff',
                      boxShadow: `0 -10px 20px ${colors.paperShadow}`,
                      zIndex: -1,
                    }}
                  />
                )}
              </div>

              {!isOpening && (
                <button
                  onClick={handleOpen}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${colors.burgundy}`,
                    color: colors.burgundy,
                    padding: '12px 32px',
                    fontSize: '0.85rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = colors.burgundy;
                    e.currentTarget.style.color = colors.ivory;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.burgundy;
                  }}
                >
                  Open My Letter
                </button>
              )}
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 2: THE APOLOGY (MAIN CONTENT) --- */
          <motion.div
            key="apology-letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{
              padding: '15vh 20px 10vh 20px',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {/* 1. Before Anything Else */}
            <FadeSection>
              <p
                style={{
                  fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                  fontSize: '1.6rem',
                  lineHeight: 1.6,
                  color: colors.burgundy,
                  marginBottom: '15vh',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {openingStatement}
              </p>
            </FadeSection>

            {/* 2. I Know I Hurt You */}
            <FadeSection>
              <div style={{ marginBottom: '15vh' }}>
                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.9,
                    color: colors.ink,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {acknowledgment}
                </p>
              </div>
            </FadeSection>

            {/* 3. What I Should Have Done (Cards) */}
            {reflectionsList.length > 0 && (
              <FadeSection>
                <div style={{ marginBottom: '15vh' }}>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: colors.burgundy,
                      marginBottom: '30px',
                    }}
                  >
                    What I Should Have Done
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {reflectionsList.map((ref, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '20px 24px',
                          borderLeft: `2px solid ${colors.sand}`,
                          backgroundColor: '#fbf8f3',
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
                          color: colors.ink,
                        }}
                      >
                        {ref}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeSection>
            )}

            {/* 4. A Letter, Just For You */}
            <FadeSection>
              <div style={{ marginBottom: '15vh' }}>
                <p
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: 2,
                    color: colors.ink,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {mainLetter}
                </p>
              </div>
            </FadeSection>

            {/* 5. What I Want To Change (Commitments) */}
            {commitmentsList.length > 0 && (
              <FadeSection>
                <div style={{ marginBottom: '15vh' }}>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: colors.burgundy,
                      marginBottom: '30px',
                    }}
                  >
                    What I Want To Change
                  </h3>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {commitmentsList.map((com, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
                        }}
                      >
                        <span
                          style={{ color: colors.burgundy, marginTop: '2px' }}
                        >
                          ♦
                        </span>
                        <span>{com}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeSection>
            )}

            {/* 6. Closing */}
            <FadeSection>
              <div
                style={{
                  borderTop: `1px solid ${colors.sand}`,
                  paddingTop: '60px',
                  marginTop: '10vh',
                }}
              >
                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.9,
                    color: colors.ink,
                    whiteSpace: 'pre-wrap',
                    fontStyle: 'italic',
                    marginBottom: '40px',
                  }}
                >
                  {closingText}
                </p>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontFamily:
                        'var(--font-serif, "Playfair Display", serif)',
                      fontSize: '1.5rem',
                      color: colors.burgundy,
                    }}
                  >
                    {senderName}
                  </p>
                </div>
              </div>
            </FadeSection>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
