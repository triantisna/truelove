'use client';

import { useState, useEffect } from 'react';
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

// --- SUB-COMPONENT: 3D FLIP CARD ---
function FlipCard({ text, index }: { text: string; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        perspective: '1000px',
        width: '100%',
        height: '140px',
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT SIDE */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #f3e8e6',
          }}
        >
          <span style={{ fontSize: '2rem', marginBottom: '8px' }}>✨</span>
          <p
            style={{
              fontSize: '0.8rem',
              letterSpacing: '2px',
              color: '#b99a9a',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            Reason #{index + 1}
          </p>
        </div>

        {/* BACK SIDE (THE REASON) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            backgroundColor: '#f3e8e6',
            borderRadius: '16px',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(220,180,180,0.2)',
          }}
        >
          <p style={{ color: '#5c4a44', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {text}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function Anniversary02({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const heroTitle = getString(
    content,
    'heroTitle',
    'Welcome to Our Little Universe',
  );
  const heroImage = getImage(content, 'heroImage');
  const storyBeganDate = getString(content, 'storyBeganDate', '');
  const gallery = getMediaList(content, 'gallery');
  const thingsILoveStr = getString(content, 'thingsILove');
  const mainMessage = getString(content, 'mainMessage', website.message);
  const closingImage = getImage(content, 'closingImage');
  const closingText = getString(content, 'closingText');
  const senderName = getString(content, 'senderName', website.senderName);

  // Proses teks yang dipisah dengan enter menjadi array
  const reasonsList = thingsILoveStr.split('\n').filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI ---
  const [isEntered, setIsEntered] = useState(false);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#fdfbf7', // Warm cream
        color: '#5c4a44',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
    >
      <FloatingMusicPlayer url={musicUrl} isOpened={isEntered} />

      <AnimatePresence mode="wait">
        {!isEntered ? (
          /* --- SCENE 1: THE PORTAL --- */
          <motion.div
            key="portal"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              backgroundColor: '#fdfbf7',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ textAlign: 'center' }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '1.8rem',
                  color: '#b99a9a',
                  marginBottom: '60px',
                  fontWeight: '300',
                }}
              >
                {heroTitle}
              </h2>

              <div
                style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  margin: '0 auto',
                  cursor: 'pointer',
                }}
                onClick={() => setIsEntered(true)}
              >
                {/* Glowing Pulse Effect */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    inset: -20,
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, #e8c3c4 0%, transparent 70%)',
                  }}
                />

                {/* The Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e8c3c4, #d4a3b3)',
                    boxShadow: '0 10px 30px rgba(212,163,179,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🤍</span>
                </motion.div>
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  marginTop: '40px',
                  letterSpacing: '2px',
                  fontSize: '0.8rem',
                  color: '#a38a8a',
                  textTransform: 'uppercase',
                }}
              >
                Tap to enter
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 2: THE UNIVERSE (MAIN CONTENT) --- */
          <motion.div
            key="universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{ paddingBottom: '100px' }}
          >
            {/* Soft Ambient Background Particles */}
            <div
              style={{
                position: 'fixed',
                top: '10%',
                left: '5%',
                fontSize: '1.5rem',
                opacity: 0.2,
              }}
            >
              ✨
            </div>
            <div
              style={{
                position: 'fixed',
                top: '40%',
                right: '10%',
                fontSize: '1rem',
                opacity: 0.3,
              }}
            >
              🤍
            </div>
            <div
              style={{
                position: 'fixed',
                bottom: '20%',
                left: '15%',
                fontSize: '2rem',
                opacity: 0.1,
              }}
            >
              ✨
            </div>

            <div
              style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '0 20px',
                paddingTop: '10vh',
              }}
            >
              {/* HERO SECTION (POLAROID) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{ textAlign: 'center', marginBottom: '15vh' }}
              >
                <p
                  style={{
                    letterSpacing: '3px',
                    fontSize: '0.8rem',
                    color: '#b99a9a',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                  }}
                >
                  Hello, {receiverName}
                </p>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif, serif)',
                    fontSize: '2.2rem',
                    color: '#5c4a44',
                    marginBottom: '40px',
                  }}
                >
                  {heroTitle}
                </h1>

                {heroImage && (
                  <motion.div
                    whileHover={{ rotate: 0 }}
                    style={{
                      background: '#fff',
                      padding: '16px 16px 30px 16px',
                      borderRadius: '8px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                      transform: 'rotate(-3deg)',
                      margin: '0 auto',
                      width: '80%',
                      maxWidth: '280px',
                    }}
                  >
                    <img
                      src={heroImage}
                      alt="Our start"
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <p
                      style={{
                        fontFamily: 'var(--font-serif, serif)',
                        fontStyle: 'italic',
                        marginTop: '20px',
                        color: '#8a7670',
                        fontSize: '1.1rem',
                      }}
                    >
                      {storyBeganDate}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* GALLERY CAROUSEL */}
              {gallery.length > 0 && (
                <div style={{ marginBottom: '15vh' }}>
                  <h2
                    style={{
                      fontSize: '0.9rem',
                      letterSpacing: '4px',
                      textAlign: 'center',
                      color: '#b99a9a',
                      marginBottom: '30px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Our Little Moments
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      overflowX: 'auto',
                      paddingBottom: '20px',
                      padding: '0 10px',
                      scrollSnapType: 'x mandatory',
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }}
                  >
                    {gallery.map((photo: any, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        style={{ flex: '0 0 75%', scrollSnapAlign: 'center' }}
                      >
                        <img
                          src={photo.url}
                          alt={`Memory ${i}`}
                          style={{
                            width: '100%',
                            aspectRatio: '4/5',
                            objectFit: 'cover',
                            borderRadius: '16px',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <p
                    style={{
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      color: '#c4b5b5',
                      marginTop: '10px',
                    }}
                  >
                    ← Swipe to explore →
                  </p>
                </div>
              )}

              {/* THINGS I LOVE (3D FLIP CARDS) */}
              {reasonsList.length > 0 && (
                <div style={{ marginBottom: '15vh' }}>
                  <h2
                    style={{
                      fontSize: '0.9rem',
                      letterSpacing: '4px',
                      textAlign: 'center',
                      color: '#b99a9a',
                      marginBottom: '40px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Things I Love About You
                  </h2>
                  <p
                    style={{
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#a38a8a',
                      marginBottom: '24px',
                    }}
                  >
                    (Tap the cards)
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    {reasonsList.map((reason, i) => (
                      <FlipCard key={i} index={i} text={reason} />
                    ))}
                  </div>
                </div>
              )}

              {/* A LETTER FOR YOU */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1 }}
                style={{
                  backgroundColor: '#f3e8e6',
                  padding: '40px 30px',
                  borderRadius: '24px',
                  marginBottom: '15vh',
                  boxShadow: '0 20px 40px rgba(212,163,179,0.1)',
                  border: '1px solid #fff',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-serif, serif)',
                    fontSize: '1.6rem',
                    color: '#5c4a44',
                    marginBottom: '24px',
                    textAlign: 'center',
                  }}
                >
                  A Letter For You
                </h2>
                <p
                  style={{
                    color: '#73615b',
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '30px',
                  }}
                >
                  {mainMessage}
                </p>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontStyle: 'italic',
                      color: '#b99a9a',
                      marginBottom: '4px',
                    }}
                  >
                    Forever yours,
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: '#5c4a44',
                    }}
                  >
                    {senderName}
                  </p>
                </div>
              </motion.div>

              {/* CLOSING */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                style={{ textAlign: 'center' }}
              >
                {closingImage && (
                  <div
                    style={{
                      width: '160px',
                      height: '160px',
                      margin: '0 auto 30px',
                      borderRadius: '50%',
                      padding: '6px',
                      background: 'linear-gradient(135deg, #e8c3c4, #fdfbf7)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.05)',
                    }}
                  >
                    <img
                      src={closingImage}
                      alt="Closing"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                )}
                <h2
                  style={{
                    fontFamily: 'var(--font-serif, serif)',
                    fontSize: '1.8rem',
                    color: '#5c4a44',
                    marginBottom: '16px',
                  }}
                >
                  Our Next Chapter
                </h2>
                <p
                  style={{
                    color: '#a38a8a',
                    fontStyle: 'italic',
                    fontSize: '1.1rem',
                  }}
                >
                  {closingText}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
