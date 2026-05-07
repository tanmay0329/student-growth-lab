"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useChallenge } from "@/store/ChallengeContext";
import { Compass, Award, Zap, Shield, Eye, Brain, Download, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

export default function Results() {
  const { metrics, userData, isSynced, setSynced } = useChallenge();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [mounted, setMounted] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);




  const scores = useMemo(() => {
    // 1. Confidence (Base = 5)
    let conf = 5;
    // Accuracy Pattern
    if (metrics.hiddenRuleAttempts === 1) conf += 2;
    else if (metrics.hiddenRuleAttempts === 2) conf += 1;
    else if (metrics.hiddenRuleAttempts >= 3) conf -= 1;
    
    // Decisiveness (Door Choice)
    if (metrics.doorHesitationTime > 0) {
      if (metrics.doorHesitationTime < 3000) conf += 1;
      else if (metrics.doorHesitationTime > 6000) conf -= 1;
    }
    
    // Consistency Check
    const timingVariance = Math.abs(metrics.doorHesitationTime - metrics.timeToFirstClick);
    if (timingVariance < 2000 && metrics.doorHesitationTime < 4000) conf += 1;
    else if (timingVariance > 8000) conf -= 1;

    // AI Critique Response
    if (metrics.feedbackReaction === "continue") conf += 1;
    else if (metrics.feedbackReaction === "quit") conf -= 1;

    // 2. Curiosity (Base = 3)
    let cur = 3;
    // Depth & Diversity
    cur += Math.min(5, metrics.objectsExplored);
    if (metrics.objectsExplored > 3) cur += 1; // Pattern Diversity
    
    // Initiative Speed
    if (metrics.timeToFirstClick > 0) {
      if (metrics.timeToFirstClick < 2000) cur += 1;
      else if (metrics.timeToFirstClick > 6000) cur -= 1;
    }
    
    // Exploration Pattern
    if (metrics.objectsExplored > 4) cur += 1;
    else if (metrics.objectsExplored < 2) cur -= 1;

    // 3. Emotional Safety (Base = 5)
    let emSafe = 5;
    // Failure Recovery & Critique Handling
    if (metrics.feedbackReaction === "continue") {
      emSafe += 2;
      if (metrics.hiddenRuleAttempts > 1) emSafe += 1; // Retry + Continue
    } else if (metrics.feedbackReaction === "quit") {
      emSafe -= 2;
    }

    // Persistence Pattern
    if (metrics.hiddenRuleAttempts > 1 && metrics.hiddenRuleAttempts < 4) emSafe += 1;
    else if (metrics.hiddenRuleAttempts >= 4) emSafe -= 1;

    // Stability Signals (Low jitter/shifts)
    if (metrics.headPoseJitter < 5 && metrics.gazeShifts < 10) emSafe += 1;

    // 4. Exploratory Power (Base = 3)
    let expPow = 3;
    // Completion
    if (metrics.objectsExplored >= 5) expPow += 2;
    
    // Synthesis & Depth (Text Analysis)
    const words = metrics.frontierText.split(' ').filter((w: string) => w.length > 0).length;
    if (words > 60) {
      expPow += 3; // Synthesis Bonus
      expPow += 2; // Depth Bonus
    } else if (words > 20) {
      expPow += 2;
    } else if (words < 10 && words > 0) {
      expPow -= 2;
    }

    const clamp = (v: number) => Math.max(1, Math.min(10, Math.round(v)));
    return {
      confidence: clamp(conf),
      curiosity: clamp(cur),
      emotional_safety: clamp(emSafe),
      exploratory_power: clamp(expPow),
    };
  }, [metrics]);

  const radarData = [
    { subject: 'Confidence', A: scores.confidence, fullMark: 10 },
    { subject: 'Curiosity', A: scores.curiosity, fullMark: 10 },
    { subject: 'Emotional Safety', A: scores.emotional_safety, fullMark: 10 },
    { subject: 'Exploratory Power', A: scores.exploratory_power, fullMark: 10 },
  ];

  const archetype = useMemo(() => {
    const { confidence, curiosity, emotional_safety: emSafe, exploratory_power: expPow } = scores;
    
    if (expPow >= 8 && curiosity >= 7) return { 
      name: "Visionary", 
      icon: <Eye className="w-12 h-12 text-cyan-400" />,
      tag: "Architect of the Unknown",
      desc: "You perceive patterns in chaos that others miss. Your ability to map unexplored territories makes you a natural pioneer."
    };
    if (confidence >= 8 && expPow >= 6) return { 
      name: "Builder", 
      icon: <Zap className="w-12 h-12 text-amber-400" />,
      tag: "Catalyst of Execution",
      desc: "You operate with high-velocity precision. You construct the path forward through raw decisive power."
    };
    if (curiosity >= 8 && confidence < 7) return { 
      name: "Explorer", 
      icon: <Compass className="w-12 h-12 text-blue-400" />,
      tag: "Seer of Possibility",
      desc: "Your hunger for data is your primary engine. You treat every uncertainty as a puzzle to be solved."
    };
    if (emSafe >= 8) return { 
      name: "Strategist", 
      icon: <Shield className="w-12 h-12 text-emerald-400" />,
      tag: "Master of Resilience",
      desc: "You possess a rare psychological fortitude, staying calm and methodical when systems fail."
    };
    return { 
      name: "Warrior", 
      icon: <Award className="w-12 h-12 text-red-400" />,
      tag: "Force of Persistence",
      desc: "You break through barriers by sheer force of will, showing intense drive regardless of systemic feedback."
    };
  }, [scores]);

  const handleDownload = async () => {
    if (!resultCardRef.current) return;
    setIsDownloading(true);
    const canvas = await html2canvas(resultCardRef.current, {
      backgroundColor: "#020617",
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `inner-compass-${archetype.name.toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setIsDownloading(false);
  };

  const syncToSheet = useCallback(async () => {
    if (isSyncing || syncStatus === "success" || isSynced) return;
    setIsSyncing(true);
    try {
      await fetch("https://script.google.com/macros/s/AKfycby_Tbi-pnGfkgpHUVJD5EkqC74PtrX5MGbaAqteSaFslK5ABKxUqaICovncfurnR6ak/exec", {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script redirects
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          college: userData.college,
          branch: userData.branch,
          prn: userData.prn,
          confidence: scores.confidence,
          curiosity: scores.curiosity,
          emotionalSafety: scores.emotionalSafety,
          exploratoryPower: scores.exploratory_power,
          archetype: archetype.name
        })
      });
      setSyncStatus("success");
      setSynced(true);
    } catch (err) {
      console.error("Sync failed", err);
      setSyncStatus("error");
    } finally {
      setIsSyncing(false);
    }
  }, [userData, scores, archetype, isSyncing, syncStatus]);

  useEffect(() => {
    if (mounted && !isSynced && syncStatus === "idle") {
      syncToSheet();
    } else if (isSynced) {
      setSyncStatus("success");
    }
  }, [mounted, isSynced, syncStatus, syncToSheet]);

  return (
    <main className="min-h-screen bg-black text-slate-200 p-6 md:p-12 overflow-x-hidden flex flex-col items-center justify-center">
      <div className="z-10 w-full max-w-2xl text-center">
        {mounted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[48px] border-white/5 p-12 md:p-20 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-10 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
              <Award className="w-12 h-12 text-cyan-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tighter leading-none">Assessment Complete.</h1>
            
            <p className="text-slate-400 mb-12 text-lg font-light leading-relaxed">
              Thank you, <span className="text-white font-bold">{userData.name || "Candidate"}</span>. 
              Your behavioral data and performance metrics have been successfully captured and synchronized with our system.
            </p>

            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">System Status</h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                Your profile is now being processed by the growth algorithm. 
                Detailed insights and your behavioral archetype will be shared with you by the administration soon.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
               {isSyncing ? (
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Synchronizing...</span>
                 </div>
               ) : syncStatus === "success" ? (
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Profile Secured</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Sync Pending</span>
                 </div>
               )}
            </div>

            <Link 
              href="/"
              className="inline-block mt-12 px-10 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white"
            >
              Return to Portal
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <RefreshCcw className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Finalizing Analysis...</p>
          </div>
        )}

        <p className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
          Student Growth Lab // Neural Analysis Sequence Complete
        </p>
      </div>
    </main>
  );
}
