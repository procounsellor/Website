import { useState, useRef, useEffect } from "react";
import { SendHorizonal, Mic } from "lucide-react";
import { useVoiceChatStore } from "@/store/VoiceChatStore";


// Props for the ChatInput component
interface ChatInputProps {
  onSend: (message: string) => void;
}

// Helper to check if the browser supports Speech Recognition
const isSpeechRecognitionSupported =
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

export default function ChatInput({ onSend }: ChatInputProps) {
  const { toggleVoiceChat } = useVoiceChatStore();
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    // @ts-ignore - vendor prefixed type
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    // @ts-ignore
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputValue((prev) => (prev ? prev + " " : "") + finalTranscript);
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // accept optional event so it can be called from onClick or as a form submit handler
  const handleSubmit = (e?: any) => {
    e?.preventDefault?.();
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue("");
    }
  };

  return (
    <>
      
        <div className="max-w-4xl mx-auto">
          <div
            className={`relative transition-all duration-300 ease-out ${
              isFocused || isListening ? "transform -translate-y-3 scale-[1.02]" : ""
            }`}
          >
            {/* Premium backdrop with gradient border */}
            <div className="relative">
              {/* Gradient border effect */}
              <div
                className={`absolute -inset-0.5 rounded-full transition-all duration-500 ${
                  isFocused || isListening
                    ? isListening
                      ? "bg-gradient-to-r from-red-500/50 via-pink-500/50 to-purple-500/50"
                      : "bg-gradient-to-r from-orange-400/60 via-pink-400/60 to-purple-400/60"
                    : "bg-gradient-to-r from-gray-200/40 via-gray-300/40 to-gray-200/40"
                } blur-sm`}
              />

              {/* Main input container */}
              <div
                className={`relative flex items-center w-full backdrop-blur-2xl bg-white/95 border-2 rounded-full transition-all duration-300 ${
                  isFocused
                    ? "border-transparent shadow-2xl shadow-orange-500/25"
                    : isListening
                    ? "border-transparent shadow-2xl shadow-red-500/25"
                    : "border-white/30 shadow-xl shadow-black/10 hover:shadow-2xl hover:border-white/40"
                }`}
              >
                {/* Input field */}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="flex-grow w-full pl-8 pr-28 py-5 bg-transparent text-gray-900 placeholder-gray-500 rounded-full focus:outline-none text-lg font-medium"
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                />

                {/* END main input container */}
              </div>
            </div>

            {/* Single absolute wrapper for mic + toggle/send buttons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 z-20">
              {/* Dictation / mic button */}
              {isSpeechRecognitionSupported && (
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 group ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 hover:shadow-md"
                  }`}
                  aria-label="Use microphone for dictation"
                >
                  <Mic
                    size={20}
                    className={`transition-transform duration-200 ${
                      isListening ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />
                  {isListening && (
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
                  )}
                </button>
              )}

              {/* Composer toggle or Send button — sits to the right of mic */}
              {inputValue.trim() === "" ? (
                <button
                  data-testid="composer-speech-button"
                  aria-label="Start voice mode"
                  onClick={toggleVoiceChat}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full disabled:text-gray-50 disabled:opacity-30 composer-secondary-button-color hover:opacity-80"
                  style={{
                    viewTransitionName: "var(--vt-composer-speech-button)",
                  }}
                >
                  <div className="flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                    >
                      <path d="M7.167 15.416V4.583a.75.75 0 0 1 1.5 0v10.833a.75.75 0 0 1-1.5 0Zm4.166-2.5V7.083a.75.75 0 0 1 1.5 0v5.833a.75.75 0 0 1-1.5 0ZM3 11.25V8.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-1.5 0Zm12.5 0V8.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-1.5 0Z" />
                    </svg>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit()}
                  className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 group ${
                    inputValue.trim()
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!inputValue.trim()}
                  aria-label="Send message"
                >
                  <SendHorizonal
                    size={20}
                    className={`transition-transform duration-200 ${
                      inputValue.trim() ? "group-hover:translate-x-0.5" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Premium glow effect */}
            <div
              className={`absolute -inset-6 rounded-full transition-all duration-700 pointer-events-none ${
                isFocused || isListening
                  ? `opacity-30 ${
                      isListening
                        ? "bg-gradient-to-r from-red-400/20 via-pink-400/20 to-purple-400/20"
                        : "bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-purple-400/20"
                    } blur-2xl animate-pulse`
                  : "opacity-0"
              }`}
            />
          </div>
        </div>
      
    </>
  );
}
