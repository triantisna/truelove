'use client';

import {
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import FloatingMusicPlayer from '@/components/motion/FloatingMusicPlayer';
import type { WebsiteRecord } from '@/types/website';

/* ------------------------------------------------------------------ */
/* Safe helpers: tidak pernah crash walau field kosong / bentuk beda   */
/* ------------------------------------------------------------------ */
type Json = Record<string, unknown>;

function asRecord(value: unknown): Json {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Json)
    : {};
}

function getString(source: unknown, key: string, fallback = ''): string {
  const value = asRecord(source)[key];
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function urlFromItem(item: unknown): string {
  if (typeof item === 'string') return item.trim();
  const record = asRecord(item);
  for (const key of ['url', 'src', 'publicUrl', 'secure_url', 'href']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function toList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function getMediaList(
  source: unknown,
  key: string,
  fallback?: unknown,
): string[] {
  const list = toList(asRecord(source)[key]).map(urlFromItem).filter(Boolean);
  if (list.length) return list;
  return toList(fallback).map(urlFromItem).filter(Boolean);
}

function getMediaUrl(source: unknown, key: string, fallback?: unknown): string {
  return getMediaList(source, key, fallback)[0] ?? '';
}

const pad = (n: number) => String(n).padStart(2, '0');
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TAGLINE =
  'Peace isn’t won by being right; it’s built by choosing you over my pride.';

const splitParagraphs = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/* ------------------------------------------------------------------ */
/* Sub-komponen                                                         */
/* ------------------------------------------------------------------ */
const LEAF_POINTS: [number, number][] = [
  [33.6, 68.4],
  [46, 56],
  [58.4, 43.6],
  [69.6, 32.4],
];

function Olive({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 84C38 70 58 52 82 20" />
      {LEAF_POINTS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x + 9} cy={y} rx="9" ry="3.4" />
          <ellipse cx={x} cy={y - 9} rx="3.4" ry="9" />
        </g>
      ))}
      <ellipse cx="88" cy="14" rx="8" ry="3" transform="rotate(-45 88 14)" />
      <ellipse cx="27" cy="62" rx="3.4" ry="4.8" fill="currentColor" />
      <ellipse cx="22" cy="72" rx="3.2" ry="4.4" fill="currentColor" />
    </svg>
  );
}

function WaxSeal() {
  return (
    <span className="ob7-wax" aria-hidden="true">
      <span className="ob7-wax-ring" />
      <Olive className="ob7-wax-mark" />
    </span>
  );
}

