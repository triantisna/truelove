'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

interface ChatMessage {
  id: string;
  from: 'sender' | 'receiver';
  text?: string;
  image?: string;
  isQuestion?: boolean;
  time: string;
}

function formatTime(dateInput?: Date | string | null): string {
  const target = dateInput ? new Date(dateInput) : new Date();
  const validDate = Number.isNaN(target.getTime()) ? new Date() : target;
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(validDate);
}

export default function Proposal02({ website }: { website: WebsiteRecord }) {
  const isPublished = website.status === 'published';
  const savedResponse = (website.receiverResponse ?? {}) as ContentValue;
  const initialAccepted = isPublished && Boolean(savedResponse.accepted);
  const initialAcceptedAt =
    isPublished && typeof savedResponse.acceptedAt === 'string'
      ? savedResponse.acceptedAt
      : null;

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

  const openingMsg1 = getString(
    content,
    'openingMsg1',
    `Hai ${receiverName}, lagi sibuk gak?`,
  );
  const openingMsg2 = getString(
    content,
    'openingMsg2',
    'Ada sesuatu yang dari kemarin kutetik terus kuhapus lagi. Tapi hari ini aku mau kirim beneran.',
  );
  const replyBtn1 = getString(content, 'replyBtn1', 'Enggak kok, ada apa?');

  const chatPhoto = useMemo(() => {
    const fromContent = getMediaUrl(content.chatPhoto);
    if (fromContent) return fromContent;
    const firstMedia = (website.media ?? []).find(
      (item) => item.type === 'image',
    );
    return firstMedia?.url || '';
  }, [content.chatPhoto, website.media]);

  const photoMessage = getString(
    content,
    'photoMessage',
    website.message ||
      'Setiap lihat momen ini, aku selalu ingat betapa nyamannya hari itu. Dari situ aku mulai sadar kalau aku selalu nungguin kabar darimu.',
  );
  const replyBtn2 = getString(
    content,
    'replyBtn2',
    'Haha inget banget! Terus?',
  );

  const confessionMsg1 = getString(
    content,
    'confessionMsg1',
    'Aku suka caramu dengerin ceritaku, caramu ketawa, dan gimana hari yang capek selalu terasa lebih ringan kalau sudah ngobrol sama kamu.',
  );
  const confessionMsg2 = getString(
    content,
    'confessionMsg2',
    'Aku mungkin bukan orang yang paling sempurna, tapi aku janji akan selalu berusaha jadi tempat yang aman dan jujur buat kamu.',
  );
  const replyBtn3 = getString(
    content,
    'replyBtn3',
    'Jujur ini bikin deg-degan...',
  );

  const questionText = getString(
    content,
    'questionText',
    'Jadi... maukah kamu jadi pasanganku?',
  );
  const yesReplyLabel = getString(content, 'yesReplyLabel', 'Iya, aku mau! ❤️');
  const playfulReplyLabel = getString(
    content,
    'playfulReplyLabel',
    'Bentar, masih salting 😅',
  );
  const playfulSenderResponse = getString(
    content,
    'playfulSenderResponse',
    'Haha ambil napas dulu, aku tunggu di sini kok ✨',
  );
  const closingReply = getString(
    content,
    'closingReply',
    'Serius?! Makasih banyak ya sudah memilih jalan bareng aku. Mulai hari ini, resmi ya!',
  );

  const [hasAccepted, setHasAccepted] = useState(initialAccepted);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(
    initialAcceptedAt,
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

  const buildOpeningMessages = (): ChatMessage[] => {
    const now = formatTime();
    const initial: ChatMessage[] = [
      { id: 'init-1', from: 'sender', text: openingMsg1, time: now },
    ];
    if (openingMsg2) {
      initial.push({
        id: 'init-2',
        from: 'sender',
        text: openingMsg2,
        time: now,
      });
    }
    return initial;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!initialAccepted) {
      return buildOpeningMessages();
    }

    const savedTime = formatTime(initialAcceptedAt);
    const fullHistory: ChatMessage[] = [
      { id: 'hist-1', from: 'sender', text: openingMsg1, time: savedTime },
    ];
    if (openingMsg2) {
      fullHistory.push({
        id: 'hist-2',
        from: 'sender',
        text: openingMsg2,
        time: savedTime,
      });
    }
    fullHistory.push({
      id: 'hist-3',
      from: 'receiver',
      text: replyBtn1,
      time: savedTime,
    });
    if (chatPhoto) {
      fullHistory.push({
        id: 'hist-4',
        from: 'sender',
        image: chatPhoto,
        time: savedTime,
      });
    }
    fullHistory.push(
      { id: 'hist-5', from: 'sender', text: photoMessage, time: savedTime },
      { id: 'hist-6', from: 'receiver', text: replyBtn2, time: savedTime },
      { id: 'hist-7', from: 'sender', text: confessionMsg1, time: savedTime },
    );
    if (confessionMsg2) {
      fullHistory.push({
        id: 'hist-8',
        from: 'sender',
        text: confessionMsg2,
        time: savedTime,
      });
    }
    fullHistory.push(
      { id: 'hist-9', from: 'receiver', text: replyBtn3, time: savedTime },
      {
        id: 'hist-10',
        from: 'sender',
        text: questionText,
        isQuestion: true,
        time: savedTime,
      },
      { id: 'hist-11', from: 'receiver', text: yesReplyLabel, time: savedTime },
      { id: 'hist-12', from: 'sender', text: closingReply, time: savedTime },
    );
    return fullHistory;
  });

  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(
    initialAccepted ? 4 : 0,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [usedPlayful, setUsedPlayful] = useState(false);

  const streamEndRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, stage]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  const pushMessage = (msg: Omit<ChatMessage, 'id' | 'time'>) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        time: formatTime(),
      },
    ]);
  };

  const handleStage0Reply = () => {
    if (isTyping) return;
    if (!musicStarted) setMusicStarted(true);
    pushMessage({ from: 'receiver', text: replyBtn1 });
    setIsTyping(true);

    schedule(() => {
      if (chatPhoto) {
        pushMessage({ from: 'sender', image: chatPhoto });
      }
      schedule(
        () => {
          pushMessage({ from: 'sender', text: photoMessage });
          setIsTyping(false);
          setStage(1);
        },
        chatPhoto ? 750 : 150,
      );
    }, 850);
  };

  const handleStage1Reply = () => {
    if (isTyping) return;
    pushMessage({ from: 'receiver', text: replyBtn2 });
    setIsTyping(true);

    schedule(() => {
      pushMessage({ from: 'sender', text: confessionMsg1 });
      if (confessionMsg2) {
        schedule(() => {
          pushMessage({ from: 'sender', text: confessionMsg2 });
          setIsTyping(false);
          setStage(2);
        }, 900);
      } else {
        setIsTyping(false);
        setStage(2);
      }
    }, 900);
  };

  const handleStage2Reply = () => {
    if (isTyping) return;
    pushMessage({ from: 'receiver', text: replyBtn3 });
    setIsTyping(true);

    schedule(() => {
      pushMessage({
        from: 'sender',
        text: questionText,
        isQuestion: true,
      });
      setIsTyping(false);
      setStage(3);
    }, 1050);
  };

  const handlePlayfulReply = () => {
    if (isTyping || usedPlayful) return;
    setUsedPlayful(true);
    pushMessage({ from: 'receiver', text: playfulReplyLabel });
    setIsTyping(true);

    schedule(() => {
      pushMessage({ from: 'sender', text: playfulSenderResponse });
      setIsTyping(false);
    }, 850);
  };

  const handleYesReply = () => {
    if (isTyping) return;
    if (!musicStarted) setMusicStarted(true);

    if (!hasAccepted) {
      const nowIso = new Date().toISOString();
      setHasAccepted(true);
      setAcceptedAt(nowIso);

      if (isPublished) {
        void saveWebsiteResponse(website.id, {
          accepted: true,
          acceptedAt: nowIso,
        });
      }
    }

    pushMessage({ from: 'receiver', text: yesReplyLabel });
    setIsTyping(true);

    schedule(() => {
      pushMessage({ from: 'sender', text: closingReply });
      setIsTyping(false);
      setStage(4);
    }, 950);
  };

  const handleReplayChat = () => {
    clearTimers();
    setIsTyping(false);
    setUsedPlayful(false);
    setMessages(buildOpeningMessages());
    setStage(0);
  };

  const senderInitial = senderName.trim().charAt(0).toUpperCase() || 'A';

  return (
    <main className="lnt2-root">
      <style>{css}</style>

      <FloatingMusicPlayer url={musicUrl} isOpened={musicStarted} />

      <div className="lnt2-device">
        {/* 1. TOP CONTACT BAR */}
        <header className="lnt2-topbar">
          <div className="lnt2-avatar" aria-hidden="true">
            <span>{senderInitial}</span>
            <span className="lnt2-dot" />
          </div>

          <div className="lnt2-contact">
            <h1 className="lnt2-contact-name">{senderName}</h1>
            <p className="lnt2-contact-status">
              {isTyping ? 'sedang mengetik...' : 'online'}
            </p>
          </div>

          <span className="lnt2-tag">PRIVATE CHAT</span>
        </header>

        {/* 2. CHAT STREAM */}
        <section className="lnt2-stream" aria-live="polite">
          <div className="lnt2-date-pill">
            <span>{hasAccepted ? officialDate.toUpperCase() : 'HARI INI'}</span>
          </div>

          {messages.map((msg) => {
            const isSender = msg.from === 'sender';
            return (
              <motion.div
                key={msg.id}
                className={`lnt2-row ${isSender ? 'is-sender' : 'is-receiver'}`}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`lnt2-bubble ${
                    isSender ? 'is-sender' : 'is-receiver'
                  } ${msg.isQuestion ? 'is-question' : ''} ${
                    msg.image ? 'is-media' : ''
                  }`}
                >
                  {msg.isQuestion && (
                    <span className="lnt2-q-label">ONE QUESTION</span>
                  )}

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Momen kenangan kita"
                      className="lnt2-photo"
                    />
                  )}

                  {msg.text && <p className="lnt2-text">{msg.text}</p>}

                  <span className="lnt2-meta">
                    {msg.time}
                    {!isSender && ' · ✓✓'}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator Bubble */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="lnt2-row is-sender"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="lnt2-bubble is-sender lnt2-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Official Pinned Banner (Stage 4) */}
          <AnimatePresence>
            {stage === 4 && (
              <motion.div
                className="lnt2-pinned"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="lnt2-pinned-badge">OFFICIALLY TOGETHER</span>
                <strong className="lnt2-pinned-names">
                  {senderName} &amp; {receiverName}
                </strong>
                <span className="lnt2-pinned-date">{officialDate}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={streamEndRef} />
        </section>

        {/* 3. BOTTOM REPLY BAR */}
        <footer className="lnt2-replybar">
          {stage === 4 ? (
            <div className="lnt2-done-bar">
              <span>Percakapan ini resmi jadi awal cerita kita ✨</span>
              <button
                type="button"
                className="lnt2-replay-btn"
                onClick={handleReplayChat}
              >
                ↺ Putar ulang chat
              </button>
            </div>
          ) : isTyping ? (
            <div className="lnt2-wait-bar">
              <span>{senderName} sedang mengetik pesan...</span>
            </div>
          ) : stage === 0 ? (
            <button
              type="button"
              className="lnt2-chip lnt2-chip-primary"
              onClick={handleStage0Reply}
            >
              {replyBtn1}
            </button>
          ) : stage === 1 ? (
            <button
              type="button"
              className="lnt2-chip lnt2-chip-primary"
              onClick={handleStage1Reply}
            >
              {replyBtn2}
            </button>
          ) : stage === 2 ? (
            <button
              type="button"
              className="lnt2-chip lnt2-chip-primary"
              onClick={handleStage2Reply}
            >
              {replyBtn3}
            </button>
          ) : (
            <div className="lnt2-choice-stack">
              <motion.button
                type="button"
                className="lnt2-chip lnt2-chip-yes"
                onClick={handleYesReply}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                {hasAccepted ? `✓ ${yesReplyLabel}` : yesReplyLabel}
              </motion.button>

              {!hasAccepted && !usedPlayful && (
                <button
                  type="button"
                  className="lnt2-chip lnt2-chip-secondary"
                  onClick={handlePlayfulReply}
                >
                  {playfulReplyLabel}
                </button>
              )}
            </div>
          )}
        </footer>
      </div>
    </main>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .lnt2-root {
    min-height: 100svh;
    width: 100%;
    background-color: #e9edf4;
    color: #1a202c;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
  }

  .lnt2-root * {
    box-sizing: border-box;
  }

  /* Messenger Container */
  .lnt2-device {
    width: min(100%, 480px);
    height: 100svh;
    max-height: 880px;
    background-color: #f4f6f9;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(26, 32, 44, 0.12);
  }

  @media (min-width: 520px) {
    .lnt2-root {
      padding: 20px;
    }
    .lnt2-device {
      height: min(92svh, 820px);
      border-radius: 26px;
      border: 1px solid rgba(26, 32, 44, 0.08);
    }
  }

  /* 1. Top Contact Bar */
  .lnt2-topbar {
    background-color: #ffffff;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(26, 32, 44, 0.08);
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .lnt2-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b5bdb 0%, #5c7cfa 100%);
    color: #ffffff;
    font-weight: 700;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }

  .lnt2-dot {
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background-color: #2b8a3e;
    border: 2px solid #ffffff;
  }

  .lnt2-contact {
    flex: 1;
    min-width: 0;
  }

  .lnt2-contact-name {
    margin: 0;
    font-size: 0.98rem;
    font-weight: 700;
    color: #1a202c;
    line-height: 1.25;
  }

  .lnt2-contact-status {
    margin: 2px 0 0;
    font-size: 0.76rem;
    font-weight: 500;
    color: #2b8a3e;
  }

  .lnt2-tag {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #64748b;
    background-color: #f1f5f9;
    padding: 5px 9px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  /* 2. Chat Stream */
  .lnt2-stream {
    flex: 1;
    overflow-y: auto;
    padding: 18px 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lnt2-date-pill {
    text-align: center;
    margin-bottom: 8px;
  }

  .lnt2-date-pill span {
    display: inline-block;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #64748b;
    background-color: rgba(100, 116, 139, 0.12);
    padding: 4px 12px;
    border-radius: 999px;
  }

  .lnt2-row {
    display: flex;
    width: 100%;
  }

  .lnt2-row.is-sender {
    justify-content: flex-start;
  }

  .lnt2-row.is-receiver {
    justify-content: flex-end;
  }

  .lnt2-bubble {
    max-width: 82%;
    padding: 11px 14px 8px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  }

  .lnt2-bubble.is-sender {
    background-color: #ffffff;
    color: #1e293b;
    border-bottom-left-radius: 6px;
  }

  .lnt2-bubble.is-receiver {
    background-color: #3b5bdb;
    color: #ffffff;
    border-bottom-right-radius: 6px;
  }

  .lnt2-bubble.is-question {
    background-color: #ffffff;
    border: 1.5px solid #3b5bdb;
    box-shadow: 0 8px 24px rgba(59, 91, 219, 0.12);
    padding: 14px 16px 10px;
  }

  .lnt2-bubble.is-media {
    padding: 6px 6px 8px;
  }

  .lnt2-q-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #3b5bdb;
  }

  .lnt2-photo {
    width: 100%;
    max-width: 260px;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 13px;
    display: block;
  }

  .lnt2-text {
    margin: 0;
    font-size: 0.93rem;
    line-height: 1.55;
    white-space: pre-line;
  }

  .lnt2-bubble.is-question .lnt2-text {
    font-size: 1.02rem;
    font-weight: 700;
    color: #1a202c;
  }

  .lnt2-meta {
    font-size: 0.65rem;
    align-self: flex-end;
    opacity: 0.65;
  }

  /* Typing Dots */
  .lnt2-typing {
    flex-direction: row;
    align-items: center;
    gap: 5px;
    padding: 12px 15px;
  }

  .lnt2-typing span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #94a3b8;
    animation: lnt2Bounce 1.1s infinite ease-in-out;
  }

  .lnt2-typing span:nth-child(2) {
    animation-delay: 0.16s;
  }

  .lnt2-typing span:nth-child(3) {
    animation-delay: 0.32s;
  }

  @keyframes lnt2Bounce {
    0%, 80%, 100% {
      transform: translateY(0);
      opacity: 0.45;
    }
    40% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }

  /* Pinned Official Banner */
  .lnt2-pinned {
    margin-top: 12px;
    background: linear-gradient(135deg, #3b5bdb 0%, #4c6ef5 100%);
    color: #ffffff;
    border-radius: 18px;
    padding: 18px 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 12px 28px rgba(59, 91, 219, 0.24);
  }

  .lnt2-pinned-badge {
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: rgba(255, 255, 255, 0.85);
  }

  .lnt2-pinned-names {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
  }

  .lnt2-pinned-date {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.88);
  }

  /* 3. Bottom Reply Bar */
  .lnt2-replybar {
    background-color: #ffffff;
    border-top: 1px solid rgba(26, 32, 44, 0.08);
    padding: 14px 16px;
    flex-shrink: 0;
  }

  .lnt2-choice-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .lnt2-chip {
    width: 100%;
    padding: 13px 18px;
    border-radius: 14px;
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease, background-color 0.2s ease;
  }

  .lnt2-chip-primary {
    background-color: #3b5bdb;
    color: #ffffff;
  }

  .lnt2-chip-primary:hover {
    background-color: #364fc7;
  }

  .lnt2-chip-yes {
    background-color: #3b5bdb;
    color: #ffffff;
    font-weight: 700;
    box-shadow: 0 8px 20px rgba(59, 91, 219, 0.24);
  }

  .lnt2-chip-secondary {
    background-color: #f1f5f9;
    color: #334155;
  }

  .lnt2-chip-secondary:hover {
    background-color: #e2e8f0;
  }

  .lnt2-wait-bar,
  .lnt2-done-bar {
    text-align: center;
    font-size: 0.82rem;
    font-weight: 500;
    color: #64748b;
    padding: 6px 4px;
  }

  .lnt2-done-bar {
    color: #3b5bdb;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .lnt2-replay-btn {
    background: transparent;
    border: none;
    color: #64748b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    padding: 2px 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    .lnt2-typing span {
      animation: none !important;
    }
  }
`;
