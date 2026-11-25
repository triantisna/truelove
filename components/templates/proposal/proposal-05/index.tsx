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

export default function Proposal05({ website }: { website: WebsiteRecord }) {
  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as ContentValue;
  const initialAccepted = isPublished && Boolean(savedResponse.accepted);

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

  const documentTitle = getString(
    content,
    'documentTitle',
    'Perjanjian Resmi Hati',
  );

  const exhibitPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.exhibitPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.exhibitPhoto, website.media]);

  const exhibitCaption = getString(
    content,
    'exhibitCaption',
    'Lampiran A — Bukti nyata betapa nyamannya kita saat bersama.',
  );

  const clauses = useMemo(() => {
    const raw = getString(
      content,
      'clausesList',
      'Pihak Pertama wajib menjadi tempat pulang yang aman dan pendengar yang sabar.\nTidak ada tidur dalam keadaan marahan tanpa saling mencari jalan tengah.\nSelalu menyisihkan waktu untuk kencan kecil di tengah kesibukan.',
    );
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [content]);

  const questionText = getString(
    content,
    'questionText',
    'Maukah kamu menandatangani perjanjian ini dan menjadi pasanganku?',
  );
  const yesButtonLabel = getString(
    content,
    'yesButtonLabel',
    'Tanda Tangani & Resmikan ✒️',
  );
  const closingNote = getString(
    content,
    'closingNote',
    website.message ||
      'Perjanjian ini berlaku mulai hari ini dan seterusnya. Terima kasih sudah memilih berjalan bersamaku.',
  );

  const [checkedClauses, setCheckedClauses] = useState<boolean[]>(() =>
    clauses.map(() => initialAccepted),
  );
  const [hasAccepted, setHasAccepted] = useState(initialAccepted);
  const [showStamped, setShowStamped] = useState(initialAccepted);
  const [stampAnimKey, setStampAnimKey] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(
    isPublished && typeof savedResponse.acceptedAt === 'string'
      ? savedResponse.acceptedAt
      : null,
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

  const allClausesChecked =
    clauses.length === 0 ||
    clauses.every((_, idx) => Boolean(checkedClauses[idx]));

  const toggleClause = (idx: number) => {
    if (!musicStarted) setMusicStarted(true);
    if (showStamped) return;
    setCheckedClauses((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleSignAndApprove = () => {
    if (!musicStarted) setMusicStarted(true);
    const nowIso = new Date().toISOString();

    setHasAccepted(true);
    setShowStamped(true);
    setStampAnimKey((k) => k + 1);
    setAcceptedAt((prev) => prev ?? nowIso);

    if (isPublished && !hasAccepted) {
      void saveWebsiteResponse(website.id, {
        accepted: true,
        acceptedAt: nowIso,
      });
    }
  };

  const handleReplayStamp = () => {
    setStampAnimKey((k) => k + 1);
  };

  return (
    <main className="oa5-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={musicStarted} />

      <article className="oa5-paper">
        <div className="oa5-border-inner">
          {/* 1. KOP DOKUMEN RESMI */}
          <header className="oa5-header">
            <div className="oa5-doc-meta">
              <span>DOC NO. TL-05</span>
              <span>{officialDate.toUpperCase()}</span>
            </div>

            <span className="oa5-kicker">OFFICIAL AGREEMENT</span>
            <h1 className="oa5-title">{documentTitle}</h1>

            <div className="oa5-parties">
              <div className="oa5-party-box">
                <span className="oa5-party-label">PIHAK PERTAMA</span>
                <strong className="oa5-party-name">{senderName}</strong>
              </div>
              <div className="oa5-party-amp" aria-hidden="true">
                &amp;
              </div>
              <div className="oa5-party-box">
                <span className="oa5-party-label">PIHAK KEDUA</span>
                <strong className="oa5-party-name">{receiverName}</strong>
              </div>
            </div>
          </header>

          {/* 2. LAMPIRAN BUKTI (EXHIBIT A) */}
          {exhibitPhoto && (
            <section className="oa5-exhibit">
              <div className="oa5-exhibit-tag">EXHIBIT A · LAMPIRAN BUKTI</div>
              <div className="oa5-photo-wrap">
                <div className="oa5-clip" aria-hidden="true" />
                <img
                  src={exhibitPhoto}
                  alt={exhibitCaption}
                  className="oa5-photo"
                />
              </div>
              <p className="oa5-caption">{exhibitCaption}</p>
            </section>
          )}

          {/* 3. PASAL-PASAL PERJANJIAN */}
          <section className="oa5-clauses">
            <div className="oa5-section-head">
              <span className="oa5-section-kicker">PASAL KOMITMEN</span>
              <span className="oa5-section-hint">
                {showStamped
                  ? 'Semua pasal disetujui ✓'
                  : 'Ketuk tiap pasal untuk menyetujui'}
              </span>
            </div>

            <div className="oa5-clause-list">
              {clauses.map((clause, idx) => {
                const isChecked = Boolean(checkedClauses[idx]);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleClause(idx)}
                    disabled={showStamped}
                    className={`oa5-clause-item ${isChecked ? 'is-checked' : ''}`}
                  >
                    <span className="oa5-checkbox" aria-hidden="true">
                      {isChecked ? '✓' : ''}
                    </span>
                    <div className="oa5-clause-content">
                      <span className="oa5-clause-num">PASAL 0{idx + 1}</span>
                      <p className="oa5-clause-text">{clause}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. KOLOM PENGESAHAN & STEMPEL SAH */}
          <footer className="oa5-approval">
            <div className="oa5-question-box">
              <span className="oa5-section-kicker">PENGESAHAN AKHIR</span>
              <h2 className="oa5-question">{questionText}</h2>
            </div>

            {/* Area Tanda Tangan */}
            <div className="oa5-signatures">
              <div className="oa5-sig-col">
                <span className="oa5-sig-script">{senderName}</span>
                <div className="oa5-sig-line" />
                <span className="oa5-sig-role">Pihak Pertama</span>
              </div>

              <div className="oa5-sig-col">
                <span
                  className={`oa5-sig-script ${showStamped ? 'is-signed' : 'is-pending'}`}
                >
                  {showStamped ? receiverName : '...'}
                </span>
                <div className="oa5-sig-line" />
                <span className="oa5-sig-role">Pihak Kedua</span>
              </div>
            </div>

            {/* Stempel Tinta SAH */}
            <AnimatePresence mode="wait">
              {showStamped ? (
                <motion.div
                  key={`stamped-${stampAnimKey}`}
                  className="oa5-stamped-area"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <motion.div
                    className="oa5-stamp"
                    initial={{ scale: 2.1, opacity: 0, rotate: -18 }}
                    animate={{ scale: 1, opacity: 1, rotate: -7 }}
                    transition={{
                      type: 'spring',
                      stiffness: 340,
                      damping: 20,
                    }}
                  >
                    <span className="oa5-stamp-main">SAH</span>
                    <span className="oa5-stamp-sub">OFFICIALLY TOGETHER</span>
                    <span className="oa5-stamp-date">{officialDate}</span>
                  </motion.div>

                  <p className="oa5-closing-note">“{closingNote}”</p>

                  <button
                    type="button"
                    className="oa5-replay-link"
                    onClick={handleReplayStamp}
                  >
                    ↺ Lihat ulang animasi stempel
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="action-btn"
                  className="oa5-action-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.button
                    type="button"
                    className={`oa5-btn-sign ${!allClausesChecked ? 'is-locked' : ''}`}
                    disabled={!allClausesChecked}
                    onClick={handleSignAndApprove}
                    whileHover={
                      allClausesChecked ? { scale: 1.015 } : undefined
                    }
                    whileTap={allClausesChecked ? { scale: 0.985 } : undefined}
                  >
                    {allClausesChecked
                      ? yesButtonLabel
                      : 'Setujui semua pasal di atas terlebih dahulu'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="oa5-colophon">
              TRUELOVE ARCHIVE · {senderName.toUpperCase()} &amp;{' '}
              {receiverName.toUpperCase()}
            </div>
          </footer>
        </div>
      </article>
    </main>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .oa5-root {
    min-height: 100svh;
    width: 100%;
    background-color: #ebe6db;
    background-image: radial-gradient(circle at 50% 0%, #f4f0e6 0%, #e4ded1 100%);
    color: #1e3a2f;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 14px 44px;
    -webkit-font-smoothing: antialiased;
  }

  .oa5-root * {
    box-sizing: border-box;
  }

  /* Document Sheet */
  .oa5-paper {
    width: min(100%, 540px);
    background-color: #faf8f3;
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 24px 60px rgba(30, 58, 47, 0.14), 0 2px 8px rgba(30, 58, 47, 0.06);
    border: 1px solid rgba(30, 58, 47, 0.14);
  }

  .oa5-border-inner {
    border: 1.5px solid rgba(184, 146, 74, 0.55);
    padding: clamp(22px, 5vw, 36px) clamp(18px, 4.5vw, 32px);
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* 1. Header */
  .oa5-header {
    text-align: center;
    border-bottom: 1px solid rgba(30, 58, 47, 0.15);
    padding-bottom: 24px;
  }

  .oa5-doc-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #6b7b73;
    margin-bottom: 18px;
  }

  .oa5-kicker {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #b8924a;
    margin-bottom: 8px;
  }

  .oa5-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.1rem, 7vw, 2.75rem);
    font-weight: 600;
    line-height: 1.08;
    color: #1e3a2f;
    margin: 0 0 22px;
  }

  .oa5-parties {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 10px;
    background-color: rgba(30, 58, 47, 0.04);
    border: 1px solid rgba(30, 58, 47, 0.1);
    padding: 14px 12px;
  }

  .oa5-party-box {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .oa5-party-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #6b7b73;
  }

  .oa5-party-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e3a2f;
  }

  .oa5-party-amp {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.4rem;
    font-style: italic;
    color: #b8924a;
  }

  /* 2. Exhibit Photo */
  .oa5-exhibit {
    text-align: center;
  }

  .oa5-exhibit-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: #6b7b73;
    margin-bottom: 12px;
  }

  .oa5-photo-wrap {
    position: relative;
    display: inline-block;
    width: min(100%, 340px);
    background-color: #ffffff;
    padding: 10px 10px 14px;
    border: 1px solid rgba(30, 58, 47, 0.14);
    box-shadow: 0 12px 26px rgba(30, 58, 47, 0.08);
  }

  .oa5-clip {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 34px;
    height: 16px;
    border: 2px solid #b8924a;
    border-radius: 999px;
    background-color: #faf8f3;
  }

  .oa5-photo {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .oa5-caption {
    margin: 12px auto 0;
    max-width: 360px;
    font-size: 0.84rem;
    font-style: italic;
    line-height: 1.55;
    color: #52635b;
  }

  /* 3. Clauses */
  .oa5-section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .oa5-section-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: #b8924a;
  }

  .oa5-section-hint {
    font-size: 0.74rem;
    font-weight: 500;
    color: #6b7b73;
  }

  .oa5-clause-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .oa5-clause-item {
    width: 100%;
    text-align: left;
    background-color: #ffffff;
    border: 1px solid rgba(30, 58, 47, 0.16);
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }

  .oa5-clause-item:hover:not(:disabled) {
    border-color: #1e3a2f;
  }

  .oa5-clause-item.is-checked {
    background-color: rgba(30, 58, 47, 0.04);
    border-color: #1e3a2f;
  }

  .oa5-clause-item:disabled {
    cursor: default;
  }

  .oa5-checkbox {
    width: 22px;
    height: 22px;
    border: 1.5px solid #1e3a2f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
    background-color: transparent;
    color: #faf8f3;
    transition: background-color 0.2s ease;
  }

  .oa5-clause-item.is-checked .oa5-checkbox {
    background-color: #1e3a2f;
  }

  .oa5-clause-content {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .oa5-clause-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: #b8924a;
  }

  .oa5-clause-text {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.58;
    color: #263830;
  }

  /* 4. Approval & Stamp */
  .oa5-approval {
    border-top: 1px solid rgba(30, 58, 47, 0.15);
    padding-top: 24px;
    text-align: center;
  }

  .oa5-question-box {
    margin-bottom: 24px;
  }

  .oa5-question {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.65rem, 5.5vw, 2.15rem);
    font-weight: 600;
    line-height: 1.2;
    color: #1e3a2f;
    margin: 8px 0 0;
  }

  .oa5-signatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 26px;
  }

  .oa5-sig-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .oa5-sig-script {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.65rem;
    font-style: italic;
    font-weight: 600;
    color: #1e3a2f;
    min-height: 36px;
    display: flex;
    align-items: flex-end;
  }

  .oa5-sig-script.is-pending {
    color: rgba(30, 58, 47, 0.25);
  }

  .oa5-sig-line {
    width: 100%;
    height: 1px;
    background-color: rgba(30, 58, 47, 0.35);
    margin: 6px 0;
  }

  .oa5-sig-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b7b73;
  }

  .oa5-action-wrap {
    margin-bottom: 10px;
  }

  .oa5-btn-sign {
    width: 100%;
    padding: 15px 22px;
    border: none;
    background-color: #1e3a2f;
    color: #faf8f3;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 12px 26px rgba(30, 58, 47, 0.2);
  }

  .oa5-btn-sign.is-locked {
    background-color: rgba(30, 58, 47, 0.12);
    color: #6b7b73;
    box-shadow: none;
    cursor: not-allowed;
    font-size: 0.82rem;
    font-weight: 600;
  }

  /* Stamped State */
  .oa5-stamped-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 8px 0 6px;
  }

  .oa5-stamp {
    border: 3px double #9b2c2c;
    color: #9b2c2c;
    padding: 10px 26px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    background-color: rgba(155, 44, 44, 0.04);
  }

  .oa5-stamp-main {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.55rem;
    font-weight: 700;
    letter-spacing: 0.24em;
    line-height: 1.1;
  }

  .oa5-stamp-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.16em;
  }

  .oa5-stamp-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    margin-top: 2px;
    opacity: 0.85;
  }

  .oa5-closing-note {
    margin: 0;
    max-width: 400px;
    font-size: 0.92rem;
    line-height: 1.7;
    color: #3c4f46;
  }

  .oa5-replay-link {
    background: transparent;
    border: none;
    color: #6b7b73;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .oa5-colophon {
    margin-top: 26px;
    padding-top: 14px;
    border-top: 1px dashed rgba(30, 58, 47, 0.2);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    color: #7c8a83;
  }
`;
