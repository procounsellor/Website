import { useEffect, useRef, useState } from 'react';
import { useVoiceChatStore } from '@/store/VoiceChatStore';
import { Mic, PhoneOff} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Predefined color palettes for the visualizer ---
const colorPalettes = [
  { from: 'from-sky-400', to: 'to-blue-600', radial: 'from-blue-300/50' },
  { from: 'from-purple-400', to: 'to-indigo-600', radial: 'from-indigo-300/50' },
];


// --- Helper Hook for Voice Visualization (Unchanged) ---
const useVoiceVisualizer = (isListening: boolean) => {
  const [volume, setVolume] = useState(0);
  // ... (rest of the hook is unchanged)
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setupAudio = async () => {
      if (isListening) {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) {
            console.warn('AudioContext is not supported in this browser.');
            return;
          }
          const context = new AudioContext();
          audioContextRef.current = context;

          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;

          const source = context.createMediaStreamSource(stream);
          sourceRef.current = source;
          const analyser = context.createAnalyser();
          analyser.fftSize = 512;
          analyserRef.current = analyser;

          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const draw = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              const avg = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
              setVolume(avg / 128);
            }
            animationFrameRef.current = requestAnimationFrame(draw);
          };
          draw();
        } catch (err) {
          console.error('Error setting up audio visualizer:', err);
        }
      }
    };

    setupAudio();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isListening]);

  return volume;
};


// --- ✨ MODIFIED: The Visualizer now has a "breathing" animation when speaking ---
const VoiceVisualizer = ({
  volume,
  isSpeaking = false,
  palette,
}: {
  volume: number;
  isSpeaking?: boolean;
  palette: { from: string; to: string; radial: string };
}) => {
  const baseScale = 1 + volume * 0.1;

  return (
    <motion.div
      className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden"
      aria-hidden
      // ✨ Animate the scale property
      animate={{ scale: isSpeaking ? [1.1, 1.18, 1.1] : baseScale }}
      // ✨ Define the transition for the animation
      transition={{
        duration: isSpeaking ? 1.5 : 0.2,
        repeat: isSpeaking ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${palette.from} ${palette.to} transition-opacity duration-500 ${isSpeaking ? 'opacity-95' : 'opacity-100'}`} />
      
      {/* ✨ Animate the blur for a nice secondary effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/10"
        animate={{ backdropFilter: isSpeaking ? 'blur(16px)' : 'blur(24px)' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
      />
      
      <div
        className={`absolute w-[300%] h-[300%] -left-full -top-full bg-gradient-radial from-white/60 via-white/20 to-transparent ${
          isSpeaking ? 'animate-[spin_8s_linear_infinite] opacity-90' : 'animate-[spin_18s_linear_infinite]'
        }`}
      />
      <div
        className={`absolute w-[200%] h-[200%] -left-1/2 -top-1/2 bg-gradient-radial ${palette.radial} via-blue-400/20 to-transparent ${
          isSpeaking ? 'animate-[spin_6s_linear_infinite] opacity-90' : 'animate-[spin_12s_linear_infinite] opacity-70'
        }`}
      />
    </motion.div>
  );
};


// --- Small animated dots for "thinking" ---
const ThinkingDots = () => (
  <span className="inline-flex items-center space-x-1">
    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
    <span style={{ animationDelay: '200ms' }} className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
    <span style={{ animationDelay: '400ms' }} className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
  </span>
);


// --- Main VoiceChat Component (Unchanged from previous version) ---
const isSpeechRecognitionSupported =
  typeof window !== 'undefined' && ('SpeechRecognition' in window || (window as any).webkitSpeechRecognition);

export default function VoiceChat() {
  const {
    isListening,
    isSpeaking,
    isVoiceChatOpen,
    toggleVoiceChat,
    startListening,
    stopListening,
    stopSpeaking,
    processUserTranscript,
  } = useVoiceChatStore();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const volume = useVoiceVisualizer(isListening);
  
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [palette, setPalette] = useState(colorPalettes[0]);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = startListening;
    recognition.onend = stopListening;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) {
        setIsAwaitingResponse(true);
        try {
          await processUserTranscript(transcript);
        } catch (err) {
          console.error('Error processing transcript:', err);
          setIsAwaitingResponse(false);
        }
      }
    };
    

    recognition.onerror = (ev: any) => {
      console.warn('Speech recognition error', ev);
      stopListening();
    };

    return () => {
      try {
        recognition.stop();
      } catch (e) { /* ignore */ }
    };
  }, [processUserTranscript, startListening, stopListening]);
  
  useEffect(() => {
    if (isSpeaking) {
      setIsAwaitingResponse(false);
      setPalette(colorPalettes[Math.floor(Math.random() * colorPalettes.length)]);
    }
    if (!isVoiceChatOpen) {
      setIsAwaitingResponse(false);
    }
  }, [isSpeaking, isVoiceChatOpen]);

  const startRecognitionSafely = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.start();
    } catch (e) { /* ignore */ }
  };

  const handleMicClick = () => {
    const recognition = recognitionRef.current;

    if (isSpeaking) {
      stopSpeaking();
      setTimeout(() => {
        startRecognitionSafely();
      }, 250);
      return;
    }

    if (isListening) {
      recognition?.stop();
    } else {
      startRecognitionSafely();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#202124] z-[200] flex flex-col items-center justify-center p-4 md:p-6 animate-in fade-in-20">

      {/* Status indicators - Responsive positioning */}
      <div className="absolute top-6 md:top-9 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3">
        {isListening && (
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs md:text-sm text-white">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Listening</span>
          </div>
        )}
        {isAwaitingResponse && (
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs md:text-sm text-white">
            <span>Thinking</span>
            <ThinkingDots />
          </div>
        )}
        {isSpeaking && (
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs md:text-sm text-white">
            <span>Speaking</span>
          </div>
        )}
      </div>

      {/* Voice Visualizer - Responsive */}
      <div className="flex-grow flex items-center justify-center w-full max-w-md md:max-w-2xl">
        <VoiceVisualizer
          volume={isSpeaking ? 0.1 : volume}
          isSpeaking={isSpeaking}
          palette={palette}
        />
      </div>

      {/* Control buttons - Responsive */}
      <div className="w-full flex justify-center items-center gap-4 md:gap-6 flex-shrink-0 pt-6 md:pt-8 pb-4 md:pb-0">
        <button
          onClick={handleMicClick}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 text-white ${
            isListening ? 'bg-red-600 shadow-lg shadow-red-500/30' : 'bg-white/10 hover:bg-white/20'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <Mic size={24} className="md:w-7 md:h-7" />
        </button>

        <button
          onClick={toggleVoiceChat}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-[#ea4335] hover:bg-[#d93025] transition-colors text-white"
          aria-label="End call"
        >
          <PhoneOff size={24} className="md:w-7 md:h-7" />
        </button>
      </div>
    </div>
  );
}