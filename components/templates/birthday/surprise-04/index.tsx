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

// --- SUB-COMPONENT: INTERACTIVE REASON CARD ---
function ReasonCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
      onClick={() => setIsRevealed(!isRevealed)}
      style={{
        background: '#ffffff',
        padding: '28px 24px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(74, 59, 50, 0.04)',
        border: '1px solid #e8e2d5',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
            color: '#a38f7d',
            textTransform: 'uppercase',
          }}
        >
          Reason No. {number}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: isRevealed ? '#9e6b5d' : '#c2b2a3',
            fontStyle: 'italic',
            fontWeight: isRevealed ? 'bold' : 'normal',
          }}
        >
          {isRevealed ? 'Tutup ✕' : 'Ketuk untuk membaca →'}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: '1.4rem',
          color: '#4a3b32',
          marginBottom: isRevealed ? '12px' : '0px',
          transition: 'margin 0.3s ease',
        }}
      >
        {title}
      </h3>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                fontSize: '0.98rem',
                lineHeight: 1.8,
                color: '#5e4e42',
                whiteSpace: 'pre-wrap',
                marginTop: '8px',
              }}
            >
              {body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- MAIN COMPONENT ---
export default function ReasonsYoureSpecial({
  website,
}: {
  website: WebsiteRecord;
}) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const heroTitle = getString(content, 'heroTitle', "Reasons You're Special");
  const introMessage = getString(content, 'introMessage');
  const reasonsStr = getString(content, 'reasonsList');
  const affirmationsStr = getString(content, 'affirmationsList');
  const birthdayWish = getString(content, 'birthdayWish');
  const senderName = getString(content, 'senderName', website.senderName);

  // Parsing alasan (Format: Judul | Isi, dipisah dengan Enter)
  const rawReasonsLines = reasonsStr.split('\n').filter((t) => t.trim() !== '');
  const parsedReasons = rawReasonsLines.map((line, idx) => {
    const parts = line.split('|');
    return {
      num: String(idx + 1),
      title: parts[0]?.trim() || `Reason #${idx + 1}`,
      body: parts[1]?.trim() || line,
    };
  });

  const affirmationsList = affirmationsStr
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

  // COLOR PALETTE (Paper, Blush Beige, Dusty Rose, Brown Ink)
  const colors = {
    bg: '#f7f4ef',
    cardBg: '#ffffff',
    primary: '#9e6b5d', // Dusty Rose hangat
    textMain: '#4a3b32', // Brown Ink
    textMuted: '#877568',
    border: '#e8e2d5',
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
      <FloatingMusicPlayer url={musicUrl} isOpened={isOpened} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* --- SCENE 0: ENTRANCE SCREEN --- */
          <motion.div
            key="entrance-scrapbook"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
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
                  fontSize: '0.8rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: colors.primary,
                  marginBottom: '12px',
                  fontWeight: 'bold',
                }}
              >
                A Birthday Collection For
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '2.5rem',
                  color: colors.textMain,
                  marginBottom: '24px',
                }}
              >
                {receiverName}
              </h1>

              <div
                style={{
                  background: colors.cardBg,
                  padding: '30px 24px',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(74, 59, 50, 0.05)',
                  border: `1px solid ${colors.border}`,
                  marginBottom: '30px',
                }}
              >
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: colors.textMuted,
                    fontStyle: 'italic',
                  }}
                >
                  "Kumpulan catatan kecil tentang hal-hal sederhana yang
                  membuatmu begitu berarti."
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpened(true)}
                style={{
                  background: colors.primary,
                  color: '#fff',
                  border: 'none',
                  padding: '16px 36px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(158, 107, 93, 0.25)',
                }}
              >
                Buka Catatan ✨
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 1 ONWARDS: SCRAPBOOK CONTENT FLOW --- */
          <motion.div
            key="scrapbook-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '8vh 20px 0 20px',
            }}
          >
            {/* HERO TITLE */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center', marginBottom: '8vh' }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: colors.primary,
                  fontWeight: 'bold',
                }}
              >
                A Few Things About You
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '2.6rem',
                  color: colors.textMain,
                  marginTop: '12px',
                  marginBottom: '20px',
                  lineHeight: 1.2,
                }}
              >
                {heroTitle}
              </h1>
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: colors.primary,
                  margin: '0 auto',
                }}
              />
            </motion.div>

            {/* 1. INTRO MESSAGE */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '36px 28px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(74, 59, 50, 0.04)',
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
                {introMessage}
              </p>
            </motion.div>

            {/* 2. REASONS LIST CARDS */}
            {parsedReasons.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  marginBottom: '6vh',
                }}
              >
                {parsedReasons.map((reason, i) => (
                  <ReasonCard
                    key={i}
                    number={reason.num}
                    title={reason.title}
                    body={reason.body}
                  />
                ))}
              </div>
            )}

            {/* 3. THINGS I HOPE YOU NEVER FORGET (AFFIRMATIONS) */}
            {affirmationsList.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                style={{
                  background: '#ede7db',
                  padding: '40px 28px',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(74, 59, 50, 0.04)',
                  border: '1px solid #dfd7c7',
                  marginBottom: '6vh',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: colors.primary,
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Things I Hope You Never Forget
                </p>
                {/* Menggunakan list HTML bawaan agar titik dan teks sinkron otomatis */}
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {affirmationsList.map((aff, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: 'var(--font-serif, serif)',
                        fontSize: '1.05rem',
                        lineHeight: 1.7,
                        color: colors.textMain,
                        fontStyle: 'italic',
                      }}
                    >
                      {aff}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* 4. MY BIRTHDAY WISH FOR YOU (CLOSING) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              style={{
                background: colors.cardBg,
                padding: '40px 28px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(74, 59, 50, 0.04)',
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                  marginBottom: '20px',
                  fontWeight: 'bold',
                }}
              >
                My Birthday Wish for You
              </p>
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.9,
                  color: colors.textMain,
                  whiteSpace: 'pre-wrap',
                  marginBottom: '35px',
                }}
              >
                {birthdayWish}
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
