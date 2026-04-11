import { X } from "lucide-react";

export default function SelectFileCard(){
    return (
        <div className="fixed inset-0 z-70 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
        <div 
        className="hidden md:flex items-center flex-col gap-8 w-full max-w-[26.813rem] h-[18.8rem] bg-[#F5F7FA] rounded-2xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={()=>{}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>

        
      </div>
        </div>
    );
}