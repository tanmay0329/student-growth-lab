"use client";

import { useEffect, useRef } from "react";
import { useChallenge } from "@/store/ChallengeContext";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export function useVisionTracking() {
  const { metrics, updateMetric, setVideoStream } = useChallenge();
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isTracking = useRef(false);
  
  const facePresentStartTime = useRef(0);
  const isFacePresent = useRef(false);
  const lastNosePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!metrics.sensorModeEnabled) return;

    let animationFrameId: number;
    let lastVideoTime = -1;
    isTracking.current = true;

    const initVision = async () => {
      try {
        // 1. Initialize MediaPipe
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        if (!isTracking.current) return;

        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });

        // 2. Setup Camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (!isTracking.current) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        setVideoStream(stream); // Expose to UI
        
        const video = document.createElement("video");
        video.srcObject = stream;
        video.playsInline = true;
        await video.play();
        videoRef.current = video;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = 160; // Low res for speed
        canvas.height = 120;

        // 3. Start Tracking Loop
        const predictWebcam = () => {
          if (!isTracking.current || !videoRef.current || !landmarkerRef.current) return;
          
          if (videoRef.current.currentTime !== lastVideoTime && videoRef.current.readyState >= 2) {
            lastVideoTime = videoRef.current.currentTime;

            // Brightness Check
            if (ctx) {
              ctx.drawImage(videoRef.current, 0, 0, 160, 120);
              const imageData = ctx.getImageData(0, 0, 160, 120);
              let r, g, b, avg = 0;
              for (let i = 0; i < imageData.data.length; i += 4) {
                r = imageData.data[i];
                g = imageData.data[i + 1];
                b = imageData.data[i + 2];
                avg += (r + g + b) / 3;
              }
              const brightness = avg / (imageData.data.length / 4);
              updateMetric("brightnessLevel", (prev: number) => (prev * 0.9 + brightness * 0.1)); // Smoothing
            }

            try {
              const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
              
              if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {

              // Face is present
              if (!isFacePresent.current) {
                isFacePresent.current = true;
                facePresentStartTime.current = Date.now();
              }
              
              const shapes = results.faceBlendshapes[0].categories;
              
              // Smile detection
              const smileL = shapes.find(s => s.categoryName === "mouthSmileLeft")?.score || 0;
              const smileR = shapes.find(s => s.categoryName === "mouthSmileRight")?.score || 0;
              if (smileL > 0.5 && smileR > 0.5) {
                // simple heuristic for a "smile event"
                if (Math.random() < 0.05) updateMetric("smileEvents", (prev: number) => prev + 1);
              }

              // Blink detection
              const eyeBlinkL = shapes.find(s => s.categoryName === "eyeBlinkLeft")?.score || 0;
              const eyeBlinkR = shapes.find(s => s.categoryName === "eyeBlinkRight")?.score || 0;
              if (eyeBlinkL > 0.5 && eyeBlinkR > 0.5) {
                if (Math.random() < 0.1) updateMetric("blinks", (prev: number) => prev + 1);
              }

              // Gaze & Head Jitter (approximation using nose tip if available)
              if (results.faceLandmarks && results.faceLandmarks[0]) {
                const nose = results.faceLandmarks[0][1]; // Nose tip
                const dx = nose.x - lastNosePos.current.x;
                const dy = nose.y - lastNosePos.current.y;
                const movement = Math.sqrt(dx*dx + dy*dy);
                if (movement > 0.05) {
                  updateMetric("headPoseJitter", (prev: number) => prev + movement);
                  updateMetric("gazeShifts", (prev: number) => prev + 1);
                }
                lastNosePos.current = { x: nose.x, y: nose.y };
              }
            } else {
              // Face absent
              if (isFacePresent.current) {
                isFacePresent.current = false;
                updateMetric("facePresentTime", (prev: number) => prev + (Date.now() - facePresentStartTime.current));
              }
            }
          } catch (error) {
            console.error("MediaPipe detection error:", error);
          }



          }
          if (isTracking.current) {
            animationFrameId = requestAnimationFrame(predictWebcam);
          }
        };
        predictWebcam();

      } catch (err) {
        console.error("Vision tracking initialization failed", err);
      }
    };

    initVision();

    return () => {
      isTracking.current = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      const stream = streamRef.current;
      const landmarker = landmarkerRef.current;
      const facePresent = isFacePresent.current;
      const startTime = facePresentStartTime.current;

      streamRef.current = null;
      landmarkerRef.current = null;
      videoRef.current = null;

      if (stream) stream.getTracks().forEach(t => t.stop());
      if (landmarker) landmarker.close();
      
      const timeToAdd = facePresent ? Date.now() - startTime : 0;
      
      setTimeout(() => {
        if (timeToAdd > 0) {
          updateMetric("facePresentTime", (prev: number) => prev + timeToAdd);
        }
        setVideoStream(null); // Clear from UI
      }, 0);
    };
  }, [metrics.sensorModeEnabled, updateMetric, setVideoStream]);
}
