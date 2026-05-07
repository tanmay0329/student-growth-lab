"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useChallenge, InnerFeedbackReaction } from "@/store/ChallengeContext";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { useVisionTracking } from "@/hooks/useVisionTracking";
import { useAudioTracking } from "@/hooks/useAudioTracking";
import { 
  Box, DoorClosed, Fingerprint, Eye, ShieldAlert,
  ArrowRight, CheckCircle2, ChevronRight, Zap, Search, Map, Drone, Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import InteractionModal from "@/components/challenge/ArtifactInteractions";
import PortalInteractionModal from "@/components/challenge/PortalInteractions";
import VoiceVisualizer from "@/components/challenge/VoiceVisualizer";
import { Mic, Activity, BrainCircuit, FlaskConical, Atom, Globe, Rocket, Terminal, Database, CopyPlus as CpuIcon } from "lucide-react";

const SCENARIOS = [
  {
    id: 0,
    stage1: {
      title: "The Mystery Room",
      desc: "You wake in a room containing 6 strange objects. Each holds a specific weight. Investigate their properties before proceeding.",
      objects: [
        { id: 1, icon: Box, label: "Locked Cube" },
        { id: 2, icon: Zap, label: "Pulsing Orb" },
        { id: 3, icon: Map, label: "Old Map" },
        { id: 4, icon: Eye, label: "AI Mirror" },
        { id: 5, icon: Key, label: "Unknown Key" },
        { id: 6, icon: Drone, label: "Broken Drone" },
      ]
    },
    stage3: {
      title: "Pattern Logic",
      desc: "Identify the logic governing this sequence to unlock the next sector.",
      sequence: [
        { q: "2", a: "6" },
        { q: "3", a: "12" },
        { q: "4", a: "20" },
        { q: "5", a: "?" }
      ],
      answer: "30"
    },
    stage5: {
      title: "Experience Reflection",
      prompt: "Share a detailed experience where you had to take initiative to solve a problem without being asked. What was your thought process and the final result?"
    }
  },
  {
    id: 1,
    stage1: {
      title: "Abandoned Research Lab",
      desc: "The lab is silent, but 6 instruments are still humming with residual energy. Calibrate them to restore the containment field.",
      objects: [
        { id: 1, icon: FlaskConical, label: "Empty Beaker" },
        { id: 2, icon: Activity, label: "Pulse Monitor" },
        { id: 3, icon: Atom, label: "Particle Jar" },
        { id: 4, icon: BrainCircuit, label: "Neural Link" },
        { id: 5, icon: Zap, label: "Power Cell" },
        { id: 6, icon: ShieldAlert, label: "Bio Hazard" },
      ]
    },
    stage3: {
      title: "Quantum Calculation",
      desc: "The reactor core requires a specific harmonic sequence. Find the missing frequency.",
      sequence: [
        { q: "10", a: "100" },
        { q: "8", a: "64" },
        { q: "6", a: "36" },
        { q: "4", a: "?" }
      ],
      answer: "16"
    },
    stage5: {
      title: "Collaborative Experience",
      prompt: "Describe a time you worked on a team where there was a significant disagreement. How did you handle the situation and what did you learn?"
    }
  },
  {
    id: 2,
    stage1: {
      title: "Cybernetic Space Station",
      desc: "The station's AI is offline. Interface with 6 core nodes to reboot the primary consciousness.",
      objects: [
        { id: 1, icon: Terminal, label: "Command Node" },
        { id: 2, icon: Database, label: "Data Core" },
        { id: 3, icon: Globe, label: "Comm Relay" },
        { id: 4, icon: Rocket, label: "Fuel Pump" },
        { id: 5, icon: CpuIcon, label: "Logic Gate" },
        { id: 6, icon: Key, label: "Access Key" },
      ]
    },
    stage3: {
      title: "Neural Synchronization",
      desc: "Sync your cognitive patterns with the station's core clock cycle.",
      sequence: [
        { q: "1", a: "1" },
        { q: "2", a: "4" },
        { q: "3", a: "9" },
        { q: "4", a: "?" }
      ],
      answer: "16"
    },
    stage5: {
      title: "Personal Milestone",
      prompt: "Tell us about a specific accomplishment you are proud of. What obstacles did you overcome to achieve it, and how did it change your perspective?"
    }
    }
];

function generatePuzzle() {
  const types = ["multiply", "add_sequence", "square_offset", "fibonacci_style"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const sequence = [];
  let answer = "";
  
  if (type === "multiply") {
    const factor = Math.floor(Math.random() * 6) + 3; // 3-8
    const offset = Math.floor(Math.random() * 10);
    const start = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < 4; i++) {
       const x = start + i;
       const val = x * factor + offset;
       sequence.push({ q: x.toString(), a: i === 3 ? "?" : val.toString() });
       if (i === 3) answer = val.toString();
    }
  } else if (type === "add_sequence") {
    const startValue = Math.floor(Math.random() * 20) + 10;
    const increment = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < 4; i++) {
       const val = startValue + (i * increment);
       sequence.push({ q: (i + 1).toString(), a: i === 3 ? "?" : val.toString() });
       if (i === 3) answer = val.toString();
    }
  } else if (type === "square_offset") {
    const offset = Math.floor(Math.random() * 15);
    const start = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < 4; i++) {
       const x = start + i;
       const val = x * x + offset;
       sequence.push({ q: x.toString(), a: i === 3 ? "?" : val.toString() });
       if (i === 3) answer = val.toString();
    }
  } else {
    // Fibonacci style: x_n = x_{n-1} + x_{n-2} + k
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 5;
    const k = Math.floor(Math.random() * 3);
    sequence.push({ q: "1", a: a.toString() });
    sequence.push({ q: "2", a: b.toString() });
    const next = a + b + k;
    sequence.push({ q: "3", a: next.toString() });
    answer = (b + next + k).toString();
    sequence.push({ q: "4", a: "?" });
  }
  
  return { sequence, answer };
}



