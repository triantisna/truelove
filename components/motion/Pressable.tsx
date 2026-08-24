"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type PressableProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
};

export default function Pressable({
  children,
  className = "",
  ...props
}: PressableProps) {
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
