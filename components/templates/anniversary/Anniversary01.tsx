"use client";

import { motion } from "framer-motion";
import type { WebsiteRecord } from "@/types/website";

export default function Anniversary01({ website }: { website: WebsiteRecord }) {
  return (
    <main className="experience-shell anniversary-theme">
      <motion.section className="experience-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <p className="eyebrow">TRUELOVE • ANNIVERSARY</p>
        <div className="envelope-mark" aria-hidden="true">❤️</div>
        <p className="muted">{website.senderName} × {website.receiverName}</p>
        <h1>{website.title}</h1>
        <p className="letter-copy">{website.message}</p>
        {website.eventDate ? <div className="date-chip">Since {website.eventDate}</div> : null}
      </motion.section>
    </main>
  );
}
