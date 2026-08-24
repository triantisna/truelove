"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import FloatingHearts from "@/components/motion/FloatingHearts";
import Pressable from "@/components/motion/Pressable";
import type { WebsiteRecord } from "@/types/website";

export default function LoveLetter01({ website }: { website: WebsiteRecord }) {
  const [opened, setOpened] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);

  const reasons = useMemo(() => {
    const fromContent = website.content?.reasons;
    if (Array.isArray(fromContent) && fromContent.every((item) => typeof item === "string")) return fromContent as string[];
    return [
      "You make ordinary days feel lighter.",
      "You make chaos feel a little more like home.",
      "You are still my favorite person to tell everything to."
    ];
  }, [website.content]);

  const photos = (website.media ?? []).filter((item) => item.type === "image").slice(0, 3);

  return (
    <main className="experience-shell love-letter-theme cinematic-experience">
      <FloatingHearts />
      <div className="experience-vignette" aria-hidden="true" />

      <section className="gift-stage">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          TRUELOVE • LOVE LETTER
        </motion.p>

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div key="closed" className="envelope-scene" initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className="envelope-3d" animate={{ y: [0, -8, 0], rotateZ: [-1, 1, -1] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}>
                <div className="envelope-back" />
                <div className="envelope-paper"><span>To {website.receiverName}</span></div>
                <div className="envelope-front" />
                <div className="envelope-flap" />
                <div className="wax-seal">♥</div>
              </motion.div>
              <div className="opening-copy">
                <small>Someone made this just for you.</small>
                <h1>{website.title}</h1>
                <Pressable className="button primary" onClick={() => setOpened(true)}>Open your letter</Pressable>
              </div>
            </motion.div>
          ) : (
            <motion.div key="opened" className="letter-experience" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <motion.article className="letter-paper" initial={{ rotateX: 12, scale: 0.94 }} animate={{ rotateX: 0, scale: 1 }} transition={{ duration: 0.8 }}>
                <span className="letter-kicker">A note for {website.receiverName}</span>
                <h1>Dear {website.receiverName},</h1>
                <p>{website.message}</p>
                <strong>— {website.senderName}</strong>
              </motion.article>

              <div className="memory-strip">
                {photos.length ? photos.map((photo, index) => (
                  <motion.figure key={photo.id} className="memory-polaroid" whileHover={{ rotate: index % 2 ? 2 : -2, y: -6 }}>
                    <img src={photo.url} alt={photo.caption || `Memory ${index + 1}`} />
                    <figcaption>{photo.caption || `Memory ${index + 1}`}</figcaption>
                  </motion.figure>
                )) : ["Our favorite day", "That random photo", "Still my favorite"].map((label, index) => (
                  <motion.div key={label} className="memory-polaroid placeholder-polaroid" whileHover={{ rotate: index % 2 ? 2 : -2, y: -6 }}>
                    <div className="photo-placeholder"><span>PHOTO {String(index + 1).padStart(2, "0")}</span></div>
                    <small>{label}</small>
                  </motion.div>
                ))}
              </div>

              <section className="reason-stage">
                <p className="tiny-label">A FEW THINGS I KEEP THINKING ABOUT</p>
                <AnimatePresence mode="wait">
                  <motion.div key={reasonIndex} className="reason-card" initial={{ opacity: 0, rotateY: 16, x: 22 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: -16, x: -22 }} transition={{ duration: 0.35 }}>
                    <span>{String(reasonIndex + 1).padStart(2, "0")}</span>
                    <p>{reasons[reasonIndex]}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="reason-dots">
                  {reasons.map((_, index) => (
                    <button key={index} aria-label={`Reason ${index + 1}`} className={index === reasonIndex ? "active" : ""} onClick={() => setReasonIndex(index)} />
                  ))}
                </div>
              </section>

              <motion.section className="final-reveal-card" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }}>
                <small>One last reminder</small>
                <h2>You are deeply loved.</h2>
                <p>And out of everyone in this world, I&apos;d still choose you.</p>
                <span>♥</span>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
