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

export default function Anniversary01({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const unlockDateStr = getString(content, 'unlockDate');
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const senderName = getString(content, 'senderName', website.senderName);
  const heroTitle = getString(content, 'heroTitle', website.title);
  const mainMessage = getString(content, 'mainMessage', website.message);
  const heroImage = getImage(content, 'heroImage');
  const timeline = getMediaList(content, 'timeline');
  const gallery = getMediaList(content, 'gallery');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- COUNTDOWN LOGIC ---
  const [timeReached, setTimeReached] = useState(false); // Penanda waktu habis
  const [hasEntered, setHasEntered] = useState(false); // Penanda user udah ngeklik tombol masuk
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!unlockDateStr) {
      setTimeReached(true);
      return;
    }

    let targetTime: number;

    // Trik Dummy MockData
    if (unlockDateStr === 'DEMO_5_SEC') {
      targetTime = Date.now() + 5000;
    } else {
      targetTime = new Date(unlockDateStr).getTime();
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance <= 0) {
        setTimeReached(true);
        clearInterval(interval);
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockDateStr]);

  // --- COUNTDOWN GATE SCREEN ---
  if (!hasEntered) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#050b14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <AnimatePresence mode="wait">
          {!timeReached ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  display: 'block',
                  marginBottom: '20px',
                  opacity: 0.8,
                }}
              >
                🌙
              </span>
              <p
                style={{
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  marginBottom: '10px',
                }}
              >
                A Special Journey Awaits
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '1.5rem',
                  marginBottom: '40px',
                  fontWeight: '300',
                }}
              >
                Unlocks at midnight...
              </h2>

              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'center',
                }}
              >
                {[
                  { label: 'DAYS', value: timeLeft.d },
                  { label: 'HOURS', value: timeLeft.h },
                  { label: 'MINUTES', value: timeLeft.m },
                  { label: 'SECONDS', value: timeLeft.s },
                ].map((time, idx) => (
                  <div
                    key={idx}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <span
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: '300',
                        fontFamily: 'monospace',
                      }}
                    >
                      {String(time.value).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6rem',
                        letterSpacing: '2px',
                        color: '#64748b',
                        marginTop: '8px',
                      }}
                    >
                      {time.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="enter-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <span
                style={{
                  fontSize: '2.5rem',
                  display: 'block',
                  marginBottom: '24px',
                }}
              >
                ✨
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '1.8rem',
                  marginBottom: '40px',
                  fontWeight: '300',
                }}
              >
                The time has come.
              </h2>
              <button
                onClick={() => setHasEntered(true)}
                style={{
                  background: '#f8fafc',
                  color: '#050b14',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                }}
              >
                Begin Journey
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    );
  }

  // --- THE CINEMATIC EXPERIENCE ---
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#050b14',
        color: '#f8fafc',
        position: 'relative',
        overflowX: 'hidden',
        paddingBottom: '100px',
      }}
    >
      {/* Background Ambient (Stars Effect) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 0%, #1e293b 0%, #050b14 70%)',
          zIndex: 0,
          opacity: 0.5,
        }}
      />
      <FloatingMusicPlayer url={musicUrl} isOpened={true} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* HERO SCENE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '10vh',
            marginBottom: '15vh',
          }}
        >
          <p
            style={{
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginBottom: '24px',
            }}
          >
            To {receiverName}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: '2.5rem',
              fontWeight: '300',
              lineHeight: 1.3,
              marginBottom: '40px',
            }}
          >
            {heroTitle}
          </h1>

          {heroImage && (
            <motion.div
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              style={{
                width: '100%',
                aspectRatio: '3/4',
                margin: '0 auto',
                borderRadius: '200px 200px 12px 12px', // Arch Shape
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <img
                src={heroImage}
                alt="Hero"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            style={{
              marginTop: '40px',
              fontSize: '0.8rem',
              letterSpacing: '2px',
              color: '#64748b',
            }}
          >
            SCROLL TO EXPLORE ↓
          </motion.p>
        </motion.div>

        {/* TIMELINE SCENE */}
        {timeline.length > 0 && (
          <div style={{ marginBottom: '15vh' }}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontSize: '0.9rem',
                letterSpacing: '4px',
                textAlign: 'center',
                marginBottom: '60px',
                color: '#94a3b8',
              }}
            >
              OUR JOURNEY
            </motion.h2>

            <div
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.15)',
                marginLeft: '20px',
                paddingLeft: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '60px',
              }}
            >
              {timeline.map((item: any, i) => {
                const parts = (item.caption || '').split('|');
                const date = parts[0]?.trim();
                const story = parts[1]?.trim() || '';

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'relative' }}
                  >
                    {/* Glowing Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-35px',
                        top: '0',
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: '#fff',
                        boxShadow: '0 0 15px 3px rgba(255,255,255,0.4)',
                      }}
                    />

                    {date && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          letterSpacing: '2px',
                          color: '#cbd5e1',
                          marginBottom: '12px',
                        }}
                      >
                        {date}
                      </p>
                    )}

                    <img
                      src={item.url}
                      alt={`Timeline ${i}`}
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        aspectRatio: '4/3',
                        marginBottom: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    />

                    {story && (
                      <p
                        style={{
                          color: '#94a3b8',
                          lineHeight: 1.7,
                          fontSize: '0.95rem',
                        }}
                      >
                        {story}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* DEEP CONFESSION SCENE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          style={{
            marginBottom: '15vh',
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span
            style={{
              fontSize: '3rem',
              color: 'rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-serif, serif)',
            }}
          >
            "
          </span>
          <p
            style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: '1.2rem',
              lineHeight: 1.9,
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              marginBottom: '30px',
            }}
          >
            {mainMessage}
          </p>
          <p
            style={{
              letterSpacing: '2px',
              fontSize: '0.8rem',
              color: '#94a3b8',
            }}
          >
            — {senderName}
          </p>
        </motion.div>

        {/* GALLERY SCENE */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontSize: '0.9rem',
                letterSpacing: '4px',
                textAlign: 'center',
                marginBottom: '40px',
                color: '#94a3b8',
              }}
            >
              THE MEMORIES
            </h2>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  src={photo.url}
                  style={{
                    width: '100%',
                    aspectRatio: i % 3 === 0 ? '1/1' : '4/5',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
