"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateXRaw = useTransform(y, [0, 1], [7, -7]);
  const rotateYRaw = useTransform(x, [0, 1], [-7, 7]);
  const rotateX = useSpring(rotateXRaw, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 180, damping: 22 });

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function reset() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      className={`tilt-card ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ y: -5, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <div className="tilt-shine" aria-hidden="true" />
      {children}
    </motion.div>
  );
}
