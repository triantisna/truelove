'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingMusicPlayer({
  url,
  isOpened,
}: {
  url?: string | null;
  isOpened: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Otomatis Play saat kado dibuka (isOpened = true)
  useEffect(() => {
    if (isOpened && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay dicegah browser:', err));
    }
  }, [isOpened]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!url) return null;

  return (
    <>
      {/* Tape-nya (disembunyikan) */}
      <audio ref={audioRef} src={url} loop />

      {/* Tombol Play/Pause Melayang */}
      <AnimatePresence>
        {isOpened && (
          <motion.button
            onClick={toggleMusic}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              zIndex: 50,
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(142, 53, 74, 0.2)',
              boxShadow: '0 10px 25px rgba(142, 53, 74, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--wine)',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? (
              // Icon Pause
              <svg
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              // Icon Play
              <svg
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
