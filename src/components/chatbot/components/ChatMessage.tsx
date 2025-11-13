// pushkar3119/website/Website-main/src/components/chatbot/components/ChatMessage.tsx

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export default function ChatMessage({ text, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`rounded-[.50rem] max-w-[85%] md:max-w-[80%] ${
          isUser
            ? "bg-[#6C6969] text-gray-400 py-2 px-3 md:py-3 md:px-4"
            : "text-gray-400"
        }`}
      >
        <p className="text-gray-200 text-left break-words text-sm md:text-base">{text}</p>
      </div>
    </div>
  );
}