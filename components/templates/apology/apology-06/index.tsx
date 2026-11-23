'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
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
  'I hate that I was the storm. Let me be the calm that stays after.';

/* Rintik hujan deterministik (tanpa Math.random, aman untuk SSR) */
const DROPS = Array.from({ length: 46 }, (_, i) => ({
  left: `${(i * 97) % 101}%`,
  height: 38 + ((i * 29) % 64),
  duration: 0.85 + (i % 5) * 0.17,
  delay: -((i * 0.37) % 2.4),
  opacity: 0.22 + (i % 4) * 0.1,
}));

/* Bentuk waveform deterministik per kartu */
const BAR_COUNT = 30;
function barHeight(index: number, seed: number) {
  const v = Math.abs(
    Math.sin((index + seed * 3) * 1.7) * Math.cos(index * 0.55 + seed),
  );
  return Math.round(22 + v * 74);
}

/* ------------------------------------------------------------------ */
/* Sub-komponen kecil                                                   */
/* ------------------------------------------------------------------ */
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
      className="ar6-sec"
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <header className="ar6-sec-head">
        <span className="ar6-mono">
          {pad(n)} / 06 · {kicker}
        </span>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </header>
      {children}
    </motion.section>
  );
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="#1a1d24" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="#1a1d24" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"
        fill="#1a1d24"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Komponen utama                                                       */
