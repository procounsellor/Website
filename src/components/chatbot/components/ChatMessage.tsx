// pushkar3119/website/Website-main/src/components/chatbot/components/ChatMessage.tsx

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export default function ChatMessage({ text, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`p-3 rounded-lg max-w-lg ${ // Added max-w-lg
          isUser
            ? "bg-[#FA660F] text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap text-left break-words">{text}</p>
      </div>
    </div>
  );
}