import { ChevronDown } from 'lucide-react';

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="w-full bg-white border border-[#EFEFEF] rounded-2xl p-4 mb-4 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-[#343C6A]">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-[#13097D] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="mt-4 transition-transform">
          <p className="text-[#718EBF] font-normal text-base">{answer}</p>
        </div>
      )}
    </div>
  );
}