function Section({
  n,
  kicker,
  title,
  note,
  reduce,
  children,
}: {
  n: number;
  kicker: string;
  title: string;
  note?: string;
  reduce: boolean;
  children: ReactNode;
}) {
  return (
    <motion.section
      className="ob7-sec"
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <header className="ob7-sec-head">
        <span className="ob7-label">
          {pad(n)} · {kicker}
        </span>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </header>
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Komponen utama                                                       */
/* ------------------------------------------------------------------ */
export default function Apology07({ website }: { website: WebsiteRecord }) {
  const reduce = !!useReducedMotion();

  const w = website as unknown as Json;
  const content = asRecord(w.content);
  const text = (key: string, fallback = '') =>
    getString(content, key, fallback);

  const senderName = text(
    'senderName',
    getString(w, 'senderName', 'Seseorang'),
  );
  const receiverName = text(
    'receiverName',
    getString(w, 'receiverName', 'Kamu'),
  );
  const writtenDate = text('writtenDate');
  const openingLine = text(
    'openingLine',
    'Tidak ada yang perlu dijawab hari ini. Baca saja, pelan-pelan.',
  );
  const signature = text('signature', senderName);
  const closingNote = text('closingNote');

  const letterBody = text('letterBody', getString(w, 'message'));
  const paragraphs = splitParagraphs(letterBody);

  const tabs = [
    {
      num: '01',
      label: 'Yang Terucap',
      prompt: 'Sikap dan kata-kataku yang menyakitimu',
      body: text('ledgerSaid'),
    },
    {
      num: '02',
      label: 'Yang Kusesali',
      prompt: 'Kesadaran penuh, tanpa kata “tapi”',
      body: text('ledgerRegret'),
    },
    {
      num: '03',
      label: 'Yang Kamu Layak Dapat',
      prompt: 'Perlakuan yang seharusnya kuberikan padamu',
      body: text('ledgerDeserve'),
    },
  ].filter((t) => t.body);

  const commits = [1, 2, 3, 4]
    .map((i) => ({
      title: text(`commit${i}Title`),
      detail: text(`commit${i}Detail`),
    }))
    .filter((c) => c.title || c.detail);

  const fallbackMedia = Array.isArray(w.media) ? (w.media as unknown[]) : [];
  const mainSrc = getMediaUrl(content, 'mainPhoto', fallbackMedia[0]);
  const gallerySrc = getMediaList(
    content,
    'galleryPhotos',
    fallbackMedia.slice(1),
  );
  const captionLines = text('galleryCaptions')
    .split('\n')
    .map((c) => c.trim());
  const photos: { src: string; caption: string }[] = [
    ...(mainSrc ? [{ src: mainSrc, caption: text('mainPhotoCaption') }] : []),
    ...gallerySrc.map((src, i) => ({ src, caption: captionLines[i] ?? '' })),
  ];
  const galleryOffset = mainSrc ? 1 : 0;

  const musicUrl =
    getMediaUrl(content, 'backgroundMusic') || getString(w, 'musicUrl');

  /* ---------- state ---------- */
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'open'>('sealed');
  const opened = phase !== 'sealed';
  const [tab, setTab] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const [lightIdx, setLightIdx] = useState<number | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);

  const activeTab = Math.min(tab, Math.max(tabs.length - 1, 0));

  useEffect(() => {
    if (phase !== 'opening') return;
    const timer = setTimeout(
      () => {
        window.scrollTo(0, 0);
        setPhase('open');
      },
      reduce ? 250 : 2000,
    );
    return () => clearTimeout(timer);
  }, [phase, reduce]);

  useEffect(() => {
    if (lightIdx === null) return;
    const total = photos.length;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightIdx(null);
      else if (event.key === 'ArrowRight')
        setLightIdx((i) => (i === null ? i : (i + 1) % total));
      else if (event.key === 'ArrowLeft')
        setLightIdx((i) => (i === null ? i : (i - 1 + total) % total));
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [lightIdx, photos.length]);

  const breakSeal = () => {
    if (phase === 'sealed') setPhase('opening');
  };
  const toggleCommit = (i: number) =>
    setChecked((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i],
    );
  const step = (dir: 1 | -1) =>
    setLightIdx((i) =>
      i === null ? i : (i + dir + photos.length) % photos.length,
    );

  const onTabKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const dir = event.key === 'ArrowRight' ? 1 : -1;
    const next = (activeTab + dir + tabs.length) % tabs.length;
    setTab(next);
    document.getElementById(`ob7-tab-${next}`)?.focus();
  };

  const lit = photos[lightIdx ?? 0];
  const opening = phase === 'opening';
  const currentTab = tabs[activeTab];
  const progress = commits.length ? (checked.length / commits.length) * 100 : 0;

  return (
    <div className="ob7">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      <div className="ob7-sun" aria-hidden="true" />

      {/* ================= 01 — THE EMERALD SEAL ================= */}
      <AnimatePresence>
        {phase !== 'open' && (
          <motion.section
            key="cover"
            className="ob7-open"
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.9, ease: 'easeInOut' }}
          >
            <div className="ob7-stage">
              <motion.div
                className="ob7-cover"
                initial={false}
                animate={
                  opening
                    ? {
                        rotateX: reduce ? 0 : -84,
                        y: reduce ? 0 : -24,
                        opacity: 0,
                      }
                    : { rotateX: 0, y: 0, opacity: 1 }
                }
                transition={{
                  duration: reduce ? 0.2 : 1.2,
                  ease: EASE,
                  delay: opening && !reduce ? 0.6 : 0,
                }}
              >
                <p className="ob7-label ob7-cover-top">Sepucuk surat untuk</p>
                <div className="ob7-cover-text">
                  <h1 className="ob7-recipient">{receiverName}</h1>
                  <p className="ob7-cover-line">{openingLine}</p>
                </div>
                <motion.div
                  className="ob7-seal-wrap"
                  initial={false}
                  animate={
                    opening
                      ? {
                          y: reduce ? 0 : -26,
                          scale: reduce ? 1 : 1.12,
                          opacity: 0,
                        }
                      : { y: 0, scale: 1, opacity: 1 }
                  }
                  transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE }}
                >
                  <WaxSeal />
                </motion.div>
              </motion.div>
            </div>

            <motion.button
              type="button"
              className="ob7-cta"
              onClick={breakSeal}
              disabled={phase !== 'sealed'}
              initial={false}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              Buka Segel &amp; Baca Pelan-Pelan
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= KONTEN UTAMA ================= */}
      {phase === 'open' && (
        <motion.main
          className="ob7-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="ob7-wrap">
            {/* ---------- 02 — THE HONEST LEDGER ---------- */}
            {tabs.length > 0 && currentTab && (
              <Section
                n={2}
                reduce={reduce}
                kicker="The Honest Ledger"
                title="Catatan yang jujur"
                note="Tiga halaman refleksi. Pilih satu per satu."
              >
                <div className="ob7-narrow">
                  <div
                    className="ob7-tabs"
                    role="tablist"
                    aria-label="Halaman refleksi"
                    onKeyDown={onTabKey}
                  >
                    {tabs.map((t, i) => {
                      const isActive = i === activeTab;
                      return (
                        <button
                          key={t.num}
                          id={`ob7-tab-${i}`}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-controls="ob7-tabpanel"
                          tabIndex={isActive ? 0 : -1}
                          className={`ob7-tab ${isActive ? 'is-active' : ''}`}
                          onClick={() => setTab(i)}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="ob7-tab-bg"
                              className="ob7-tab-bg"
                              transition={{
                                duration: reduce ? 0 : 0.45,
                                ease: EASE,
                              }}
                            />
                          )}
                          <span className="ob7-tab-num">{t.num}</span>
                          <span className="ob7-tab-label">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className="ob7-panel ob7-dbl"
                    id="ob7-tabpanel"
                    role="tabpanel"
                    aria-labelledby={`ob7-tab-${activeTab}`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                        transition={{
                          duration: reduce ? 0.1 : 0.4,
                          ease: EASE,
                        }}
                      >
                        <p className="ob7-panel-prompt">{currentTab.prompt}</p>
                        <div className="ob7-prose">
                          {splitParagraphs(currentTab.body).map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </Section>
            )}

            {/* ---------- 03 — THE MONOGRAPH LETTER ---------- */}
            <Section
              n={3}
              reduce={reduce}
              kicker="The Monograph Letter"
              title="Surat untukmu"
            >
              <article className="ob7-sheet ob7-dbl">
                <Olive className="ob7-sheet-mark" />
                {writtenDate && (
                  <p className="ob7-label ob7-sheet-date">{writtenDate}</p>
                )}
                <p className="ob7-greeting">Untuk {receiverName},</p>
                <div className="ob7-prose ob7-letter">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p>Surat ini sedang menunggu kata-kata pertamamu.</p>
                  )}
                </div>
              </article>
            </Section>

            {/* ---------- 04 — REBUILDING TRUST ---------- */}
            {commits.length > 0 && (
              <Section
                n={4}
                reduce={reduce}
                kicker="Rebuilding Trust"
                title="Membangun kembali, pelan-pelan"
                note="Tandai setiap langkah sesuai ritmemu sendiri. Tidak ada urutan, tidak ada tenggat."
              >
                <div className="ob7-narrow">
                  <ul className="ob7-commits">
                    {commits.map((c, i) => {
                      const isOn = checked.includes(i);
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            className={`ob7-commit ${isOn ? 'is-on' : ''}`}
                            aria-pressed={isOn}
                            onClick={() => toggleCommit(i)}
                          >
                            <span className="ob7-check" aria-hidden="true">
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            </span>
                            <span className="ob7-commit-text">
                              {c.title && (
                                <span className="ob7-commit-title">
                                  {c.title}
                                </span>
                              )}
                              {c.detail && (
                                <span className="ob7-commit-detail">
                                  {c.detail}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="ob7-progress" aria-live="polite">
                    <div className="ob7-progress-bar" aria-hidden="true">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <p className="ob7-label">
                      {checked.length} dari {commits.length} langkah ditandai
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {/* ---------- 05 — KEEPSAKE GALLERY ---------- */}
            {photos.length > 0 && (
              <Section
                n={5}
                reduce={reduce}
                kicker="Keepsake Gallery"
                title="Kenang-kenangan"
                note="Ketuk foto untuk melihatnya lebih besar."
              >
                {mainSrc && (
                  <button
                    type="button"
                    className="ob7-mat ob7-mat-main"
                    onClick={() => setLightIdx(0)}
                    aria-label="Perbesar foto utama"
                  >
                    <img
                      src={mainSrc}
                      alt={photos[0].caption || 'Foto utama'}
                      loading="lazy"
                    />
                    {photos[0].caption && (
                      <span className="ob7-cap">{photos[0].caption}</span>
                    )}
                  </button>
                )}
                {gallerySrc.length > 0 && (
                  <div className="ob7-gallery">
                    {gallerySrc.map((src, i) => (
                      <button
                        type="button"
                        key={`${src}-${i}`}
                        className="ob7-mat"
                        onClick={() => setLightIdx(i + galleryOffset)}
                        aria-label={`Perbesar foto kenangan ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt={
                            photos[i + galleryOffset].caption ||
                            `Foto kenangan ${i + 1}`
                          }
                          loading="lazy"
                        />
                        {photos[i + galleryOffset].caption && (
                          <span className="ob7-cap">
                            {photos[i + galleryOffset].caption}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* ---------- 06 — THE OPEN DOOR ---------- */}
            <Section
              n={6}
              reduce={reduce}
              kicker="The Open Door"
              title="Pintu yang terbuka"
            >
              <div className="ob7-sign">
                <p className="ob7-closing">Dengan tulus,</p>
                <p className="ob7-signature">{signature}</p>

                {closingNote && (
                  <div className="ob7-door">
                    <div className="ob7-fold">
                      <div
                        className="ob7-fold-inside ob7-dbl"
                        style={{ visibility: noteOpen ? 'visible' : 'hidden' }}
                      >
                        <p className="ob7-label">Catatan terakhir</p>
                        <p className="ob7-fold-note">{closingNote}</p>
                      </div>
                      <motion.div
                        className="ob7-fold-cover"
                        initial={false}
                        animate={{
                          rotateY: noteOpen ? (reduce ? 0 : -102) : 0,
                          opacity: noteOpen && reduce ? 0 : 1,
                        }}
                        transition={{
                          duration: reduce ? 0.1 : 1.1,
                          ease: EASE,
                        }}
                        aria-hidden={noteOpen}
                      >
                        <Olive className="ob7-fold-mark" />
                        <span className="ob7-fold-title">Catatan terakhir</span>
                        <span className="ob7-fold-sub">
                          dibuka kapan pun kamu siap
                        </span>
                      </motion.div>
                    </div>
                    <button
                      type="button"
                      className="ob7-cta ob7-cta-outline"
                      aria-expanded={noteOpen}
                      onClick={() => setNoteOpen((v) => !v)}
                    >
                      {noteOpen ? 'Tutup Catatan' : 'Buka Catatan Terakhir'}
                    </button>
                  </div>
                )}
              </div>
            </Section>

            <footer className="ob7-end">
              <Olive className="ob7-end-mark" />
              <p>{TAGLINE}</p>
            </footer>
          </div>
        </motion.main>
      )}

      {/* ================= LIGHTBOX ================= */}
      <AnimatePresence>
        {lightIdx !== null && lit && (
          <motion.div
            className="ob7-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau foto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightIdx(null)}
          >
            <button
              type="button"
              className="ob7-lb-btn ob7-lb-close"
              onClick={() => setLightIdx(null)}
              aria-label="Tutup"
            >
              ×
            </button>
            <motion.figure
              key={lightIdx}
              className="ob7-lb-figure"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lit.src} alt={lit.caption || 'Foto'} />
              {lit.caption && <figcaption>{lit.caption}</figcaption>}
              <span className="ob7-lb-count">
                {pad((lightIdx ?? 0) + 1)} / {pad(photos.length)}
              </span>
            </motion.figure>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="ob7-lb-btn ob7-lb-prev"
                  aria-label="Foto sebelumnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="ob7-lb-btn ob7-lb-next"
                  aria-label="Foto berikutnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                >
                  ›
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CSS lokal (scoped di bawah .ob7)                                     */
/* ------------------------------------------------------------------ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

.ob7{
  --travertine:#f4f0e8; --linen:#fbf9f5; --emerald:#1d352a; --emerald-deep:#14261d;
  --gold:#b08d57; --gold-soft:#e5cf9f; --ink:#232220; --gray:#68635b;
  --serif:'Cormorant Garamond',Georgia,'Times New Roman',serif;
  --body:'Newsreader',Georgia,'Times New Roman',serif;
  --sans:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  --grain:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .28 0 0 0 .16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  position:relative; min-height:100vh; min-height:100svh; width:100%;
  background:var(--grain),linear-gradient(170deg,var(--linen),var(--travertine));
  color:var(--ink); font-family:var(--body); overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.ob7 *,.ob7 *::before,.ob7 *::after{box-sizing:border-box}
.ob7 h1,.ob7 h2,.ob7 h3,.ob7 p,.ob7 ul,.ob7 ol,.ob7 figure{margin:0;padding:0}
.ob7 ul,.ob7 ol{list-style:none}
.ob7 button{font:inherit;color:var(--ink);cursor:pointer;-webkit-tap-highlight-color:transparent}
.ob7 button:focus-visible{outline:2px solid var(--emerald);outline-offset:3px}
.ob7 img{display:block;max-width:100%}
.ob7-label{font-family:var(--sans);font-weight:500;font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
.ob7-dbl{position:relative;border:1px solid var(--gold)}
.ob7-dbl::after{content:'';position:absolute;inset:6px;border:1px solid rgba(176,141,87,.42);pointer-events:none}

.ob7-sun{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 60% 45% at 14% 0%,rgba(255,236,196,.6),transparent 70%),radial-gradient(ellipse 45% 35% at 100% 12%,rgba(255,244,222,.5),transparent 70%)}

/* ---------- 01 cover ---------- */
.ob7-open{
  position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:28px;padding:24px 18px;overflow-y:auto;
  background:var(--grain),linear-gradient(170deg,var(--linen),var(--travertine));
}
.ob7-stage{perspective:1500px;width:min(430px,100%);flex:none}
.ob7-cover{
  position:relative;transform-origin:top center;display:flex;flex-direction:column;align-items:center;text-align:center;
  min-height:min(540px,66vh);min-height:min(540px,66svh);padding:46px 34px 36px;
  background:linear-gradient(160deg,#fefcf9,#f6f1e7);
  box-shadow:0 1px 0 #e9e2d3,0 2px 0 #fbf9f5,0 3px 0 #e6dfd0,0 34px 60px -30px rgba(40,34,24,.5);
}
.ob7-cover::before{content:'';position:absolute;inset:14px;border:1px solid var(--gold);pointer-events:none}
.ob7-cover::after{content:'';position:absolute;inset:20px;border:1px solid rgba(176,141,87,.45);pointer-events:none}
.ob7-cover-top{margin-top:4px}
.ob7-cover-text{margin:auto 0}
.ob7-recipient{font-family:var(--serif);font-weight:500;font-size:clamp(2.9rem,13vw,4.4rem);line-height:1;letter-spacing:-.01em;margin-bottom:16px;color:var(--ink);overflow-wrap:anywhere}
.ob7-cover-line{font-family:var(--body);font-style:italic;font-size:1.05rem;line-height:1.55;color:var(--gray);max-width:290px;margin:0 auto}
.ob7-seal-wrap{padding-top:18px}
.ob7-wax{
  position:relative;display:grid;place-items:center;width:84px;height:84px;
  border-radius:52% 48% 55% 45% / 48% 55% 45% 52%;
  background:radial-gradient(circle at 34% 28%,#35604a,var(--emerald) 58%,#10211a);
  box-shadow:0 12px 20px -6px rgba(16,33,26,.55),inset 0 2px 3px rgba(255,255,255,.18),inset 0 -4px 6px rgba(0,0,0,.35);
}
.ob7-wax-ring{position:absolute;inset:9px;border-radius:50%;border:1px solid rgba(229,207,159,.7)}
.ob7-wax-mark{width:40px;height:40px;color:var(--gold-soft)}

.ob7-cta{
  appearance:none;padding:15px 30px;border-radius:2px;border:1px solid var(--gold);
  background:var(--emerald);color:#f4ecd8;font-family:var(--sans);font-weight:500;font-size:.78rem;
  letter-spacing:.16em;text-transform:uppercase;transition:background .35s,transform .35s,box-shadow .35s;
  box-shadow:0 14px 28px -14px rgba(29,53,42,.8);
}
.ob7-cta:hover:not(:disabled){background:var(--emerald-deep);transform:translateY(-2px)}
.ob7-cta:disabled{cursor:default}
.ob7-cta-outline{background:transparent;color:var(--emerald);border-color:var(--emerald);box-shadow:none}
.ob7-cta-outline:hover:not(:disabled){background:var(--emerald);color:#f4ecd8}

/* ---------- page ---------- */
.ob7-page{position:relative;z-index:1}
.ob7-wrap{width:min(1000px,calc(100% - 32px));margin:0 auto;padding:clamp(56px,10vw,110px) 0 90px}
.ob7-narrow{width:min(720px,100%);margin:0 auto}
.ob7-sec{margin-bottom:clamp(84px,14vw,150px)}
.ob7-sec-head{margin-bottom:38px;text-align:center}
.ob7-sec-head h2{font-family:var(--serif);font-weight:500;font-size:clamp(2.1rem,7.2vw,3.4rem);line-height:1.04;letter-spacing:-.01em;margin:14px 0 12px;color:var(--ink)}
.ob7-sec-head p{font-family:var(--body);font-style:italic;font-size:1.05rem;line-height:1.6;color:var(--gray);max-width:480px;margin:0 auto}
.ob7-prose p{font-family:var(--body);font-size:clamp(1.06rem,3.5vw,1.2rem);line-height:1.85;margin-bottom:1.2em;color:var(--ink)}
.ob7-prose p:last-child{margin-bottom:0}

/* ---------- 02 ledger tabs ---------- */
.ob7-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin-bottom:-1px;position:relative;z-index:2}
.ob7-tab{
  position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px 13px;
  background:rgba(251,249,245,.6);color:var(--ink);border:1px solid rgba(176,141,87,.55);border-bottom-color:var(--gold);
  margin-left:-1px;text-align:center;transition:background .3s;
}
.ob7-tab:first-child{margin-left:0}
.ob7-tab:hover:not(.is-active){background:rgba(251,249,245,.95)}
.ob7-tab-bg{position:absolute;inset:-1px;background:var(--emerald);z-index:0}
.ob7-tab-num,.ob7-tab-label{position:relative;z-index:1}
.ob7-tab-num{font-family:var(--sans);font-weight:500;font-size:.7rem;letter-spacing:.2em;color:var(--gold)}
.ob7-tab-label{font-family:var(--serif);font-weight:600;font-size:clamp(.98rem,3.4vw,1.2rem);line-height:1.15;color:var(--ink)}
.ob7-tab.is-active .ob7-tab-num{color:var(--gold-soft)}
.ob7-tab.is-active .ob7-tab-label{color:#f7f1e1}
.ob7-panel{background:var(--linen);padding:clamp(28px,6vw,52px) clamp(22px,5.5vw,52px);min-height:240px;box-shadow:0 26px 50px -30px rgba(40,34,24,.4)}
.ob7-panel-prompt{font-family:var(--serif);font-style:italic;font-size:clamp(1.25rem,4.4vw,1.5rem);color:var(--emerald);margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(176,141,87,.4)}

/* ---------- 03 letter ---------- */
.ob7-sheet{width:min(720px,100%);margin:0 auto;padding:clamp(34px,8vw,84px) clamp(24px,7vw,78px);background:#fdfbf7;box-shadow:0 30px 60px -30px rgba(40,34,24,.45)}
.ob7-sheet>*{position:relative}
.ob7-sheet-mark{display:block;width:42px;height:42px;margin:0 auto 18px;color:var(--gold)}
.ob7-sheet-date{text-align:center;margin-bottom:34px;padding-bottom:18px;border-bottom:1px solid rgba(176,141,87,.4)}
.ob7-greeting{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(1.9rem,6vw,2.6rem);margin-bottom:22px;color:var(--ink)}
.ob7-letter p:first-child::first-letter{float:left;font-family:var(--serif);font-weight:500;font-size:4.6em;line-height:.78;padding:.07em .1em 0 0;color:var(--emerald)}

/* ---------- 04 commitments ---------- */
.ob7-commits{display:grid;gap:12px}
.ob7-commit{
  width:100%;display:flex;gap:16px;align-items:flex-start;text-align:left;padding:18px 18px 18px 16px;
  background:var(--linen);color:var(--ink);border:1px solid rgba(176,141,87,.5);border-left:3px solid rgba(176,141,87,.5);
  transition:background .45s,border-color .45s,box-shadow .45s;
}
.ob7-commit:hover{border-color:var(--gold);background:#fffdf9}
.ob7-check{flex:none;width:26px;height:26px;margin-top:2px;border-radius:50%;border:1px solid var(--gold);display:grid;place-items:center;color:transparent;background:transparent;transition:background .45s,color .45s,border-color .45s}
.ob7-commit-text{display:grid;gap:6px;min-width:0}
.ob7-commit-title{font-family:var(--serif);font-weight:600;font-size:clamp(1.3rem,4.6vw,1.55rem);line-height:1.15;color:var(--ink);transition:color .4s}
.ob7-commit-detail{font-family:var(--body);font-size:1.02rem;line-height:1.65;color:var(--gray)}
.ob7-commit.is-on{background:linear-gradient(90deg,rgba(29,53,42,.09),rgba(176,141,87,.1));border-color:var(--gold);border-left-color:var(--emerald);box-shadow:0 14px 30px -22px rgba(29,53,42,.6)}
.ob7-commit.is-on .ob7-check{background:var(--emerald);border-color:var(--emerald);color:var(--gold-soft)}
.ob7-commit.is-on .ob7-commit-title{color:var(--emerald)}
.ob7-progress{margin-top:26px;text-align:center}
.ob7-progress-bar{height:2px;background:rgba(176,141,87,.3);margin-bottom:12px;overflow:hidden}
.ob7-progress-bar span{display:block;height:100%;background:var(--emerald);transition:width .7s cubic-bezier(.22,1,.36,1)}

/* ---------- 05 gallery ---------- */
.ob7-mat{
  position:relative;display:block;width:100%;padding:clamp(10px,2.6vw,16px) clamp(10px,2.6vw,16px) 0;
  background:var(--linen);color:var(--ink);text-align:left;border:1px solid var(--gold);
  box-shadow:0 22px 40px -24px rgba(40,34,24,.55);transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;
}
.ob7-mat::after{content:'';position:absolute;inset:5px;border:1px solid rgba(176,141,87,.4);pointer-events:none}
.ob7-mat:hover{transform:translateY(-4px);box-shadow:0 32px 50px -24px rgba(40,34,24,.6)}
.ob7-mat img{width:100%;aspect-ratio:4/5;object-fit:cover;box-shadow:0 0 0 1px rgba(176,141,87,.8);filter:saturate(.92)}
.ob7-cap{display:block;padding:14px 4px 16px;font-family:var(--body);font-style:italic;font-size:1rem;line-height:1.4;color:var(--ink)}
.ob7-mat-main{width:min(460px,100%);margin:0 auto 32px}
.ob7-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.ob7-gallery .ob7-mat img{aspect-ratio:1/1.1}

/* ---------- 06 open door ---------- */
.ob7-sign{text-align:center}
.ob7-closing{font-family:var(--serif);font-style:italic;font-size:clamp(1.4rem,5vw,1.8rem);color:var(--gray)}
.ob7-signature{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(3.2rem,14vw,5.4rem);line-height:1.1;color:var(--emerald);transform:rotate(-3deg);margin-top:6px;overflow-wrap:anywhere}
.ob7-door{margin-top:clamp(40px,8vw,64px);display:flex;flex-direction:column;align-items:center;gap:26px}
.ob7-fold{position:relative;perspective:1600px;width:min(540px,100%);text-align:left}
.ob7-fold-inside{background:#fdfbf7;padding:clamp(30px,7vw,52px) clamp(24px,6vw,48px);min-height:280px;box-shadow:0 30px 56px -28px rgba(40,34,24,.5)}
.ob7-fold-inside>*{position:relative}
.ob7-fold-note{margin-top:16px;font-family:var(--serif);font-style:italic;font-size:clamp(1.35rem,4.8vw,1.7rem);line-height:1.5;color:var(--ink);white-space:pre-line}
.ob7-fold-cover{
  position:absolute;inset:0;transform-origin:left center;backface-visibility:hidden;-webkit-backface-visibility:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;
  background:linear-gradient(160deg,#27483a,var(--emerald) 55%,var(--emerald-deep));color:var(--gold-soft);
  box-shadow:0 30px 56px -28px rgba(16,33,26,.7);
}
.ob7-fold-cover::before{content:'';position:absolute;inset:10px;border:1px solid rgba(229,207,159,.55);pointer-events:none}
.ob7-fold-mark{width:46px;height:46px;color:var(--gold-soft)}
.ob7-fold-title{font-family:var(--serif);font-weight:500;font-size:1.9rem;line-height:1.1;color:#f7f1e1}
.ob7-fold-sub{font-family:var(--sans);font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-soft)}
.ob7-end{text-align:center;padding-top:20px}
.ob7-end-mark{display:block;width:34px;height:34px;margin:0 auto 14px;color:var(--gold)}
.ob7-end p{font-family:var(--serif);font-style:italic;font-size:1.08rem;line-height:1.5;color:var(--gray);max-width:420px;margin:0 auto}

/* ---------- lightbox ---------- */
.ob7-lightbox{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:60px 14px 28px;background:rgba(14,26,20,.95);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.ob7-lb-figure{max-width:min(900px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center;gap:12px}
.ob7-lb-figure img{max-width:100%;max-height:calc(100vh - 190px);max-height:calc(100svh - 190px);object-fit:contain;border:10px solid var(--linen);outline:1px solid var(--gold);outline-offset:-5px;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.ob7-lb-figure figcaption{font-family:var(--body);font-style:italic;font-size:clamp(1.05rem,4vw,1.25rem);line-height:1.45;color:#f4ecd8;text-align:center;max-width:540px}
.ob7-lb-count{font-family:var(--sans);font-size:.66rem;letter-spacing:.22em;color:var(--gold-soft)}
.ob7-lb-btn{position:absolute;width:46px;height:46px;border-radius:50%;border:1px solid rgba(229,207,159,.6);background:rgba(14,26,20,.75);color:#f4ecd8;font-size:1.7rem;line-height:1;display:grid;place-items:center;padding:0}
.ob7-lb-btn:hover{background:rgba(176,141,87,.35)}
.ob7-lb-close{top:12px;right:14px}
.ob7-lb-prev{left:8px;top:50%;transform:translateY(-50%)}
.ob7-lb-next{right:8px;top:50%;transform:translateY(-50%)}

/* ---------- breakpoints ---------- */
@media (min-width:760px){
  .ob7-gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
  .ob7-lb-prev{left:24px}
  .ob7-lb-next{right:24px}
}
@media (max-width:380px){
  .ob7-cover{padding:42px 26px 30px}
  .ob7-tab{padding:12px 4px}
  .ob7-commit{gap:12px;padding:16px 12px}
  .ob7-cta{padding:14px 20px;font-size:.72rem}
}
@media (prefers-reduced-motion:reduce){
  .ob7-mat,.ob7-cta,.ob7-commit,.ob7-check,.ob7-progress-bar span{transition:none}
}
`;
