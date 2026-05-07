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
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Student Growth Lab",
            "url": "https://student-growth-lab.vercel.app",
            "logo": "https://student-growth-lab.vercel.app/logo.png",
            "description": "AI-powered behavioral intelligence and career growth platform for students.",
            "sameAs": [
              "https://twitter.com/studentgrowth",
              "https://linkedin.com/company/studentgrowthlab"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Behavioral Intelligence Assessment",
            "provider": {
              "@type": "Organization",
              "name": "Student Growth Lab"
            },
            "description": "7-minute cinematic challenge using AI to map candidate operational DNA."
          })
        }}
      />

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
            <img src="/logo.png" alt="" className="w-4 h-4 object-contain" />
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
                  aria-label="Toggle multimodal tracking sensors"
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
                  <label htmlFor="full-name" className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">Full Name</label>
                  <input 
                    id="full-name"
                    type="text" 
                    value={userData.name || ""}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Enter candidate name"
                    suppressHydrationWarning={true}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="org" className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">College / Organization</label>
                  <input 
                    id="org"
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
                    <label htmlFor="branch" className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">Branch</label>
                    <input 
                      id="branch"
                      type="text" 
                      value={userData.branch || ""}
                      onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
                      placeholder="e.g. CSE, IT"
                      suppressHydrationWarning={true}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="prn" className="block text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 ml-4">PRN / ID</label>
                    <input 
                      id="prn"
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
          <h2 className="text-4xl font-bold mb-4">Core Dimensions of Student Growth</h2>
          <p className="text-slate-500">Beyond standard personality tests, we map behavioral execution for career readiness.</p>
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
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories from our Community</h2>
            <p className="text-slate-500">Real impact on student careers and professional development.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Final Year CS Student",
                org: "D.Y. Patil Institute",
                text: "The behavioral analysis was scarily accurate. It helped me understand my decision-making patterns under pressure and gave me a clear path for growth.",
                color: "from-cyan-500 to-blue-500"
              },
              {
                name: "Dr. Arvinder Singh",
                role: "Dean of Academics",
                org: "Growth Engineering College",
                text: "Integrating this simulation has allowed us to personalize student development at scale. It captures nuances that standard assessments completely miss.",
                color: "from-purple-500 to-pink-500"
              },
              {
                name: "Michael Chen",
                role: "Tech Recruiter",
                org: "Global Systems Inc.",
                text: "SGL provides a multidimensional view of candidates. We now look for 'Visionary' and 'Strategist' archetypes specifically for our high-growth roles.",
                color: "from-emerald-500 to-teal-500"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass p-10 rounded-[40px] border-white/5 relative group hover:border-white/10 transition-all duration-500"
              >
                <Quote className="w-12 h-12 text-white/5 absolute top-8 right-8 group-hover:text-white/10 transition-colors" />
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-lg text-slate-300 italic mb-8 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-full bg-gradient-to-br shadow-lg", testimonial.color)} />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{testimonial.role}</p>
                    <p className="text-[10px] text-cyan-500/70 font-bold uppercase tracking-tighter mt-0.5">{testimonial.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section for AI SEO */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500">Everything you need to know about SGL Behavioral Intelligence.</p>
        </div>
        <div className="space-y-6">
          {[
            {
              q: "How does the behavioral analysis work?",
              a: "SGL uses computer vision and audio analysis (processed entirely locally) to map your micro-expressions, gaze patterns, and speech variance during a high-stakes simulation."
            },
            {
              q: "Is my data stored or shared?",
              a: "No. All sensor data is processed in real-time within your browser. We only synchronize the final derived scores and archetype to help with your career guidance."
            },
            {
              q: "How can SGL help my career?",
              a: "By identifying your behavioral archetype (e.g., Visionary, Strategist), we connect you with specific roles, internships, and skill-building resources that match your natural operational DNA."
            }
          ].map((faq, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/5 bg-white/5">
              <h3 className="text-lg font-bold mb-3 text-cyan-400">{faq.q}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does the behavioral analysis work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SGL uses computer vision and audio analysis processed locally to map micro-expressions and gaze patterns."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can SGL help my career?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It identifies your behavioral archetype to match you with suitable internships and career paths."
                  }
                }
              ]
            })
          }}
        />
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <img src="/logo.png" alt="Student Growth Lab Logo" className="w-12 h-12 object-contain" />
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
