"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useChallenge } from "@/store/ChallengeContext";

export default function VoiceVisualizer() {
  const { audioLevel } = useChallenge();
  
  // Create 20 bars for the visualizer
  // Create stable, deterministic pseudo-random offsets for jitter
  // We use Math.sin based on index to ensure the function is "pure" and idempotent
  const offsets = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    return (Math.abs(Math.sin(i * 82.3)) * 10);
  }), []);

  return (
    <div className="flex items-center justify-center gap-1.5 h-32 w-full max-w-md mx-auto">
      {offsets.map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 via-purple-500 to-white/50"
          animate={{
            height: Math.max(8, (audioLevel * (1 + Math.sin(i * 0.5))) / 2 + offsets[i]),
            opacity: 0.3 + (audioLevel / 50),
          }}
          transition={{
            type: "spring",
            bounce: 0.5,
            damping: 10,
            stiffness: 100,
          }}
        />
      ))}
      
      {/* Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 blur-sm" />
    </div>
  );
}
