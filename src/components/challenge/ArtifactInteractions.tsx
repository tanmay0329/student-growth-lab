"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Key
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractionProps {
  onComplete: () => void;
}

// 1. Locked Cube: Memory Sequence
export function LockedCubeInteraction({ onComplete }: InteractionProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "input" | "success" | "error">("idle");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startSequence = () => {
    const newSeq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setUserSequence([]);
    setStatus("playing");
    
    let i = 0;
    intervalRef.current = setInterval(() => {
      setActiveButton(newSeq[i]);
      setTimeout(() => setActiveButton(null), 400);
      i++;
      if (i >= newSeq.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          setStatus("input");
        }, 600);
      }
    }, 800);
  };


  const handleInput = (idx: number) => {
    if (status !== "input") return;
    
    const nextUserSeq = [...userSequence, idx];
    setUserSequence(nextUserSeq);
    
    if (idx !== sequence[nextUserSeq.length - 1]) {
      setStatus("error");
      setTimeout(() => {
        setUserSequence([]);
        setStatus("input");
      }, 1000);
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      setStatus("success");
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Memory Resonance</h3>
        <p className="text-slate-500 text-sm">Synchronize with the cube&apos;s internal sequence.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((idx) => (
          <button
            key={idx}
            onClick={() => handleInput(idx)}
            className={cn(
              "w-20 h-20 rounded-2xl border transition-all duration-200",
              activeButton === idx ? "bg-cyan-500 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] scale-105" : "bg-white/5 border-white/10",
              status === "input" && "hover:bg-white/10 hover:border-white/20 active:scale-95"
            )}
          />
        ))}
      </div>

      {status === "idle" && (
        <button onClick={startSequence} className="px-8 py-3 bg-white text-black font-black rounded-full uppercase text-xs tracking-widest">Begin Sync</button>
      )}
      {status === "error" && <span className="text-red-500 text-xs font-black uppercase tracking-widest">Sequence Mismatch</span>}
      {status === "success" && <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Access Granted</span>}
    </div>
  );
}

// 2. Pulsing Orb: Timing
export function PulsingOrbInteraction({ onComplete }: InteractionProps) {
  const [success, setSuccess] = useState(false);

  const handleCapture = () => {
    // This is a simplified "rhythm" check. In a real app, we'd check against an animation timeline.
    // For now, let's make it a high-speed reaction test.
    const win = Math.random() > 0.6; // Simulating a timing window
    if (win) {
      setSuccess(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Orb Stabilization</h3>
        <p className="text-slate-500 text-sm">Capture the energy at its peak frequency.</p>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            filter: ["blur(20px)", "blur(40px)", "blur(20px)"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-purple-500 rounded-full"
        />
        <div className="relative z-10 w-16 h-16 bg-white rounded-full shadow-[0_0_50px_white]" />
      </div>

      <button
        onClick={handleCapture}
        disabled={success}
        className={cn(
          "px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all",
          success ? "bg-emerald-500 text-black" : "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
        )}
      >
        {success ? "Stabilized" : "Stabilize Pulse"}
      </button>
    </div>
  );
}

// 3. Old Map: Exploration
export function OldMapInteraction({ onComplete }: InteractionProps) {
  const [found, setFound] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const target = { x: 75, y: 30 }; // Hidden beacon location in %

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || found) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });

    const dist = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
    if (dist < 5) {
      setFound(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Coordinate Recovery</h3>
        <p className="text-slate-500 text-sm">Scan the terrain for the hidden extraction beacon.</p>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full aspect-square bg-slate-900 rounded-3xl border border-white/10 overflow-hidden cursor-none"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* The "Lens" */}
        <div 
          className="absolute w-24 h-24 border border-amber-500/50 rounded-full pointer-events-none flex items-center justify-center"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-1 h-1 bg-amber-500 rounded-full" />
          <div className="absolute inset-0 bg-amber-500/10 blur-xl" />
        </div>

        {/* The Beacon (only visible when found or close) */}
        <AnimatePresence>
          {found && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute w-8 h-8 bg-amber-400 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.8)]"
              style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
            />
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-amber-500/50 uppercase tracking-widest">
          Scanner Active: {pos.x.toFixed(0)}, {pos.y.toFixed(0)}
        </div>
      </div>
      
      {found && <span className="text-amber-500 text-xs font-black uppercase tracking-widest">Beacon Located</span>}
    </div>
  );
}

