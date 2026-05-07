"use client";

import { useEffect, useRef } from "react";
import { useChallenge } from "@/store/ChallengeContext";

export function useBehaviorTracking() {
  const { metrics, updateMetric } = useChallenge();
  
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const lastKeyTime = useRef<number>(0);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lastKeyTime.current = Date.now();
    if (!metrics.sensorModeEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Reset idle timer
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        updateMetric("idleTime", (prev: number) => prev + 1000);
      }, 1000);

      if (lastMousePos.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        updateMetric("mouseDistance", (prev: number) => prev + dist);
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleKeyDown = () => {
      const now = Date.now();
      if (now - lastKeyTime.current < 200) {
        // Fast typing -> consider part of a burst, 
        // randomly increment burst count slightly or count true bursts.
        // For simplicity, we just count keys pressed quickly.
      } else if (now - lastKeyTime.current > 1000) {
        updateMetric("typingBursts", (prev: number) => prev + 1);
      }
      lastKeyTime.current = now;

      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, [metrics.sensorModeEnabled, updateMetric]);
}