/* ------------------------------------------------------------------ */
export default function Apology06({ website }: { website: WebsiteRecord }) {
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
  const writtenTime = text('writtenTime', '22:40');
  const writtenDate = text('writtenDate');
  const openingLine = text(
    'openingLine',
    'Maaf, kemarin aku yang jadi penyebab mendungnya.',
  );
  const signature = text('signature', senderName);
  const hopeText = text('hopeText');

  const letterBody = text('letterBody', getString(w, 'message'));
  const paragraphs = letterBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const voices = [1, 2, 3]
    .map((i) => ({
      title: text(`voice${i}Title`),
      body: text(`voice${i}Text`),
    }))
    .filter((v) => v.body);

  const realizations = [1, 2, 3, 4]
    .map((i) => ({
      title: text(`realize${i}Title`),
      confession: text(`realize${i}Confession`),
      fix: text(`realize${i}Fix`),
    }))
    .filter((r) => r.confession || r.fix);

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
  const [phase, setPhase] = useState<'rain' | 'clearing' | 'clear'>('rain');
  const opened = phase !== 'rain';
  const [openVoices, setOpenVoices] = useState<number[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const [openReal, setOpenReal] = useState<number[]>([]);
  const [lightIdx, setLightIdx] = useState<number | null>(null);
  const [hopeOpen, setHopeOpen] = useState(false);

  useEffect(() => {
    if (phase !== 'clearing') return;
    const timer = setTimeout(
      () => {
        window.scrollTo(0, 0);
        setPhase('clear');
      },
      reduce ? 250 : 2600,
    );
    return () => clearTimeout(timer);
  }, [phase, reduce]);

  /* "pemutaran" voice note berhenti sendiri setelah beberapa detik */
  useEffect(() => {
    if (playing === null) return;
    const timer = setTimeout(() => setPlaying(null), 5200);
    return () => clearTimeout(timer);
  }, [playing]);

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

  const calm = () => {
    if (phase === 'rain') setPhase('clearing');
  };
  const togglePlay = (i: number) => {
    setOpenVoices((cur) => (cur.includes(i) ? cur : [...cur, i]));
    setPlaying((cur) => (cur === i ? null : i));
  };
  const toggleReal = (i: number) =>
    setOpenReal((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i],
    );
  const step = (dir: 1 | -1) =>
    setLightIdx((i) =>
      i === null ? i : (i + dir + photos.length) % photos.length,
    );

  const lit = photos[lightIdx ?? 0];
  const clearing = phase === 'clearing';

  return (
    <div className="ar6">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      {/* cahaya fajar untuk fase konten */}
      <div className="ar6-dawn" aria-hidden="true" />

      {/* ================= 01 — THROUGH THE RAIN ================= */}
      <AnimatePresence>
        {phase !== 'clear' && (
          <motion.section
            key="opening"
            className="ar6-open"
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 1.1, ease: 'easeInOut' }}
          >
            <span className="ar6-fog ar6-fog-a" aria-hidden="true" />
            <span className="ar6-fog ar6-fog-b" aria-hidden="true" />

            <motion.div
              className="ar6-rain"
              aria-hidden="true"
              initial={false}
              animate={{ opacity: clearing ? 0 : 1 }}
              transition={{ duration: reduce ? 0.2 : 2, ease: 'easeOut' }}
            >
              {DROPS.map((d, i) => (
                <span
                  key={i}
                  className="ar6-drop"
                  style={{
                    left: d.left,
                    height: d.height,
                    opacity: d.opacity,
                    animationDuration: `${d.duration}s`,
                    animationDelay: `${d.delay}s`,
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              className="ar6-golden"
              aria-hidden="true"
              initial={false}
              animate={
                clearing
                  ? { opacity: 1, scale: reduce ? 1 : 1.5 }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={{ duration: reduce ? 0.2 : 2.2, ease: EASE }}
            />

            <motion.div
              className="ar6-glass"
              initial={false}
              animate={clearing ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0.2 : 1.3,
                ease: EASE,
                delay: clearing && !reduce ? 0.5 : 0,
              }}
            >
              <p className="ar6-mono ar6-weather">Hujan · {writtenTime}</p>
              <p className="ar6-open-line">{openingLine}</p>
              <h1 className="ar6-recipient">{receiverName}</h1>
              <button
                type="button"
                className="ar6-cta"
                onClick={calm}
                disabled={phase !== 'rain'}
              >
                Redakan Hujan &amp; Baca Surat
              </button>
            </motion.div>

            <p className="ar6-open-tagline">{TAGLINE}</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= KONTEN UTAMA ================= */}
      {phase === 'clear' && (
        <motion.main
          className="ar6-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
        >
          <div className="ar6-wrap">
            <p className="ar6-mono ar6-strip">
              <span>Hujan reda · {writtenTime}</span>
            </p>

            {/* ---------- 02 — THINGS I ALMOST SAID ---------- */}
            {voices.length > 0 && (
              <Section
                n={2}
                reduce={reduce}
                kicker="Things I Almost Said"
                title="Hal yang nyaris kuucapkan"
                note="Kalimat-kalimat yang kutelan karena ego. Tekan putar untuk mendengarkan."
              >
                <ul className="ar6-voices">
                  {voices.map((v, i) => {
                    const isOpen = openVoices.includes(i);
                    const isPlaying = playing === i;
                    const seconds = Math.min(
                      59,
                      8 + Math.floor(v.body.length / 12),
                    );
                    return (
                      <li
                        key={i}
                        className={`ar6-voice ${isOpen ? 'is-open' : ''}`}
                      >
                        <div className="ar6-voice-row">
                          <button
                            type="button"
                            className="ar6-play"
                            aria-pressed={isPlaying}
                            aria-label={
                              isPlaying
                                ? `Jeda pesan ${i + 1}`
                                : `Putar pesan ${i + 1}`
                            }
                            onClick={() => togglePlay(i)}
                          >
                            <PlayIcon playing={isPlaying} />
                          </button>
                          <div className="ar6-voice-meta">
                            <span className="ar6-mono">
                              Tertahan #{pad(i + 1)} · 0:{pad(seconds)}
                            </span>
                            <div
                              className={`ar6-wave ${isPlaying ? 'is-playing' : ''}`}
                              aria-hidden="true"
                            >
                              {Array.from({ length: BAR_COUNT }, (_, b) => (
                                <span
                                  key={b}
                                  className="ar6-bar"
                                  style={
                                    {
                                      '--h': `${barHeight(b, i + 1)}%`,
                                      '--i': b,
                                    } as CSSProperties
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {v.title && (
                          <p className="ar6-voice-title">{v.title}</p>
                        )}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="ar6-voice-body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reduce ? 0.1 : 0.6,
                                ease: EASE,
                              }}
                            >
                              <p>{v.body}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            {/* ---------- 03 — THE APOLOGY LETTER ---------- */}
            <Section
              n={3}
              reduce={reduce}
              kicker="The Apology Letter"
              title="Surat permintaan maaf"
            >
              <article className="ar6-paper">
                <div className="ar6-paper-meta ar6-mono">
                  {writtenDate && <span>{writtenDate}</span>}
                  <span>Hujan reda · {writtenTime}</span>
                </div>
                <p className="ar6-greeting">Untuk {receiverName},</p>
                <div className="ar6-letter">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p>Surat ini sedang menunggu kata-kata pertamamu.</p>
                  )}
                </div>
              </article>
            </Section>

            {/* ---------- 04 — TAKING FULL RESPONSIBILITY ---------- */}
            {realizations.length > 0 && (
              <Section
                n={4}
                reduce={reduce}
                kicker="Taking Full Responsibility"
                title="Tanggung jawabku"
                note="Tanpa kata “tapi”. Ketuk setiap kartu untuk membukanya."
              >
                <ul className="ar6-reals">
                  {realizations.map((r, i) => {
                    const isOpen = openReal.includes(i);
                    return (
                      <li
                        key={i}
                        className={`ar6-real ${isOpen ? 'is-open' : ''}`}
                      >
                        <button
                          type="button"
                          className="ar6-real-head"
                          aria-expanded={isOpen}
                          onClick={() => toggleReal(i)}
                        >
                          <span className="ar6-real-label">
                            Hal yang Kusadari #{pad(i + 1)}
                          </span>
                          {r.title && (
                            <span className="ar6-real-title">{r.title}</span>
                          )}
                          <span className="ar6-real-hint">
                            {isOpen ? 'tutup' : 'ketuk untuk membuka'}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="ar6-real-body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reduce ? 0.1 : 0.6,
                                ease: EASE,
                              }}
                            >
                              <div className="ar6-real-inner">
                                {r.confession && (
                                  <>
                                    <span className="ar6-real-tag">
                                      Pengakuan
                                    </span>
                                    <p>{r.confession}</p>
                                  </>
                                )}
                                {r.fix && (
                                  <>
                                    <span className="ar6-real-tag">
                                      Langkah nyata
                                    </span>
                                    <p>{r.fix}</p>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            {/* ---------- 05 — CLEARER DAYS ---------- */}
            {photos.length > 0 && (
              <Section
                n={5}
                reduce={reduce}
                kicker="Clearer Days"
                title="Hari-hari yang lebih terang"
                note="Ketuk foto untuk melihatnya lebih besar."
              >
                {mainSrc && (
                  <button
                    type="button"
                    className="ar6-frame ar6-frame-main"
                    onClick={() => setLightIdx(0)}
                    aria-label="Perbesar foto utama"
                  >
                    <img
                      src={mainSrc}
                      alt={photos[0].caption || 'Foto utama'}
                      loading="lazy"
                    />
                    {photos[0].caption && (
                      <span className="ar6-cap">{photos[0].caption}</span>
                    )}
                  </button>
                )}
                {gallerySrc.length > 0 && (
                  <div className="ar6-gallery">
                    {gallerySrc.map((src, i) => (
                      <button
                        type="button"
                        key={`${src}-${i}`}
                        className="ar6-frame"
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
                          <span className="ar6-cap">
                            {photos[i + galleryOffset].caption}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* ---------- 06 — AFTER THE STORM ---------- */}
            <Section
              n={6}
              reduce={reduce}
              kicker="After the Storm"
              title="Setelah hujan"
            >
              <div className="ar6-sign">
                <p className="ar6-closing">Dengan sepenuh hati,</p>
                <p className="ar6-signature">{signature}</p>

                {hopeText && (
                  <div className="ar6-hope">
                    <svg
                      className="ar6-arc"
                      viewBox="0 0 200 100"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 96A90 90 0 0 1 190 96"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.22"
                      />
                      <motion.path
                        d="M10 96A90 90 0 0 1 190 96"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        initial={false}
                        animate={{
                          pathLength: hopeOpen ? 1 : 0.0001,
                          opacity: hopeOpen ? 1 : 0,
                        }}
                        transition={{
                          duration: reduce ? 0.1 : 1.4,
                          ease: EASE,
                        }}
                      />
                    </svg>
                    <button
                      type="button"
                      className="ar6-cta ar6-cta-outline"
                      aria-expanded={hopeOpen}
                      onClick={() => setHopeOpen((v) => !v)}
                    >
                      {hopeOpen ? 'Tutup Janji' : 'Buka Janji Setelah Hujan'}
                    </button>
                    <AnimatePresence initial={false}>
                      {hopeOpen && (
                        <motion.div
                          className="ar6-hope-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: reduce ? 0.1 : 0.9,
                            ease: EASE,
                            delay: reduce ? 0 : 0.3,
                          }}
                        >
                          <div className="ar6-paper ar6-hope-card">
                            <p>{hopeText}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </Section>

            <footer className="ar6-end">
              <p>{TAGLINE}</p>
            </footer>
          </div>
        </motion.main>
      )}

      {/* ================= LIGHTBOX ================= */}
      <AnimatePresence>
        {lightIdx !== null && lit && (
          <motion.div
            className="ar6-lightbox"
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
              className="ar6-lb-btn ar6-lb-close"
              onClick={() => setLightIdx(null)}
              aria-label="Tutup"
            >
              ×
            </button>
            <motion.figure
              key={lightIdx}
              className="ar6-lb-figure"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lit.src} alt={lit.caption || 'Foto'} />
              {lit.caption && <figcaption>{lit.caption}</figcaption>}
              <span className="ar6-lb-count">
                {pad((lightIdx ?? 0) + 1)} / {pad(photos.length)}
              </span>
            </motion.figure>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="ar6-lb-btn ar6-lb-prev"
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
                  className="ar6-lb-btn ar6-lb-next"
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
/* CSS lokal (scoped di bawah .ar6)                                     */
/* ------------------------------------------------------------------ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=JetBrains+Mono:wght@300;400&display=swap');

.ar6{
  --slate:#0f1722; --mist:#1e2b3c; --dusk-a:#16202c; --dusk-b:#1c2735;
  --gold:#e2c69b; --sky:#8fa7bf; --ivory:#f7f4ee; --ink:#252320; --ink-soft:#5c574f;
  --text:#e8edf3; --text-soft:#a9b8c8;
  --serif:'Cormorant Garamond',Georgia,'Times New Roman',serif;
  --body:'Newsreader',Georgia,'Times New Roman',serif;
  --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  position:relative; min-height:100vh; min-height:100svh; width:100%;
  background:linear-gradient(180deg,var(--dusk-a),var(--dusk-b));
  color:var(--text); font-family:var(--body); overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.ar6 *,.ar6 *::before,.ar6 *::after{box-sizing:border-box}
.ar6 h1,.ar6 h2,.ar6 h3,.ar6 p,.ar6 ul,.ar6 ol,.ar6 figure{margin:0;padding:0}
.ar6 ul,.ar6 ol{list-style:none}
.ar6 button{font:inherit;color:var(--text);cursor:pointer;-webkit-tap-highlight-color:transparent}
.ar6 button:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.ar6 img{display:block;max-width:100%}
.ar6-mono{font-family:var(--mono);font-weight:300;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--sky)}

/* ---------- fase konten: cahaya fajar ---------- */
.ar6-dawn{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 80% 45% at 50% 108%,rgba(226,198,155,.26),transparent 70%),
    radial-gradient(ellipse 60% 35% at 50% -6%,rgba(143,167,191,.16),transparent 70%);
  animation:ar6-breathe 9s ease-in-out infinite;
}
@keyframes ar6-breathe{0%,100%{opacity:.8}50%{opacity:1}}

/* ---------- 01 opening ---------- */
.ar6-open{
  position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;
  padding:24px 18px;overflow:hidden;
  background:linear-gradient(180deg,var(--slate),var(--mist));
}
.ar6-fog{position:absolute;border-radius:50%;background:rgba(143,167,191,.16);filter:blur(60px);pointer-events:none;animation:ar6-fog 26s ease-in-out infinite alternate}
.ar6-fog-a{width:70vmax;height:26vmax;top:-8vmax;left:-20vmax}
.ar6-fog-b{width:60vmax;height:24vmax;bottom:-8vmax;right:-18vmax;animation-duration:34s}
@keyframes ar6-fog{from{translate:0 0}to{translate:5vmax 3vmax}}
.ar6-rain{position:absolute;inset:-10% -10%;pointer-events:none;transform:rotate(9deg)}
.ar6-drop{
  position:absolute;top:-120px;width:1px;border-radius:1px;
  background:linear-gradient(180deg,transparent,rgba(170,195,220,.85));
  animation-name:ar6-fall;animation-timing-function:linear;animation-iteration-count:infinite;
}
@keyframes ar6-fall{from{transform:translateY(0)}to{transform:translateY(125vh)}}
.ar6-golden{
  position:absolute;inset:0;pointer-events:none;opacity:0;transform-origin:50% 100%;
  background:radial-gradient(ellipse 70% 60% at 50% 100%,rgba(240,214,170,.95),rgba(226,198,155,.45) 38%,transparent 72%);
}
.ar6-glass{
  position:relative;z-index:3;width:min(460px,100%);text-align:center;
  padding:clamp(30px,7vw,48px) clamp(22px,6vw,40px);border-radius:26px;
  background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.03));
  border:1px solid rgba(170,195,220,.22);
  -webkit-backdrop-filter:blur(16px) saturate(1.2);backdrop-filter:blur(16px) saturate(1.2);
  box-shadow:0 30px 70px -30px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.1);
}
.ar6-weather{margin-bottom:26px}
.ar6-open-line{font-family:var(--serif);font-style:italic;font-size:clamp(1.3rem,5vw,1.65rem);line-height:1.35;color:var(--text-soft)}
.ar6-recipient{font-family:var(--serif);font-weight:500;font-size:clamp(3rem,15vw,5.2rem);line-height:1;letter-spacing:-.02em;margin:16px 0 34px;color:#f4f6f9;overflow-wrap:anywhere}
.ar6-open-tagline{position:absolute;z-index:3;bottom:22px;left:20px;right:20px;text-align:center;font-family:var(--serif);font-style:italic;font-size:.98rem;color:rgba(169,184,200,.55)}

.ar6-cta{
  appearance:none;padding:15px 30px;border-radius:999px;border:1px solid var(--gold);
  background:var(--gold);color:#1a1d24;font-family:var(--serif);font-weight:600;font-size:1.15rem;
  transition:background .35s,transform .35s,box-shadow .35s;box-shadow:0 14px 32px -14px rgba(226,198,155,.7);
}
.ar6-cta:hover:not(:disabled){background:#efd9b4;transform:translateY(-2px)}
.ar6-cta:disabled{cursor:default;opacity:.85}
.ar6-cta-outline{background:transparent;color:var(--gold);box-shadow:none}
.ar6-cta-outline:hover:not(:disabled){background:var(--gold);color:#1a1d24}

/* ---------- page ---------- */
.ar6-page{position:relative;z-index:1}
.ar6-wrap{width:min(780px,calc(100% - 32px));margin:0 auto;padding:clamp(40px,8vw,80px) 0 90px}
.ar6-strip{text-align:center;margin-bottom:clamp(56px,10vw,100px)}
.ar6-strip span{display:inline-block;padding:8px 16px;border-radius:999px;border:1px solid rgba(143,167,191,.3);color:var(--gold)}
.ar6-sec{margin-bottom:clamp(80px,14vw,150px)}
.ar6-sec-head{margin-bottom:36px;text-align:center}
.ar6-sec-head h2{font-family:var(--serif);font-weight:500;font-size:clamp(2.1rem,7.5vw,3.3rem);line-height:1.04;letter-spacing:-.01em;margin:14px 0 12px;color:#f4f6f9}
.ar6-sec-head p{font-family:var(--body);font-style:italic;font-size:1.05rem;line-height:1.6;color:var(--text-soft);max-width:480px;margin:0 auto}

/* ---------- 02 voice notes ---------- */
.ar6-voices{display:grid;gap:16px}
.ar6-voice{
  padding:20px 20px 22px;border-radius:20px;
  background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.025));
  border:1px solid rgba(143,167,191,.2);transition:border-color .5s,box-shadow .6s;
}
.ar6-voice.is-open{border-color:rgba(226,198,155,.45);box-shadow:0 0 50px rgba(226,198,155,.08)}
.ar6-voice-row{display:flex;align-items:center;gap:16px}
.ar6-play{
  flex:none;width:50px;height:50px;border-radius:50%;border:0;padding:0;display:grid;place-items:center;
  background:var(--gold);color:#1a1d24;transition:transform .3s,box-shadow .3s;box-shadow:0 8px 20px -8px rgba(226,198,155,.8);
}
.ar6-play:hover{transform:scale(1.06)}
.ar6-voice-meta{flex:1;min-width:0;display:grid;gap:8px}
.ar6-wave{display:flex;align-items:center;gap:3px;height:42px}
.ar6-bar{flex:1;min-width:2px;max-width:5px;height:var(--h);border-radius:2px;background:rgba(143,167,191,.55);transform-origin:center}
.ar6-wave.is-playing .ar6-bar{background:var(--gold);animation:ar6-pulse 1.1s ease-in-out infinite;animation-delay:calc(var(--i) * -70ms)}
@keyframes ar6-pulse{0%,100%{transform:scaleY(.32)}50%{transform:scaleY(1)}}
.ar6-voice-title{margin-top:16px;font-family:var(--serif);font-style:italic;font-size:clamp(1.3rem,4.6vw,1.55rem);line-height:1.3;color:#eef2f7}
.ar6-voice-body{overflow:hidden}
.ar6-voice-body p{padding-top:14px;font-family:var(--body);font-size:1.06rem;line-height:1.75;color:var(--text)}

/* ---------- 03 paper ---------- */
.ar6-paper{
  position:relative;border-radius:4px 4px 10px 10px;color:var(--ink);
  background:linear-gradient(135deg,#faf8f3,var(--ivory) 55%,#f0ece3);
  padding:clamp(30px,7vw,70px) clamp(24px,6.5vw,66px);
  box-shadow:0 2px 3px rgba(0,0,0,.35),0 26px 44px -14px rgba(0,0,0,.55),0 60px 120px -30px rgba(226,198,155,.22);
}
.ar6-paper::before{
  content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.4;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .4 0 0 0 0 .38 0 0 0 0 .34 0 0 0 .45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.ar6-paper>*{position:relative}
.ar6-paper-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 18px;margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid rgba(92,87,79,.25)}
.ar6-paper .ar6-mono{color:var(--ink-soft)}
.ar6-greeting{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(1.9rem,6vw,2.6rem);margin-bottom:22px;color:var(--ink)}
.ar6-letter p{font-family:var(--body);font-size:clamp(1.08rem,3.6vw,1.22rem);line-height:1.85;margin-bottom:1.25em;white-space:pre-line;color:var(--ink)}
.ar6-letter p:last-child{margin-bottom:0}
.ar6-letter p:first-child::first-letter{float:left;font-family:var(--serif);font-weight:500;font-size:4.5em;line-height:.78;padding:.07em .1em 0 0;color:#3d5368}

/* ---------- 04 responsibility ---------- */
.ar6-reals{display:grid;gap:14px}
.ar6-real{border-radius:16px;overflow:hidden;background:var(--ivory);color:var(--ink);border:1px solid rgba(226,198,155,.5);box-shadow:0 18px 34px -22px rgba(0,0,0,.7);transition:box-shadow .5s}
.ar6-real.is-open{box-shadow:0 22px 50px -20px rgba(226,198,155,.35)}
.ar6-real-head{
  width:100%;display:flex;flex-direction:column;gap:6px;text-align:left;padding:20px 22px;border:0;background:transparent;color:var(--ink);
}
.ar6-real-label{font-family:var(--mono);font-weight:400;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:#7a5f2c}
.ar6-real-title{font-family:var(--serif);font-weight:500;font-size:clamp(1.5rem,5vw,1.85rem);line-height:1.15;color:var(--ink)}
.ar6-real-hint{font-family:var(--body);font-style:italic;font-size:.98rem;color:var(--ink-soft)}
.ar6-real-body{overflow:hidden}
.ar6-real-inner{padding:2px 22px 24px;display:grid;gap:8px;border-top:1px solid rgba(37,35,32,.1);margin:0 22px;padding-left:0;padding-right:0;padding-top:18px}
.ar6-real-tag{font-family:var(--mono);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:#3d5368;margin-top:6px}
.ar6-real-inner p{font-family:var(--body);font-size:1.05rem;line-height:1.7;color:var(--ink)}

/* ---------- 05 gallery ---------- */
.ar6-frame{
  display:block;width:100%;padding:clamp(8px,2.2vw,12px) clamp(8px,2.2vw,12px) 0;border:0;border-radius:4px;
  background:var(--ivory);color:var(--ink);text-align:left;
  box-shadow:0 22px 40px -20px rgba(0,0,0,.7);transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;
}
.ar6-frame:hover{transform:translateY(-4px);box-shadow:0 30px 54px -20px rgba(226,198,155,.3)}
.ar6-frame img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:2px}
.ar6-cap{display:block;padding:14px 4px 16px;font-family:var(--body);font-style:italic;font-size:1rem;line-height:1.4;color:var(--ink)}
.ar6-frame-main{width:min(480px,100%);margin:0 auto 28px}
.ar6-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.ar6-gallery .ar6-frame img{aspect-ratio:1/1.1}

/* ---------- 06 hope ---------- */
.ar6-sign{text-align:center}
.ar6-closing{font-family:var(--serif);font-style:italic;font-size:clamp(1.4rem,5vw,1.8rem);color:var(--text-soft)}
.ar6-signature{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(3.2rem,14vw,5.4rem);line-height:1.1;color:var(--gold);transform:rotate(-3deg);margin-top:6px;overflow-wrap:anywhere}
.ar6-hope{margin-top:clamp(40px,8vw,64px);display:flex;flex-direction:column;align-items:center;gap:22px}
.ar6-arc{width:min(220px,60%);height:auto;color:var(--gold);margin-bottom:-6px}
.ar6-hope-body{width:100%;overflow:hidden;text-align:left}
.ar6-hope-card{margin-top:6px;padding:clamp(28px,6vw,52px)}
.ar6-hope-card p{font-family:var(--serif);font-style:italic;font-size:clamp(1.35rem,4.8vw,1.7rem);line-height:1.55;color:var(--ink);white-space:pre-line}
.ar6-end{text-align:center;padding-top:20px}
.ar6-end p{font-family:var(--serif);font-style:italic;font-size:1.05rem;line-height:1.5;color:rgba(169,184,200,.6);max-width:420px;margin:0 auto}

/* ---------- lightbox ---------- */
.ar6-lightbox{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:60px 14px 28px;background:rgba(10,15,22,.94);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.ar6-lb-figure{max-width:min(900px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center;gap:12px}
.ar6-lb-figure img{max-width:100%;max-height:calc(100vh - 190px);max-height:calc(100svh - 190px);object-fit:contain;border:10px solid var(--ivory);border-radius:3px;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.ar6-lb-figure figcaption{font-family:var(--body);font-style:italic;font-size:clamp(1.05rem,4vw,1.25rem);line-height:1.45;color:var(--text);text-align:center;max-width:540px}
.ar6-lb-count{font-family:var(--mono);font-size:.68rem;letter-spacing:.2em;color:var(--gold)}
.ar6-lb-btn{position:absolute;width:46px;height:46px;border-radius:50%;border:1px solid rgba(226,198,155,.5);background:rgba(15,23,34,.75);color:var(--text);font-size:1.7rem;line-height:1;display:grid;place-items:center;padding:0}
.ar6-lb-btn:hover{background:rgba(226,198,155,.25)}
.ar6-lb-close{top:12px;right:14px}
.ar6-lb-prev{left:8px;top:50%;transform:translateY(-50%)}
.ar6-lb-next{right:8px;top:50%;transform:translateY(-50%)}

/* ---------- breakpoints ---------- */
@media (min-width:760px){
  .ar6-gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
  .ar6-lb-prev{left:24px}
  .ar6-lb-next{right:24px}
}
@media (max-width:380px){
  .ar6-voice{padding:16px 14px 18px}
  .ar6-voice-row{gap:12px}
  .ar6-play{width:44px;height:44px}
  .ar6-real-head{padding:18px 16px}
  .ar6-real-inner{margin:0 16px}
  .ar6-cta{padding:14px 22px;font-size:1.05rem}
}
@media (prefers-reduced-motion:reduce){
  .ar6-rain,.ar6-fog{display:none}
  .ar6-dawn,.ar6-wave.is-playing .ar6-bar{animation:none}
  .ar6-frame,.ar6-cta,.ar6-play{transition:none}
}
`;
