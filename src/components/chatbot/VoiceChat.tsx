import { useEffect, useRef, useState } from 'react';
import { useVoiceChatStore } from '@/store/VoiceChatStore';
import { Mic, PhoneOff, Share2 } from 'lucide-react';

// --- Helper Hook for Voice Visualization ---
const useVoiceVisualizer = (isListening: boolean) => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    // FIX #2: Ensure this code only runs in the browser
    if (typeof window === 'undefined') {
      return;
    }

    const setupAudio = async () => {
      if (isListening) {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) {
            console.warn("AudioContext is not supported in this browser.");
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
          console.error("Error setting up audio visualizer:", err);
        }
      }
    };

    setupAudio();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isListening]);

  return volume;
};


// --- The Visualizer Component ---
const VoiceVisualizer = ({ volume }: { volume: number }) => {
  const scale = 1 + volume * 0.1;
  return (
    <div 
      className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden transition-transform duration-100 ease-out"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600"></div>
      <div className="absolute inset-0 rounded-full bg-white/10 blur-xl"></div>
      <div 
        className="absolute w-[300%] h-[300%] -left-full -top-full animate-[spin_18s_linear_infinite] bg-gradient-radial from-white/60 via-white/20 to-transparent" 
      />
      <div 
        className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 animate-[spin_12s_linear_infinite] opacity-70 bg-gradient-radial from-blue-300/50 via-blue-400/20 to-transparent" 
      />
    </div>
  );
};

// --- Main VoiceChat Component ---
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

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = startListening;
    recognition.onend = () => {
        stopListening(); 
    };
    
   

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) {
        processUserTranscript(transcript);
      }
    };

    return () => {
      recognition.stop();
    };
  }, [processUserTranscript, startListening, stopListening]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isVoiceChatOpen) {
      if (isSpeaking) {
        recognition.stop();
      } else {
        try {
          recognition.start();
        } catch (e) {
          // Ignores error if it's already started
        }
      }
    } else {
      recognition.stop();
    }
  }, [isVoiceChatOpen, isSpeaking]);

  const handleMicClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (isListening) {
      recognitionRef.current?.stop();
    } else {
        recognitionRef.current?.start();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#202124] z-[200] flex flex-col items-center justify-center p-6 animate-in fade-in-20">
      
      <button className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
        <Share2 size={24} />
      </button>

      <div className="flex-grow flex items-center justify-center">
        <VoiceVisualizer volume={isSpeaking ? 0.1 : volume} />
      </div>

      <div className="w-full flex justify-center items-center gap-6 flex-shrink-0 pt-8">
        <button 
          onClick={handleMicClick}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 text-white ${
              isListening ? 'bg-red-600 shadow-lg shadow-red-500/30' : 'bg-white/10 hover:bg-white/20'
          }`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          <Mic size={28}/>
        </button>
        <button 
          onClick={toggleVoiceChat} 
          className="w-16 h-16 rounded-full flex items-center justify-center bg-[#ea4335] hover:bg-[#d93025] transition-colors text-white"
          aria-label="End call"
        >
          <PhoneOff size={28}/>
        </button>
      </div>

      <div className="absolute bottom-6 right-6 w-9 h-9 flex items-center justify-center bg-teal-500 rounded-full font-bold text-white text-lg select-none">
        G
      </div>
    </div>
  );
}