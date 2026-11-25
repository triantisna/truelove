'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';
import { saveWebsiteResponse } from '@/lib/website-response';
import type { WebsiteRecord } from '@/types/website';

type ContentValue = Record<string, unknown>;

function getString(content: ContentValue, key: string, fallback = ''): string {
  const value = content[key];
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function getMediaUrl(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object' && value !== null && 'url' in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === 'string' ? url.trim() : '';
  }
  return '';
}

const TOTAL_SLIDES = 5;

const HESITATE_LINES = [
  'Pikir-pikir dulu...',
  'Yakin nih? 🥺',
  'Coba pikir sekali lagi deh...',
  'Janji bakal bikin kamu bahagia!',
  'Masa tega nolak sih...',
  'Klik tombol yang satunya aja yuk ✨',
];

const CONFETTI_PIECES = [
  { id: 1, x: -150, y: -180, rot: -45, color: '#d46a7e', size: 10, delay: 0 },
  { id: 2, x: -110, y: -220, rot: 35, color: '#e8a87c', size: 8, delay: 0.05 },
  { id: 3, x: -70, y: -160, rot: -80, color: '#c48cb3', size: 11, delay: 0.08 },
  { id: 4, x: -30, y: -240, rot: 60, color: '#f2c14e', size: 9, delay: 0.02 },
  { id: 5, x: 20, y: -210, rot: -25, color: '#d46a7e', size: 10, delay: 0.1 },
  { id: 6, x: 65, y: -175, rot: 95, color: '#85b79d', size: 8, delay: 0.04 },
  { id: 7, x: 115, y: -230, rot: -65, color: '#e8a87c', size: 11, delay: 0.07 },
  { id: 8, x: 155, y: -170, rot: 45, color: '#f2c14e', size: 9, delay: 0.03 },
  { id: 9, x: -135, y: -110, rot: 120, color: '#c48cb3', size: 8, delay: 0.12 },
  {
    id: 10,
    x: -85,
    y: -95,
    rot: -110,
    color: '#85b79d',
    size: 10,
    delay: 0.06,
  },
  { id: 11, x: 85, y: -105, rot: 75, color: '#d46a7e', size: 9, delay: 0.09 },
  {
    id: 12,
    x: 140,
    y: -120,
    rot: -55,
    color: '#e8a87c',
    size: 10,
    delay: 0.11,
  },
  { id: 13, x: -45, y: -130, rot: 40, color: '#f2c14e', size: 7, delay: 0.14 },
  { id: 14, x: 45, y: -140, rot: -90, color: '#c48cb3', size: 8, delay: 0.13 },
];

