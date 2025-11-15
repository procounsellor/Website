import React, { useState } from "react";
import { X } from "lucide-react";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const isSubmitDisabled = !subject || !description;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    // should add API call here
    console.log({
      subject,
      description,
      isAnonymous,
    });

    setSubject("");
    setDescription("");
    setIsAnonymous(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#23232380] backdrop-blur-[35px]"
      onClick={onClose}
    >

      <div
        className="relative w-full max-w-[632px] p-10 bg-white rounded-[16px] shadow-xl border border-[#EFEFEF]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full text-black hover:bg-black hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center w-full mb-6">
          <h2 className="text-[20px] font-semibold text-[#343C6A]">
            Submit Your Question
          </h2>
          <p className="text-sm font-medium text-[#8C8CA1] text-center max-w-[347px] mt-3">
            We are here to help! Fill out the form below and we will get back to
            you as soon as possible
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="subject"
              className="text-base font-semibold text-[#343C6A]"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <textarea
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your question subject"
              className="w-full h-[75px] resize-none bg-[#F5F7FA] border border-[#EFEFEF] rounded-lg p-3
                         text-base font-medium text-[#242645] 
                         placeholder:text-[#8C8CA180] placeholder:font-normal placeholder:text-base 
                         focus:outline-none focus:ring-2 focus:ring-[#13097D]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-base font-semibold text-[#343C6A]"
            >
              Question description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your question in detail (50-500 char)"
              className="w-full h-[120px] resize-none bg-[#F5F7FA] border border-[#EFEFEF] rounded-lg p-3
                         text-base font-medium text-[#242645]
                         placeholder:text-[#8C8CA180] placeholder:font-normal placeholder:text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#13097D]"
            />
          </div>

          <label
            htmlFor="anonymous"
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className="h-4 w-4 rounded border-[#8C8CA1] accent-[#13097D] focus:ring-transparent"
            />
            <span className="text-sm text-[#8C8CA1] font-normal">
              Ask anonymously
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-[335px] h-12 mx-auto rounded-xl text-white font-semibold transition-all duration-300
                       ${
                         isSubmitDisabled
                           ? "bg-[#242645] opacity-50 cursor-not-allowed"
                           : "bg-[#655E95] hover:bg-opacity-90 cursor-pointer"
                       }`}
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionModal;