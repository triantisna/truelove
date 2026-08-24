"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export default function Pressable({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <motion.button
      {...props}
      className={className}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.965 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      {children}
    </motion.button>
  );
}
