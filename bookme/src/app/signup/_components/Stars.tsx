"use client";

import { motion } from "framer-motion";

export default function ClientOnlyStars() {
  if (typeof window === "undefined") return null;

  return (
    <div className="absolute inset-0 z-2">
      {[...Array(300)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-40"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: Math.random() > 0.1 ? "#ffffff" : "#e0e7ff",
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: Math.random() * 20 + 30,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </div>
  );
}
