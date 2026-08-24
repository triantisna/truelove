"use client";

import { motion } from "framer-motion";
import type { WebsiteRecord } from "@/types/website";

export default function LoveLetter01({ website }: { website: WebsiteRecord }) {
  return (
    <main className="experience-shell love-letter-theme">
      <motion.section
        className="experience-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <p className="eyebrow">TRUELOVE • LOVE LETTER</p>
        <div className="envelope-mark" aria-hidden="true">💌</div>
        <p className="muted">To {website.receiverName}</p>
        <h1>{website.title}</h1>
        <div className="letter-copy">
          <p>Dear {website.receiverName},</p>
          <p>{website.message}</p>
          <p className="signature">— {website.senderName}</p>
        </div>
        <div className="demo-note">Template engine active • content injected from website data</div>
      </motion.section>
    </main>
  );
}
