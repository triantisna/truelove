'use client';

import { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
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

// --- SUB-COMPONENT: EDITORIAL CHAT BUBBLE ---
function ChatBubble({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '24px',
        borderRadius: '24px 24px 24px 8px', // Bentuk chat bubble modern
        marginBottom: '20px',
        maxWidth: '85%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}
    >
      <p
        style={{
          color: '#f3f4f6',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

// --- MAIN COMPONENT ---
export default function Apology02({ website }: { website: WebsiteRecord }) {
  const content = website.content ?? {};

  // --- DATA EXTRACTION ---
  const receiverName = getString(content, 'receiverName', website.receiverName);
  const ambientImage = getImage(content, 'ambientImage');
  const openingChat = getString(content, 'openingChat');
  const intentionChat = getString(content, 'intentionChat');
  const reflectionCardsStr = getString(content, 'reflectionCards');
  const transitionImage = getImage(content, 'transitionImage');
  const mainLetter = getString(content, 'mainLetter');
  const closingInvite = getString(content, 'closingInvite');
  const senderName = getString(content, 'senderName', website.senderName);

  const reflectionsList = reflectionCardsStr
    .split('\n')
    .filter((t) => t.trim() !== '');

  let rawMusicUrl =
    (website as any).music?.url ||
    website.musicUrl ||
    getString(content, 'backgroundMusic');
  const musicUrl =
    rawMusicUrl && rawMusicUrl.startsWith('http') ? rawMusicUrl : '';

  // --- STATE INTERAKSI & SCROLL ---
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);

  // Magic Parallax & Color Shift
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Transisi warna background dari Night Ink (Biru Gelap) ke Warm Amber (Senja)
  const overlayColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['rgba(15, 23, 42, 0.85)', 'rgba(56, 31, 24, 0.85)'],
  );

  return (
    <main
      ref={containerRef}
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 1. AMBIENT BACKGROUND LAYER */}
      {ambientImage && (
        <div
          style={{
            position: 'fixed',
            inset: '-50px', // Dibuat lebih besar agar saat di-blur ujungnya tidak putih
            backgroundImage: `url(${ambientImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(60px) saturate(1.5)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 2. DYNAMIC COLOR OVERLAY LAYER (Responds to scroll) */}
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: overlayColor,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <FloatingMusicPlayer url={musicUrl} isOpened={isReady} />

      <AnimatePresence mode="wait">
        {!isReady ? (
          /* --- SCENE 1: A QUIET MOMENT (OPENING) --- */
          <motion.div
            key="quiet-moment"
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <h1
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 400,
                  letterSpacing: '1px',
                  color: '#e2e8f0',
                  marginBottom: '10px',
                }}
              >
                Hey, {receiverName}.
              </h1>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#94a3b8',
                  fontStyle: 'italic',
                  marginBottom: '50px',
                }}
              >
                There's something I'd like to say, if you're willing to hear me
                out.
              </p>

              <button
                onClick={() => setIsReady(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '14px 36px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Read My Message
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* --- SCENE 2: THE EDITORIAL CHAT --- */
          <motion.div
            key="chat-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '500px',
              margin: '0 auto',
              padding: '15vh 20px 10vh 20px',
            }}
          >
            {/* The Conversation Begins */}
            <div style={{ marginBottom: '10vh' }}>
              <ChatBubble text={openingChat} />
              <ChatBubble text={intentionChat} delay={0.3} />
            </div>

            {/* Reflection Cards */}
            {reflectionsList.length > 0 && (
              <div style={{ marginBottom: '15vh' }}>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                    marginBottom: '20px',
                    marginLeft: '10px',
                  }}
                >
                  Looking back
                </motion.p>
                {reflectionsList.map((ref, i) => (
                  <ChatBubble key={i} text={ref} delay={i * 0.2} />
                ))}
              </div>
            )}

            {/* --- SCENE 3: THE SHIFT (TRANSITION TO LETTER) --- */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2 }}
              style={{ marginTop: '20vh', marginBottom: '10vh' }}
            >
              {transitionImage && (
                <div
                  style={{
                    marginBottom: '40px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    filter: 'grayscale(30%) contrast(1.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  }}
                >
                  <img
                    src={transitionImage}
                    alt="Memory"
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
              )}

              {/* The Open Panel (Serif Font, Letter Style) */}
              <div
                style={{
                  background: '#fdfbf7', // Kertas Ivory terang
                  color: '#3a3535',
                  padding: '40px 30px',
                  borderRadius: '24px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}
              >
                <h2
                  style={{
                    fontSize: '0.8rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#8a7670',
                    marginBottom: '30px',
                  }}
                >
                  What I wish I had said
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                    fontSize: '1.15rem',
                    lineHeight: 1.9,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {mainLetter}
                </p>
              </div>
            </motion.div>

            {/* --- SCENE 4: WHEN YOU'RE READY (CLOSING) --- */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              style={{ textAlign: 'center', marginTop: '15vh' }}
            >
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '40px',
                }}
              >
                {closingInvite}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                  fontSize: '1.4rem',
                  color: '#fff',
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
