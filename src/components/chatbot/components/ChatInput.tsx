import React from "react";

type ChatInputProps = {
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  loading: boolean;
  input: string;
  setInput: (value: string) => void;
};

export default function ChatInput({handleKeyPress, handleSend, loading, input, setInput}: ChatInputProps): React.ReactElement{
  return (
    <div className="max-w-[57.6rem] w-full mx-auto">
            <div className="flex gap-3 items-end">
              <div className="relative flex-1 bg-[#232323] rounded-3xl border border-[#A0A0A066] transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full bg-transparent text-white p-4 resize-none outline-none max-h-32 h-[117px] min-h-[56px]"
                  rows={1}
                  disabled={loading}
                />
                <div className="absolute right-5 bottom-5 flex gap-3"> 
                   <button className="cursor-pointer" >
                <img src="/voice.svg" alt="" />
              </button>
                  <button  onClick={handleSend} disabled={!input.trim() || loading}  className="cursor-pointer">
                <img src="/send.svg" alt="" />
              </button>
                </div>
              </div>
        
            </div>
          </div>
  );
}