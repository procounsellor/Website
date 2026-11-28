import { useCallback, useEffect, useRef, useState } from "react";
import type { Presence } from "@/api/mbaLiveInterview";

/**
 * Body-language numbers for the mock interview, measured on the candidate's own
 * device with MediaPipe face tracking. Frames are analysed in memory and thrown
 * away; nothing but the per-answer totals below ever leaves the browser.
 *
 * Loaded only when the candidate turns the camera on (the library, its WASM and
 * the ~3.6 MB face model are fetched then, never for anyone else).
 */

const VERSION = "0.10.14"; // keep in step with package.json
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const SAMPLE_MS = 250; // 4 samples a second is plenty for posture and gaze
const AWAY_SAMPLES = 6; // ~1.5 s looking away counts as one glance away
const MAX_YAW_DEG = 22;
const MAX_PITCH_DEG = 25; // a webcam usually sits above the screen, so allow looking a little down
const SIDE_GAZE = 0.6; // eyeLookIn/Out/Up blendshape above this = eyes off the screen
const SMILE = 0.35;

type Landmarker = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => {
    faceLandmarks: { x: number; y: number }[][];
    faceBlendshapes?: { categories: { categoryName: string; score: number }[] }[];
    facialTransformationMatrixes?: { data: number[] }[];
  };
};

let landmarkerPromise: Promise<Landmarker> | null = null;

/** One FaceLandmarker for the page; GPU where the browser allows it, else CPU. */
function loadLandmarker(): Promise<Landmarker> {
  landmarkerPromise ??= (async () => {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
    const options = (delegate: "GPU" | "CPU") => ({
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: "VIDEO" as const,
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });
    try {
      return (await FaceLandmarker.createFromOptions(fileset, options("GPU"))) as unknown as Landmarker;
    } catch {
      return (await FaceLandmarker.createFromOptions(fileset, options("CPU"))) as unknown as Landmarker;
    }
  })();
  landmarkerPromise.catch(() => {
    landmarkerPromise = null; // allow a retry later
  });
  return landmarkerPromise;
}

/** What one frame says. Exported for tests. */
export interface FrameReading {
  face: boolean;
  eyeContact: boolean;
  smiling: boolean;
  nose: { x: number; y: number } | null;
}

/** Yaw and pitch (degrees) from MediaPipe's column-major 4x4 face transform. */
export function headAngles(m: number[]): { yaw: number; pitch: number } {
  const deg = 180 / Math.PI;
  const yaw = Math.asin(Math.max(-1, Math.min(1, -m[2]))) * deg;
  const pitch = Math.atan2(m[6], m[10]) * deg;
  return { yaw, pitch };
}

export function readFrame(result: ReturnType<Landmarker["detectForVideo"]>): FrameReading {
  const landmarks = result.faceLandmarks?.[0];
  if (!landmarks || landmarks.length === 0) return { face: false, eyeContact: false, smiling: false, nose: null };
  const shapes = new Map((result.faceBlendshapes?.[0]?.categories ?? []).map((c) => [c.categoryName, c.score]));
  const s = (name: string) => shapes.get(name) ?? 0;
  const matrix = result.facialTransformationMatrixes?.[0]?.data;
  const { yaw, pitch } = matrix && matrix.length >= 16 ? headAngles(matrix) : { yaw: 0, pitch: 0 };
  // Reading the question on screen means looking down a little: only eyes turned
  // to the side or up count as looking away. Head turned far away does too.
  const sideways = Math.max(s("eyeLookOutLeft"), s("eyeLookOutRight"), s("eyeLookInLeft"), s("eyeLookInRight"));
  const up = Math.max(s("eyeLookUpLeft"), s("eyeLookUpRight"));
  const facing = Math.abs(yaw) <= MAX_YAW_DEG && Math.abs(pitch) <= MAX_PITCH_DEG;
  return {
    face: true,
    eyeContact: facing && sideways < SIDE_GAZE && up < SIDE_GAZE,
    smiling: (s("mouthSmileLeft") + s("mouthSmileRight")) / 2 > SMILE,
    nose: landmarks[1] ? { x: landmarks[1].x, y: landmarks[1].y } : null,
  };
}

