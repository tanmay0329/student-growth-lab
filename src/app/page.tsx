"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Camera, Mic, Shield, Zap, Search, Brain, Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChallenge } from "@/store/ChallengeContext";
import { cn } from "@/lib/utils";

export default function Home() {
  const { updateMetric, resetChallenge, userData, setUserData, setVideoStream } = useChallenge();
  const [sensorsEnabled, setSensorsEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "requesting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    resetChallenge();
  }, [resetChallenge]);

  const toggleSensors = () => {
    const newVal = !sensorsEnabled;
    setSensorsEnabled(newVal);
    updateMetric("sensorModeEnabled", newVal);
  };

  const handleStart = async () => {
    if (!userData.name || !userData.college || !userData.branch || !userData.prn) return;
    
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      setVideoStream(stream);
      router.push("/challenge");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.name === "NotAllowedError" 
        ? "Access Denied: Camera and Microphone are mandatory for behavioral analysis."
        : "Hardware Error: Please ensure your camera and microphone are connected.");
    }
  };

  const traits = [
    { name: "Confidence", icon: Zap, desc: "Measure your decisiveness and assertiveness under pressure.", color: "text-amber-400" },
    { name: "Curiosity", icon: Search, desc: "Evaluate your drive to explore and understand the unknown.", color: "text-cyan-400" },
    { name: "Emotional Safety", icon: Shield, desc: "Assess your resilience and recovery from critical feedback.", color: "text-emerald-400" },
    { name: "Exploratory Power", icon: Brain, desc: "Test your capacity for novel strategies and creative expansion.", color: "text-purple-400" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="z-10 max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest text-cyan-400 uppercase"
          >
            <Compass className="w-4 h-4" />
            <span>Behavioral Intelligence v2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Discover How You <br />
            <span className="text-gradient">Operate Under Uncertainty</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light"
          >
            A 7-minute cinematic challenge that uses AI and real-time behavioral patterns to map your operational DNA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex flex-col items-center glass p-6 rounded-3xl max-w-sm w-full border-white/5 shadow-2xl">
              <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm uppercase tracking-tighter">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <Mic className="w-4 h-4 text-purple-400" />
                  Sensor Mode
                </div>
                <button 
                  onClick={toggleSensors}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    sensorsEnabled ? "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-slate-800"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                    sensorsEnabled ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-left leading-relaxed">
                ENABLE MULTIMODAL TRACKING TO ANALYZE EYE GAZE, SPEECH VARIANCE, AND MICRO-EXPRESSIONS. PROCESSED 100% LOCALLY.
              </p>
            </div>

            <div className="flex flex-col items-center glass p-8 rounded-[40px] max-w-md w-full border-white/5 shadow-2xl mb-8">
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-slate-500 mb-8">Candidate Authentication</h2>
              
              <div className="w-full space-y-6">
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">Full Name</label>
                  <input 
                    type="text" 
                    value={userData.name || ""}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Enter candidate name"
                    suppressHydrationWarning={true}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">College / Organization</label>
                  <input 
                    type="text" 
                    value={userData.college || ""}
                    onChange={(e) => setUserData({ ...userData, college: e.target.value })}
                    placeholder="Enter institution name"
                    suppressHydrationWarning={true}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">Branch</label>
                    <input 
                      type="text" 
                      value={userData.branch || ""}
                      onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
                      placeholder="e.g. CSE, IT"
                      suppressHydrationWarning={true}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">PRN / ID</label>
                    <input 
                      type="text" 
                      value={userData.prn || ""}
                      onChange={(e) => setUserData({ ...userData, prn: e.target.value })}
                      placeholder="PRN number"
                      suppressHydrationWarning={true}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleStart}
              disabled={status === "requesting" || !userData.name || !userData.college || !userData.branch || !userData.prn}
              className={cn(
                "group relative w-full md:w-auto",
                (!userData.name || !userData.college || !userData.branch || !userData.prn) && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-3 px-12 py-6 bg-white text-black text-xl font-black rounded-full transition-transform hover:scale-105 active:scale-95">
                {status === "requesting" ? "INITIALIZING SENSORS..." : "START CHALLENGE"}
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {status === "error" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-bold"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {errorMsg}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Traits Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Core Dimensions Measured</h2>
          <p className="text-slate-500">Beyond standard personality tests, we map behavioral execution.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {traits.map((trait, i) => (
            <motion.div
              key={trait.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl border-white/5 hover:border-white/10 transition-colors"
            >
              <trait.icon className={cn("w-10 h-10 mb-6", trait.color)} />
              <h3 className="text-xl font-bold mb-2">{trait.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{trait.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass p-10 rounded-[40px] border-white/5 relative">
                <Quote className="w-12 h-12 text-white/5 absolute top-8 right-8" />
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-lg text-slate-300 italic mb-8">
                  &quot;This is not a test. It felt like a high-stakes simulation that actually knew how I was thinking.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500" />
                  <div>
                    <p className="font-bold">Operational Lead</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">FinTech Startup</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Compass className="w-8 h-8 text-cyan-400" />
          <span className="text-2xl font-black tracking-tighter uppercase">Student Growth Lab</span>
        </div>
        <div className="flex gap-8 justify-center text-slate-500 text-sm mb-12">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Methodology</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <p className="text-slate-600 text-xs">© 2026 Student Growth Lab. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
