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

const TOTAL_CARDS = 5;

export default function Proposal04({ website }: { website: WebsiteRecord }) {
  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as ContentValue;
  const initialAccepted = isPublished && Boolean(savedResponse.accepted);

  const [cardIndex, setCardIndex] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
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

  const deckTitle = getString(content, 'deckTitle', 'The Final Card');
  const coverNote = getString(
    content,
    'coverNote',
    'Empat kartu untuk menceritakan perasaanku, dan satu kartu terakhir untuk bertanya padamu.',
  );

  const photoImage = useMemo(() => {
    const fromContent = getMediaUrl(content.photoImage);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.photoImage, website.media]);

  const photoTitle = getString(
    content,
    'photoTitle',
    'Salah Satu Momen Favoritku',
  );
  const photoCaption = getString(
    content,
    'photoCaption',
    'Setiap kali melihat momen ini, aku selalu ingat betapa mudahnya aku merasa nyaman di dekatmu.',
  );

  const feelingTitle = getString(
    content,
    'feelingTitle',
    'Apa yang Berubah Sejak Mengenalmu',
  );
  const feelingStory = getString(
    content,
    'feelingStory',
    website.message ||
      'Sejak kamu ada, aku selalu punya alasan kecil untuk menantikan esok hari.',
  );

  const promiseTitle = getString(
    content,
    'promiseTitle',
    'Sebelum Kartu Terakhir',
  );
  const promiseBody = getString(
    content,
    'promiseBody',
    'Aku berjanji akan selalu berusaha menjadi pendengar yang sabar, jujur dalam setiap langkah, dan memilihmu setiap hari.',
  );

  const questionText = getString(
    content,
    'questionText',
    'Maukah kamu menjadi pasanganku?',
  );
  const yesButtonLabel = getString(content, 'yesButtonLabel', 'Iya, Aku Mau!');

  const keepsakeTitle = getString(
    content,
    'keepsakeTitle',
    'Official Keepsake',
  );
  const keepsakeMessage = getString(
    content,
    'keepsakeMessage',
    'Terima kasih sudah memilih berjalan bersamaku. Simpan kartu ini sebagai awal cerita kita.',
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

  const dealNext = () => {
    if (!musicStarted) setMusicStarted(true);
    if (cardIndex < TOTAL_CARDS - 1) {
      setCardIndex((prev) => prev + 1);
    }
  };

  const resetDeck = () => {
    setCardIndex(0);
  };

  const handleAccept = () => {
    if (!musicStarted) setMusicStarted(true);
    const nowIso = new Date().toISOString();

    setHasAccepted(true);
    setShowCelebration(true);
    setAcceptedAt(nowIso);

    if (isPublished) {
      void saveWebsiteResponse(website.id, {
        accepted: true,
        acceptedAt: nowIso,
      });
    }
  };

  const remainingUnder = Math.max(0, TOTAL_CARDS - 1 - cardIndex);

  return (
    <main className="tfc4-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={musicStarted} />

      <div className="tfc4-wrap">
        {/* Top Deck Indicator */}
        <header className="tfc4-header">
          <span className="tfc4-brand">
            {senderName} → {receiverName}
          </span>
          <span className="tfc4-counter">
            {showCelebration
              ? 'KEEPSAKE SAVED'
              : `CARD 0${cardIndex + 1} / 0${TOTAL_CARDS}`}
          </span>
        </header>

        {/* Stacked Card Stage */}
        <section className="tfc4-stage">
          {/* Decorative underlying cards for physical deck depth */}
          {!showCelebration && remainingUnder >= 2 && (
            <div className="tfc4-under-card tfc4-under-2" aria-hidden="true" />
          )}
          {!showCelebration && remainingUnder >= 1 && (
            <div
              className={`tfc4-under-card tfc4-under-1 ${
                remainingUnder === 1 ? 'is-burgundy-peek' : ''
              }`}
              aria-hidden="true"
            />
          )}

          <AnimatePresence mode="wait">
            {showCelebration ? (
              /* --- OFFICIAL KEEPSAKE CARD --- */
              <motion.article
                key="keepsake"
                className="tfc4-card tfc4-card-burgundy"
                initial={{ opacity: 0, rotateY: -90, scale: 0.94 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tfc4-card-inner tfc4-inner-gold">
                  <div className="tfc4-card-top">
                    <span>{keepsakeTitle}</span>
                    <span>✦</span>
                  </div>

                  <div className="tfc4-card-center">
                    <span className="tfc4-gold-kicker">OFFICIALLY YOURS</span>
                    <h1 className="tfc4-serif-white">
                      {senderName} &amp; {receiverName}
                    </h1>
                    <div className="tfc4-gold-divider" aria-hidden="true" />
                    <p className="tfc4-burgundy-body">{keepsakeMessage}</p>
                  </div>

                  <div className="tfc4-keepsake-foot">
                    <span className="tfc4-date-kicker">TANGGAL RESMI</span>
                    <strong className="tfc4-date-val">{officialDate}</strong>
                  </div>
                  <button
                    type="button"
                    className="tfc4-btn-replay"
                    onClick={() => {
                      setShowCelebration(false);
                      setCardIndex(0);
                    }}
                  >
                    ↺ Lihat ulang tumpukan kartu
                  </button>
                </div>
              </motion.article>
            ) : cardIndex === 0 ? (
              /* --- CARD 01: COVER CARD --- */
              <motion.article
                key="card-0"
                className="tfc4-card tfc4-card-ivory"
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 110, rotate: 9 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tfc4-card-inner">
                  <div className="tfc4-card-top">
                    <span>CARD 01 / 05</span>
                    <span>FOR {receiverName.toUpperCase()}</span>
                  </div>

                  <div className="tfc4-card-center">
                    <span className="tfc4-kicker">A SMALL DECK FOR YOU</span>
                    <h1 className="tfc4-serif-xl">{deckTitle}</h1>
                    <div className="tfc4-divider" aria-hidden="true" />
                    <p className="tfc4-body">{coverNote}</p>
                  </div>

                  <motion.button
                    type="button"
                    className="tfc4-btn-dark"
                    onClick={dealNext}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Tarik Kartu Pertama →
                  </motion.button>
                </div>
              </motion.article>
            ) : cardIndex === 1 ? (
              /* --- CARD 02: PHOTO CARD --- */
              <motion.article
                key="card-1"
                className="tfc4-card tfc4-card-ivory"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -110, rotate: -9 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tfc4-card-inner">
                  <div className="tfc4-card-top">
                    <span>CARD 02 / 05</span>
                    <span>THE MOMENT</span>
                  </div>

                  <div className="tfc4-card-center">
                    {photoImage && (
                      <div className="tfc4-photo-frame">
                        <img
                          src={photoImage}
                          alt={photoTitle}
                          className="tfc4-photo"
                        />
                      </div>
                    )}
                    <h2 className="tfc4-serif-md">{photoTitle}</h2>
                    <p className="tfc4-body">{photoCaption}</p>
                  </div>

                  <motion.button
                    type="button"
                    className="tfc4-btn-dark"
                    onClick={dealNext}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Kartu Berikutnya →
                  </motion.button>
                </div>
              </motion.article>
            ) : cardIndex === 2 ? (
              /* --- CARD 03: FEELING CARD --- */
              <motion.article
                key="card-2"
                className="tfc4-card tfc4-card-ivory"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 110, rotate: 8 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tfc4-card-inner">
                  <div className="tfc4-card-top">
                    <span>CARD 03 / 05</span>
                    <span>THE FEELING</span>
                  </div>

                  <div className="tfc4-card-center">
                    <span className="tfc4-kicker">SINCE MEETING YOU</span>
                    <h2 className="tfc4-serif-md">{feelingTitle}</h2>
                    <div className="tfc4-divider" aria-hidden="true" />
                    <p className="tfc4-body">{feelingStory}</p>
                  </div>

                  <motion.button
                    type="button"
                    className="tfc4-btn-dark"
                    onClick={dealNext}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Kartu Berikutnya →
                  </motion.button>
                </div>
              </motion.article>
            ) : cardIndex === 3 ? (
              /* --- CARD 04: PROMISE CARD --- */
              <motion.article
                key="card-3"
                className="tfc4-card tfc4-card-ivory"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -110, rotate: -8 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tfc4-card-inner">
                  <div className="tfc4-card-top">
                    <span>CARD 04 / 05</span>
                    <span>THE PROMISE</span>
                  </div>

                  <div className="tfc4-card-center">
                    <span className="tfc4-kicker">ONE MORE CARD LEFT</span>
                    <h2 className="tfc4-serif-md">{promiseTitle}</h2>
                    <blockquote className="tfc4-quote">
                      “{promiseBody}”
                    </blockquote>
                    <span className="tfc4-sign">— {senderName}</span>
                  </div>

                  <motion.button
                    type="button"
                    className="tfc4-btn-burgundy"
                    onClick={dealNext}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Buka Kartu Terakhir →
                  </motion.button>
                </div>
              </motion.article>
            ) : (
              /* --- CARD 05: THE FINAL CARD (DEEP BURGUNDY) --- */
              <motion.article
                key="card-4"
                className="tfc4-card tfc4-card-burgundy"
                initial={{ opacity: 0, y: 18, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tfc4-card-inner tfc4-inner-gold">
                  <div className="tfc4-card-top">
                    <span>CARD 05 / 05</span>
                    <span>THE FINAL CARD</span>
                  </div>

                  <div className="tfc4-card-center">
                    <span className="tfc4-gold-kicker">
                      FOR {receiverName.toUpperCase()}
                    </span>
                    <h2 className="tfc4-question">{questionText}</h2>
                  </div>

                  <div className="tfc4-final-actions">
                    {hasAccepted ? (
                      <motion.button
                        type="button"
                        className="tfc4-btn-gold"
                        onClick={() => setShowCelebration(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ✓ Sudah Dijawab Iya · Lihat Keepsake →
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          type="button"
                          className="tfc4-btn-gold"
                          onClick={handleAccept}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {yesButtonLabel}
                        </motion.button>

                        <button
                          type="button"
                          className="tfc4-btn-replay"
                          onClick={resetDeck}
                        >
                          Boleh lihat kartu sebelumnya lagi? 😅
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .tfc4-root {
    min-height: 100svh;
    width: 100%;
    background-color: #f2ede4;
    background-image: radial-gradient(circle at 50% 25%, #f9f6f0 0%, #ede6da 100%);
    color: #241e1d;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 18px 28px;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .tfc4-root * {
    box-sizing: border-box;
  }

  .tfc4-wrap {
    width: min(100%, 420px);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* Header */
  .tfc4-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6e635c;
  }

  .tfc4-counter {
    color: #7a2033;
  }

  /* Stage */
  .tfc4-stage {
    position: relative;
    min-height: 520px;
    display: flex;
    align-items: stretch;
  }

  /* Underlying Deck Cards */
  .tfc4-under-card {
    position: absolute;
    inset: 0;
    border-radius: 22px;
    background-color: #faf8f4;
    border: 1px solid rgba(36, 30, 29, 0.1);
    box-shadow: 0 14px 32px rgba(36, 30, 29, 0.07);
    pointer-events: none;
  }

  .tfc4-under-1 {
    transform: rotate(2.2deg) translate(5px, 6px);
    z-index: 1;
  }

  .tfc4-under-1.is-burgundy-peek {
    background-color: #7a2033;
    border-color: rgba(197, 155, 95, 0.4);
  }

  .tfc4-under-2 {
    transform: rotate(-2.4deg) translate(-5px, 11px);
    background-color: #f3eee5;
    z-index: 0;
  }

  /* Active Card */
  .tfc4-card {
    position: relative;
    z-index: 3;
    width: 100%;
    min-height: 520px;
    border-radius: 22px;
    padding: 12px;
    display: flex;
    box-shadow: 0 24px 54px rgba(36, 30, 29, 0.14);
  }

  .tfc4-card-ivory {
    background-color: #ffffff;
    border: 1px solid rgba(36, 30, 29, 0.1);
    color: #241e1d;
  }

  .tfc4-card-burgundy {
    background-color: #7a2033;
    border: 1px solid rgba(197, 155, 95, 0.45);
    color: #fbf8f3;
    box-shadow: 0 26px 60px rgba(122, 32, 51, 0.3);
  }

  .tfc4-card-inner {
    flex: 1;
    border-radius: 14px;
    border: 1px solid rgba(197, 155, 95, 0.35);
    padding: 22px 22px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
  }

  .tfc4-inner-gold {
    border-color: rgba(197, 155, 95, 0.5);
  }

  .tfc4-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: #9e8150;
  }

  .tfc4-card-burgundy .tfc4-card-top {
    color: #e3c48e;
  }

  .tfc4-card-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .tfc4-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #7a2033;
    margin-bottom: 10px;
  }

  .tfc4-gold-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #e3c48e;
    margin-bottom: 12px;
  }

  .tfc4-serif-xl {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.35rem, 8vw, 2.9rem);
    font-weight: 600;
    line-height: 1.08;
    color: #241e1d;
    margin: 0 0 16px;
  }

  .tfc4-serif-md {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.7rem, 6vw, 2.1rem);
    font-weight: 600;
    line-height: 1.18;
    color: #241e1d;
    margin: 0 0 12px;
  }

  .tfc4-serif-white {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.05rem, 7vw, 2.6rem);
    font-weight: 600;
    font-style: italic;
    line-height: 1.12;
    color: #fbf8f3;
    margin: 0 0 16px;
  }

  .tfc4-question {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.15rem, 7.5vw, 2.75rem);
    font-weight: 600;
    line-height: 1.14;
    color: #fbf8f3;
    margin: 0;
  }

  .tfc4-divider {
    width: 36px;
    height: 1.5px;
    background-color: #c59b5f;
    margin: 0 auto 16px;
  }

  .tfc4-gold-divider {
    width: 40px;
    height: 1.5px;
    background-color: #e3c48e;
    margin: 0 auto 16px;
  }

  .tfc4-body {
    margin: 0;
    font-size: 0.94rem;
    line-height: 1.72;
    color: #544b46;
  }

  .tfc4-burgundy-body {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.72;
    color: rgba(251, 248, 243, 0.88);
  }

  .tfc4-quote {
    margin: 4px 0 14px;
    padding: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.28rem;
    font-style: italic;
    line-height: 1.6;
    color: #2f2725;
  }

  .tfc4-sign {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    color: #7a2033;
  }

  /* Photo Frame */
  .tfc4-photo-frame {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid rgba(36, 30, 29, 0.08);
    background-color: #efeae0;
  }

  .tfc4-photo {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  /* Buttons */
  .tfc4-btn-dark {
    width: 100%;
    padding: 13px 18px;
    border-radius: 12px;
    border: none;
    background-color: #241e1d;
    color: #fbf8f3;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .tfc4-btn-burgundy {
    width: 100%;
    padding: 13px 18px;
    border-radius: 12px;
    border: none;
    background-color: #7a2033;
    color: #fbf8f3;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .tfc4-final-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tfc4-btn-gold {
    width: 100%;
    padding: 14px 20px;
    border-radius: 12px;
    border: none;
    background-color: #e3c48e;
    color: #4a101d;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.94rem;
    font-weight: 700;
    cursor: pointer;
  }

  .tfc4-btn-replay {
    width: 100%;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid rgba(251, 248, 243, 0.25);
    background-color: transparent;
    color: #f3dfd5;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
  }

  /* Keepsake Footer */
  .tfc4-keepsake-foot {
    padding-top: 14px;
    border-top: 1px dashed rgba(227, 196, 142, 0.4);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tfc4-date-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.16em;
    color: #e3c48e;
  }

  .tfc4-date-val {
    font-size: 0.9rem;
    font-weight: 600;
    color: #fbf8f3;
  }
`;