export default function ChallengeFlow() {
  const router = useRouter();
  const { metrics, step, setStep, scenarioId, puzzleData, setPuzzleData, updateMetric } = useChallenge();

  const currentScenario = SCENARIOS[scenarioId] || SCENARIOS[0];

  // Generate dynamic puzzle once per session
  useEffect(() => {
    if (!puzzleData && typeof window !== "undefined") {
       setPuzzleData(generatePuzzle());
    }
  }, [puzzleData, setPuzzleData]);

  const activePuzzle = puzzleData || { 
    sequence: currentScenario.stage3.sequence, 
    answer: currentScenario.stage3.answer 
  };

  // Initialize Sensors
  useBehaviorTracking();
  useVisionTracking();
  useAudioTracking();

  const nextStep = useCallback(() => setStep(step + 1), [step, setStep]);
  const finishChallenge = () => router.push("/results");

  // Step 1 State: Mystery Room
  const [inspectedObjects, setInspectedObjects] = useState<Set<number>>(new Set());
  const [activeArtifactId, setActiveArtifactId] = useState<number | null>(null);
  const [activePortalId, setActivePortalId] = useState<string | null>(null);
  const step1StartTime = useRef<number>(0);
  const firstClickRecorded = useRef(false);

  // Step 2 State: Door Choice
  const step2StartTime = useRef<number | null>(null);

  // Step 3 State: Hidden Rule
  const [ruleGuess, setRuleGuess] = useState("");
  const [ruleAttempts, setRuleAttempts] = useState(0);
  const [ruleError, setRuleError] = useState(false);
  const [ruleSuccess, setRuleSuccess] = useState(false);

  // Step 5 State: Frontier Prompt
  const [promptText] = useState("");

  useEffect(() => {
    if (step === 1 && step1StartTime.current === 0) {
      step1StartTime.current = Date.now();
    }
    if (step === 2 && !step2StartTime.current) {
      step2StartTime.current = Date.now();
    }
  }, [step]);


  // Handlers
  const handleInspect = useCallback((id: number) => {
    const clickTime = Date.now();
    if (!firstClickRecorded.current) {
      updateMetric("timeToFirstClick", clickTime - step1StartTime.current);
      firstClickRecorded.current = true;
    }
    setActiveArtifactId(id);
  }, [updateMetric]);

  const handleInteractionComplete = useCallback(() => {
    if (activeArtifactId !== null) {
      const newSet = new Set(inspectedObjects).add(activeArtifactId);
      setInspectedObjects(newSet);
      updateMetric("objectsExplored", newSet.size);
      setActiveArtifactId(null);
    }
  }, [activeArtifactId, inspectedObjects, updateMetric]);

  const handleDoorSelect = useCallback((choice: string) => {
    const selectionTime = Date.now();
    if (step2StartTime.current) {
      updateMetric("doorHesitationTime", selectionTime - step2StartTime.current);
    }
    setActivePortalId(choice);
  }, [updateMetric]);

  const handlePortalComplete = useCallback((choice: string) => {
    updateMetric("doorChoice", choice);
    setActivePortalId(null);
    nextStep();
  }, [nextStep, updateMetric]);


  const handleRuleSubmit = () => {
    const newAttempts = ruleAttempts + 1;
    setRuleAttempts(newAttempts);
    updateMetric("hiddenRuleAttempts", newAttempts);

    if (ruleGuess.trim() === activePuzzle.answer) {
      setRuleSuccess(true);
      setTimeout(nextStep, 1500);
    } else {
      setRuleError(true);
      setTimeout(() => setRuleError(false), 2000);
    }
  };

  const handleFeedback = (reaction: InnerFeedbackReaction) => {
    updateMetric("feedbackReaction", reaction);
    if (reaction === "quit") {
      finishChallenge();
    } else {
      nextStep();
    }
  };

  const handlePromptSubmit = () => {
    updateMetric("frontierText", promptText);
    finishChallenge();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black relative overflow-hidden font-sans text-slate-200">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.1),transparent)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(168,85,247,0.08),transparent)]"></div>
      </div>

      {/* Artifact Interaction Modal */}
      <AnimatePresence>
        {activeArtifactId && (
          <InteractionModal 
            objectId={activeArtifactId} 
            onComplete={handleInteractionComplete} 
            onClose={() => setActiveArtifactId(null)} 
          />
        )}
      </AnimatePresence>

      {/* Portal Interaction Modal */}
      <AnimatePresence>
        {activePortalId && (
          <PortalInteractionModal 
            portalId={activePortalId} 
            onComplete={handlePortalComplete} 
            onClose={() => setActivePortalId(null)} 
          />
        )}
      </AnimatePresence>



      <div className="z-10 w-full max-w-3xl relative">
        {/* Progress System */}
        <div className="absolute -top-24 left-0 w-full">
          <div className="flex justify-between mb-4 px-2">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Phase {step} of 5</span>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-400">{Math.round((step/5)*100)}% Synchronized</span>
          </div>
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              initial={{ width: `${((step - 1) / 5) * 100}%` }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STAGE 1: Mystery Room */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="glass p-8 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
              
              <div className="flex items-center gap-3 mb-10 text-cyan-400">
                <Search className="w-6 h-6" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase">Stage I — {currentScenario.stage1.title}</h2>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tighter leading-tight">Analyze the Environment.</h3>
              <p className="text-slate-400 mb-12 text-lg font-light leading-relaxed">
                {currentScenario.stage1.desc}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {currentScenario.stage1.objects.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => handleInspect(obj.id)}
                    className={cn(
                      "group aspect-square rounded-[32px] flex flex-col items-center justify-center gap-4 border transition-all duration-500",
                      inspectedObjects.has(obj.id)
                        ? "bg-white/10 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                    )}
                  >
                    <obj.icon className={cn(
                      "w-10 h-10 transition-all duration-500",
                      inspectedObjects.has(obj.id) ? "scale-110 text-white" : "text-slate-600 group-hover:text-slate-400"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300">{obj.label}</span>
                    {inspectedObjects.has(obj.id) && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="group px-10 py-5 bg-white text-black font-black rounded-full transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 uppercase tracking-tighter"
                >
                  Proceed to Threshold
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}


          {/* STAGE 2: Choose a Door */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass p-8 md:p-16 rounded-[40px] text-center"
            >
              <div className="inline-flex items-center gap-3 mb-10 text-purple-400 mx-auto">
                <DoorClosed className="w-6 h-6" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase">Stage II — The Threshold</h2>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tighter">Choose Your Path.</h3>
              <p className="text-slate-400 mb-14 text-lg font-light max-w-lg mx-auto">
                Three portals stand before you. There is no mapping data available. 
                Your choice here dictates the complexity of the next layer.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: "red", label: "The Red Portal", color: "bg-red-500/20 border-red-500/50 text-red-400" },
                  { id: "white", label: "The White Portal", color: "bg-white/10 border-white/30 text-white" },
                  { id: "black", label: "The Black Portal", color: "bg-slate-950 border-white/10 text-slate-500" }
                ].map((door) => (
                  <button
                    key={door.id}
                    onClick={() => handleDoorSelect(door.id)}
                    className={cn(
                      "group h-64 rounded-3xl border transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden",
                      door.color,
                      "hover:scale-[1.02] hover:shadow-2xl"
                    )}
                  >
                    <div className="w-full h-full absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                    <Fingerprint className="w-12 h-12 mb-6 opacity-40 group-hover:opacity-100 transition-all duration-500" />
                    <span className="font-black tracking-[0.2em] uppercase text-[10px]">
                      {door.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STAGE 3: Hidden Rule Puzzle */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-8 md:p-16 rounded-[40px] shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-10 text-emerald-400">
                <CpuIcon className="w-6 h-6" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase">Stage III — {currentScenario.stage3.title}</h2>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tighter leading-tight">Decipher the System Rule.</h3>
              <p className="text-slate-400 mb-12 text-lg font-light leading-relaxed">
                {currentScenario.stage3.desc}
              </p>
              
              <div className="bg-black/60 border border-white/5 rounded-[32px] p-10 font-mono text-xl mb-12 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="text-[10px] uppercase text-slate-600 font-black tracking-widest animate-pulse">Encryption Active</div>
                </div>
                {activePuzzle.sequence.map((item, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-6",
                    item.a === "?" ? "text-white font-bold" : "text-slate-400"
                  )}>
                    <span className="text-emerald-500/50 font-black tracking-tighter">0{i+1}</span> 
                    {item.q} <ArrowRight className={cn("w-4 h-4", item.a === "?" && "text-emerald-500")} /> 
                    {item.a === "?" ? <span className="bg-white/5 px-4 py-1 rounded-md animate-pulse">?</span> : item.a}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  value={ruleGuess}
                  onChange={(e) => setRuleGuess(e.target.value)}
                  placeholder="Operational Value..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono text-2xl"
                  disabled={ruleSuccess}
                  onKeyDown={(e) => e.key === 'Enter' && handleRuleSubmit()}
                />
                <button
                  onClick={handleRuleSubmit}
                  disabled={!ruleGuess || ruleSuccess}
                  className="px-12 py-5 rounded-2xl bg-emerald-500 text-black font-black hover:bg-emerald-400 transition-all disabled:opacity-50 uppercase tracking-tighter shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {ruleSuccess ? <CheckCircle2 className="w-6 h-6" /> : "Verify Logic"}
                </button>
              </div>

              {ruleError && <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-xs font-black uppercase tracking-widest">Logic Failure. Try again.</motion.p>}
              {ruleSuccess && <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400 text-xs font-black uppercase tracking-widest">Logic Verified. Transitioning...</motion.p>}
              
              {!ruleSuccess && ruleAttempts >= 3 && (
                <button onClick={nextStep} className="mt-8 text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.3em] transition-colors">
                  FORCE BYPASS PROTOCOL
                </button>
              )}
            </motion.div>
          )}

          {/* STAGE 4: Feedback Test */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              className="glass p-8 md:p-16 rounded-[40px] border-red-500/20 shadow-[0_0_100px_rgba(239,68,68,0.1)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                <ShieldAlert className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tighter">System Critique.</h3>
              <p className="text-red-200/60 mb-14 text-xl font-light max-w-md mx-auto leading-relaxed">
                Evaluation algorithm suggests your last decision pattern was suboptimal. 
                Internal metrics indicate a &quot;weak&quot; performance profile.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => handleFeedback("retry")}
                  className="px-8 py-5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 font-black transition-all uppercase tracking-widest text-[10px]"
                >
                  Reject & Re-evaluate
                </button>
                <button
                  onClick={() => handleFeedback("continue")}
                  className="px-8 py-5 rounded-full bg-white text-black font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Acknowledge & Continue
                </button>
                <button
                  onClick={() => handleFeedback("quit")}
                  className="px-8 py-5 rounded-full text-slate-600 hover:text-white font-black transition-all uppercase tracking-widest text-[10px]"
                >
                  Abort Session
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 5: Frontier Choice (Voice Round) */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass p-8 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden border-cyan-500/20"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 text-amber-400">
                  <Mic className="w-6 h-6 animate-pulse" />
                  <h2 className="text-xs font-black tracking-[0.3em] uppercase text-amber-500">Stage V — {currentScenario.stage5.title}</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">AI Observer Active</span>
                </div>
              </div>

              <h3 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tighter leading-tight">Define Your Strategy.</h3>
              <p className="text-slate-400 mb-10 text-lg font-light leading-relaxed">
                {currentScenario.stage5.prompt}
                <span className="text-white font-bold"> Speak clearly into the microphone.</span>
              </p>
              
              {/* Voice Interface */}
              <div className="bg-black/40 border border-white/5 rounded-[40px] p-10 mb-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <VoiceVisualizer />
                
                <div className="mt-8 min-h-[100px] border-t border-white/5 pt-8">
                   <p className="text-sm text-slate-500 font-mono italic leading-relaxed">
                     {metrics.frontierText || "System waiting for vocal input..."}
                   </p>
                </div>

                {/* AI Insights HUD */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-[8px] uppercase text-slate-500 font-black tracking-widest">Vocal Stability</p>
                      <p className="text-[10px] font-bold text-white">{metrics.fillerWordsCount < 2 ? "OPTIMAL" : "CALIBRATING"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-[8px] uppercase text-slate-500 font-black tracking-widest">Cognitive Focus</p>
                      <p className="text-[10px] font-bold text-white">{metrics.gazeShifts < 5 ? "LOCKED" : "SHIFTS DETECTED"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                   {metrics.frontierText.split(' ').length} WORDS LOGGED
                </div>
                <button
                  onClick={handlePromptSubmit}
                  className="group px-12 py-6 rounded-full bg-white text-black font-black hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                >
                  Finalize Profile
                  <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
