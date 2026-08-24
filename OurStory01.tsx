"use client";

import { motion } from "framer-motion";
import type { WebsiteRecord } from "@/types/website";

const fallbackChapters = [
  { label: "Chapter 01", title: "The Beginning", copy: "The moment everything quietly started." },
  { label: "Chapter 02", title: "The Little Things", copy: "Random chats, silly jokes, ordinary days that became memories." },
  { label: "Chapter 03", title: "Today", copy: "Still writing this story, one day at a time." }
];

export default function OurStory01({ website }: { website: WebsiteRecord }) {
  const fromContent = website.content?.chapters;
  const chapters = Array.isArray(fromContent) ? fromContent as Array<{ label?: string; title?: string; copy?: string }> : fallbackChapters;

  return (
    <main className="experience-shell story-theme cinematic-experience story-experience">
      <div className="story-noise" aria-hidden="true" />
      <section className="story-stage">
        <motion.div className="story-opening" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">TRUELOVE • OUR STORY</p>
          <span className="story-index">01 / ∞</span>
          <h1>{website.title}</h1>
          <p className="story-names">{website.senderName} & {website.receiverName}</p>
          <p className="story-intro">{website.message}</p>
          <div className="scroll-cue">Scroll to turn the pages ↓</div>
        </motion.div>

        <div className="chapter-stack">
          {chapters.map((chapter, index) => (
            <motion.article
              key={`${chapter.title}-${index}`}
              className="chapter-card"
              initial={{ opacity: 0, y: 70, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, delay: 0.03 * index, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="chapter-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <span>{chapter.label || `Chapter ${String(index + 1).padStart(2, "0")}`}</span>
                <h2>{chapter.title || "Untitled Chapter"}</h2>
                <p>{chapter.copy || "A memory that belongs to the two of you."}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div className="story-ending" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
          <p>There are still pages we haven&apos;t written yet.</p>
          <h2>And that&apos;s my favorite part.</h2>
          <span>To be continued…</span>
        </motion.div>
      </section>
    </main>
  );
}
