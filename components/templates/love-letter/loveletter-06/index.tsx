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
  'Written in the quiet hours, when all I can think about is you.';
const TILTS = [-2.6, 1.8, -1.3, 2.7, -2, 1.4];

/* ------------------------------------------------------------------ */
/* Sub-komponen kecil                                                   */
/* ------------------------------------------------------------------ */
function Clock({ time }: { time: string }) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(.*)$/);
  if (!match) return <>{time}</>;
  return (
    <>
      {match[1]}
      <span className="ml6-colon">:</span>
      {match[2]}
      {match[3] ? ` ${match[3]}` : ''}
    </>
  );
}

function Section({
  n,
  title,
  note,
  reduce,
  children,
}: {
  n: number;
  title: string;
  note?: string;
  reduce: boolean;
  children: ReactNode;
}) {
  return (
    <motion.section
      className="ml6-sec"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <header className="ml6-sec-head">
        <span className="ml6-mono">{pad(n)} / 06</span>
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
export default function LoveLetter06({ website }: { website: WebsiteRecord }) {
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
  const writtenTime = text('writtenTime', '02:14 AM');
  const location = text('location', 'Bandung');
  const writtenDate = text('writtenDate');
  const openingLine = text('openingLine', 'Ditulis saat kamu sedang tertidur');
  const signature = text('signature', senderName);
  const psText = text('psText');

  const letterBody = text('letterBody', getString(w, 'message'));
  const paragraphs = letterBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const drafts = [1, 2, 3, 4]
    .map((i) => ({ time: text(`draft${i}Time`), body: text(`draft${i}Text`) }))
    .filter((d) => d.body);

  const things = [1, 2, 3, 4, 5].map((i) => text(`thing${i}`)).filter(Boolean);

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
  const [phase, setPhase] = useState<'off' | 'lighting' | 'on'>('off');
  const opened = phase !== 'off';
  const [openDrafts, setOpenDrafts] = useState<number[]>([]);
  const [activeThing, setActiveThing] = useState<number | null>(null);
  const [lightIdx, setLightIdx] = useState<number | null>(null);
  const [psOpen, setPsOpen] = useState(false);

  useEffect(() => {
    if (phase !== 'lighting') return;
    const timer = setTimeout(
      () => {
        window.scrollTo(0, 0);
        setPhase('on');
      },
      reduce ? 250 : 1500,
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

  function lightUp() {
    if (phase === 'off') setPhase('lighting');
  }
  function toggleDraft(i: number) {
    setOpenDrafts((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i],
    );
  }
  const step = (dir: 1 | -1) =>
    setLightIdx((i) =>
      i === null ? i : (i + dir + photos.length) % photos.length,
    );

  const lit = photos[lightIdx ?? 0];

  return (
    <div className="ml6">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={opened} />

      {/* ================= 01 — THE QUIET HOUR ================= */}
      <AnimatePresence>
        {phase !== 'on' && (
          <motion.section
            key="opening"
            className="ml6-open"
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.9, ease: 'easeInOut' }}
          >
            <span className="ml6-mono ml6-open-index">01 / 06</span>
            <div className="ml6-open-inner">
              <p
                className="ml6-clock ml6-mono"
                aria-label={`${writtenTime}, ${location}`}
              >
                <Clock time={writtenTime} />
                <span className="ml6-clock-sep"> · </span>
                <span>{location}</span>
              </p>
              <p className="ml6-open-line">{openingLine}</p>
              <h1 className="ml6-recipient">{receiverName}</h1>

              <button
                type="button"
                className={`ml6-switch ${phase === 'lighting' ? 'is-on' : ''}`}
                onClick={lightUp}
                disabled={phase !== 'off'}
                aria-pressed={phase !== 'off'}
              >
                <span className="ml6-track" aria-hidden="true">
                  <span className="ml6-knob" />
                </span>
                <span>Nyalakan Lampu &amp; Baca Surat</span>
              </button>
            </div>
            <p className="ml6-open-tagline">{TAGLINE}</p>

            <motion.div
              className="ml6-flash"
              aria-hidden="true"
              initial={false}
              animate={
                phase === 'lighting'
                  ? { opacity: 1, scale: reduce ? 1 : 2.6 }
                  : { opacity: 0, scale: 0.2 }
              }
              transition={{ duration: reduce ? 0.2 : 1.3, ease: EASE }}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= KONTEN UTAMA ================= */}
      {phase === 'on' && (
        <motion.main
          className="ml6-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="ml6-lamp" aria-hidden="true" />
          <div className="ml6-vignette" aria-hidden="true" />

          <div className="ml6-wrap">
            {/* ---------- 02 — UNSENT DRAFTS ---------- */}
            {drafts.length > 0 && (
              <Section
                n={2}
                reduce={reduce}
                title="Pesan yang sempat tertahan"
                note="Catatan yang hampir kukirim lewat chat, lalu kuhapus lagi."
              >
                <ul className="ml6-drafts">
                  {drafts.map((d, i) => {
                    const isOpen = openDrafts.includes(i);
                    return (
                      <li
                        key={i}
                        className={`ml6-draft ${isOpen ? 'is-open' : ''}`}
                      >
                        <button
                          type="button"
                          className="ml6-draft-btn"
                          aria-expanded={isOpen}
                          onClick={() => toggleDraft(i)}
                        >
                          <span className="ml6-mono">
                            Draft #{pad(i + 1)}
                            {d.time ? ` · ${d.time}` : ''}
                          </span>
                          <span className="ml6-draft-hint">
                            {isOpen ? 'lipat kembali' : 'ketuk untuk membuka'}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="ml6-draft-body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reduce ? 0.1 : 0.55,
                                ease: EASE,
                              }}
                            >
                              <p>{d.body}</p>
                              <span className="ml6-unsent ml6-mono">
                                tidak jadi terkirim
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            {/* ---------- 03 — THE MAIN LETTER ---------- */}
            <Section n={3} reduce={reduce} title="Surat di atas meja">
              <article className="ml6-paper">
                <div className="ml6-paper-meta ml6-mono">
                  {writtenDate && <span>{writtenDate}</span>}
                  <span>
                    {writtenTime} · {location}
                  </span>
                </div>
                <p className="ml6-greeting">Untuk {receiverName},</p>
                <div className="ml6-letter">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p>Surat ini sedang menunggu kata-kata pertamamu.</p>
                  )}
                </div>
              </article>
            </Section>

            {/* ---------- 04 — LITTLE THINGS ---------- */}
            {things.length > 0 && (
              <Section
                n={4}
                reduce={reduce}
                title="Hal kecil yang kusuka darimu"
                note="Detail yang mungkin tidak pernah kamu sadari."
              >
                <ol className="ml6-things">
                  {things.map((t, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className={`ml6-thing ${activeThing === i ? 'is-active' : ''}`}
                        aria-pressed={activeThing === i}
                        onClick={() =>
                          setActiveThing(activeThing === i ? null : i)
                        }
                      >
                        <span className="ml6-thing-num ml6-mono">
                          {pad(i + 1)}
                        </span>
                        <span className="ml6-thing-text">{t}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {/* ---------- 05 — PHOTOS ON THE DESK ---------- */}
            {photos.length > 0 && (
              <Section
                n={5}
                reduce={reduce}
                title="Foto di atas meja"
                note="Ketuk salah satu untuk melihatnya lebih jelas."
              >
                <div className="ml6-desk">
                  {mainSrc && (
                    <button
                      type="button"
                      className="ml6-photo ml6-photo-main"
                      style={{ ['--r' as string]: '-1.4deg' }}
                      onClick={() => setLightIdx(0)}
                      aria-label="Perbesar foto utama"
                    >
                      <img
                        src={mainSrc}
                        alt={photos[0].caption || 'Foto utama'}
                        loading="lazy"
                      />
                      {photos[0].caption && (
                        <span className="ml6-photo-cap">
                          {photos[0].caption}
                        </span>
                      )}
                    </button>
                  )}
                  {gallerySrc.length > 0 && (
                    <div className="ml6-gallery">
                      {gallerySrc.map((src, i) => (
                        <button
                          type="button"
                          key={`${src}-${i}`}
                          className="ml6-photo"
                          style={{
                            ['--r' as string]: `${TILTS[i % TILTS.length]}deg`,
                          }}
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
                            <span className="ml6-photo-cap">
                              {photos[i + galleryOffset].caption}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* ---------- 06 — SIGN-OFF & P.S. ---------- */}
            <Section n={6} reduce={reduce} title="Sampai di sini dulu">
              <div className="ml6-paper ml6-signoff">
                <p className="ml6-closing">Selalu milikmu,</p>
                <p className="ml6-signature">{signature}</p>
              </div>

              {psText && (
                <div className="ml6-ps">
                  <div className="ml6-env" aria-hidden="true">
                    <div className="ml6-env-back" />
                    <motion.div
                      className="ml6-env-card"
                      initial={false}
                      animate={{ y: psOpen ? '-42%' : '0%' }}
                      transition={{
                        duration: reduce ? 0.1 : 0.9,
                        ease: EASE,
                        delay: psOpen ? 0.35 : 0,
                      }}
                    />
                    <div className="ml6-env-front" />
                    <motion.div
                      className="ml6-env-flap"
                      initial={false}
                      animate={{
                        scaleY: psOpen ? 0 : 1,
                        opacity: psOpen ? 0 : 1,
                      }}
                      transition={{ duration: reduce ? 0.1 : 0.55, ease: EASE }}
                    />
                    <motion.div
                      className="ml6-env-seal"
                      initial={false}
                      animate={{
                        scale: psOpen ? 0 : 1,
                        opacity: psOpen ? 0 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      ♥
                    </motion.div>
                  </div>

                  <button
                    type="button"
                    className="ml6-ps-btn"
                    aria-expanded={psOpen}
                    onClick={() => setPsOpen((v) => !v)}
                  >
                    {psOpen
                      ? 'Simpan kembali P.S.'
                      : 'Buka P.S. (Catatan Rahasia)'}
                  </button>

                  <AnimatePresence initial={false}>
                    {psOpen && (
                      <motion.div
                        className="ml6-ps-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reduce ? 0.1 : 0.8,
                          ease: EASE,
                          delay: reduce ? 0 : 0.5,
                        }}
                      >
                        <div className="ml6-paper ml6-ps-card">
                          <p>{psText}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </Section>

            <footer className="ml6-end">
              <p>{TAGLINE}</p>
            </footer>
          </div>
        </motion.main>
      )}

      {/* ================= LIGHTBOX ================= */}
      <AnimatePresence>
        {lightIdx !== null && lit && (
          <motion.div
            className="ml6-lightbox"
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
              className="ml6-lb-close"
              onClick={() => setLightIdx(null)}
              aria-label="Tutup"
            >
              ×
            </button>
            <motion.figure
              key={lightIdx}
              className="ml6-lb-figure"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lit.src} alt={lit.caption || 'Foto'} />
              {lit.caption && <figcaption>{lit.caption}</figcaption>}
            </motion.figure>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="ml6-lb-nav ml6-lb-prev"
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
                  className="ml6-lb-nav ml6-lb-next"
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
/* CSS lokal (scoped di bawah .ml6)                                     */
/* ------------------------------------------------------------------ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=JetBrains+Mono:wght@300;400&display=swap');

.ml6{
  --navy-0:#0b0f17; --navy-1:#121824; --amber:#e6c79c; --gold:#c89d66;
  --paper:#f5efe4; --ink:#2f2419; --ink-soft:#6b5a48;
  --serif:'Cormorant Garamond',Georgia,'Times New Roman',serif;
  --body:'Newsreader',Georgia,'Times New Roman',serif;
  --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  position:relative; min-height:100vh; min-height:100svh; width:100%;
  background:linear-gradient(180deg,var(--navy-0),var(--navy-1) 45%,var(--navy-0));
  color:#e9e0d2; font-family:var(--body); overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.ml6 *,.ml6 *::before,.ml6 *::after{box-sizing:border-box}
.ml6 h1,.ml6 h2,.ml6 p,.ml6 ul,.ml6 ol,.ml6 figure{margin:0;padding:0}
.ml6 ul,.ml6 ol{list-style:none}
.ml6 button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.ml6 button:focus-visible{outline:2px solid var(--amber);outline-offset:3px}
.ml6 img{display:block;max-width:100%}
.ml6-mono{font-family:var(--mono);font-weight:300;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(230,199,156,.72)}

/* ---------- 01 opening ---------- */
.ml6-open{
  position:fixed; inset:0; z-index:30; display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center; padding:28px 20px;
  overflow:hidden;
  background:
    radial-gradient(ellipse 60% 40% at 50% 100%,rgba(200,157,102,.1),transparent 70%),
    linear-gradient(180deg,var(--navy-0),var(--navy-1));
}
.ml6-open-index{position:absolute;top:22px;left:22px}
.ml6-open-inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;max-width:620px}
.ml6-clock{font-size:clamp(.8rem,2.8vw,.95rem);color:var(--amber);margin-bottom:34px}
.ml6-clock-sep{opacity:.5}
.ml6-colon{animation:ml6-blink 1.6s steps(1,end) infinite;display:inline-block;margin:0 .04em}
@keyframes ml6-blink{0%,55%{opacity:1}56%,100%{opacity:.12}}
.ml6-open-line{font-family:var(--serif);font-style:italic;font-size:clamp(1.2rem,4.4vw,1.5rem);color:rgba(233,224,210,.7)}
.ml6-recipient{
  font-family:var(--serif);font-weight:500;font-size:clamp(3.2rem,15vw,6.8rem);
  line-height:1;letter-spacing:-.02em;margin:10px 0 46px;color:#f3e6d0;
  text-shadow:0 0 42px rgba(230,199,156,.18);overflow-wrap:anywhere;
}
.ml6-switch{
  display:inline-flex;align-items:center;gap:16px;padding:12px 26px 12px 14px;
  border-radius:999px;border:1px solid rgba(230,199,156,.35);background:rgba(230,199,156,.06);
  color:var(--amber);font-family:var(--serif);font-size:clamp(1.02rem,3.8vw,1.2rem);
  transition:background .4s,border-color .4s,box-shadow .6s;
}
.ml6-switch:hover:not(:disabled){background:rgba(230,199,156,.12);border-color:rgba(230,199,156,.6)}
.ml6-switch:disabled{cursor:default}
.ml6-switch.is-on{box-shadow:0 0 60px rgba(230,199,156,.45);border-color:var(--amber)}
.ml6-track{position:relative;flex:none;width:46px;height:26px;border-radius:999px;background:#1a2231;border:1px solid rgba(230,199,156,.3)}
.ml6-knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#6b6458;transition:transform .5s cubic-bezier(.22,1,.36,1),background .5s,box-shadow .5s}
.ml6-switch.is-on .ml6-knob{transform:translateX(20px);background:var(--amber);box-shadow:0 0 18px 4px rgba(230,199,156,.85)}
.ml6-open-tagline{position:absolute;bottom:24px;left:20px;right:20px;font-family:var(--serif);font-style:italic;font-size:.98rem;color:rgba(233,224,210,.42)}
.ml6-flash{
  position:absolute;inset:0;z-index:5;pointer-events:none;opacity:0;
  background:radial-gradient(circle at 50% 62%,rgba(255,232,186,.95),rgba(230,199,156,.55) 28%,transparent 62%);
}

/* ---------- page + lamp ---------- */
.ml6-page{position:relative;z-index:1}
.ml6-lamp{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse 70% 55% at 50% -5%,rgba(230,199,156,.2),transparent 70%);
  animation:ml6-breathe 7s ease-in-out infinite;
}
@keyframes ml6-breathe{0%,100%{opacity:.85}50%{opacity:1}}
.ml6-vignette{position:fixed;inset:0;z-index:0;pointer-events:none;box-shadow:inset 0 0 160px rgba(0,0,0,.55)}
.ml6-wrap{position:relative;z-index:2;width:min(760px,calc(100% - 32px));margin:0 auto;padding:clamp(56px,10vw,110px) 0 90px}
.ml6-sec{margin-bottom:clamp(80px,14vw,150px)}
.ml6-sec-head{margin-bottom:34px}
.ml6-sec-head h2{font-family:var(--serif);font-weight:500;font-size:clamp(2.1rem,7.5vw,3.3rem);line-height:1.02;margin:12px 0 10px;color:#f3e6d0;letter-spacing:-.01em}
.ml6-sec-head p{font-family:var(--serif);font-style:italic;font-size:1.15rem;color:rgba(233,224,210,.6)}

/* ---------- 02 drafts ---------- */
.ml6-drafts{display:grid;gap:14px}
.ml6-draft{
  position:relative;border-radius:6px 24px 6px 6px;overflow:hidden;
  background:linear-gradient(160deg,rgba(255,255,255,.05),rgba(255,255,255,.015));
  border:1px solid rgba(230,199,156,.16);transition:border-color .4s,box-shadow .5s;
}
.ml6-draft::after{content:'';position:absolute;top:0;right:0;width:28px;height:28px;background:linear-gradient(225deg,var(--navy-0) 50%,rgba(230,199,156,.28) 50%);pointer-events:none}
.ml6-draft.is-open{border-color:rgba(230,199,156,.42);box-shadow:0 0 46px rgba(230,199,156,.09)}
.ml6-draft-btn{width:100%;display:flex;flex-direction:column;gap:6px;text-align:left;background:none;border:0;padding:18px 48px 18px 20px}
.ml6-draft-hint{font-family:var(--serif);font-style:italic;font-size:1.02rem;color:rgba(233,224,210,.5)}
.ml6-draft-body{overflow:hidden}
.ml6-draft-body p{padding:0 22px;font-family:var(--serif);font-style:italic;font-size:clamp(1.2rem,4.4vw,1.4rem);line-height:1.55;color:#efe3cf}
.ml6-unsent{display:block;padding:14px 22px 20px;font-size:.62rem}

/* ---------- 03 paper ---------- */
.ml6-paper{
  position:relative;border-radius:4px 4px 10px 10px;color:var(--ink);
  background:linear-gradient(135deg,#f8f2e7,var(--paper) 55%,#efe6d4);
  padding:clamp(30px,7vw,72px) clamp(24px,6.5vw,68px);
  box-shadow:0 2px 3px rgba(0,0,0,.4),0 22px 40px -12px rgba(0,0,0,.6),0 60px 120px -30px rgba(200,157,102,.28);
  transform:rotate(-.35deg);
}
.ml6-paper::before{
  content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.5;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .18 0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.ml6-paper>*{position:relative}
.ml6-paper-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 18px;color:var(--ink-soft);margin-bottom:34px;padding-bottom:16px;border-bottom:1px solid rgba(107,90,72,.25)}
.ml6-paper .ml6-mono{color:var(--ink-soft)}
.ml6-greeting{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(1.8rem,6vw,2.5rem);margin-bottom:22px;color:#3d2c1c}
.ml6-letter p{font-family:var(--body);font-size:clamp(1.08rem,3.6vw,1.24rem);line-height:1.85;margin-bottom:1.25em;white-space:pre-line;color:var(--ink)}
.ml6-letter p:last-child{margin-bottom:0}
.ml6-letter p:first-child::first-letter{float:left;font-family:var(--serif);font-weight:500;font-size:4.4em;line-height:.78;padding:.07em .1em 0 0;color:#8a5a2b}

/* ---------- 04 things ---------- */
.ml6-things{display:grid;gap:4px;counter-reset:none}
.ml6-thing{
  width:100%;display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:baseline;text-align:left;
  padding:20px 16px;background:transparent;border:0;border-left:2px solid rgba(230,199,156,.14);
  border-bottom:1px solid rgba(255,255,255,.06);transition:background .45s,border-color .45s,padding-left .45s;
}
.ml6-thing-num{transition:color .4s,text-shadow .4s}
.ml6-thing-text{font-family:var(--serif);font-size:clamp(1.3rem,4.8vw,1.6rem);line-height:1.35;color:rgba(243,230,208,.82);transition:color .4s}
.ml6-thing:hover,.ml6-thing.is-active{background:linear-gradient(90deg,rgba(230,199,156,.15),transparent 85%);border-left-color:var(--amber);padding-left:22px}
.ml6-thing:hover .ml6-thing-num,.ml6-thing.is-active .ml6-thing-num{color:var(--amber);text-shadow:0 0 14px rgba(230,199,156,.7)}
.ml6-thing:hover .ml6-thing-text,.ml6-thing.is-active .ml6-thing-text{color:#fff3dc}

/* ---------- 05 photos ---------- */
.ml6-desk{display:grid;gap:clamp(26px,6vw,44px)}
.ml6-photo{
  display:block;width:100%;padding:10px 10px 0;border:0;text-align:left;
  background:#f7f1e6;border-radius:3px;color:#4a3a2a;
  box-shadow:0 18px 34px -10px rgba(0,0,0,.7),0 2px 4px rgba(0,0,0,.4);
  transform:rotate(var(--r,0deg));transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;
}
.ml6-photo:hover{transform:rotate(0deg) scale(1.025);box-shadow:0 28px 50px -10px rgba(0,0,0,.75),0 0 60px rgba(230,199,156,.14)}
.ml6-photo img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:1px;filter:sepia(.12) saturate(.95)}
.ml6-photo-cap{display:block;padding:14px 6px 16px;font-family:var(--serif);font-style:italic;font-size:1.08rem;line-height:1.35;color:#4a3a2a}
.ml6-photo-main{width:min(440px,92%);margin:0 auto}
.ml6-photo-main img{aspect-ratio:4/5}
.ml6-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(18px,4vw,30px) clamp(14px,3.5vw,28px)}
.ml6-gallery .ml6-photo:nth-child(even){margin-top:22px}
.ml6-gallery .ml6-photo img{aspect-ratio:1/1.1}

/* ---------- 06 sign-off + P.S. ---------- */
.ml6-signoff{padding-top:clamp(34px,7vw,60px);padding-bottom:clamp(34px,7vw,60px)}
.ml6-closing{font-family:var(--serif);font-style:italic;font-size:clamp(1.4rem,5vw,1.8rem);color:var(--ink-soft)}
.ml6-signature{font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(3rem,13vw,5rem);line-height:1.1;color:#5b3a1c;transform:rotate(-3deg);transform-origin:left center;margin-top:8px;overflow-wrap:anywhere}
.ml6-ps{margin-top:clamp(50px,9vw,80px);display:flex;flex-direction:column;align-items:center}
.ml6-env{position:relative;width:min(240px,70%);aspect-ratio:1.6;margin:48px auto 30px;filter:drop-shadow(0 20px 26px rgba(0,0,0,.55))}
.ml6-env>*{position:absolute}
.ml6-env-back{inset:0;border-radius:8px;background:#b99768}
.ml6-env-card{left:8%;right:8%;top:10%;bottom:8%;border-radius:4px;background:linear-gradient(180deg,#fbf6ec,#f1e8d6);box-shadow:0 4px 10px rgba(0,0,0,.25)}
.ml6-env-front{inset:0;border-radius:8px;clip-path:polygon(0 0,50% 64%,100% 0,100% 100%,0 100%);background:linear-gradient(145deg,#e2cfa8,#c9ab78)}
.ml6-env-flap{left:0;right:0;top:0;height:64%;transform-origin:top center;clip-path:polygon(0 0,100% 0,50% 100%);background:linear-gradient(160deg,#ecdcb9,#cfb27f)}
.ml6-env-seal{left:50%;top:64%;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#b54f69,#7e2b42 70%);color:#f9d6df;font-size:.9rem}
.ml6-ps-btn{
  padding:14px 28px;border-radius:999px;border:1px solid rgba(230,199,156,.4);background:rgba(230,199,156,.07);
  color:var(--amber);font-family:var(--serif);font-size:clamp(1.05rem,3.8vw,1.2rem);transition:background .35s,border-color .35s,transform .35s;
}
.ml6-ps-btn:hover{background:rgba(230,199,156,.16);border-color:var(--amber);transform:translateY(-2px)}
.ml6-ps-body{width:100%;overflow:hidden}
.ml6-ps-card{margin-top:34px;transform:rotate(.5deg);padding:clamp(26px,6vw,48px)}
.ml6-ps-card p{font-family:var(--serif);font-style:italic;font-size:clamp(1.3rem,4.8vw,1.65rem);line-height:1.55;color:#3d2c1c;white-space:pre-line}
.ml6-end{text-align:center;padding-top:30px}
.ml6-end p{font-family:var(--serif);font-style:italic;font-size:1.05rem;color:rgba(233,224,210,.4);max-width:420px;margin:0 auto}

/* ---------- lightbox ---------- */
.ml6-lightbox{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:56px 14px 28px;background:rgba(6,8,13,.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.ml6-lb-figure{max-width:min(920px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center;gap:14px}
.ml6-lb-figure img{max-width:100%;max-height:calc(100vh - 170px);max-height:calc(100svh - 170px);object-fit:contain;border:8px solid #f7f1e6;border-bottom-width:8px;border-radius:2px;box-shadow:0 30px 80px rgba(0,0,0,.7)}
.ml6-lb-figure figcaption{font-family:var(--serif);font-style:italic;font-size:clamp(1.1rem,4vw,1.35rem);color:#efe3cf;text-align:center;max-width:560px}
.ml6-lb-close{position:absolute;top:12px;right:14px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(230,199,156,.35);background:rgba(11,15,23,.6);color:var(--amber);font-size:1.7rem;line-height:1}
.ml6-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1px solid rgba(230,199,156,.3);background:rgba(11,15,23,.55);color:var(--amber);font-size:1.8rem;line-height:1}
.ml6-lb-prev{left:8px}
.ml6-lb-next{right:8px}

/* ---------- desktop ---------- */
@media (min-width:760px){
  .ml6-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}
  .ml6-gallery .ml6-photo:nth-child(even){margin-top:0}
  .ml6-gallery .ml6-photo:nth-child(3n+2){margin-top:26px}
  .ml6-lb-prev{left:24px}
  .ml6-lb-next{right:24px}
}
@media (max-width:380px){
  .ml6-draft-btn{padding-right:40px}
  .ml6-thing{gap:12px;padding:16px 10px}
  .ml6-switch{padding-right:20px;gap:12px}
}
@media (prefers-reduced-motion:reduce){
  .ml6-colon,.ml6-lamp{animation:none}
  .ml6-photo,.ml6-thing,.ml6-knob{transition:none}
}
`;
