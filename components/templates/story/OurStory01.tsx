"use client";

import { motion } from "framer-motion";
import type { WebsiteRecord } from "@/types/website";

export default function OurStory01({ website }: { website: WebsiteRecord }) {
  return (
    <main className="experience-shell story-theme">
      <motion.section className="experience-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">TRUELOVE • OUR STORY</p>
        <div className="envelope-mark" aria-hidden="true">📖</div>
        <h1>{website.title}</h1>
        <p className="muted">{website.senderName} & {website.receiverName}</p>
        <p className="letter-copy">{website.message}</p>
        <div className="timeline-mini">
          <span>Chapter 01</span><strong>The Beginning</strong>
          <span>Chapter 02</span><strong>The Memories</strong>
          <span>Chapter 03</span><strong>Today</strong>
        </div>
      </motion.section>
    </main>
  );
}
