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

const THINK_LINES = [
  'Boleh mikir 5 detik? 😅',
  'Sudah 5 detik nih... ✨',
  'Yakin gak mau langsung klik Iya? 🥺',
  'Aku tunggu dengan sabar kok!',
];

export default function Proposal03({ website }: { website: WebsiteRecord }) {
  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as ContentValue;
  const initialAccepted = isPublished && Boolean(savedResponse.accepted);

  const [unlocked, setUnlocked] = useState<{
    moment: boolean;
    reasons: boolean;
    promise: boolean;
  }>({
    moment: initialAccepted,
    reasons: initialAccepted,
    promise: initialAccepted,
  });
  const [musicStarted, setMusicStarted] = useState(false);
  const [thinkCount, setThinkCount] = useState(0);
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

  const boardTitle = getString(content, 'boardTitle', 'All The Little Pieces');
  const boardSubtitle = getString(
    content,
    'boardSubtitle',
    'Ketuk 3 kepingan di bawah ini untuk membuka satu pertanyaan penting dariku.',
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
    'Momen yang Bikin Aku Yakin',
  );
  const momentNote = getString(
    content,
    'momentNote',
    website.message ||
      'Di momen ini aku sadar kalau waktu selalu terasa kurang tiap kali lagi ngobrol sama kamu.',
  );

  const reasonsTitle = getString(content, 'reasonsTitle', 'Kenapa Harus Kamu?');
  const reasonsList = useMemo(() => {
    const raw = getString(
      content,
      'reasonsList',
      'Caramu selalu mendengar dengan tenang tanpa pernah menghakimi\nEnergi hangatmu yang bikin hari biasa langsung terasa spesial\nRasa nyaman yang tidak pernah perlu dibuat-buat saat kita berdua',
    );
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [content]);

  const promiseTitle = getString(content, 'promiseTitle', 'Janji Kecilku');
  const promiseText = getString(
    content,
    'promiseText',
    'Aku berjanji akan selalu berusaha jujur, sabar, dan menjadi tempat pulang yang aman untukmu.',
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
    'Semua Kepingan Lengkap',
  );
  const celebrationMessage = getString(
    content,
    'celebrationMessage',
    'Terima kasih sudah memilih berjalan bersamaku. Mari kita kumpulkan lebih banyak kepingan cerita indah mulai hari ini.',
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

  const unlockedCount =
    Number(unlocked.moment) +
    Number(unlocked.reasons) +
    Number(unlocked.promise);
  const allUnlocked = unlockedCount === 3;

  const togglePiece = (key: 'moment' | 'reasons' | 'promise') => {
    if (!musicStarted) setMusicStarted(true);
    setUnlocked((prev) => ({ ...prev, [key]: true }));
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

  const currentThinkText =
    THINK_LINES[Math.min(thinkCount, THINK_LINES.length - 1)];

  return (
    <main className="alp3-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={musicStarted} />

      <div className="alp3-wrap">
        <AnimatePresence mode="wait">
          {showCelebration ? (
            /* --- OFFICIAL CELEBRATION CARD --- */
            <motion.section
              key="alp3-celebration"
              className="alp3-celebration"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="alp3-cel-badge">ALL PIECES COMPLETE</span>
              <h1 className="alp3-cel-title">{celebrationTitle}</h1>

              <div className="alp3-cel-couple">
                {senderName} &amp; {receiverName}
              </div>

              <p className="alp3-cel-msg">{celebrationMessage}</p>

              <div className="alp3-cel-meta">
                <div className="alp3-cel-pill">
                  <span className="alp3-cel-label">TANGGAL RESMI</span>
                  <strong className="alp3-cel-val">{officialDate}</strong>
                </div>
                <div className="alp3-cel-pill">
                  <span className="alp3-cel-label">STATUS</span>
                  <strong className="alp3-cel-val">3/3 Terbuka ✓</strong>
                </div>
              </div>

              <p className="alp3-cel-sign">Dengan sepenuh hati, {senderName}</p>
              <button
                type="button"
                onClick={() => {
                  setShowCelebration(false);
                  window.scrollTo(0, 0);
                }}
                style={{
                  marginTop: '18px',
                  background: 'transparent',
                  border: 'none',
                  color: '#6b645c',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
              >
                ↺ Lihat kembali papan kepingan
              </button>
            </motion.section>
          ) : (
            /* --- INTERACTIVE BENTO BOARD --- */
            <motion.div
              key="alp3-board"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45 }}
              className="alp3-board"
            >
              {/* Top Status Pill & Heading */}
              <header className="alp3-head">
                <div className="alp3-status-pill">
                  <span>Untuk {receiverName}</span>
                  <span className="alp3-dot" aria-hidden="true">
                    ·
                  </span>
                  <span className={allUnlocked ? 'is-done' : ''}>
                    {unlockedCount}/3 Kepingan Terbuka
                  </span>
                </div>
                <h1 className="alp3-title">{boardTitle}</h1>
                <p className="alp3-sub">{boardSubtitle}</p>
              </header>

              {/* Bento Grid */}
              <div className="alp3-grid">
                {/* WIDGET 01: FOTO & MOMEN (WIDE CARD) */}
                <button
                  type="button"
                  onClick={() => togglePiece('moment')}
                  className={`alp3-tile alp3-tile-wide alp3-tile-white ${
                    unlocked.moment ? 'is-open' : ''
                  }`}
                >
                  <div className="alp3-tile-top">
                    <span className="alp3-tile-tag">01 · MOMEN</span>
                    <span
                      className={`alp3-check ${unlocked.moment ? 'is-done' : ''}`}
                    >
                      {unlocked.moment ? 'Terbuka ✓' : 'Ketuk untuk buka'}
                    </span>
                  </div>

                  {momentPhoto && (
                    <div className="alp3-photo-box">
                      <img
                        src={momentPhoto}
                        alt={momentTitle}
                        className="alp3-photo"
                      />
                    </div>
                  )}

                  <h2 className="alp3-tile-heading">{momentTitle}</h2>

                  <AnimatePresence initial={false}>
                    {unlocked.moment ? (
                      <motion.p
                        key="moment-open"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.35 }}
                        className="alp3-tile-body"
                      >
                        {momentNote}
                      </motion.p>
                    ) : (
                      <p className="alp3-tile-hint">
                        Ada catatan kecil di balik foto ini...
                      </p>
                    )}
                  </AnimatePresence>
                </button>

                {/* WIDGET 02: KENAPA KAMU? (MATCHA CARD) */}
                <button
                  type="button"
                  onClick={() => togglePiece('reasons')}
                  className={`alp3-tile alp3-tile-matcha ${
                    unlocked.reasons ? 'is-open' : ''
                  }`}
                >
                  <div className="alp3-tile-top">
                    <span className="alp3-tile-tag">02 · ALASAN</span>
                    <span
                      className={`alp3-check ${unlocked.reasons ? 'is-done' : ''}`}
                    >
                      {unlocked.reasons ? '✓' : 'Ketuk'}
                    </span>
                  </div>

                  <h2 className="alp3-tile-heading">{reasonsTitle}</h2>

                  <AnimatePresence initial={false}>
                    {unlocked.reasons ? (
                      <motion.ul
                        key="reasons-open"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.35 }}
                        className="alp3-reason-list"
                      >
                        {reasonsList.map((item, idx) => (
                          <li key={idx}>
                            <span className="alp3-reason-bullet">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </motion.ul>
                    ) : (
                      <p className="alp3-tile-hint">
                        3 hal yang selalu bikin aku bersyukur kenal kamu.
                      </p>
                    )}
                  </AnimatePresence>
                </button>

                {/* WIDGET 03: JANJI KECILKU (BUTTER CARD) */}
                <button
                  type="button"
                  onClick={() => togglePiece('promise')}
                  className={`alp3-tile alp3-tile-butter ${
                    unlocked.promise ? 'is-open' : ''
                  }`}
                >
                  <div className="alp3-tile-top">
                    <span className="alp3-tile-tag">03 · JANJI</span>
                    <span
                      className={`alp3-check ${unlocked.promise ? 'is-done' : ''}`}
                    >
                      {unlocked.promise ? '✓' : 'Ketuk'}
                    </span>
                  </div>

                  <h2 className="alp3-tile-heading">{promiseTitle}</h2>

                  <AnimatePresence initial={false}>
                    {unlocked.promise ? (
                      <motion.div
                        key="promise-open"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.35 }}
                      >
                        <p className="alp3-tile-body">“{promiseText}”</p>
                        <span className="alp3-promise-sign">
                          — {senderName}
                        </span>
                      </motion.div>
                    ) : (
                      <p className="alp3-tile-hint">
                        Satu janji tulus dari {senderName} sebelum bertanya.
                      </p>
                    )}
                  </AnimatePresence>
                </button>

                {/* WIDGET 04: THE LOCKED QUESTION (WIDE BOTTOM CARD) */}
                <motion.div
                  layout
                  className={`alp3-question-card ${
                    allUnlocked ? 'is-unlocked' : 'is-locked'
                  }`}
                >
                  {!allUnlocked ? (
                    <div className="alp3-locked-state">
                      <span className="alp3-lock-icon" aria-hidden="true">
                        🔒
                      </span>
                      <p className="alp3-locked-title">Pertanyaan Terkunci</p>
                      <p className="alp3-locked-sub">
                        Buka {3 - unlockedCount} kepingan lagi di atas untuk
                        melihat pertanyaanku.
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45 }}
                      className="alp3-unlocked-state"
                    >
                      <span className="alp3-q-badge">
                        UNLOCKED · ONE QUESTION
                      </span>
                      <h2 className="alp3-q-text">{questionText}</h2>

                      <div className="alp3-q-actions">
                        {hasAccepted ? (
                          <motion.button
                            type="button"
                            className="alp3-btn-yes"
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
                              className="alp3-btn-yes"
                              onClick={handleAccept}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {yesButtonLabel}
                            </motion.button>

                            <button
                              type="button"
                              className="alp3-btn-think"
                              onClick={() => setThinkCount((c) => c + 1)}
                            >
                              {currentThinkText}
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .alp3-root {
    min-height: 100svh;
    width: 100%;
    background-color: #f7f5ef;
    color: #24211e;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px 40px;
    -webkit-font-smoothing: antialiased;
  }

  .alp3-root * {
    box-sizing: border-box;
  }

  .alp3-wrap {
    width: min(100%, 640px);
  }

  /* Header */
  .alp3-head {
    text-align: center;
    margin-bottom: 22px;
  }

  .alp3-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border-radius: 999px;
    background-color: #ffffff;
    border: 1px solid rgba(36, 33, 30, 0.1);
    font-size: 0.72rem;
    font-weight: 600;
    color: #5c564f;
    margin-bottom: 14px;
  }

  .alp3-status-pill .is-done {
    color: #2f6b3e;
  }

  .alp3-dot {
    opacity: 0.4;
  }

  .alp3-title {
    margin: 0 0 6px;
    font-size: clamp(1.65rem, 5vw, 2.1rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #24211e;
  }

  .alp3-sub {
    margin: 0 auto;
    max-width: 440px;
    font-size: 0.9rem;
    line-height: 1.55;
    color: #6b645c;
  }

  /* Bento Grid */
  .alp3-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 560px) {
    .alp3-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .alp3-tile-wide,
    .alp3-question-card {
      grid-column: span 2;
    }
  }

  /* Bento Tiles */
  .alp3-tile {
    width: 100%;
    text-align: left;
    border-radius: 24px;
    padding: 20px;
    border: 1.5px solid rgba(36, 33, 30, 0.08);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    color: #24211e;
  }

  .alp3-tile:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(36, 33, 30, 0.06);
  }

  .alp3-tile.is-open {
    border-color: rgba(36, 33, 30, 0.22);
  }

  .alp3-tile-white {
    background-color: #ffffff;
  }

  .alp3-tile-matcha {
    background-color: #dfe8dc;
  }

  .alp3-tile-butter {
    background-color: #f8efd4;
  }

  .alp3-tile-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .alp3-tile-tag {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #5c564f;
  }

  .alp3-check {
    font-size: 0.68rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    background-color: rgba(36, 33, 30, 0.07);
    color: #4a453f;
  }

  .alp3-check.is-done {
    background-color: #24211e;
    color: #f7f5ef;
  }

  .alp3-photo-box {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    background-color: #ece9e0;
  }

  .alp3-photo {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }

  .alp3-tile-heading {
    margin: 0;
    font-size: 1.12rem;
    font-weight: 700;
    color: #24211e;
    line-height: 1.3;
  }

  .alp3-tile-hint {
    margin: 0;
    font-size: 0.86rem;
    line-height: 1.55;
    color: #6b645c;
  }

  .alp3-tile-body {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.65;
    color: #34302c;
  }

  .alp3-reason-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.88rem;
    line-height: 1.5;
    color: #24211e;
  }

  .alp3-reason-list li {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .alp3-reason-bullet {
    color: #3b5c42;
    font-weight: 700;
  }

  .alp3-promise-sign {
    display: block;
    margin-top: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #5c5138;
  }

  /* Widget 04: Locked / Unlocked Question Card */
  .alp3-question-card {
    border-radius: 24px;
    padding: clamp(24px, 5vw, 34px) 22px;
    text-align: center;
    transition: background-color 0.4s ease, color 0.4s ease;
  }

  .alp3-question-card.is-locked {
    background-color: rgba(36, 33, 30, 0.05);
    border: 1.5px dashed rgba(36, 33, 30, 0.2);
    color: #6b645c;
  }

  .alp3-question-card.is-unlocked {
    background-color: #24211e;
    color: #f7f5ef;
    box-shadow: 0 20px 48px rgba(36, 33, 30, 0.18);
  }

  .alp3-lock-icon {
    font-size: 1.45rem;
    display: block;
    margin-bottom: 8px;
  }

  .alp3-locked-title {
    margin: 0 0 4px;
    font-size: 0.96rem;
    font-weight: 700;
    color: #3a3530;
  }

  .alp3-locked-sub {
    margin: 0;
    font-size: 0.84rem;
    color: #6b645c;
  }

  .alp3-q-badge {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 999px;
    background-color: rgba(248, 239, 212, 0.14);
    color: #f8efd4;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    margin-bottom: 14px;
  }

  .alp3-q-text {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 6.5vw, 2.7rem);
    font-weight: 600;
    line-height: 1.15;
    color: #f7f5ef;
    margin: 0 0 26px;
  }

  .alp3-q-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .alp3-btn-yes {
    width: min(100%, 280px);
    padding: 14px 24px;
    border-radius: 999px;
    border: none;
    background-color: #f8efd4;
    color: #24211e;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
  }

  .alp3-btn-think {
    padding: 9px 18px;
    border-radius: 999px;
    border: 1px solid rgba(247, 245, 239, 0.22);
    background-color: transparent;
    color: #d6d0c7;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
  }

  /* Celebration Card */
  .alp3-celebration {
    background-color: #ffffff;
    border: 1.5px solid rgba(36, 33, 30, 0.1);
    border-radius: 28px;
    padding: clamp(32px, 6vw, 48px) clamp(22px, 5vw, 36px);
    text-align: center;
    box-shadow: 0 24px 60px rgba(36, 33, 30, 0.08);
  }

  .alp3-cel-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    background-color: #dfe8dc;
    color: #24402a;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin-bottom: 16px;
  }

  .alp3-cel-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.1rem, 7vw, 2.75rem);
    font-weight: 600;
    line-height: 1.12;
    color: #24211e;
    margin: 0 0 14px;
  }

  .alp3-cel-couple {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 999px;
    background-color: #f8efd4;
    color: #24211e;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 600;
    font-style: italic;
    margin-bottom: 18px;
  }

  .alp3-cel-msg {
    max-width: 420px;
    margin: 0 auto 26px;
    font-size: 0.96rem;
    line-height: 1.72;
    color: #524d47;
  }

  .alp3-cel-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    max-width: 380px;
    margin: 0 auto 24px;
  }

  .alp3-cel-pill {
    background-color: #f7f5ef;
    border-radius: 16px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .alp3-cel-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #787169;
  }

  .alp3-cel-val {
    font-size: 0.86rem;
    font-weight: 700;
    color: #24211e;
  }

  .alp3-cel-sign {
    margin: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.25rem;
    font-style: italic;
    color: #5c564f;
  }

  @media (prefers-reduced-motion: reduce) {
    .alp3-tile,
    .alp3-question-card {
      transition: none !important;
    }
  }
`;
