"use client";

import { useEffect, useRef } from "react";
import { useChallenge } from "@/store/ChallengeContext";

// Types for Web Speech API
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitAudioContext: typeof AudioContext;
  }
}

export function useAudioTracking() {
  const { metrics, updateMetric, setAudioLevel } = useChallenge();
  
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isTracking = useRef(false);
  
  const isSpeaking = useRef(false);
  const speechStartTime = useRef(0);
  const startDelayRef = useRef(0);
  const delayRecorded = useRef(false);

  useEffect(() => {
    if (!metrics.sensorModeEnabled) return;
    
    startDelayRef.current = Date.now();
    isTracking.current = true;

    let animationFrameId: number;

    let volumeHistory: number[] = [];

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isTracking.current) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        // 1. Audio Volume Variance via Web Audio API
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext.current = new AudioCtx();
        analyser.current = audioContext.current.createAnalyser();
        const source = audioContext.current.createMediaStreamSource(stream);
        source.connect(analyser.current);
        analyser.current.fftSize = 256;
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);

        const analyzeAudio = () => {
          if (!analyser.current) return;
          analyser.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          const avg = sum / dataArray.length;
          setAudioLevel(avg);
          updateMetric("avgAudioLevel", (prev: number) => (prev * 0.99 + avg * 0.01)); // Long-term average

          // Detect speaking
          if (avg > 10) {
            if (!delayRecorded.current) {
               updateMetric("speechDelay", Date.now() - startDelayRef.current);
               delayRecorded.current = true;
            }
            if (!isSpeaking.current) {
              isSpeaking.current = true;
              speechStartTime.current = Date.now();
            }
            volumeHistory.push(avg);
            if (volumeHistory.length > 100) volumeHistory.shift();
          } else {
            if (isSpeaking.current) {
              isSpeaking.current = false;
              updateMetric("speechDuration", (prev: number) => prev + (Date.now() - speechStartTime.current));
              
              // Calculate volume variance
              if (volumeHistory.length > 0) {
                const mean = volumeHistory.reduce((a,b) => a+b, 0) / volumeHistory.length;
                const variance = volumeHistory.reduce((a,b) => a + Math.pow(b - mean, 2), 0) / volumeHistory.length;
                updateMetric("volumeVariance", (prev: number) => prev + variance);
              }
              volumeHistory = [];
            }
          }

          animationFrameId = requestAnimationFrame(analyzeAudio);
        };
        analyzeAudio();

        // 2. Speech Recognition for Fillers
        if (window.webkitSpeechRecognition) {
          const SpeechRecognition = window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = false;
          
          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            let latestTranscript = "";
            for (let i = event.results.length - 1; i < event.results.length; i++) {
              latestTranscript = event.results[i][0].transcript;
            }
            
            // Update the global frontier text for analysis
            updateMetric("frontierText", (prev: string) => {
               // Simple deduplication for interim vs final results if needed
               // but webkitSpeechRecognition continuous mode usually appends to the results array
               return prev + " " + latestTranscript;
            });
              
            const fillers = (latestTranscript.toLowerCase().match(/\b(um|uh|like|you know)\b/g) || []).length;
            if (fillers > 0) {
              updateMetric("fillerWordsCount", (prev: number) => prev + fillers);
            }
          };

          recognitionRef.current.start();
        }

      } catch (err) {
        console.error("Audio tracking initialization failed", err);
      }
    };

    initAudio();

    return () => {
      isTracking.current = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContext.current) audioContext.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (recognitionRef.current) recognitionRef.current.stop();
      setTimeout(() => setAudioLevel(0), 0);
    };
  }, [metrics.sensorModeEnabled, updateMetric, setAudioLevel]);
}
