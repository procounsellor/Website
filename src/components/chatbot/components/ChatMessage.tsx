// pushkar3119/website/Website-main/src/components/chatbot/components/ChatMessage.tsx

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export default function ChatMessage({ text, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={` rounded-[.50rem] max-w-[80%] ${ // Added max-w-lg
          isUser
            ? "bg-[#6C6969] text-gray-400 py-3 px-4"
            : " text-gray-400 "
        }`}
      >
        <p className=" text-gray-200 text-left break-words ">{text}</p>
      </div>
    </div>
  );
}