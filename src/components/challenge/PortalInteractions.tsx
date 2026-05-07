"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Fingerprint, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortalProps {
  onComplete: (choice: string) => void;
  onClose: () => void;
  portalId: string;
}

// 1. Red Portal: The Hold (Stress Test)
export function RedPortalInteraction({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHolding) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            onComplete();
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHolding, onComplete]);

  const handleStart = () => setIsHolding(true);
  const handleStop = () => {
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-tighter">Thermal Authorization</h3>
        <p className="text-slate-500 text-sm">Maintain contact to override system firewall.</p>
      </div>

      <button
        onMouseDown={handleStart}
        onMouseUp={handleStop}
        onMouseLeave={handleStop}
        onTouchStart={handleStart}
        onTouchEnd={handleStop}

        className="relative w-32 h-32 rounded-full flex items-center justify-center bg-red-950 border border-red-500/30 transition-transform active:scale-95 overflow-hidden"
      >
        <div 
          className="absolute bottom-0 left-0 w-full bg-red-500/20 transition-all duration-75"
          style={{ height: `${progress}%` }}
        />
        <Fingerprint className={cn(
          "w-16 h-16 transition-all duration-300 z-10",
          isHolding ? "text-red-400 scale-110 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-red-900"
        )} />
      </button>

      <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-red-500 transition-all duration-75" style={{ width: `${progress}%` }} />
      </div>
      
      <p className="text-[10px] font-black uppercase tracking-widest text-red-900 animate-pulse">
        {isHolding ? "Syncing..." : "Hold Fingerprint"}
      </p>
    </div>
  );
}

// 2. White Portal: The Trace (Precision)
export function WhitePortalInteraction({ onComplete }: { onComplete: () => void }) {
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (success) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints(prev => [...prev.slice(-20), { x, y }]);

    // Simple check: if points cover a certain area
    if (points.length > 15) {
      const minX = Math.min(...points.map(p => p.x));
      const maxX = Math.max(...points.map(p => p.x));
      if (maxX - minX > 100) {
        setSuccess(true);
        setTimeout(onComplete, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Geometric Scan</h3>
        <p className="text-slate-500 text-sm">Trace the circular resonance to verify identity.</p>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-64 h-64 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center cursor-crosshair overflow-hidden"
      >
        <div className="absolute inset-0 border-[20px] border-white/5 rounded-full" />
        <Fingerprint className="w-24 h-24 text-white/20" />
        
        {points.map((p, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-50"
            style={{ left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}
          />
        ))}

        {success && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-white flex items-center justify-center">
            <ShieldCheck className="w-16 h-16 text-black" />
          </motion.div>
        )}
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Trace the Ring
      </p>
    </div>
  );
}

// 3. Black Portal: The Sequence (Memory)
export function BlackPortalInteraction({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const sequence = [0, 2, 1, 3];

  const handleClick = (idx: number) => {
    if (success) return;
    if (idx === sequence[step]) {
      setActive(idx);
      setTimeout(() => setActive(null), 200);
      if (step === sequence.length - 1) {
        setSuccess(true);
        setTimeout(onComplete, 1000);
      } else {
        setStep(step + 1);
      }
    } else {
      setStep(0);
      // feedback for error
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter">Null Sequence</h3>
        <p className="text-slate-600 text-sm">Align the fragmented prints in the dark spectrum.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={cn(
              "w-20 h-20 rounded-2xl border transition-all duration-300 flex items-center justify-center",
              active === i ? "bg-white border-white scale-110 shadow-[0_0_30px_white]" : "bg-black border-white/5 hover:border-white/20"
            )}
          >
            <Fingerprint className={cn(
              "w-8 h-8",
              active === i ? "text-black" : "text-white/10"
            )} />
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {sequence.map((_, i) => (
          <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i < step ? "bg-white" : "bg-white/10")} />
        ))}
      </div>
    </div>
  );
}

// Main Modal Container
export default function PortalInteractionModal({ portalId, onComplete, onClose }: PortalProps) {
  const handleSuccess = () => {
    onComplete(portalId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-lg glass p-12 rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {portalId === "red" && <RedPortalInteraction onComplete={handleSuccess} />}
        {portalId === "white" && <WhitePortalInteraction onComplete={handleSuccess} />}
        {portalId === "black" && <BlackPortalInteraction onComplete={handleSuccess} />}
      </div>
    </motion.div>
  );
}
