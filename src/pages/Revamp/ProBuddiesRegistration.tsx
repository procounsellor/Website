import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";

export default function ProBuddiesRegistration() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      alert("Please upload a valid PNG or JPEG image.");
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#C6DDF040] pt-[80px] pb-20 flex flex-col items-center gap-[24px]">

      <div className="w-[1200px] h-auto bg-white rounded-[8px] mt-[80px] p-[24px] box-border">
        
        <div className="flex items-center gap-[10px] mb-[12px]">
          <div className="w-[24px] h-[24px] rounded-[12px] bg-[#2F43F2] flex items-center justify-center">
            <span className="text-white text-[14px] font-semibold font-sans leading-none">1</span>
          </div>
          <h2 
            className="text-[#0E1629] text-[20px] font-semibold leading-[100%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Personal Information
          </h2>
        </div>

        <div className="flex gap-[120px] mb-[12px]">
          <div className="flex flex-col gap-[14px] w-[510px] h-[68px]">
            <label 
              htmlFor="firstName" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              First Name*
            </label>
            <input 
              type="text" 
              id="firstName"
              placeholder="Enter your First Name as per Aadhar"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px] h-[68px]">
            <label 
              htmlFor="lastName" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Last Name*
            </label>
            <input 
              type="text" 
              id="lastName"
              placeholder="Enter your Last Name as per Aadhar"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[12px] w-full h-[152px] mb-[12px]">
          <label 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Profile Photo
          </label>
          
          <div 
            className="relative w-full h-[120px] rounded-[4px] border-[1px] border-dashed border-[#EBEBEB] bg-[#6B72800A] flex flex-col items-center justify-center gap-[8px] cursor-pointer hover:bg-[#6b728013] transition-colors overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={onFileChange}
            />

            {previewUrl ? (
              <>
                <img 
                  src={previewUrl} 
                  alt="Profile Preview" 
                  className="w-full h-full object-contain bg-white" 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-[8px] right-[8px] w-[24px] h-[24px] bg-red-500 cursor-pointer rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                  aria-label="Remove image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span 
                  className="text-[#6B7280] text-[12px] leading-[125%]"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Click to upload or drag and drop
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[14px] w-full h-[68px]">
          <label 
            htmlFor="location" 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Location*
          </label>
          <input 
            type="text" 
            id="location"
            placeholder="e.g. Delhi, Mumbai"
            className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
            style={{ fontFamily: 'Poppins' }}
          />
        </div>

      </div>

      <div className="w-[1200px] h-auto bg-white rounded-[8px] p-[24px] box-border flex flex-col gap-[24px]">
        
        <div className="flex items-center gap-[10px]">
          <div className="w-[24px] h-[24px] rounded-[12px] bg-[#2F43F2] flex items-center justify-center">
            <span className="text-white text-[14px] font-semibold font-sans leading-none">2</span>
          </div>
          <h2 
            className="text-[#0E1629] text-[20px] font-semibold leading-[100%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Academic Details
          </h2>
        </div>

        <div className="flex gap-[120px]">
          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="institution" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Institution
            </label>
            <input 
              type="text" 
              id="institution"
              placeholder="e.g., IIT Delhi"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="degree" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Degree
            </label>
            <input 
              type="text" 
              id="degree"
              placeholder="e.g., B.Tech"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

        <div className="flex gap-[120px]">
          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="course" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Course/Major
            </label>
            <input 
              type="text" 
              id="course"
              placeholder="e.g., Computer Science Engineering"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="years" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Years of study
            </label>
            <div className="relative w-full">
              <select 
                id="years"
                defaultValue=""
                className="appearance-none w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] bg-white cursor-pointer"
                style={{ fontFamily: 'Poppins' }}
              >
                <option value="" disabled className="text-[#6B7280]">Select Year</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5+">5+ Years</option>
              </select>
              <div className="absolute right-[12px] top-[10px] pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="w-[1200px] h-auto bg-white rounded-[8px] p-[24px] box-border flex flex-col gap-[24px]">
        
        <div className="flex items-center gap-[10px]">
          <div className="w-[24px] h-[24px] rounded-[12px] bg-[#2F43F2] flex items-center justify-center">
            <span className="text-white text-[14px] font-semibold font-sans leading-none">3</span>
          </div>
          <h2 
            className="text-[#0E1629] text-[20px] font-semibold leading-[100%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Career Focus & About you
          </h2>
        </div>

        <div className="flex flex-col gap-[14px] w-full">
          <label 
            htmlFor="specialization" 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Career Specialization
          </label>
          <input 
            type="text" 
            id="specialization"
            placeholder="e.g., Career Transition strategy"
            className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
            style={{ fontFamily: 'Poppins' }}
          />
        </div>

        <div className="flex flex-col gap-[14px] w-full">
          <label 
            htmlFor="aboutMe" 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            About me
          </label>
          <textarea 
            id="aboutMe"
            placeholder="Tell us about yourself, your achievements and what you are passionate about.."
            className="w-full h-[120px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px] resize-none"
            style={{ fontFamily: 'Poppins' }}
          />
        </div>

        <div className="flex flex-col gap-[14px] w-full">
          <label 
            htmlFor="whyConnect" 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Why should people connect with you?
          </label>
          <textarea 
            id="whyConnect"
            placeholder="Describe what you offer..."
            className="w-full h-[120px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px] resize-none"
            style={{ fontFamily: 'Poppins' }}
          />
        </div>

      </div>

      <div className="w-[1200px] h-auto bg-white rounded-[8px] p-[24px] box-border flex flex-col gap-[24px]">
        
        <div className="flex items-center gap-[10px]">
          <div className="w-[24px] h-[24px] rounded-[12px] bg-[#2F43F2] flex items-center justify-center">
            <span className="text-white text-[14px] font-semibold font-sans leading-none">4</span>
          </div>
          <h2 
            className="text-[#0E1629] text-[20px] font-semibold leading-[100%]"
            style={{ fontFamily: 'Poppins' }}
          >
            How Can You Help
          </h2>
        </div>

        <div className="flex gap-[120px]">
          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="option1" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Option 1
            </label>
            <textarea 
              id="option1"
              placeholder="Lorem ipsum"
              className="w-full h-[68px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px] resize-none"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="option2" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Option 2
            </label>
            <textarea 
              id="option2"
              placeholder="Lorem ipsum"
              className="w-full h-[68px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px] resize-none"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

        <div className="flex gap-[120px]">
          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="option3" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Option 3
            </label>
            <textarea 
              id="option3"
              placeholder="Lorem ipsum"
              className="w-full h-[68px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px] resize-none"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="option4" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Option 4
            </label>
            <textarea 
              id="option4"
              placeholder="Lorem ipsum"
              className="w-full h-[68px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px] resize-none"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

      </div>

      <div className="w-[1200px] h-auto bg-white rounded-[8px] p-[24px] box-border flex flex-col gap-[24px]">
        
        <div className="flex items-center gap-[10px]">
          <div className="w-[24px] h-[24px] rounded-[12px] bg-[#2F43F2] flex items-center justify-center">
            <span className="text-white text-[14px] font-semibold font-sans leading-none">5</span>
          </div>
          <h2 
            className="text-[#0E1629] text-[20px] font-semibold leading-[100%]"
            style={{ fontFamily: 'Poppins' }}
          >
            College Life at College
          </h2>
        </div>

        <div className="flex gap-[120px]">
          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="messFood" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Mess Food
            </label>
            <input 
              type="text" 
              id="messFood"
              placeholder="e.g., IIT Delhi"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="attendance" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Attendance
            </label>
            <input 
              type="text" 
              id="attendance"
              placeholder="e.g., B.Tech"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

        <div className="flex gap-[120px]">
          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="campusVibe" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Campus Vibe
            </label>
            <input 
              type="text" 
              id="campusVibe"
              placeholder="e.g., Computer Science Engineering"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B7280] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="facultyQuality" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Faculty Quality
            </label>
            <div className="relative w-full">
              <select 
                id="facultyQuality"
                defaultValue=""
                className="appearance-none w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] bg-white cursor-pointer"
                style={{ fontFamily: 'Poppins' }}
              >
                <option value="" disabled className="text-[#6B7280]">Select Year</option>
              </select>
              <div className="absolute right-[12px] top-[10px] pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="w-[1200px] flex justify-end gap-[16px]">
        <button 
          type="button"
          className="w-[90px] h-[44px] rounded-[8px] border border-[#2F43F2] cursor-pointer bg-transparent py-[10px] px-[16px] flex items-center justify-center transition-colors hover:bg-gray-50"
        >
          <span 
            className="text-[#2F43F2] text-[16px] font-medium leading-[100%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Cancel
          </span>
        </button>

        <button 
          type="submit"
          className="w-[214px] h-[44px] rounded-[8px] border border-[#2F43F2] bg-[#2F43F2] cursor-pointer py-[10px] px-[16px] flex items-center justify-center transition-opacity hover:opacity-90"
        >
          <span 
            className="text-white text-[16px] font-medium leading-[100%] text-nowrap"
            style={{ fontFamily: 'Poppins' }}
          >
            Complete Registration
          </span>
        </button>
      </div>

    </div>
  );
}