/** Running totals for one answer. Exported for tests. */
export class PresenceAccumulator {
  private startedAt = Date.now();
  private samples = 0;
  private faceSamples = 0;
  private contactSamples = 0;
  private smileSamples = 0;
  private awayRun = 0;
  private lookAways = 0;
  private movement = 0;
  private moves = 0;
  private lastNose: { x: number; y: number } | null = null;

  private now: () => number;

  constructor(now: () => number = Date.now) {
    this.now = now;
    this.startedAt = now();
  }

  reset(): void {
    Object.assign(this, new PresenceAccumulator(this.now));
  }

  add(frame: FrameReading): void {
    this.samples += 1;
    if (frame.face) this.faceSamples += 1;
    if (frame.face && frame.eyeContact) this.contactSamples += 1;
    if (frame.face && frame.smiling) this.smileSamples += 1;
    if (frame.face && frame.eyeContact) {
      this.awayRun = 0;
    } else {
      this.awayRun += 1;
      if (this.awayRun === AWAY_SAMPLES) this.lookAways += 1; // once per glance away
    }
    if (frame.nose && this.lastNose) {
      this.movement += Math.hypot(frame.nose.x - this.lastNose.x, frame.nose.y - this.lastNose.y);
      this.moves += 1;
    }
    this.lastNose = frame.nose;
  }

  /** The answer's numbers, or null with too little to go on (under ~2 s of camera). */
  snapshot(): Presence | null {
    if (this.samples < 8) return null;
    const pct = (n: number, of: number) => (of > 0 ? Math.round((n / of) * 100) : 0);
    const meanMove = this.moves > 0 ? this.movement / this.moves : 0;
    return {
      durationSeconds: Math.min(1800, Math.round((this.now() - this.startedAt) / 1000)),
      samples: this.samples,
      faceVisiblePct: pct(this.faceSamples, this.samples),
      eyeContactPct: pct(this.contactSamples, this.faceSamples),
      lookAwayCount: Math.min(500, this.lookAways),
      smilePct: pct(this.smileSamples, this.faceSamples),
      // Nose travel per sample, as a share of the frame: ~0.003 is a still head, ~0.02 a lot of movement.
      steadiness: Math.max(0, Math.min(100, Math.round(100 - meanMove * 3000))),
    };
  }
}

export type TrackerStatus = "off" | "loading" | "tracking" | "unavailable";

/**
 * Track the face in `video` while `enabled`. `reset()` starts a new answer;
 * `snapshot()` returns that answer's numbers. `lookingAtScreen` drives a small
 * live hint in the self-view.
 */
export function usePresenceTracker(video: HTMLVideoElement | null, enabled: boolean) {
  const [status, setStatus] = useState<TrackerStatus>("off");
  const [lookingAtScreen, setLookingAtScreen] = useState<boolean | null>(null);
  const acc = useRef(new PresenceAccumulator());

  useEffect(() => {
    if (!enabled || !video) {
      setStatus("off");
      setLookingAtScreen(null);
      return;
    }
    let cancelled = false;
    let timer = 0;
    setStatus("loading");
    loadLandmarker()
      .then((landmarker) => {
        if (cancelled) return;
        setStatus("tracking");
        let last = 0;
        timer = window.setInterval(() => {
          if (video.readyState < 2 || video.videoWidth === 0) return;
          const now = performance.now();
          if (now <= last) return; // MediaPipe needs increasing timestamps
          last = now;
          try {
            const frame = readFrame(landmarker.detectForVideo(video, now));
            acc.current.add(frame);
            setLookingAtScreen(frame.face && frame.eyeContact);
          } catch {
            // a dropped frame is not worth surfacing
          }
        }, SAMPLE_MS);
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [video, enabled]);

  const reset = useCallback(() => acc.current.reset(), []);
  const snapshot = useCallback(() => (status === "tracking" ? acc.current.snapshot() : null), [status]);
  return { status, lookingAtScreen, reset, snapshot };
}
