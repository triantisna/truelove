"use client";

import { motion } from "framer-motion";

const hearts = [
  { left: "8%", delay: 0.2, duration: 8.4, size: 14 },
  { left: "22%", delay: 1.4, duration: 9.2, size: 10 },
  { left: "38%", delay: 0.8, duration: 7.8, size: 18 },
  { left: "57%", delay: 2.1, duration: 9.8, size: 11 },
  { left: "74%", delay: 1.1, duration: 8.8, size: 15 },
  { left: "91%", delay: 2.8, duration: 10.2, size: 9 }
];

export default function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart, index) => (
        <motion.span
          key={index}
          style={{ left: heart.left, fontSize: heart.size }}
          initial={{ y: "105vh", opacity: 0, rotate: -12 }}
          animate={{ y: "-15vh", opacity: [0, 0.35, 0.2, 0], rotate: 18 }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
