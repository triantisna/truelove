"use client";

import { motion } from "framer-motion";

export default function GlowOrbs() {
  return (
    <div className="glow-orbs" aria-hidden="true">
      <motion.div className="glow-orb orb-one" animate={{ x: [0, 30, -10, 0], y: [0, -18, 24, 0], scale: [1, 1.08, 0.96, 1] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="glow-orb orb-two" animate={{ x: [0, -26, 18, 0], y: [0, 22, -16, 0], scale: [1, 0.94, 1.1, 1] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}
