"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Camera, Mic, Shield, Zap, Search, Brain, Star, Quote, Activity, Mail, MapPin } from "lucide-react";
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

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 glass px-5 py-2.5 rounded-2xl border-white/5 shadow-xl"
          >
            <img src="/logo.png" alt="Student Growth Lab Logo" className="w-8 h-8 object-contain mix-blend-lighten" />
            <span className="text-xl font-black tracking-tighter uppercase text-white">Student Growth Lab</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500"
          >
            <a href="#traits" className="hover:text-cyan-400 transition-colors pointer-events-auto">Methodology</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors pointer-events-auto">Privacy</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors pointer-events-auto">Contact</a>
            <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white pointer-events-auto">
              Institutional Login
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>

        <div className="z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start pt-12 lg:pt-20">
          {/* Left Column: Content */}
          <div className="text-center lg:text-left pt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black tracking-widest text-cyan-400 uppercase"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Behavioral Intelligence v2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.85] text-white"
            >
              Master Your <br />
              <span className="text-gradient">Operational DNA</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
            >
              Step into a 7-minute high-fidelity simulation designed to map how you think, decide, and execute under extreme uncertainty. Powered by multimodal AI.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:flex items-center gap-12 text-slate-500"
            >
              <div>
                <p className="text-2xl font-black text-white">7 min</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Analysis Time</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Local Privacy</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">4D</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Trait Mapping</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form & Sensors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-md space-y-8">
              {/* Sensor Card */}
              <div className="glass p-6 rounded-3xl border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex items-center gap-3 text-slate-300 font-bold text-xs uppercase tracking-widest">
                    <div className="flex gap-2">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <Mic className="w-4 h-4 text-purple-400" />
                    </div>
                    <span>Sensor Suite</span>
                  </div>
                  <button 
                    onClick={toggleSensors}
                    aria-label="Toggle multimodal tracking sensors"
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      sensorsEnabled ? "bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-slate-800"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                      sensorsEnabled ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
                  Analyzing gaze, micro-expressions, and speech variance. 100% processed locally on your device.
                </p>
              </div>

              {/* Auth Card */}
              <div className="glass p-10 rounded-[48px] border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 mb-10 text-center">Candidate Credentials</h2>
                
                <div className="space-y-6">
                  <div className="group">
                    <label htmlFor="full-name" className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-4 group-focus-within:text-cyan-400 transition-colors">Full Name</label>
                    <input 
                      id="full-name"
                      type="text" 
                      value={userData.name || ""}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      placeholder="Enter candidate name"
                      autoComplete="off"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all font-mono text-sm"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="org" className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-4 group-focus-within:text-purple-400 transition-colors">Organization</label>
                    <input 
                      id="org"
                      type="text" 
                      value={userData.college || ""}
                      onChange={(e) => setUserData({ ...userData, college: e.target.value })}
                      placeholder="University or Company"
                      autoComplete="off"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="branch" className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-4 group-focus-within:text-cyan-400 transition-colors">Branch</label>
                      <input 
                        id="branch"
                        type="text" 
                        value={userData.branch || ""}
                        onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
                        placeholder="e.g. CS, IT"
                        autoComplete="off"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all font-mono text-sm"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="prn" className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-4 group-focus-within:text-purple-400 transition-colors">PRN / ID</label>
                      <input 
                        id="prn"
                        type="text" 
                        value={userData.prn || ""}
                        onChange={(e) => setUserData({ ...userData, prn: e.target.value })}
                        placeholder="ID Number"
                        autoComplete="off"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleStart}
                  disabled={status === "requesting" || !userData.name || !userData.college || !userData.branch || !userData.prn}
                  className={cn(
                    "group relative w-full mt-10 transition-all active:scale-95",
                    (!userData.name || !userData.college || !userData.branch || !userData.prn) && "opacity-50 grayscale cursor-not-allowed"
                  )}
                >
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-3 px-12 py-6 bg-white text-black text-sm font-black rounded-full transition-transform hover:bg-slate-100 uppercase tracking-widest">
                    {status === "requesting" ? "INITIALIZING..." : "Begin Analysis"}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>

                {status === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {errorMsg}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Traits Section */}
      <section id="traits" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
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
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto scroll-mt-20">
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

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black tracking-widest text-purple-400 uppercase"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Connect with us</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
              Let&apos;s Build the <br />
              <span className="text-gradient">Future of Growth</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12 max-w-lg font-light leading-relaxed">
              Have questions about our methodology or want to integrate SGL into your institution? We&apos;re here to help.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">HQ Location</p>
                  <p className="text-lg font-bold text-white">Pune, Maharashtra, India</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Direct Inquiries</p>
                  <p className="text-lg font-bold text-white">admin@praisearray.org</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-[48px] border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <form action="https://formspree.io/f/xkoybdej" method="POST" className="space-y-6">
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-4">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-4">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@university.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3 ml-4">Message</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full relative flex items-center justify-center gap-3 px-12 py-6 bg-white text-black text-sm font-black rounded-full transition-transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
              >
                Send Message
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Student Growth Lab Logo" className="w-8 h-8 object-contain mix-blend-lighten" />
                <span className="text-xl font-black tracking-tighter uppercase text-white">Student Growth Lab</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Redefining behavioral intelligence through high-fidelity simulations and multimodal AI analysis.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-500/50 transition-colors text-slate-400 hover:text-cyan-400">
                  <Activity className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/50 transition-colors text-slate-400 hover:text-purple-400">
                  <Shield className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#traits" className="hover:text-cyan-400 transition-colors">Methodology</a></li>
                <li><a href="#faq" className="hover:text-cyan-400 transition-colors">AI Analysis</a></li>
                <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Partner Inquiry</a></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Governance</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#faq" className="hover:text-cyan-400 transition-colors">Privacy Framework</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Data Processing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Ethics Policy</a></li>
              </ul>
            </div>

            {/* Column 4: HUD */}
            <div className="glass p-6 rounded-3xl border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Active</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter leading-tight mb-4">
                Neural processing clusters operational across all nodes.
              </p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-cyan-500 to-purple-500" />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">
              © 2026 Student Growth Lab. ALL RIGHTS RESERVED.
            </p>
            
            <div className="flex items-center gap-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600">Powered by</p>
              <a 
                href="https://praisearray.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-black tracking-tighter text-slate-400 hover:text-white transition-colors uppercase"
              >
                Praise Array
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