export default function Proposal01({ website }: { website: WebsiteRecord }) {
  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as ContentValue;
  const initialAccepted = isPublished && Boolean(savedResponse.accepted);

  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [musicStarted, setMusicStarted] = useState(false);
  const [hesitateCount, setHesitateCount] = useState(0);
  const [hasAccepted, setHasAccepted] = useState(initialAccepted);
  const [showCelebration, setShowCelebration] = useState(initialAccepted);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(
    isPublished && typeof savedResponse.acceptedAt === 'string'
      ? savedResponse.acceptedAt
      : null,
  );

  const content = (website.content ?? {}) as ContentValue;

  const senderName = getString(
    content,
    'senderName',
    website.senderName || 'Aku',
  );
  const receiverName = getString(
    content,
    'receiverName',
    website.receiverName || 'Kamu',
  );

  const hookTitle = getString(
    content,
    'hookTitle',
    'Ada satu hal yang sudah lama ingin kutanyakan padamu...',
  );
  const hookSubtext = getString(
    content,
    'hookSubtext',
    'Baca pelan-pelan sampai halaman terakhir, ya.',
  );

  const momentPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.momentPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.momentPhoto, website.media]);

  const momentTitle = getString(
    content,
    'momentTitle',
    'Di Momen Ini, Aku Sadar',
  );
  const momentStory = getString(
    content,
    'momentStory',
    website.message ||
      'Setiap hal kecil terasa jauh lebih ringan dan hangat kalau ada kamu di sampingku.',
  );

  const reasonsTitle = getString(content, 'reasonsTitle', 'Kenapa Harus Kamu?');
  const reasonsList = useMemo(() => {
    const raw = getString(
      content,
      'reasonsList',
      'Caramu mendengarkan dengan tulus tanpa pernah membuatku merasa sendirian\nTawamu yang selalu berhasil mengubah hari biasa jadi momen favoritku\nKetenangan yang selalu kurasakan setiap kali kita cuma duduk berdua',
    );
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [content]);

  const promiseTitle = getString(
    content,
    'promiseTitle',
    'Sebelum Aku Bertanya...',
  );
  const promiseBody = getString(
    content,
    'promiseBody',
    'Aku mungkin tidak bisa menjanjikan hari-hari kita akan selalu sempurna tanpa masalah. Tapi aku berjanji akan selalu berusaha menjadi tempat pulang yang aman dan memilihmu setiap hari.',
  );

  const questionText = getString(
    content,
    'questionText',
    'Maukah kamu menjadi pasanganku?',
  );
  const yesButtonLabel = getString(content, 'yesButtonLabel', 'Iya, Aku Mau!');

  const celebrationTitle = getString(
    content,
    'celebrationTitle',
    'Mulai Hari Ini, Kita Resmi',
  );
  const celebrationMessage = getString(
    content,
    'celebrationMessage',
    'Terima kasih sudah memilihku juga. Tidak sabar menulis hari-hari berikutnya bersamamu.',
  );

  const officialDate = useMemo(() => {
    const custom = getString(content, 'officialDate', '');
    if (custom) return custom;
    const targetDate = acceptedAt ? new Date(acceptedAt) : new Date();
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(targetDate);
  }, [content, acceptedAt]);

  const rawMusic =
    getString(content, 'backgroundMusic') ||
    (website as unknown as { music?: { url?: string } }).music?.url ||
    website.musicUrl ||
    '';
  const musicUrl = /^https?:\/\//i.test(rawMusic) ? rawMusic : '';

  const goNext = () => {
    if (!musicStarted) setMusicStarted(true);
    if (slide < TOTAL_SLIDES - 1) {
      setDirection(1);
      setSlide((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goPrev = () => {
    if (slide > 0) {
      setDirection(-1);
      setSlide((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleHesitate = () => {
    setHesitateCount((prev) => prev + 1);
  };

  const handleAccept = () => {
    if (!musicStarted) setMusicStarted(true);
    const nowIso = new Date().toISOString();

    setHasAccepted(true);
    setShowCelebration(true);
    setAcceptedAt(nowIso);
    window.scrollTo(0, 0);

    if (isPublished) {
      void saveWebsiteResponse(website.id, {
        accepted: true,
        acceptedAt: nowIso,
      });
    }
  };

  const currentHesitateText =
    HESITATE_LINES[Math.min(hesitateCount, HESITATE_LINES.length - 1)];
  const yesScale = Math.min(1 + hesitateCount * 0.08, 1.38);

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 36 : -36,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -36 : 36,
      scale: 0.98,
    }),
  };

  return (
    <main className="oq1-root">
      <style>{css}</style>

      {/* Mesh Gradient Orbs */}
      <div className="oq1-orb oq1-orb-top" aria-hidden="true" />
      <div className="oq1-orb oq1-orb-bottom" aria-hidden="true" />

      <FloatingMusicPlayer url={musicUrl} isOpened={musicStarted} />

      <div className="oq1-frame">
        {/* Top Story Progress Bar */}
        {!showCelebration && (
          <header className="oq1-top">
            <div
              className="oq1-progress"
              role="progressbar"
              aria-valuenow={slide + 1}
              aria-valuemin={1}
              aria-valuemax={TOTAL_SLIDES}
            >
              {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
                <span key={idx} className="oq1-progress-track">
                  <motion.span
                    className="oq1-progress-fill"
                    initial={false}
                    animate={{
                      width: idx <= slide ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              ))}
            </div>

            <div className="oq1-top-meta">
              <span className="oq1-top-names">
                {senderName} → {receiverName}
              </span>
              <span className="oq1-top-step">
                0{slide + 1} / 0{TOTAL_SLIDES}
              </span>
            </div>
          </header>
        )}

        {/* Stage */}
        <section className="oq1-stage">
          <AnimatePresence mode="wait" custom={direction}>
            {showCelebration ? (
              /* --- CELEBRATION SCREEN --- */
              <motion.div
                key="celebration"
                className="oq1-card oq1-card-celebration"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Lightweight Framer Motion Confetti Burst */}
                <div className="oq1-confetti-wrap" aria-hidden="true">
                  {CONFETTI_PIECES.map((piece) => (
                    <motion.span
                      key={piece.id}
                      className="oq1-confetti"
                      style={{
                        backgroundColor: piece.color,
                        width: piece.size,
                        height: piece.size * 0.65,
                      }}
                      initial={{
                        opacity: 0,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 0.4,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        x: piece.x,
                        y: [0, piece.y, piece.y + 110],
                        rotate: piece.rot * 2,
                        scale: [0.4, 1.1, 0.9],
                      }}
                      transition={{
                        duration: 1.9,
                        delay: piece.delay,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  ))}
                </div>

                <span className="oq1-pill-badge">OFFICIALLY YOURS</span>
                <h1 className="oq1-serif-lg">{celebrationTitle}</h1>

                <div className="oq1-couple-pill">
                  <span>
                    {senderName} &amp; {receiverName}
                  </span>
                </div>

                <p className="oq1-body-text">{celebrationMessage}</p>

                <div className="oq1-date-stamp">
                  <span className="oq1-date-label">TANGGAL SPESIAL KITA</span>
                  <strong className="oq1-date-val">{officialDate}</strong>
                </div>

                <p className="oq1-sign-note">
                  Dengan sepenuh hati, {senderName}
                </p>
                <button
                  type="button"
                  className="oq1-back-link"
                  style={{ marginTop: '14px' }}
                  onClick={() => {
                    setShowCelebration(false);
                    setSlide(0);
                    window.scrollTo(0, 0);
                  }}
                >
                  ↺ Baca ulang dari awal
                </button>
              </motion.div>
            ) : slide === 0 ? (
              /* --- SLIDE 01: THE HOOK --- */
              <motion.div
                key="slide-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="oq1-card oq1-card-center"
              >
                <span className="oq1-pill-badge">UNTUK {receiverName}</span>
                <h1 className="oq1-serif-xl">Hai {receiverName},</h1>
                <p className="oq1-lead">{hookTitle}</p>
                <p className="oq1-subtle">{hookSubtext}</p>

                <motion.button
                  type="button"
                  className="oq1-btn-primary"
                  onClick={goNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Lanjut →
                </motion.button>
              </motion.div>
            ) : slide === 1 ? (
              /* --- SLIDE 02: THE MOMENT (ARCH PHOTO) --- */
              <motion.div
                key="slide-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="oq1-card oq1-card-center"
              >
                {momentPhoto && (
                  <div className="oq1-arch-wrap">
                    <img
                      src={momentPhoto}
                      alt={momentTitle}
                      className="oq1-arch-img"
                    />
                  </div>
                )}

                <span className="oq1-kicker">02 · THE MOMENT</span>
                <h2 className="oq1-serif-md">{momentTitle}</h2>
                <p className="oq1-body-text">{momentStory}</p>

                <div className="oq1-nav-row">
                  <button
                    type="button"
                    className="oq1-btn-ghost"
                    onClick={goPrev}
                  >
                    ← Kembali
                  </button>
                  <motion.button
                    type="button"
                    className="oq1-btn-primary"
                    onClick={goNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Lanjut →
                  </motion.button>
                </div>
              </motion.div>
            ) : slide === 2 ? (
              /* --- SLIDE 03: WHY YOU (FLOATING PILLS) --- */
              <motion.div
                key="slide-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="oq1-card oq1-card-center"
              >
                <span className="oq1-kicker">03 · WHY YOU</span>
                <h2 className="oq1-serif-md">{reasonsTitle}</h2>

                <ul className="oq1-reasons-list">
                  {reasonsList.map((reason, idx) => (
                    <motion.li
                      key={idx}
                      className="oq1-reason-pill"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.12 + idx * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <span className="oq1-reason-num">0{idx + 1}</span>
                      <span className="oq1-reason-text">{reason}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="oq1-nav-row">
                  <button
                    type="button"
                    className="oq1-btn-ghost"
                    onClick={goPrev}
                  >
                    ← Kembali
                  </button>
                  <motion.button
                    type="button"
                    className="oq1-btn-primary"
                    onClick={goNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Lanjut →
                  </motion.button>
                </div>
              </motion.div>
            ) : slide === 3 ? (
              /* --- SLIDE 04: THE PROMISE --- */
              <motion.div
                key="slide-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="oq1-card oq1-card-center"
              >
                <span className="oq1-kicker">04 · THE PROMISE</span>
                <h2 className="oq1-serif-md">{promiseTitle}</h2>

                <blockquote className="oq1-promise-quote">
                  “{promiseBody}”
                </blockquote>

                <p className="oq1-promise-from">— {senderName}</p>

                <div className="oq1-nav-row">
                  <button
                    type="button"
                    className="oq1-btn-ghost"
                    onClick={goPrev}
                  >
                    ← Kembali
                  </button>
                  <motion.button
                    type="button"
                    className="oq1-btn-primary"
                    onClick={goNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Lihat Pertanyaanku →
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              /* --- SLIDE 05: THE BIG QUESTION --- */
              <motion.div
                key="slide-4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="oq1-card oq1-card-center"
              >
                <span className="oq1-pill-badge">ONE QUESTION</span>
                <h2 className="oq1-question">{questionText}</h2>

                <div className="oq1-answer-stack">
                  {hasAccepted ? (
                    <motion.button
                      type="button"
                      className="oq1-btn-yes"
                      onClick={() => {
                        setShowCelebration(true);
                        window.scrollTo(0, 0);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✓ Sudah Dijawab Iya · Lihat Kartu Resmi →
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        type="button"
                        className="oq1-btn-yes"
                        onClick={handleAccept}
                        animate={{ scale: yesScale }}
                        whileHover={{ scale: yesScale + 0.03 }}
                        whileTap={{ scale: yesScale - 0.03 }}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 20,
                        }}
                      >
                        {yesButtonLabel}
                      </motion.button>

                      <button
                        type="button"
                        className="oq1-btn-hesitate"
                        onClick={handleHesitate}
                      >
                        {currentHesitateText}
                      </button>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="oq1-back-link"
                  onClick={goPrev}
                >
                  ← Baca ulang halaman sebelumnya
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .oq1-root {
    min-height: 100svh;
    width: 100%;
    background: linear-gradient(155deg, #fdf6f5 0%, #f9eaec 48%, #fdf5ef 100%);
    color: #2f2326;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    position: relative;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
  }

  .oq1-root * {
    box-sizing: border-box;
  }

  /* Soft Mesh Orbs */
  .oq1-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(72px);
    pointer-events: none;
    z-index: 0;
  }

  .oq1-orb-top {
    width: 360px;
    height: 360px;
    top: -110px;
    right: -90px;
    background: rgba(235, 168, 181, 0.42);
  }

  .oq1-orb-bottom {
    width: 340px;
    height: 340px;
    bottom: -110px;
    left: -90px;
    background: rgba(244, 203, 178, 0.42);
  }

  /* Story Deck Frame */
  .oq1-frame {
    width: min(100%, 480px);
    min-height: 100svh;
    padding: 20px 18px 28px;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
  }

  /* Top Progress */
  .oq1-top {
    padding-bottom: 18px;
  }

  .oq1-progress {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    margin-bottom: 12px;
  }

  .oq1-progress-track {
    height: 4px;
    border-radius: 999px;
    background-color: rgba(168, 86, 104, 0.16);
    overflow: hidden;
    display: block;
  }

  .oq1-progress-fill {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #b8566b 0%, #d47a89 100%);
  }

  .oq1-top-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #876970;
  }

  .oq1-top-names {
    text-transform: uppercase;
  }

  /* Centered Stage */
  .oq1-stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Frosted Glass Card */
  .oq1-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 32px;
    padding: clamp(28px, 6vw, 40px) clamp(22px, 5vw, 34px);
    box-shadow: 0 24px 60px rgba(135, 76, 92, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    position: relative;
  }

  .oq1-card-center {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .oq1-card-celebration {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: visible;
  }

  /* Badges & Typography */
  .oq1-pill-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    background-color: rgba(184, 86, 107, 0.12);
    color: #a6465c;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .oq1-kicker {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #b8566b;
    margin-bottom: 10px;
  }

  .oq1-serif-xl {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.5rem, 9vw, 3.3rem);
    font-weight: 600;
    line-height: 1.06;
    color: #2f2326;
    margin: 0 0 16px;
  }

  .oq1-serif-lg {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.15rem, 7.5vw, 2.75rem);
    font-weight: 600;
    line-height: 1.12;
    color: #2f2326;
    margin: 0 0 18px;
  }

  .oq1-serif-md {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.85rem, 6.5vw, 2.35rem);
    font-weight: 600;
    line-height: 1.15;
    color: #2f2326;
    margin: 0 0 14px;
  }

  .oq1-lead {
    font-size: 1.06rem;
    line-height: 1.65;
    color: #49383c;
    margin: 0 0 10px;
    max-width: 340px;
  }

  .oq1-subtle {
    font-size: 0.88rem;
    color: #8c7379;
    margin: 0 0 30px;
  }

  .oq1-body-text {
    font-size: 0.98rem;
    line-height: 1.75;
    color: #4a3a3e;
    margin: 0 0 26px;
    max-width: 360px;
  }

  /* Arch Photo Frame */
  .oq1-arch-wrap {
    width: min(100%, 240px);
    aspect-ratio: 4 / 5;
    border-radius: 999px 999px 28px 28px;
    overflow: hidden;
    margin-bottom: 22px;
    padding: 6px;
    background: linear-gradient(160deg, #ffffff 0%, #f6dce0 100%);
    box-shadow: 0 16px 36px rgba(166, 70, 92, 0.14);
  }

  .oq1-arch-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 999px 999px 22px 22px;
    display: block;
  }

  /* Slide 03: Floating Pills */
  .oq1-reasons-list {
    list-style: none;
    margin: 6px 0 28px;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: left;
  }

  .oq1-reason-pill {
    background: rgba(255, 255, 255, 0.86);
    border-radius: 20px;
    padding: 14px 18px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    box-shadow: 0 8px 22px rgba(135, 76, 92, 0.06);
  }

  .oq1-reason-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: rgba(184, 86, 107, 0.14);
    color: #a6465c;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .oq1-reason-text {
    font-size: 0.94rem;
    line-height: 1.55;
    color: #3a2c30;
  }

  /* Slide 04: Promise */
  .oq1-promise-quote {
    margin: 6px 0 16px;
    padding: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.32rem, 4.5vw, 1.55rem);
    font-style: italic;
    line-height: 1.65;
    color: #3b2c30;
  }

  .oq1-promise-from {
    font-size: 0.88rem;
    font-weight: 600;
    color: #a6465c;
    margin: 0 0 28px;
  }

  /* Slide 05: The Big Question */
  .oq1-question {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.2rem, 8vw, 2.95rem);
    font-weight: 600;
    line-height: 1.12;
    color: #2f2326;
    margin: 4px 0 32px;
  }

  .oq1-answer-stack {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    margin-bottom: 22px;
  }

  .oq1-btn-yes {
    width: min(100%, 270px);
    padding: 15px 24px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #b8566b 0%, #cf6d81 100%);
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.96rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(184, 86, 107, 0.28);
  }

  .oq1-btn-hesitate {
    padding: 10px 18px;
    border-radius: 999px;
    border: none;
    background-color: rgba(184, 86, 107, 0.09);
    color: #7c5f66;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .oq1-btn-hesitate:hover {
    background-color: rgba(184, 86, 107, 0.15);
  }

  .oq1-back-link {
    background: transparent;
    border: none;
    color: #93787e;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 10px;
  }

  /* Navigation Buttons */
  .oq1-nav-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .oq1-btn-primary {
    padding: 13px 26px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #b8566b 0%, #cf6d81 100%);
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(184, 86, 107, 0.22);
  }

  .oq1-btn-ghost {
    padding: 12px 16px;
    border-radius: 999px;
    border: none;
    background-color: rgba(47, 35, 38, 0.06);
    color: #5c494e;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
  }

  /* Celebration Extras */
  .oq1-confetti-wrap {
    position: absolute;
    top: 38%;
    left: 50%;
    pointer-events: none;
    z-index: 5;
  }

  .oq1-confetti {
    position: absolute;
    border-radius: 2px;
  }

  .oq1-couple-pill {
    display: inline-flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 999px;
    background-color: #ffffff;
    color: #a6465c;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 600;
    font-style: italic;
    margin-bottom: 18px;
    box-shadow: 0 8px 20px rgba(166, 70, 92, 0.08);
  }

  .oq1-date-stamp {
    width: 100%;
    background-color: rgba(184, 86, 107, 0.08);
    border-radius: 18px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 20px;
  }

  .oq1-date-label {
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: #a6465c;
  }

  .oq1-date-val {
    font-size: 0.96rem;
    font-weight: 700;
    color: #2f2326;
  }

  .oq1-sign-note {
    margin: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.2rem;
    font-style: italic;
    color: #7c5f66;
  }

  @media (prefers-reduced-motion: reduce) {
    .oq1-btn-hesitate {
      transition: none !important;
    }
  }
`;
