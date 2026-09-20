'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
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

function getGallery(content: Record<string, any>) {
  const gallery = content.gallery;
  if (!Array.isArray(gallery)) return [];
  return gallery.filter(
    (item) =>
      typeof item === 'object' && item !== null && typeof item.url === 'string',
  );
}

export default function BirthdaySurprise01({
  website,
}: {
  website: WebsiteRecord;
}) {
  const [lightsOn, setLightsOn] = useState(false);
  const content = website.content ?? {};

  // URL Musik pintar kita
  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // Konten Dinamis
  const tapText = getString(content, 'tapText', 'Tap to turn on the lights 💡');
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const senderName = getString(content, 'senderName', website.senderName);
  const age = getString(content, 'age', '');
  const heroTitle = getString(content, 'heroTitle', website.title);
  const openingText = getString(content, 'openingText', '');
  const mainMessage = getString(content, 'mainMessage', website.message);

  const wish1 = getString(content, 'wish1', '');
  const wish2 = getString(content, 'wish2', '');
  const wish3 = getString(content, 'wish3', '');
  const wishes = [wish1, wish2, wish3].filter((w) => w.trim() !== '');

  const closingText = getString(content, 'closingText', '');
  const heroImage = getString(content, 'heroImage');
  const closingImage = getString(content, 'closingImage');
  const gallery = getGallery(content);

  // Fungsi saat layar diklik
  const turnOnLights = () => {
    setLightsOn(true);
    // Tembak Confetti dari bawah layar!
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: lightsOn ? '#fdf8f5' : '#0a0a0a',
        transition: 'background-color 2s ease',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <FloatingMusicPlayer url={musicUrl} isOpened={lightsOn} />

      <AnimatePresence mode="wait">
        {!lightsOn ? (
          /* --- DARK MODE (BEFORE CLICK) --- */
          <motion.div
            key="dark-mode"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={turnOnLights}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 50,
            }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ fontSize: '2rem' }}>👆</span>
            </motion.div>
            <p
              style={{
                color: '#fff',
                fontSize: '1.2rem',
                letterSpacing: '2px',
                fontWeight: '300',
              }}
            >
              {tapText}
            </p>
          </motion.div>
        ) : (
          /* --- LIGHTS ON (THE SURPRISE) --- */
          <motion.div
            key="light-mode"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            style={{
              padding: '40px 20px',
              maxWidth: '600px',
              margin: '0 auto',
              color: '#4a3b32',
              textAlign: 'center',
            }}
          >
            {/* Cake Emoji Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 1 }}
              style={{ fontSize: '4rem', marginBottom: '16px' }}
            >
              🎂
            </motion.div>

            {/* Title & Age */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontSize: '0.8rem',
                color: '#8e354a',
                fontWeight: 'bold',
              }}
            >
              {age ? `Happy ${age} Birthday` : 'Happy Birthday'}
            </motion.p>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.5rem',
                margin: '8px 0 24px',
                color: '#2c1e16',
              }}
            >
              {heroTitle}
            </h1>

            {/* Hero Image */}
            {heroImage && (
              <motion.img
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 1.8 }}
                src={heroImage}
                alt="Birthday Hero"
                style={{
                  width: '100%',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  objectFit: 'cover',
                  aspectRatio: '4/5',
                  marginBottom: '32px',
                }}
              />
            )}

            {/* Opening & Main Message */}
            <div
              style={{
                background: '#fff',
                padding: '32px 24px',
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                marginBottom: '40px',
              }}
            >
              <p
                style={{
                  fontSize: '1.1rem',
                  marginBottom: '16px',
                  fontStyle: 'italic',
                  color: '#7a6b62',
                }}
              >
                {openingText}
              </p>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-serif)',
                  margin: '24px 0 16px',
                }}
              >
                Dear {receiverName},
              </h2>
              <p
                style={{
                  lineHeight: '1.8',
                  color: '#4a3b32',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {mainMessage}
              </p>
            </div>

            {/* Wishes Cards */}
            {wishes.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <p
                  style={{
                    letterSpacing: '2px',
                    fontSize: '0.8rem',
                    color: '#8e354a',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  MY WISHES FOR YOU
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {wishes.map((wish, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      style={{
                        background: 'linear-gradient(135deg, #fff, #fdf8f5)',
                        padding: '20px',
                        borderRadius: '16px',
                        borderLeft: '4px solid #8e354a',
                        textAlign: 'left',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>
                        ✨
                      </span>
                      <p
                        style={{
                          margin: '8px 0 0',
                          fontStyle: 'italic',
                          color: '#4a3b32',
                        }}
                      >
                        {wish}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Memory Gallery */}
            {gallery.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <p
                  style={{
                    letterSpacing: '2px',
                    fontSize: '0.8rem',
                    color: '#8e354a',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  MOMENTS WE SHARE
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {gallery.map((photo: any, i) => (
                    <motion.img
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      src={photo.url}
                      alt={`Memory ${i}`}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '16px',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Closing */}
            {closingImage && (
              <img
                src={closingImage}
                alt="Closing"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  display: 'block',
                  border: '4px solid #fff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}
              />
            )}
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                marginBottom: '16px',
              }}
            >
              {closingText}
            </h2>
            <p style={{ fontWeight: 'bold', color: '#8e354a' }}>
              — {senderName}
            </p>

            <div
              style={{ marginTop: '60px', paddingBottom: '40px', opacity: 0.5 }}
            >
              <small>TRUELOVE.ID • BIRTHDAY EDITION</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
