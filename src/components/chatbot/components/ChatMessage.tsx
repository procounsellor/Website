// pushkar3119/website/Website-main/src/components/chatbot/components/ChatMessage.tsx

import { useState, useEffect, useRef } from 'react';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export default function ChatMessage({ text, isUser }: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // User messages display immediately
    if (isUser) {
      setDisplayedText(text);
      return;
    }

    // For bot messages, implement smooth typing
    if (text.length > displayedText.length) {
      setIsTyping(true);
      
      const typeNextChunk = () => {
        if (indexRef.current < text.length) {
          // Type 2-3 characters at a time for smoother appearance
          const chunkSize = Math.min(2, text.length - indexRef.current);
          const nextText = text.slice(0, indexRef.current + chunkSize);
          setDisplayedText(nextText);
          indexRef.current += chunkSize;
          
          // Adjust delay based on content (faster for spaces, slower for punctuation)
          const lastChar = text[indexRef.current - 1];
          let delay = 20; // Base delay in ms
          
          if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
            delay = 100; // Pause at sentence end
          } else if (lastChar === ',' || lastChar === ';') {
            delay = 50; // Brief pause at comma
          } else if (lastChar === ' ') {
            delay = 15; // Faster through spaces
          }
          
          timeoutRef.current = setTimeout(typeNextChunk, delay);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChunk();
    } else if (text.length < displayedText.length) {
      // Handle text being cleared or reset
      setDisplayedText(text);
      indexRef.current = text.length;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isUser, displayedText.length]);

  // Reset index when text changes significantly (new message)
  useEffect(() => {
    if (text === '' || (text.length < displayedText.length / 2)) {
      indexRef.current = 0;
      setDisplayedText('');
    }
  }, [text, displayedText.length]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`rounded-[.50rem] max-w-[85%] md:max-w-[80%] ${
          isUser
            ? "bg-[#6C6969] text-gray-400 py-2 px-3 md:py-3 md:px-4"
            : "text-gray-400"
        }`}
      >
        <p className="text-gray-200 text-left break-words text-sm md:text-base">
          {displayedText}
          {isTyping && !isUser && <span className="inline-block w-1 h-4 ml-0.5 bg-gray-400 animate-pulse" />}
        </p>
      </div>
    </div>
  );
}