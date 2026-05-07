"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export type InnerFeedbackReaction = "continue" | "retry" | "quit" | null;

export interface InnerChallengeMetrics {
  // Core Behavioral Metrics
  objectsExplored: number;
  timeToFirstClick: number; // ms
  doorHesitationTime: number; // ms
  doorChoice: string | null;
  hiddenRuleAttempts: number;
  feedbackReaction: InnerFeedbackReaction;
  frontierText: string;
  
  // Settings
  sensorModeEnabled: boolean;

  // Multimodal (Optional / Advanced)
  facePresentTime: number;
  smileEvents: number;
  blinks: number;
  gazeShifts: number;
  headPoseJitter: number;
  brightnessLevel: number; // New: 0-255
  speechDuration: number;
  volumeVariance: number;
  fillerWordsCount: number;
  speechDelay: number;
  avgAudioLevel: number; // New: cumulative average
  mouseDistance: number;
  idleTime: number;
  typingBursts: number;
}

interface ChallengeContextType {
  metrics: InnerChallengeMetrics;
  step: number;
  setStep: (step: number) => void;
  scenarioId: number;
  setScenarioId: (id: number) => void;
  puzzleData: { sequence: {q: string, a: string}[], answer: string } | null;
  setPuzzleData: (data: { sequence: {q: string, a: string}[], answer: string } | null) => void;
  userData: { name: string, college: string, branch: string, prn: string };
  setUserData: (data: { name: string, college: string, branch: string, prn: string }) => void;
  isSynced: boolean;
  setSynced: (v: boolean) => void;
  updateMetric: <K extends keyof InnerChallengeMetrics>(
    key: K,
    value: InnerChallengeMetrics[K] | ((prev: InnerChallengeMetrics[K]) => InnerChallengeMetrics[K])
  ) => void;
  resetChallenge: () => void;
  videoStream: MediaStream | null;
  setVideoStream: (stream: MediaStream | null) => void;
  audioLevel: number;
  setAudioLevel: (level: number) => void;
}

const defaultMetrics: InnerChallengeMetrics = {
  objectsExplored: 0,
  timeToFirstClick: 0,
  doorHesitationTime: 0,
  doorChoice: null,
  hiddenRuleAttempts: 0,
  feedbackReaction: null,
  frontierText: "",
  
  sensorModeEnabled: false,

  facePresentTime: 0,
  smileEvents: 0,
  blinks: 0,
  gazeShifts: 0,
  headPoseJitter: 0,
  brightnessLevel: 255, // Assume light initially
  speechDuration: 0,
  volumeVariance: 0,
  fillerWordsCount: 0,
  speechDelay: 0,
  avgAudioLevel: 0,
  mouseDistance: 0,
  idleTime: 0,
  typingBursts: 0,
};

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

const STORAGE_KEY = "inner_compass_ai_state_v1";

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<InnerChallengeMetrics>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.metrics || defaultMetrics;
        } catch { console.error("Failed to load metrics"); }
      }
    }
    return defaultMetrics;
  });

  const [step, setStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.step || 1;
        } catch { console.error("Failed to load step"); }
      }
    }
    return 1;
  });
  
  const [scenarioId, setScenarioId] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.scenarioId ?? 0;
        } catch {}
      }
    }
    return 0; // Default, will randomize in ChallengeFlow if needed or on reset
  });

  const [puzzleData, setPuzzleData] = useState<{ sequence: {q: string, a: string}[], answer: string } | null>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.puzzleData || null;
        } catch {}
      }
    }
    return null;
  });

  const [userData, setUserData] = useState<{ name: string, college: string, branch: string, prn: string }>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            name: "",
            college: "",
            branch: "",
            prn: "",
            ...(parsed.userData || {})
          };
        } catch {}
      }
    }
    return { name: "", college: "", branch: "", prn: "" };
  });

  const [isSynced, setSynced] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.isSynced || false;
        } catch {}
      }
    }
    return false;
  });

  const isLoaded = useRef(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  useEffect(() => {
    isLoaded.current = true;
  }, []);

  useEffect(() => {
    if (isLoaded.current) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ metrics, step, scenarioId, puzzleData, userData, isSynced }));
    }
  }, [metrics, step, scenarioId, puzzleData, userData, isSynced]);

  const updateMetric = useCallback(<K extends keyof InnerChallengeMetrics>(
    key: K,
    value: InnerChallengeMetrics[K] | ((prev: InnerChallengeMetrics[K]) => InnerChallengeMetrics[K])
  ) => {
    setMetrics((prev) => {
      const newValue = typeof value === "function" 
        ? (value as (prev: InnerChallengeMetrics[K]) => InnerChallengeMetrics[K])(prev[key]) 
        : value;
      return { ...prev, [key]: newValue };
    });
  }, []);

  const resetChallenge = useCallback(() => {
    setMetrics(defaultMetrics);
    setStep(1);
    setScenarioId(Math.floor(Math.random() * 3)); // Randomize on reset
    setPuzzleData(null); // Clear puzzle to force regeneration
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ChallengeContext.Provider value={{ 
      metrics, step, setStep, scenarioId, setScenarioId, puzzleData, setPuzzleData, userData, setUserData, isSynced, setSynced, updateMetric, resetChallenge,
      videoStream, setVideoStream, audioLevel, setAudioLevel
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error("useChallenge must be used within a ChallengeProvider");
  }
  return context;
};
