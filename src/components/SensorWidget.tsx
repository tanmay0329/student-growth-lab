"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useChallenge } from "@/store/ChallengeContext";
import { Camera, Mic } from "lucide-react";

export function SensorWidget() {
  const { metrics, videoStream, audioLevel } = useChallenge();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  if (!mounted || !metrics.sensorModeEnabled) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      suppressHydrationWarning={true}
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
    >
      {/* Video Feed */}
      <div className="w-48 aspect-video bg-black/50 border border-white/20 rounded-xl overflow-hidden relative shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
        {videoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Camera className="w-6 h-6 text-slate-500 animate-pulse" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">Vision</span>
        </div>
      </div>

      {/* Audio Meter */}
      <div className="w-48 bg-black/50 border border-white/20 rounded-xl p-3 flex flex-col gap-2 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-purple-400">Audio</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{Math.round(audioLevel)}dB</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-purple-500"
            animate={{ width: `${Math.min(100, (audioLevel / 128) * 100)}%` }}
            transition={{ type: "tween", duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
