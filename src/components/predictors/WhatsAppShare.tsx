import { useEffect, useRef, useState } from "react";
import { Check, ImageDown, Link2 } from "lucide-react";
import { buildShareText, buildShareUrl, buildWhatsAppHref } from "@/lib/predictorShare";
import { trackEvent } from "@/lib/analytics";

type AnalyticsWindow = Window & { dataLayer?: Record<string, unknown>[] };

interface WhatsAppShareProps {
  /** Short, honest summary of the result on screen. No name/phone. */
  summary: string;
  /** Site path of the predictor page, e.g. "/neet-rank-predictor". */
  path: string;
  /** Predictor id used for utm_campaign and analytics, e.g. "neet_rank_predictor". */
  predictor: string;
  className?: string;
}

type ShareMethod = "whatsapp" | "copy_link" | "whatsapp_parents" | "story_image";

const EVENT_METHOD: Record<string, ShareMethod> = {
  predictor_share_whatsapp: "whatsapp",
  predictor_share_copy_link: "copy_link",
  predictor_share_parents: "whatsapp_parents",
  predictor_share_story: "story_image",
};

function track(event: string, predictor: string) {
  try {
    const w = window as AnalyticsWindow;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, predictor });
  } catch {
    // analytics must never break the page
  }
  trackEvent("share", {
    method: EVENT_METHOD[event] ?? "copy_link",
    content_type: "predictor_result",
    item_id: predictor,
  });
}

/**
 * The result itself, without the "Check yours…" call to action that predictors
 * append for friends, and without a trailing ":" (several summaries end
 * "…fit your rank:" because the link normally follows).
 */
function resultOnly(summary: string): string {
  const core = summary.replace(/\s*(?:Check|See) (?:yours|which|your)\b.*$/i, "").replace(/[\s:–-]+$/, "").trim();
  return core || summary.replace(/[\s:]+$/, "").trim();
}

/** Wraps text to lines that fit maxWidth on the canvas. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * A 1080×1920 image (Instagram/WhatsApp story size) of the result summary.
 * Drawn locally on a canvas — nothing is uploaded. Only the on-screen summary
 * goes in, never the student's name or phone.
 */
async function makeStoryImage(summary: string, url: string): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  try {
    await document.fonts?.load?.("700 64px Poppins");
  } catch {
    // fall back to the default sans-serif
  }
  const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, "#0E1629");
  bg.addColorStop(1, "#1A2380");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = "#FA660F";
  ctx.beginPath();
  // roundRect is missing on older Safari; a square badge is fine there.
  if (typeof ctx.roundRect === "function") ctx.roundRect(96, 160, 72, 72, 18);
  else ctx.rect(96, 160, 72, 72);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 52px Poppins, sans-serif";
  ctx.fillText("ProCounsel", 190, 214);

  ctx.font = "700 76px Poppins, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  let y = 620;
  for (const l of wrapLines(ctx, resultOnly(summary), 888).slice(0, 8)) {
    ctx.fillText(l, 96, y);
    y += 100;
  }

  ctx.font = "500 44px Poppins, sans-serif";
  ctx.fillStyle = "#FDBA74";
  ctx.fillText("Check yours, free:", 96, 1560);
  ctx.fillStyle = "#FFFFFF";
  const shortUrl = url.replace(/^https?:\/\//, "").replace(/\?.*$/, "");
  for (const [i, l] of wrapLines(ctx, shortUrl, 888).slice(0, 2).entries()) ctx.fillText(l, 96, 1630 + i * 60);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.28l5.67-1.49a11.33 11.33 0 0 0 5.78 1.47h.01c6.25 0 11.34-5.09 11.35-11.35a11.28 11.28 0 0 0-3.33-8.03z" />
    </svg>
  );
}

/**
 * "Share on WhatsApp" for a predictor result, with a "Copy link" fallback.
 * Render only once a result exists.
 */
export default function WhatsAppShare({ summary, path, predictor, className = "" }: WhatsAppShareProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const shareUrl = buildShareUrl(path, predictor);
  const href = buildWhatsAppHref(buildShareText(summary, shareUrl));
  const copyUrl = buildShareUrl(path, predictor, "copy_link");
  // Students often have to show their parents. Same facts, worded for them.
  const parentsUrl = buildShareUrl(path, predictor, "whatsapp_parents");
  const parentsHref = buildWhatsAppHref(
    // The ask comes first so it survives if a long summary gets trimmed to fit.
    buildShareText(`Can we talk about my options? ${resultOnly(summary).replace(/([^.!?])$/, "$1.")}`, parentsUrl)
  );
  const [storyState, setStoryState] = useState<"idle" | "working" | "failed">("idle");

  const handleStory = async () => {
    setStoryState("working");
    try {
      // Stories are mostly posted to Instagram; the lead-source mapper files "instagram" under INSTAGRAM.
      const storyUrl = buildShareUrl(path, predictor, "instagram");
      const blob = await makeStoryImage(summary, storyUrl);
      if (!blob) throw new Error("no canvas");
      const file = new File([blob], "procounsel-result.png", { type: "image/png" });
      const download = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "procounsel-result.png";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      };
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      // Phones get the share sheet (straight to Instagram/WhatsApp); computers
      // just save the file. If the browser refuses the share (e.g. the tap
      // "expired" while the image was drawing), fall back to saving it.
      const touch = window.matchMedia?.("(pointer: coarse)").matches;
      if (touch && nav.share && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], text: storyUrl });
        } catch (shareErr) {
          if (shareErr instanceof DOMException && shareErr.name === "AbortError") throw shareErr;
          download();
        }
      } else {
        download();
      }
      track("predictor_share_story", predictor);
      setStoryState("idle");
    } catch (err) {
      // A cancelled share sheet is not an error worth showing.
      setStoryState(err instanceof DOMException && err.name === "AbortError" ? "idle" : "failed");
    }
  };

  const handleCopy = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyUrl);
        ok = true;
      }
    } catch {
      ok = false;
    }
    setCopyState(ok ? "copied" : "failed");
    if (ok) track("predictor_share_copy_link", predictor);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        onClick={() => track("predictor_share_whatsapp", predictor)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Share on WhatsApp
      </a>
      <a
        href={parentsHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("predictor_share_parents", predictor)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#25D366] bg-white px-3.5 text-sm font-semibold text-[#146C43] transition-colors hover:bg-[#F0FBF4]"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Send to my parents
      </a>
      <button
        type="button"
        onClick={handleStory}
        disabled={storyState === "working"}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer disabled:opacity-60"
      >
        <ImageDown className="h-4 w-4" />
        {storyState === "working" ? "Making image…" : "Save as story image"}
      </button>
      {storyState === "failed" && (
        <span role="status" className="text-xs text-gray-500">Couldn't make the image on this device.</span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
      >
        {copyState === "copied" ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copyState === "copied" ? "Link copied" : "Copy link"}
      </button>
      {copyState === "failed" && (
        <span role="status" className="text-xs text-gray-500 break-all">
          Couldn't copy — link: {copyUrl}
        </span>
      )}
    </div>
  );
}
