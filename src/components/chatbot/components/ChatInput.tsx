import React, { useEffect, useRef, useState } from "react";
import { SendHorizonal, Mic } from "lucide-react";
import { useVoiceChatStore } from "@/store/VoiceChatStore";

type ChatInputProps = {
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  loading: boolean;
  input: string;
  setInput: (value: string) => void;
};

// feature-detect (works client-side)
const isSpeechRecognitionSupported =
  typeof window !== "undefined" &&
  (("SpeechRecognition" in window) || ("webkitSpeechRecognition" in window));

export default function ChatInput({
  handleKeyPress,
  handleSend,
  loading,
  input,
  setInput,
}: ChatInputProps): React.ReactElement {
  const { toggleVoiceChat } = useVoiceChatStore();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  // Keep a ref to the latest input so speech appends correctly even if parent updates value
  const inputRef = useRef<string>(input);
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      // no-op silently if not supported (keeps UI same)
      return;
    }

    // @ts-ignore vendor prefixed
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        const combined = inputRef.current ? inputRef.current + " " + finalTranscript : finalTranscript;
        setInput(combined);
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop?.();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, [setInput]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        /* ignore */
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
      }
    }
  };

  const handleLocalSend = (e?: React.SyntheticEvent) => {
    e?.preventDefault?.();
    if (input.trim()) {
      handleSend();
    }
  };

  return (
    <div className="max-w-[57.6rem] w-full mx-auto">
      <div className="flex gap-3 items-end">
        <div className="relative flex-1 bg-[#232323] rounded-3xl border border-[#A0A0A066] transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Ask me anything..."}
            className="w-full bg-transparent text-white p-4 resize-none outline-none max-h-32 h-[117px] min-h-[56px]"
            rows={1}
            disabled={loading}
          />
          <div className="absolute right-5 bottom-5 flex gap-3 items-center">
            {/* Mic button (keeps simple layout but with functionality & small visual cue when active) */}
            {isSpeechRecognitionSupported ? (
              <button
                type="button"
                onClick={handleMicClick}
                className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  isListening ? "bg-red-600 text-white shadow-lg" : "bg-gray-800 text-white/90 hover:bg-gray-700"
                }`}
                aria-label="Use microphone for dictation"
              >
                <Mic size={18} />
                {/* subtle pulse overlay when listening */}
                {isListening && <span className="absolute inline-block w-10 h-10 rounded-full bg-red-500/30 animate-pulse" />}
              </button>
            ) : (
              // fallback: keep the same visual button but disabled
              <button
                type="button"
                disabled
                className="cursor-not-allowed flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white/50"
                aria-label="Speech not supported"
                title="Speech recognition not supported"
              >
                <img src="/voice.svg" alt="voice" className="w-5 h-5" />
              </button>
            )}

            {/* Optional toggleVoiceChat (keeps function from second snippet) */}
            <button
              type="button"
              onClick={() => toggleVoiceChat()}
              className="cursor-pointer hidden sm:inline-flex items-center justify-center p-1"
              aria-label="Toggle voice chat"
            >
              {/* keep visual small so it doesn't change first file styling */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white/90">
                <path d="M7.167 15.416V4.583a.75.75 0 0 1 1.5 0v10.833a.75.75 0 0 1-1.5 0Zm4.166-2.5V7.083a.75.75 0 0 1 1.5 0v5.833a.75.75 0 0 1-1.5 0ZM3 11.25V8.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-1.5 0Zm12.5 0V8.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-1.5 0Z" />
              </svg>
            </button>

            {/* Send button (keeps your same interaction and look) */}
            <button
              onClick={() => handleLocalSend()}
              disabled={!input.trim() || loading}
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-colors disabled:opacity-40"
            >
              {/* prefer existing SVG images if you use them; fallback to lucide icon */}
              {/* If you prefer the original image icons, uncomment the next line and comment out the lucide icon */}
              {/* <img src="/send.svg" alt="send" /> */}
              <SendHorizonal size={18} className={`${input.trim() ? "text-white" : "text-white/50"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}