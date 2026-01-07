import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/AuthStore';
import { askQuestion } from '@/api/community';
import { toast } from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { userId, user } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const isSubmitDisabled = !subject || !description || isLoading;

  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setDescription('');
      setIsAnonymous(false);
      setError(null);
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    if (!userId || !user || !token) {
      toast.error('You must be logged in to ask a question.');
      setError('You must be logged in to ask a question.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await askQuestion(
        userId,
        subject,
        description,
        user.role || 'user',
        token,
        isAnonymous
      );

      if (response && response.questionId) {
        toast.success('Question submitted successfully!');
        setSubject('');
        setDescription('');
        setIsAnonymous(false);
        onClose();
      } else {
        throw new Error('Failed to submit question. Invalid response.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred.');
      toast.error(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const subjectOptions = [
    "Colleges",
    "Courses",
    "Exams",
    "Other"
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#23232380] backdrop-blur-[35px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[632px] p-10 bg-white rounded-2xl shadow-xl border border-[#EFEFEF]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer text-black hover:bg-black hover:text-white transition-colors"
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
          <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
            <label
              className="text-base font-semibold text-[#343C6A]"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full h-[50px] flex items-center justify-between bg-[#F5F7FA] border rounded-lg px-3 cursor-pointer transition-all
                ${isDropdownOpen ? 'border-[#13097D] ring-2 ring-[#13097D]/10' : 'border-[#EFEFEF]'}
              `}
            >
              <span className={`text-base font-medium ${subject ? 'text-[#242645]' : 'text-[#8C8CA180]'}`}>
                {subject || "Select a category"}
              </span>
              
              <div className="flex items-center text-[#8C8CA1]">
                {subject ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubject("");
                    }}
                    className="p-1 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </div>
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-[85px] left-0 w-full z-20 bg-white border border-[#EFEFEF] rounded-lg shadow-lg overflow-hidden">
                <div className="max-h-[250px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                  {subjectOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setSubject(option);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors
                        ${subject === option ? 'bg-[#F5F7FA] text-[#13097D]' : 'text-[#242645] hover:bg-[#F5F7FA]'}
                      `}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              className="h-4 w-4 rounded border-[#8C8CA1] accent-[#13097D] cursor-pointer focus:ring-transparent"
            />
            <span className="text-sm text-[#8C8CA1] font-normal">
              Ask anonymously
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
          )}

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
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Question'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionModal;