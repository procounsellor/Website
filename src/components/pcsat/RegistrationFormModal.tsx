import { useState } from "react";
import { X, User, Mail, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PcsatRegistrationData } from "@/api/pcsat";

interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PcsatRegistrationData) => void;
  isProcessing: boolean;
  initialData?: Partial<PcsatRegistrationData>;
}

export default function RegistrationFormModal({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
}: RegistrationFormModalProps) {
  const [formData, setFormData] = useState<PcsatRegistrationData>({
    studentName: "",
    contactNumber: "",
    email: "",
    gender: "MALE",
    category: "GEN",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={!isProcessing ? onClose : undefined}
      ></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-[#0E1629]">Candidate Registration</h2>
          {!isProcessing && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" /> Full Name
            </label>
            <input
              required
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Contact Number
              </label>
              <input
                required
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="9876543210"
                pattern="[0-9]{10}"
                maxLength={10}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <div className="relative">
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="MALE" className="cursor-pointer">Male</option>
                    <option value="FEMALE" className="cursor-pointer">Female</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="relative">
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-[#2F43F2] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="GEN" className="cursor-pointer">GEN</option>
                    <option value="OBC" className="cursor-pointer">OBC</option>
                    <option value="SC" className="cursor-pointer">SC</option>
                    <option value="ST" className="cursor-pointer">ST</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#FF660F] hover:bg-[#e15500] text-white cursor-pointer py-6 text-lg font-medium rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
            >
              {isProcessing ? "Processing..." : "Submit & Pay"}
            </Button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Secure payment powered by Razorpay
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}