import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";
import { registerProBuddy, uploadProBuddyPhoto, uploadProBuddyIdCardPhoto } from "@/api/proBuddy";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ProBuddiesRegistration() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [idCardPreviewUrl, setIdCardPreviewUrl] = useState<string | null>(null);
  const [selectedIdCard, setSelectedIdCard] = useState<File | null>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    location: "",
    institution: "",
    degree: "",
    course: "",
    years: "",
    specialization: "",
    subHeading: "",
    aboutMe: "",
    whyConnect: "",
    languagesKnow: "Hindi, English",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    officeStartTime: "09:00",
    officeEndTime: "18:00",
    messFood: "",
    attendance: "",
    campusVibe: "",
    facultyQuality: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleFile = (file: File) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedImage(file);
    } else {
      toast.error("Please upload a valid PNG or JPEG image.");
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
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleIdCardFile = (file: File) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const url = URL.createObjectURL(file);
      setIdCardPreviewUrl(url);
      setSelectedIdCard(file);
    } else {
      toast.error("Please upload a valid PNG or JPEG image for your ID Card.");
    }
  };

  const onIdCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIdCardFile(e.target.files[0]);
    }
  };

  const onIdCardDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIdCardFile(e.dataTransfer.files[0]);
    }
  };

  const removeIdCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdCardPreviewUrl(null);
    setSelectedIdCard(null);
    if (idCardInputRef.current) {
      idCardInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!selectedIdCard) {
      toast.error("Please upload your ID Card.");
      return;
    }

    const [city = "", state = ""] = formData.location.split(",").map(s => s.trim());
    
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      collegeName: formData.institution,
      currentYear: formData.years,
      course: `${formData.degree} ${formData.course}`.trim(),
      city: city || formData.location,
      state: state || formData.location,
      whoShouldConnect: formData.whyConnect,
      aboutMe: {
        heading: formData.specialization,
        subHeading: formData.subHeading || "ProBuddy",
        aboutMe: formData.aboutMe
      },
      offerings: {
        "Mess Food": Number(formData.messFood) || 5,
        "Attendance": Number(formData.attendance) || 5,
        "Campus Vibe": Number(formData.campusVibe) || 5,
        "Faculty Quality": Number(formData.facultyQuality) || 5
      },
      languagesKnow: formData.languagesKnow.split(",").map(l => l.trim()),
      workingDays: formData.workingDays,
      officeStartTime: formData.officeStartTime,
      officeEndTime: formData.officeEndTime
    };

    try {
      setLoading(true);
      
      const regResponse = await registerProBuddy(payload);
      const newBuddyId = regResponse.id || regResponse.proBuddyId || regResponse.counsellorId; 
      
      if (selectedImage && newBuddyId) {
        await uploadProBuddyPhoto(String(newBuddyId), selectedImage);
      }

      if (selectedIdCard && newBuddyId) {
        await uploadProBuddyIdCardPhoto(String(newBuddyId), selectedIdCard);
      }

      toast.success("Registration completed successfully!");
      navigate("/pro-buddies/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full min-h-screen bg-[#C6DDF040] pb-20 flex flex-col items-center gap-[24px]">

      <div className="w-[1200px] h-auto bg-white rounded-[8px] mt-[40px] p-[24px] box-border">
        
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
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="Enter your First Name as per Aadhar"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Enter your Last Name as per Aadhar"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

        <div className="flex gap-[120px] mb-[12px]">
          <div className="flex flex-col gap-[14px] w-[510px] h-[68px]">
            <label 
              htmlFor="email" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Email*
            </label>
            <input 
              type="email" 
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px] h-[68px]">
            <label 
              htmlFor="phoneNumber" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Phone Number*
            </label>
            <input 
              type="text" 
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

        <div className="flex gap-[120px] mb-[12px]">
          
          {/* Profile Photo Column */}
          <div className="flex flex-col gap-[12px] w-[510px] h-[152px]">
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

          <div className="flex flex-col gap-[12px] w-[510px] h-[152px]">
            <label 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Upload ID Card*
            </label>
            
            <div 
              className="relative w-full h-[120px] rounded-[4px] border-[1px] border-dashed border-[#EBEBEB] bg-[#6B72800A] flex flex-col items-center justify-center gap-[8px] cursor-pointer hover:bg-[#6b728013] transition-colors overflow-hidden"
              onClick={() => idCardInputRef.current?.click()}
              onDragOver={onIdCardDrop}
              onDrop={onIdCardDrop}
            >
              <input 
                type="file" 
                ref={idCardInputRef}
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={onIdCardChange}
              />

              {idCardPreviewUrl ? (
                <>
                  <img 
                    src={idCardPreviewUrl} 
                    alt="ID Card Preview" 
                    className="w-full h-full object-contain bg-white" 
                  />
                  <button
                    type="button"
                    onClick={removeIdCard}
                    className="absolute top-[8px] right-[8px] w-[24px] h-[24px] bg-red-500 cursor-pointer rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    aria-label="Remove ID Card"
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
            value={formData.location}
            onChange={handleInputChange}
            required
            placeholder="e.g. Delhi, Mumbai"
            className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
              value={formData.institution}
              onChange={handleInputChange}
              placeholder="e.g., IIT Delhi"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
              value={formData.degree}
              onChange={handleInputChange}
              placeholder="e.g., B.Tech"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
              value={formData.course}
              onChange={handleInputChange}
              placeholder="e.g., Computer Science Engineering"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
                value={formData.years}
                onChange={handleInputChange}
                className="appearance-none w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] bg-white cursor-pointer"
                style={{ fontFamily: 'Poppins' }}
              >
                <option value="" disabled className="text-[#6B728080]">Select Year</option>
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
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="e.g., Career Transition strategy"
            className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
            style={{ fontFamily: 'Poppins' }}
          />
        </div>

        <div className="flex flex-col gap-[14px] w-full">
          <label 
            htmlFor="subHeading" 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Profile Sub-heading
          </label>
          <input 
            type="text" 
            id="subHeading"
            value={formData.subHeading}
            onChange={handleInputChange}
            placeholder="e.g., B.Tech Senior at IIT"
            className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
            value={formData.aboutMe}
            onChange={handleInputChange}
            placeholder="Tell us about yourself, your achievements and what you are passionate about.."
            className="w-full h-[120px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px] resize-none"
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
            value={formData.whyConnect}
            onChange={handleInputChange}
            placeholder="Describe what you offer..."
            className="w-full h-[120px] p-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px] resize-none"
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
            Availability & Languages
          </h2>
        </div>

        <div className="flex flex-col gap-[14px] w-full">
          <label 
            htmlFor="languagesKnow" 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Languages Known (Comma separated)
          </label>
          <input 
            type="text" 
            id="languagesKnow"
            value={formData.languagesKnow}
            onChange={handleInputChange}
            placeholder="e.g., Hindi, English"
            className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
            style={{ fontFamily: 'Poppins' }}
          />
        </div>

        <div className="flex flex-col gap-[14px] w-full">
          <label 
            className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
            style={{ fontFamily: 'Poppins' }}
          >
            Working Days
          </label>
          <div className="flex gap-[16px] flex-wrap">
            {DAYS_OF_WEEK.map((day) => (
              <label key={day} className="flex items-center gap-[8px] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.workingDays.includes(day)} 
                  onChange={() => toggleDay(day)} 
                  className="w-[16px] h-[16px] accent-[#2F43F2] cursor-pointer" 
                />
                <span 
                  className="text-[14px] text-[#0E1629]"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {day}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-[120px]">
          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="officeStartTime" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Available From (Time)
            </label>
            <input 
              type="time" 
              id="officeStartTime"
              value={formData.officeStartTime}
              onChange={handleInputChange}
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className="flex flex-col gap-[14px] w-[510px]">
            <label 
              htmlFor="officeEndTime" 
              className="text-[#0E1629] text-[14px] font-semibold leading-[125%]"
              style={{ fontFamily: 'Poppins' }}
            >
              Available Until (Time)
            </label>
            <input 
              type="time" 
              id="officeEndTime"
              value={formData.officeEndTime}
              onChange={handleInputChange}
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
              value={formData.messFood}
              onChange={handleInputChange}
              placeholder="Start writing"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
              value={formData.attendance}
              onChange={handleInputChange}
              placeholder="Start writing"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
              value={formData.campusVibe}
              onChange={handleInputChange}
              placeholder="Start writing"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
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
            <input 
              type="text" 
              id="facultyQuality"
              value={formData.facultyQuality}
              onChange={handleInputChange}
              placeholder="Start writing"
              className="w-full h-[36px] px-[12px] border border-gray-200 rounded-[4px] outline-none focus:border-[#2F43F2] text-[#0E1629] text-[14px] placeholder:text-[#6B728080] placeholder:text-[12px]"
              style={{ fontFamily: 'Poppins' }}
            />
          </div>
        </div>

      </div>

      <div className="w-[1200px] flex justify-end gap-[16px]">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          disabled={loading}
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
          disabled={loading}
          className="w-[214px] h-[44px] rounded-[8px] border border-[#2F43F2] bg-[#2F43F2] cursor-pointer py-[10px] px-[16px] flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span 
            className="text-white text-[16px] font-medium leading-[100%] text-nowrap"
            style={{ fontFamily: 'Poppins' }}
          >
            {loading ? "Submitting..." : "Complete Registration"}
          </span>
        </button>
      </div>

    </form>
  );
}