// 4. AI Mirror: Semantic Choice
export function AIMirrorInteraction({ onComplete }: InteractionProps) {
  const words = ["Ambitious", "Cautious", "Stoic", "Erratic", "Calculated", "Bold", "Resilient", "Curious"];
  const [selected, setSelected] = useState<string[]>([]);

  const toggleWord = (word: string) => {
    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else if (selected.length < 3) {
      setSelected([...selected, word]);
    }
  };

  useEffect(() => {
    if (selected.length === 3) {
      setTimeout(onComplete, 1500);
    }
  }, [selected, onComplete]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Self Reflection</h3>
        <p className="text-slate-500 text-sm">Select 3 traits that define your current digital presence.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 max-w-sm">
        {words.map((word) => (
          <button
            key={word}
            onClick={() => toggleWord(word)}
            className={cn(
              "px-6 py-3 rounded-2xl border text-sm font-bold transition-all duration-300",
              selected.includes(word)
                ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
            )}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-600">
        {selected.length} of 3 Identified
      </div>
    </div>
  );
}

// 5. Unknown Key: Alignment
export function UnknownKeyInteraction({ onComplete }: InteractionProps) {
  const [rotations, setRotations] = useState([0, 0, 0]);
  const targets = [90, 270, 180];

  const rotate = (idx: number) => {
    const newRots = [...rotations];
    newRots[idx] = (newRots[idx] + 90) % 360;
    setRotations(newRots);
  };

  const isComplete = rotations.every((r, i) => r === targets[i]);

  useEffect(() => {
    if (isComplete) {
      setTimeout(onComplete, 1500);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Alignment Protocol</h3>
        <p className="text-slate-500 text-sm">Rotate the internal segments to match the lock silhouette.</p>
      </div>

      <div className="flex gap-4">
        {rotations.map((rot, i) => (
          <motion.button
            key={i}
            onClick={() => rotate(i)}
            animate={{ rotate: rot }}
            className={cn(
              "w-20 h-20 rounded-full border-4 flex items-center justify-center transition-colors",
              rot === targets[i] ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/10 bg-white/5"
            )}
          >
            <Key className={cn("w-8 h-8", rot === targets[i] ? "text-emerald-500" : "text-slate-500")} />
          </motion.button>
        ))}
      </div>

      {isComplete && <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Mechanism Aligned</span>}
    </div>
  );
}

// 6. Broken Drone: Power Balance
export function BrokenDroneInteraction({ onComplete }: InteractionProps) {
  const [levels, setLevels] = useState([30, 70, 40]);
  
  const handleAdjust = (idx: number, val: number) => {
    const newLevels = [...levels];
    newLevels[idx] = val;
    // Add some coupling effect
    if (idx === 0) newLevels[1] = Math.min(100, newLevels[1] + (val - levels[0]) * 0.2);
    if (idx === 1) newLevels[2] = Math.max(0, newLevels[2] - (val - levels[1]) * 0.1);
    
    setLevels(newLevels.map(l => Math.round(l)));
  };

  const isBalanced = levels.every(l => l > 85);

  useEffect(() => {
    if (isBalanced) {
      setTimeout(onComplete, 1500);
    }
  }, [isBalanced, onComplete]);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-xs">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Power Balancing</h3>
        <p className="text-slate-500 text-sm">Synchronize all thruster levels to 90% or higher.</p>
      </div>

      <div className="w-full space-y-8">
        {levels.map((level, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Thruster {i + 1}</span>
              <span className={level > 85 ? "text-emerald-500" : "text-red-500"}>{level}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={level}
              onChange={(e) => handleAdjust(i, parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        ))}
      </div>

      {isBalanced && <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Engines Prime</span>}
    </div>
  );
}

// Main Modal Container
export default function InteractionModal({ objectId, onComplete, onClose }: { objectId: number; onComplete: () => void; onClose: () => void }) {
  const renderInteraction = () => {
    switch (objectId) {
      case 1: return <LockedCubeInteraction onComplete={onComplete} />;
      case 2: return <PulsingOrbInteraction onComplete={onComplete} />;
      case 3: return <OldMapInteraction onComplete={onComplete} />;
      case 4: return <AIMirrorInteraction onComplete={onComplete} />;
      case 5: return <UnknownKeyInteraction onComplete={onComplete} />;
      case 6: return <BrokenDroneInteraction onComplete={onComplete} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-lg glass p-12 rounded-[48px] border border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {renderInteraction()}
      </div>
    </motion.div>
  );
}
