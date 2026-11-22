'use client';

import { useEffect, useState, type ReactNode } from 'react';
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
  'Like a scent that lingers, some people stay in every season of our lives.';

/* ------------------------------------------------------------------ */
/* Sub-komponen                                                         */
/* ------------------------------------------------------------------ */
const SPRIG_Y = [134, 106, 78, 52];

function Sprig({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M40 158C41 112 39 60 40 14" />
      {SPRIG_Y.map((y) => (
        <g key={y}>
          <path
            d={`M40 ${y}C27 ${y - 3} 17 ${y - 14} 15 ${y - 26}C29 ${y - 24} 38 ${y - 14} 40 ${y}Z`}
          />
          <path
            d={`M40 ${y - 12}C53 ${y - 15} 63 ${y - 26} 65 ${y - 38}C51 ${y - 36} 42 ${y - 26} 40 ${y - 12}Z`}
          />
        </g>
      ))}
      <path d="M40 18C34 11 36 5 40 2C44 5 46 11 40 18Z" />
    </svg>
  );
}

function Seal({ open }: { open: boolean }) {
  const t = { duration: 0.6, ease: EASE };
  return (
    <div className="ny7-seal" aria-hidden="true">
      <motion.span
        className="ny7-seal-half ny7-seal-l"
        initial={false}
        animate={{
          x: open ? -30 : 0,
          rotate: open ? -22 : 0,
          opacity: open ? 0 : 1,
        }}
        transition={t}
      />
      <motion.span
        className="ny7-seal-half ny7-seal-r"
        initial={false}
        animate={{
          x: open ? 30 : 0,
          rotate: open ? 22 : 0,
          opacity: open ? 0 : 1,
        }}
        transition={t}
      />
      <motion.span
        className="ny7-seal-mark"
        initial={false}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Sprig />
      </motion.span>
    </div>
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
      className="ny7-sec"
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <header className="ny7-sec-head">
        <span className="ny7-label">
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
export default function LoveLetter07({ website }: { website: WebsiteRecord }) {
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
  const editionNumber = text('editionNumber', 'No. 001');
  const openingLine = text(
    'openingLine',
    'Sebuah arsip kecil yang kusimpan untukmu',
  );
  const writtenDate = text('writtenDate');
  const location = text('location');
  const signature = text('signature', senderName);
  const promiseText = text('promiseText');

  const letterBody = text('letterBody', getString(w, 'message'));
  const paragraphs = letterBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const notes = [
    {
      label: 'Top Notes',
      prompt: 'Hal pertama yang selalu kuingat darimu',
      title: text('topNoteTitle'),
      body: text('topNote'),
    },
    {
      label: 'Heart Notes',
      prompt: 'Hal yang paling membuatku jatuh cinta setiap hari',
      title: text('heartNoteTitle'),
      body: text('heartNote'),
    },
    {
      label: 'Base Notes',
      prompt: 'Perasaan yang selalu tertinggal setiap kali bersamamu',
      title: text('baseNoteTitle'),
      body: text('baseNote'),
    },
  ].filter((n) => n.body);

  const memories = [1, 2, 3, 4]
    .map((i) => ({
      when: text(`memory${i}When`),
      title: text(`memory${i}Title`),
      story: text(`memory${i}Story`),
    }))
    .filter((m) => m.story || m.title);

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
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed');
  const opened = phase !== 'closed';
  const [flipped, setFlipped] = useState<number[]>([]);
  const [lightIdx, setLightIdx] = useState<number | null>(null);
  const [promiseOpen, setPromiseOpen] = useState(false);

  useEffect(() => {
    if (phase !== 'opening') return;
    const timer = setTimeout(
      () => {
        window.scrollTo(0, 0);
        setPhase('open');
      },
      reduce ? 250 : 1600,
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

  const toggleNote = (i: number) =>
    setFlipped((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i],
    );
  const step = (dir: 1 | -1) =>
    setLightIdx((i) =>
      i === null ? i : (i + dir + photos.length) % photos.length,
    );
  const untie = () => {
    if (phase === 'closed') setPhase('opening');
  };

  const lit = photos[lightIdx ?? 0];
  const unwrapping = phase === 'opening';

  return (
    <div className="ny7">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      {/* cahaya matahari berbintik (dappled light) */}
      <div className="ny7-sun" aria-hidden="true">
        <span className="ny7-leaf ny7-leaf-a" />
        <span className="ny7-leaf ny7-leaf-b" />
        <span className="ny7-leaf ny7-leaf-c" />
      </div>

      {/* ================= 01 — THE SILK RIBBON ================= */}
      <AnimatePresence>
        {phase !== 'open' && (
          <motion.section
            key="opening"
            className="ny7-open"
            exit={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
            transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE }}
          >
            <div className="ny7-frame">
              <span className="ny7-corner ny7-c-tl" />
              <span className="ny7-corner ny7-c-tr" />
              <span className="ny7-corner ny7-c-bl" />
              <span className="ny7-corner ny7-c-br" />

              <p className="ny7-label ny7-frame-top">Arsip · {editionNumber}</p>

              <div className="ny7-frame-text">
                <p className="ny7-frame-for">Untuk</p>
                <h1 className="ny7-recipient">{receiverName}</h1>
                <p className="ny7-frame-line">{openingLine}</p>
              </div>

              <motion.div
                className="ny7-tails"
                aria-hidden="true"
                initial={false}
                animate={
                  unwrapping ? { y: 90, opacity: 0 } : { y: 0, opacity: 1 }
                }
                transition={{
                  duration: reduce ? 0.1 : 0.8,
                  ease: EASE,
                  delay: unwrapping ? 0.2 : 0,
                }}
              >
                <span className="ny7-tail ny7-tail-l" />
                <span className="ny7-tail ny7-tail-r" />
              </motion.div>
              <motion.div
                className="ny7-band"
                aria-hidden="true"
                initial={false}
                animate={{ scaleX: unwrapping ? 0 : 1 }}
                transition={{
                  duration: reduce ? 0.1 : 0.7,
                  ease: EASE,
                  delay: unwrapping ? 0.55 : 0,
                }}
              />
              <Seal open={unwrapping} />
            </div>

            <button
              type="button"
              className="ny7-cta"
              onClick={untie}
              disabled={phase !== 'closed'}
            >
              Lepas Pita &amp; Buka Arsip
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= KONTEN UTAMA ================= */}
      {phase === 'open' && (
        <motion.main
          className="ny7-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1 }}
        >
          <div className="ny7-wrap">
            {/* ---------- 02 — THE THREE NOTES ---------- */}
            {notes.length > 0 && (
              <Section
                n={2}
                reduce={reduce}
                kicker="The Three Notes"
                title="Komposisi dirimu"
                note="Kalau kamu sebuah wewangian, beginilah susunannya. Ketuk kartu untuk membaliknya."
              >
                <ul className="ny7-notes">
                  {notes.map((n, i) => {
                    const isFlipped = flipped.includes(i);
                    return (
                      <li key={n.label}>
                        <button
                          type="button"
                          className="ny7-note"
                          aria-pressed={isFlipped}
                          onClick={() => toggleNote(i)}
                        >
                          <motion.span
                            className="ny7-note-inner"
                            initial={false}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{
                              duration: reduce ? 0.01 : 0.85,
                              ease: EASE,
                            }}
                          >
                            <span className="ny7-face ny7-front">
                              <span className="ny7-note-label">{n.label}</span>
                              {n.title && (
                                <span className="ny7-note-title">
                                  {n.title}
                                </span>
                              )}
                              <span className="ny7-note-prompt">
                                {n.prompt}
                              </span>
                              <span className="ny7-note-hint">
                                ketuk untuk membalik
                              </span>
                            </span>
                            <span className="ny7-face ny7-back">
                              <span className="ny7-note-label ny7-on-sage">
                                {n.label}
                              </span>
                              <span className="ny7-note-body">{n.body}</span>
                              <span className="ny7-note-hint ny7-on-sage">
                                ketuk untuk menutup
                              </span>
                            </span>
                          </motion.span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            {/* ---------- 03 — THE VELLUM LETTER ---------- */}
            <Section
              n={3}
              reduce={reduce}
              kicker="The Vellum Letter"
              title="Surat di atas kertas kalkir"
            >
              <div className="ny7-narrow">
                <div className="ny7-vellum-wrap">
                  <Sprig className="ny7-vellum-sprig" />
                  <article className="ny7-vellum">
                    <div className="ny7-vellum-meta ny7-label">
                      {writtenDate && <span>{writtenDate}</span>}
                      {location && <span>{location}</span>}
                    </div>
                    <p className="ny7-greeting">Untuk {receiverName},</p>
                    <div className="ny7-letter">
                      {paragraphs.length > 0 ? (
                        paragraphs.map((p, i) => <p key={i}>{p}</p>)
                      ) : (
                        <p>Surat ini sedang menunggu kata-kata pertamamu.</p>
                      )}
                    </div>
                  </article>
                </div>
              </div>
            </Section>

            {/* ---------- 04 — PRESSED MEMORIES ---------- */}
            {memories.length > 0 && (
              <Section
                n={4}
                reduce={reduce}
                kicker="Pressed Memories"
                title="Spesimen kenangan"
                note="Beberapa momen yang kuawetkan, seperti bunga di antara halaman buku."
              >
                <div className="ny7-specimens">
                  {memories.map((m, i) => (
                    <article key={i} className="ny7-spec">
                      <div className="ny7-plate" aria-hidden="true">
                        <Sprig className="ny7-plate-sprig" flip={i % 2 === 1} />
                      </div>
                      <div className="ny7-tag">
                        <p className="ny7-label">
                          Arsip {pad(i + 1)}
                          {m.when ? ` · ${m.when}` : ''}
                        </p>
                        {m.title && <h3>{m.title}</h3>}
                        {m.story && <p className="ny7-story">{m.story}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {/* ---------- 05 — FRAMED GALLERY ---------- */}
            {photos.length > 0 && (
              <Section
                n={5}
                reduce={reduce}
                kicker="Framed Gallery"
                title="Dalam bingkai"
                note="Ketuk salah satu foto untuk melihatnya lebih besar."
              >
                {mainSrc && (
                  <button
                    type="button"
                    className="ny7-mat ny7-mat-main"
                    onClick={() => setLightIdx(0)}
                    aria-label="Perbesar foto utama"
                  >
                    <img
                      src={mainSrc}
                      alt={photos[0].caption || 'Foto utama'}
                      loading="lazy"
                    />
                    {photos[0].caption && (
                      <span className="ny7-cap">{photos[0].caption}</span>
                    )}
                  </button>
                )}
                {gallerySrc.length > 0 && (
                  <div className="ny7-gallery">
                    {gallerySrc.map((src, i) => (
                      <button
                        type="button"
                        key={`${src}-${i}`}
                        className="ny7-mat"
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
                          <span className="ny7-cap">
                            {photos[i + galleryOffset].caption}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* ---------- 06 — A PROMISE FOR NEXT SEASONS ---------- */}
            <Section
              n={6}
              reduce={reduce}
              kicker="A Promise for Next Seasons"
              title="Sampai musim berikutnya"
            >
              <div className="ny7-narrow ny7-sign">
                <p className="ny7-closing">Dengan seluruh hangat,</p>
                <p className="ny7-signature">{signature}</p>

                {promiseText && (
                  <div className="ny7-promise">
                    <Seal open={promiseOpen} />
                    <button
                      type="button"
                      className="ny7-cta ny7-cta-outline"
                      aria-expanded={promiseOpen}
                      onClick={() => setPromiseOpen((v) => !v)}
                    >
                      {promiseOpen
                        ? 'Tutup Janji'
                        : 'Buka Janji untuk Musim Berikutnya'}
                    </button>
                    <AnimatePresence initial={false}>
                      {promiseOpen && (
                        <motion.div
                          className="ny7-promise-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: reduce ? 0.1 : 0.9,
                            ease: EASE,
                            delay: reduce ? 0 : 0.35,
                          }}
                        >
                          <div className="ny7-vellum ny7-promise-card">
                            <Sprig className="ny7-promise-sprig" />
                            <p>{promiseText}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </Section>

            <footer className="ny7-end">
              <p>{TAGLINE}</p>
            </footer>
          </div>
        </motion.main>
      )}

      {/* ================= LIGHTBOX ================= */}
      <AnimatePresence>
        {lightIdx !== null && lit && (
          <motion.div
            className="ny7-lightbox"
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
              className="ny7-lb-btn ny7-lb-close"
              onClick={() => setLightIdx(null)}
              aria-label="Tutup"
            >
              ×
            </button>
            <motion.figure
              key={lightIdx}
              className="ny7-lb-figure"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lit.src} alt={lit.caption || 'Foto'} />
              {lit.caption && <figcaption>{lit.caption}</figcaption>}
              <span className="ny7-lb-count">
                {pad((lightIdx ?? 0) + 1)} / {pad(photos.length)}
              </span>
            </motion.figure>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="ny7-lb-btn ny7-lb-prev"
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
                  className="ny7-lb-btn ny7-lb-next"
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
/* CSS lokal (scoped di bawah .ny7)                                     */
/* ------------------------------------------------------------------ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

.ny7{
  --alabaster:#f3efe8; --linen:#e8e1d5; --sage:#4a5d4e; --brass:#a68a5b;
  --espresso:#2a2622; --taupe:#6d655c; --mat:#fbf8f2;
  --serif:'Cormorant Garamond',Georgia,'Times New Roman',serif;
  --body:'Newsreader',Georgia,'Times New Roman',serif;
  --sans:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  position:relative; min-height:100vh; min-height:100svh; width:100%;
  background:linear-gradient(170deg,var(--alabaster),var(--linen));
  color:var(--espresso); font-family:var(--body); overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.ny7 *,.ny7 *::before,.ny7 *::after{box-sizing:border-box}
.ny7 h1,.ny7 h2,.ny7 h3,.ny7 p,.ny7 ul,.ny7 ol,.ny7 figure{margin:0;padding:0}
.ny7 ul,.ny7 ol{list-style:none}
.ny7 button{font:inherit;color:var(--espresso);cursor:pointer;-webkit-tap-highlight-color:transparent}
.ny7 button:focus-visible{outline:2px solid var(--sage);outline-offset:4px}
.ny7 img{display:block;max-width:100%}
.ny7-label{font-family:var(--sans);font-weight:500;font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--brass)}

/* ---------- dappled sunlight ---------- */
.ny7-sun{
  position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;
  background:
    radial-gradient(ellipse 62% 50% at 16% 0%,rgba(255,240,205,.8),transparent 70%),
    radial-gradient(ellipse 48% 40% at 100% 18%,rgba(255,246,226,.55),transparent 70%);
}
.ny7-leaf{position:absolute;border-radius:50%;background:rgba(74,93,78,.1);filter:blur(34px);animation:ny7-drift 24s ease-in-out infinite alternate}
.ny7-leaf-a{width:46vmax;height:20vmax;top:-4vmax;left:-14vmax;rotate:24deg}
.ny7-leaf-b{width:34vmax;height:16vmax;top:34vh;right:-14vmax;rotate:-20deg;animation-duration:30s}
.ny7-leaf-c{width:40vmax;height:18vmax;bottom:-6vmax;left:8vmax;rotate:12deg;animation-duration:36s}
@keyframes ny7-drift{from{translate:0 0}to{translate:3.5vmax 2.2vmax}}

/* ---------- 01 opening ---------- */
.ny7-open{
  position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:28px;padding:24px 20px;overflow-y:auto;
}
.ny7-frame{
  position:relative;flex:none;width:min(400px,100%);min-height:min(500px,64vh);min-height:min(500px,64svh);
  display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;
  padding:34px 26px 0;border-radius:3px;overflow:hidden;
  background:linear-gradient(160deg,rgba(255,255,255,.72),rgba(250,246,238,.5));
  border:1px solid var(--brass);
  box-shadow:0 30px 60px -24px rgba(74,60,40,.35),inset 0 0 0 7px rgba(255,255,255,.35),inset 0 0 0 8px rgba(166,138,91,.35);
}
.ny7-corner{position:absolute;width:14px;height:14px;border-color:var(--brass);border-style:solid;opacity:.75}
.ny7-c-tl{top:16px;left:16px;border-width:1px 0 0 1px}
.ny7-c-tr{top:16px;right:16px;border-width:1px 1px 0 0}
.ny7-c-bl{bottom:16px;left:16px;border-width:0 0 1px 1px}
.ny7-c-br{bottom:16px;right:16px;border-width:0 1px 1px 0}
.ny7-frame-top{margin-bottom:34px}
.ny7-frame-text{width:100%}
.ny7-frame-for{font-family:var(--serif);font-style:italic;font-size:1.25rem;color:var(--taupe)}
.ny7-recipient{
  font-family:var(--serif);font-weight:500;font-size:clamp(2.8rem,13vw,4.4rem);line-height:1;
  letter-spacing:-.01em;margin:6px 0 14px;color:var(--espresso);overflow-wrap:anywhere;
}
.ny7-frame-line{font-family:var(--body);font-style:italic;font-size:1.02rem;line-height:1.5;color:var(--taupe);max-width:300px;margin:0 auto}
.ny7-band{
  position:absolute;left:-1px;right:-1px;top:66%;height:34px;margin-top:-17px;z-index:3;transform-origin:center;
  background:linear-gradient(180deg,#566a5a,var(--sage) 50%,#415245);
  box-shadow:0 1px 0 rgba(166,138,91,.8),0 -1px 0 rgba(166,138,91,.8),0 8px 14px -6px rgba(42,38,34,.35);
}
.ny7-tails{position:absolute;left:50%;top:66%;width:0;height:0;z-index:2}
.ny7-tail{position:absolute;top:8px;width:26px;height:120px;background:linear-gradient(180deg,var(--sage),#3d4e41);clip-path:polygon(0 0,100% 0,100% 100%,50% 88%,0 100%)}
.ny7-tail-l{left:-30px;transform:rotate(5deg);transform-origin:top center}
.ny7-tail-r{left:4px;transform:rotate(-5deg);transform-origin:top center}
.ny7-open .ny7-seal{position:absolute;left:50%;top:66%;margin:-27px 0 0 -27px;z-index:4}

/* seal (dipakai di pembuka dan janji) */
.ny7-seal{position:relative;width:54px;height:54px;flex:none}
.ny7-seal-half{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,#d8bf8e,var(--brass) 62%,#836a42);box-shadow:0 6px 12px rgba(74,60,40,.3),inset 0 0 0 3px rgba(255,255,255,.14)}
.ny7-seal-l{clip-path:inset(0 50% 0 0)}
.ny7-seal-r{clip-path:inset(0 0 0 50%)}
.ny7-seal-mark{position:absolute;inset:0;display:grid;place-items:center;color:rgba(243,239,232,.92)}
.ny7-seal-mark svg{width:22px;height:34px}

.ny7-cta{
  appearance:none;padding:15px 30px;border-radius:999px;border:1px solid var(--brass);
  background:var(--sage);color:var(--alabaster);font-family:var(--sans);font-weight:500;font-size:.82rem;
  letter-spacing:.12em;text-transform:uppercase;transition:background .35s,transform .35s,box-shadow .35s;
  box-shadow:0 14px 28px -12px rgba(74,93,78,.7);
}
.ny7-cta:hover:not(:disabled){background:#3d4e41;transform:translateY(-2px)}
.ny7-cta:disabled{cursor:default;opacity:.8}
.ny7-cta-outline{background:transparent;color:var(--sage);border-color:var(--sage);box-shadow:none}
.ny7-cta-outline:hover:not(:disabled){background:var(--sage);color:var(--alabaster)}

/* ---------- page ---------- */
.ny7-page{position:relative;z-index:1}
.ny7-wrap{width:min(1040px,calc(100% - 32px));margin:0 auto;padding:clamp(56px,10vw,110px) 0 90px}
.ny7-narrow{width:min(720px,100%);margin:0 auto}
.ny7-sec{margin-bottom:clamp(84px,14vw,150px)}
.ny7-sec-head{margin-bottom:38px;text-align:center}
.ny7-sec-head h2{font-family:var(--serif);font-weight:500;font-size:clamp(2.2rem,7.5vw,3.5rem);line-height:1.02;letter-spacing:-.01em;margin:14px 0 12px;color:var(--espresso)}
.ny7-sec-head p{font-family:var(--body);font-style:italic;font-size:1.05rem;line-height:1.6;color:var(--taupe);max-width:480px;margin:0 auto}

/* ---------- 02 notes ---------- */
.ny7-notes{display:grid;gap:18px;grid-template-columns:1fr}
.ny7-note{display:block;width:100%;padding:0;border:0;background:none;text-align:left;perspective:1400px}
.ny7-note-inner{display:grid;transform-style:preserve-3d}
.ny7-face{
  grid-area:1/1;display:flex;flex-direction:column;gap:12px;min-height:330px;padding:28px 24px 22px;
  border-radius:3px;backface-visibility:hidden;-webkit-backface-visibility:hidden;
}
.ny7-front{background:linear-gradient(165deg,#fbf8f2,#efe8da);border:1px solid var(--brass);box-shadow:0 18px 36px -20px rgba(74,60,40,.35),inset 0 0 0 6px rgba(255,255,255,.4)}
.ny7-back{transform:rotateY(180deg);background:linear-gradient(165deg,#566a5a,var(--sage));border:1px solid var(--brass);box-shadow:0 18px 36px -18px rgba(42,52,44,.55);color:var(--alabaster)}
.ny7-note-label{font-family:var(--sans);font-weight:500;font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--brass)}
.ny7-note-title{font-family:var(--serif);font-weight:500;font-size:1.85rem;line-height:1.08;color:var(--espresso);margin-top:6px}
.ny7-note-prompt{font-family:var(--body);font-style:italic;font-size:1rem;line-height:1.5;color:var(--taupe)}
.ny7-note-hint{margin-top:auto;padding-top:10px;font-family:var(--sans);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:var(--taupe)}
.ny7-note-body{font-family:var(--body);font-size:1.02rem;line-height:1.7;color:var(--alabaster)}
.ny7-on-sage{color:#e3cfa3}
.ny7-back .ny7-note-hint{color:#d9d3c6}
.ny7-note:hover .ny7-front{border-color:var(--sage)}

/* ---------- 03 vellum ---------- */
.ny7-vellum-wrap{position:relative}
.ny7-vellum-sprig{position:absolute;z-index:0;right:-12px;top:-46px;width:110px;height:auto;color:var(--sage);opacity:.55;transform:rotate(14deg)}
.ny7-vellum{
  position:relative;z-index:1;padding:clamp(32px,7vw,68px) clamp(24px,6.5vw,64px);border-radius:3px;
  background:linear-gradient(160deg,rgba(255,255,255,.66),rgba(250,246,238,.46));
  -webkit-backdrop-filter:blur(14px) saturate(1.1);backdrop-filter:blur(14px) saturate(1.1);
  border:1px solid var(--brass);box-shadow:0 30px 60px -28px rgba(74,60,40,.4);
}
.ny7-vellum::after{content:'';position:absolute;inset:9px;border:1px solid rgba(166,138,91,.35);pointer-events:none;border-radius:1px}
.ny7-vellum-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 18px;padding-bottom:16px;margin-bottom:32px;border-bottom:1px solid rgba(166,138,91,.4)}
.ny7-greeting{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(1.9rem,6vw,2.6rem);margin-bottom:22px;color:var(--espresso)}
.ny7-letter p{font-family:var(--body);font-size:clamp(1.08rem,3.6vw,1.22rem);line-height:1.85;margin-bottom:1.25em;white-space:pre-line;color:var(--espresso)}
.ny7-letter p:last-child{margin-bottom:0}
.ny7-letter p:first-child::first-letter{float:left;font-family:var(--serif);font-weight:500;font-size:4.5em;line-height:.78;padding:.07em .1em 0 0;color:var(--sage)}

/* ---------- 04 specimens ---------- */
.ny7-specimens{display:grid;gap:clamp(28px,6vw,52px);width:min(840px,100%);margin:0 auto}
.ny7-spec{display:grid;grid-template-columns:minmax(96px,150px) 1fr;gap:clamp(18px,4vw,40px);align-items:center}
.ny7-plate{
  position:relative;aspect-ratio:3/4;display:grid;place-items:center;border-radius:2px;
  background:linear-gradient(165deg,#f6f1e6,var(--linen));border:1px solid rgba(166,138,91,.7);
  box-shadow:0 14px 26px -16px rgba(74,60,40,.4);
}
.ny7-plate::before,.ny7-plate::after{content:'';position:absolute;width:30px;height:12px;background:rgba(166,138,91,.3);top:-5px}
.ny7-plate::before{left:-8px;transform:rotate(-38deg)}
.ny7-plate::after{right:-8px;transform:rotate(38deg)}
.ny7-plate-sprig{width:58%;height:auto;color:var(--sage);opacity:.85}
.ny7-spec:nth-child(even) .ny7-plate-sprig{transform:rotate(-6deg)}
.ny7-spec:nth-child(odd) .ny7-plate-sprig{transform:rotate(5deg)}
.ny7-tag{padding:4px 0}
.ny7-tag .ny7-label{display:inline-block;padding-bottom:10px;border-bottom:1px dashed rgba(166,138,91,.7);margin-bottom:14px}
.ny7-tag h3{font-family:var(--serif);font-weight:500;font-size:clamp(1.6rem,5vw,2.1rem);line-height:1.1;margin-bottom:10px;color:var(--espresso)}
.ny7-story{font-family:var(--body);font-size:1.04rem;line-height:1.7;color:var(--taupe)}

/* ---------- 05 gallery ---------- */
.ny7-mat{
  display:block;width:100%;padding:clamp(10px,2.6vw,16px) clamp(10px,2.6vw,16px) 0;border:1px solid var(--brass);border-radius:2px;
  background:var(--mat);color:var(--espresso);text-align:left;
  box-shadow:0 20px 38px -22px rgba(74,60,40,.5);transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;
}
.ny7-mat:hover{transform:translateY(-4px);box-shadow:0 30px 48px -22px rgba(74,60,40,.55)}
.ny7-mat img{width:100%;aspect-ratio:4/5;object-fit:cover;box-shadow:0 0 0 1px rgba(166,138,91,.85);filter:saturate(.94)}
.ny7-cap{display:block;padding:14px 4px 16px;font-family:var(--body);font-style:italic;font-size:1rem;line-height:1.4;color:var(--espresso)}
.ny7-mat-main{width:min(460px,100%);margin:0 auto 34px}
.ny7-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.ny7-gallery .ny7-mat img{aspect-ratio:1/1.1}

/* ---------- 06 promise ---------- */
.ny7-sign{text-align:center}
.ny7-closing{font-family:var(--serif);font-style:italic;font-size:clamp(1.4rem,5vw,1.8rem);color:var(--taupe)}
.ny7-signature{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(3.2rem,14vw,5.4rem);line-height:1.1;color:var(--sage);transform:rotate(-3deg);margin:6px 0 0;overflow-wrap:anywhere}
.ny7-promise{margin-top:clamp(46px,8vw,70px);display:flex;flex-direction:column;align-items:center;gap:22px}
.ny7-promise-body{width:100%;overflow:hidden;text-align:left}
.ny7-promise-card{margin-top:10px;padding:clamp(28px,6vw,52px)}
.ny7-promise-sprig{position:absolute;right:16px;bottom:14px;width:44px;height:auto;color:var(--sage);opacity:.35}
.ny7-promise-card p{font-family:var(--serif);font-style:italic;font-size:clamp(1.35rem,4.8vw,1.7rem);line-height:1.55;color:var(--espresso);white-space:pre-line;position:relative}
.ny7-end{text-align:center;padding-top:20px}
.ny7-end p{font-family:var(--serif);font-style:italic;font-size:1.05rem;line-height:1.5;color:var(--taupe);max-width:420px;margin:0 auto}

/* ---------- lightbox ---------- */
.ny7-lightbox{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:60px 14px 28px;background:rgba(42,38,34,.94);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.ny7-lb-figure{max-width:min(900px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center;gap:12px}
.ny7-lb-figure img{max-width:100%;max-height:calc(100vh - 190px);max-height:calc(100svh - 190px);object-fit:contain;border:10px solid var(--mat);box-shadow:0 0 0 1px var(--brass),0 30px 80px rgba(0,0,0,.6)}
.ny7-lb-figure figcaption{font-family:var(--body);font-style:italic;font-size:clamp(1.05rem,4vw,1.25rem);line-height:1.45;color:#f3efe8;text-align:center;max-width:540px}
.ny7-lb-count{font-family:var(--sans);font-size:.66rem;letter-spacing:.22em;color:#d4b98a}
.ny7-lb-btn{position:absolute;width:46px;height:46px;border-radius:50%;border:1px solid rgba(212,185,138,.6);background:rgba(42,38,34,.7);color:#f3efe8;font-size:1.7rem;line-height:1;display:grid;place-items:center;padding:0}
.ny7-lb-btn:hover{background:rgba(166,138,91,.35)}
.ny7-lb-close{top:12px;right:14px}
.ny7-lb-prev{left:8px;top:50%;transform:translateY(-50%)}
.ny7-lb-next{right:8px;top:50%;transform:translateY(-50%)}

/* ---------- breakpoints ---------- */
@media (min-width:760px){
  .ny7-notes{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
  .ny7-face{min-height:380px}
  .ny7-gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
  .ny7-spec:nth-child(even){grid-template-columns:1fr minmax(96px,150px)}
  .ny7-spec:nth-child(even) .ny7-plate{order:2}
  .ny7-lb-prev{left:24px}
  .ny7-lb-next{right:24px}
}
@media (max-width:380px){
  .ny7-frame{padding:30px 18px 0}
  .ny7-face{padding:24px 18px 20px}
  .ny7-cta{padding:14px 22px;font-size:.76rem}
  .ny7-spec{grid-template-columns:84px 1fr}
}
@media (prefers-reduced-motion:reduce){
  .ny7-leaf{animation:none}
  .ny7-mat,.ny7-cta{transition:none}
}
`;
