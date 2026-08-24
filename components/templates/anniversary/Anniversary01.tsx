"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import FloatingHearts from "@/components/motion/FloatingHearts";
import type { WebsiteRecord } from "@/types/website";

function daysSince(value?: string) {
  if (!value) return null;
  const start = new Date(value).getTime();
  if (Number.isNaN(start)) return null;
  return Math.max(0, Math.floor((Date.now() - start) / 86_400_000));
}

export default function Anniversary01({ website }: { website: WebsiteRecord }) {
  const days = useMemo(() => daysSince(website.eventDate), [website.eventDate]);
  const photos = (website.media ?? []).filter((item) => item.type === "image").slice(0, 4);

  return (
    <main className="experience-shell anniversary-theme cinematic-experience">
      <FloatingHearts />
      <section className="anniversary-stage">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>TRUELOVE • ANNIVERSARY</motion.p>
        <motion.div className="anniversary-orbit" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
          <motion.div className="orbit-ring ring-a" animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
          <motion.div className="orbit-ring ring-b" animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
          <div className="anniversary-heart">♥</div>
        </motion.div>

        <motion.div className="anniversary-copy" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}>
          <small>{website.senderName} × {website.receiverName}</small>
          <h1>{website.title}</h1>
          <p>{website.message}</p>
        </motion.div>

        {days !== null ? (
          <motion.div className="counter-panel" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="counter-number">{days.toLocaleString("id-ID")}</span>
            <span className="counter-label">days of choosing each other</span>
          </motion.div>
        ) : null}

        <div className="anniversary-memory-grid">
          {(photos.length ? photos : Array.from({ length: 4 }, (_, index) => ({ id: `placeholder-${index}`, url: "", caption: `Memory ${index + 1}` }))).map((photo, index) => (
            <motion.figure key={photo.id} className="anniversary-memory" initial={{ opacity: 0, y: 30, rotate: index % 2 ? 2 : -2 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              {photo.url ? <img src={photo.url} alt={photo.caption || "Anniversary memory"} /> : <div className="photo-placeholder"><span>PHOTO {String(index + 1).padStart(2, "0")}</span></div>}
              <figcaption>{photo.caption}</figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div className="anniversary-ending" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.6 }}>
          <small>Same person. New memories.</small>
          <h2>Here&apos;s to our next chapter.</h2>
          <span>∞</span>
        </motion.div>
      </section>
    </main>
  );
}
