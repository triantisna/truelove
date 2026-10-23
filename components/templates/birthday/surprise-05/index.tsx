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
function getMediaList(content: Record<string, any>, key: string) {
  const list = content[key];
  if (!Array.isArray(list)) return [];
  return list.filter(
    (item) =>
      typeof item === 'object' && item !== null && typeof item.url === 'string',
  );
}

// --- SUB-COMPONENT: GOLDEN CONFETTI / DUST ---
function GoldDust() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 40 }).map((_, i) => {
        const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
        const randomY = (Math.random() - 1) * window.innerHeight * 1.2;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.5, 0.5],
              x: randomX,
              y: randomY,
            }}
            transition={{ duration: 1.8 + Math.random(), ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: '#e6c594',
              borderRadius: '50%',
              boxShadow: '0 0 10px #d4af37',
              top: '50%',
              left: '50%',
            }}
          />
        );
      })}
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function MemoryVault({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const passcode = getString(content, 'passcode', '1234');
  const passcodeHint = getString(content, 'passcodeHint');
  const vaultTitle = getString(content, 'vaultTitle', 'The Memory Vault');
  const introMessage = getString(content, 'introMessage');
  const chapter1 = getString(content, 'chapter1');
  const chapter2 = getString(content, 'chapter2');
  const vaultImages = getMediaList(content, 'vaultImages');
  const futurePromisesStr = getString(content, 'futurePromises');
  const closingMessage = getString(content, 'closingMessage');
  const senderName = getString(content, 'senderName', website.senderName);

  const promisesList = futurePromisesStr
    .split('\n')
    .filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI ---
  const [inputCode, setInputCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showDust, setShowDust] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() === passcode.trim()) {
      setShowDust(true);
      setTimeout(() => {
        setIsUnlocked(true);
      }, 800);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  // PALET WARNA (Midnight Navy, Champagne Gold, Deep Espresso)
  const colors = {
    bg: '#0a0f1d', // Midnight Navy Gelap
    cardBg: '#121829', // Navy lebih terang untuk kartu
    gold: '#d4af37', // Champagne Gold
    goldLight: '#f3e5ab',
    textMain: '#f3f4f6', // Putih gading
    textMuted: '#9ca3af', // Abu-abu elegan
    border: 'rgba(212, 175, 55, 0.2)', // Garis emas tipis
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
      <FloatingMusicPlayer url={musicUrl} isOpened={isUnlocked} />

      {showDust && <GoldDust />}

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* --- SCENE 0: THE LOCKED VAULT (PASSCODE SCREEN) --- */
          <motion.div
            key="locked-vault"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
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
              style={{
                maxWidth: '420px',
                width: '100%',
                background: colors.cardBg,
                padding: '40px 30px',
                borderRadius: '24px',
                border: `1px solid ${colors.border}`,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                style={{
                  fontSize: '3.5rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.4))',
                }}
              >
                🔒
              </div>

              <p
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  color: colors.gold,
                  marginBottom: '8px',
                  fontWeight: 'bold',
                }}
              >
                Secure Time Capsule
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '2rem',
                  color: colors.textMain,
                  marginBottom: '20px',
                }}
              >
                {vaultTitle}
              </h1>

              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: colors.textMuted,
                  whiteSpace: 'pre-wrap',
                  marginBottom: '30px',
                }}
              >
                {introMessage}
              </p>

              <form
                onSubmit={handleUnlock}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <input
                  type="password"
                  placeholder="Masukkan Kode Rahasia"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: '#0a0f1d',
                    border: `1px solid ${showError ? '#ef4444' : colors.border}`,
                    color: colors.textMain,
                    fontSize: '1rem',
                    textAlign: 'center',
                    letterSpacing: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {showError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: '0.8rem',
                      color: '#ef4444',
                      fontStyle: 'italic',
                    }}
                  >
                    Kode salah. Coba periksa kembali kodenya.
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold}, #aa820a)`,
                    color: '#0a0f1d',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)',
                  }}
                >
                  Buka Kapsul Waktu 🔓
                </motion.button>
              </form>

              {passcodeHint && (
                <div style={{ marginTop: '20px' }}>
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.gold,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Butuh petunjuk kode?
                    </button>
                  ) : (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: colors.textMuted,
                        fontStyle: 'italic',
                        marginTop: '6px',
                      }}
                    >
                      Hint: {passcodeHint}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 1 ONWARDS: UNLOCKED VAULT CONTENT --- */
          <motion.div
            key="vault-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '8vh 20px 0 20px',
            }}
          >
            {/* HERO HEADER */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center', marginBottom: '8vh' }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  color: colors.gold,
                  fontWeight: 'bold',
                }}
              >
                Vault Unlocked Successfully ✨
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '2.8rem',
                  color: colors.textMain,
                  marginTop: '12px',
                  marginBottom: '8px',
                }}
              >
                {receiverName}
              </h1>
              <div
                style={{
                  width: '50px',
                  height: '2px',
                  backgroundColor: colors.gold,
                  margin: '20px auto 0',
                }}
              />
            </motion.div>

            {/* CHAPTER 1 */}
            {chapter1 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{
                  background: colors.cardBg,
                  padding: '36px 28px',
                  borderRadius: '24px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                  border: `1px solid ${colors.border}`,
                  marginBottom: '6vh',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif, serif)',
                    fontSize: '1.1rem',
                    lineHeight: 1.9,
                    color: colors.textMain,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {chapter1}
                </p>
              </motion.div>
            )}

            {/* CHAPTER 2 */}
            {chapter2 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{
                  background: colors.cardBg,
                  padding: '36px 28px',
                  borderRadius: '24px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                  border: `1px solid ${colors.border}`,
                  marginBottom: '6vh',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif, serif)',
                    fontSize: '1.1rem',
                    lineHeight: 1.9,
                    color: colors.textMain,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {chapter2}
                </p>
              </motion.div>
            )}

            {/* VAULT IMAGES GALLERY */}
            {vaultImages.length > 0 && (
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
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: colors.gold,
                    marginBottom: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  Archived Memories
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  {vaultImages.map((img: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        background: colors.cardBg,
                        padding: '12px',
                        borderRadius: '20px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`Vault Memory ${i}`}
                        style={{
                          width: '100%',
                          aspectRatio: '4/3',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          display: 'block',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FUTURE PROMISES */}
            {promisesList.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{
                  background: colors.cardBg,
                  padding: '40px 28px',
                  borderRadius: '24px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                  border: `1px solid ${colors.border}`,
                  marginBottom: '6vh',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: colors.gold,
                    marginBottom: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Future Letters & Promises
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    listStyleType: 'none', // Menghilangkan bullet bawaan
                  }}
                >
                  {promisesList.map((promise, i) => (
                    <li
                      key={i}
                      style={{
                        position: 'relative',
                        paddingLeft: '24px',
                        fontSize: '0.98rem',
                        lineHeight: 1.8,
                        color: colors.textMain,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '2px', // Menyesuaikan posisi vertikal simbol bintang
                          color: colors.gold,
                          fontSize: '1rem',
                          lineHeight: 1,
                        }}
                      >
                        ✦
                      </span>
                      {promise}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* CLOSING MESSAGE */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '40px 28px',
                borderRadius: '24px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  color: colors.textMain,
                  whiteSpace: 'pre-wrap',
                  marginBottom: '35px',
                }}
              >
                {closingMessage}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '1.4rem',
                  color: colors.gold,
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
