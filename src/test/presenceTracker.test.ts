import { describe, expect, it } from "vitest";
import { PresenceAccumulator, headAngles, readFrame, type FrameReading } from "@/lib/presenceTracker";

// Body-language numbers for the mock interview, measured on the device.

const LOOKING: FrameReading = { face: true, eyeContact: true, smiling: false, nose: { x: 0.5, y: 0.5 } };
const AWAY: FrameReading = { face: true, eyeContact: false, smiling: false, nose: { x: 0.5, y: 0.5 } };
const NO_FACE: FrameReading = { face: false, eyeContact: false, smiling: false, nose: null };

function run(frames: FrameReading[], seconds = 60) {
  let t = 0;
  const acc = new PresenceAccumulator(() => t);
  frames.forEach((f) => acc.add(f));
  t = seconds * 1000;
  return acc.snapshot();
}

describe("PresenceAccumulator", () => {
  it("returns nothing for under ~2 s of camera", () => {
    expect(run([LOOKING, LOOKING, LOOKING])).toBeNull();
  });

  it("measures eye contact over the time the face was in frame", () => {
    const frames = [...Array(30).fill(LOOKING), ...Array(10).fill(AWAY), ...Array(10).fill(NO_FACE)];
    const p = run(frames)!;
    expect(p.faceVisiblePct).toBe(80); // 40 of 50 samples
    expect(p.eyeContactPct).toBe(75); // 30 of the 40 with a face
    expect(p.durationSeconds).toBe(60);
    expect(p.samples).toBe(50);
  });

  it("counts one glance away per ~1.5 s spell, not per frame", () => {
    const frames = [
      ...Array(10).fill(LOOKING), ...Array(12).fill(AWAY), // one long glance
      ...Array(10).fill(LOOKING), ...Array(3).fill(AWAY), // too short to count
      ...Array(10).fill(LOOKING), ...Array(8).fill(NO_FACE), // leaving the frame counts too
    ];
    expect(run(frames)!.lookAwayCount).toBe(2);
  });

  it("scores a still head as steady and a moving one as not", () => {
    const still = Array.from({ length: 20 }, (_, i) => ({ ...LOOKING, nose: { x: 0.5 + (i % 2) * 0.001, y: 0.5 } }));
    const moving = Array.from({ length: 20 }, (_, i) => ({ ...LOOKING, nose: { x: 0.5 + (i % 2) * 0.03, y: 0.5 } }));
    expect(run(still)!.steadiness).toBeGreaterThan(90);
    expect(run(moving)!.steadiness).toBeLessThan(20);
  });

  it("starts fresh for each answer", () => {
    let t = 0;
    const acc = new PresenceAccumulator(() => t);
    Array(20).fill(AWAY).forEach((f) => acc.add(f));
    acc.reset();
    Array(20).fill(LOOKING).forEach((f) => acc.add(f));
    t = 10_000;
    expect(acc.snapshot()!.eyeContactPct).toBe(100);
  });
});

describe("readFrame", () => {
  const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  it("treats a face turned to the camera with eyes forward as eye contact", () => {
    const r = readFrame({
      faceLandmarks: [[{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.52 }]],
      faceBlendshapes: [{ categories: [{ categoryName: "mouthSmileLeft", score: 0.6 }, { categoryName: "mouthSmileRight", score: 0.5 }] }],
      facialTransformationMatrixes: [{ data: identity }],
    });
    expect(r).toMatchObject({ face: true, eyeContact: true, smiling: true });
  });

  it("does not count eyes turned to the side, or no face", () => {
    const side = readFrame({
      faceLandmarks: [[{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.52 }]],
      faceBlendshapes: [{ categories: [{ categoryName: "eyeLookOutLeft", score: 0.8 }] }],
      facialTransformationMatrixes: [{ data: identity }],
    });
    expect(side.eyeContact).toBe(false);
    expect(readFrame({ faceLandmarks: [] }).face).toBe(false);
  });

  it("reads head yaw from the face transform", () => {
    const yaw40 = (40 * Math.PI) / 180;
    // Rotation about Y, column-major: m[2] = -sin(yaw)
    const m = [Math.cos(yaw40), 0, -Math.sin(yaw40), 0, 0, 1, 0, 0, Math.sin(yaw40), 0, Math.cos(yaw40), 0, 0, 0, 0, 1];
    expect(Math.round(Math.abs(headAngles(m).yaw))).toBe(40);
    expect(Math.round(headAngles(identity).pitch)).toBe(0);
  });
});
