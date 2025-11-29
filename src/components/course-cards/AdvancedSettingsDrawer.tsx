import { X } from "lucide-react";
import { useState } from "react";

export default function AdvancedSettingsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 ">
          <h2 className="text-xl font-semibold text-[#13097D]">
            Advanced Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          <OptionsCard
            title="PDF Download Permissions in APP"
            description="Switch ON, in case you want to allow PDF file
            to be downloaded from APP."
            fun={()=>{}}
          />
          <OptionsCard
            title="PDF Download Permissions in APP"
            description="Switch ON, in case you want to allow PDF file
            to be downloaded from APP."
            fun={()=>{}}
          />
        </div>
      </div>
    </>
  );
}

interface options {
  title: string;
  description: string;
  fun: () => void;
}

function OptionsCard(props: options) {
  const [isEnabled, setIsEnabled] = useState(false);

  return <div className="border w-100 rounded-[12px] flex items-start justify-between border-[#efefef] bg-white p-3 shadow-sm">
    <div className="flex flex-col">
        <h1 className="text-[1rem] font-semibold text-[#242645]">{props.title}</h1>
        <p className="text-[0.875rem] text-[#8C8CA1] font-medium">{props.description}</p>
    </div>
    <button
      onClick={() => setIsEnabled(!isEnabled)}
      className={`relative w-[2.933rem] h-4 rounded-full transition-all duration-300 flex items-center ${
        isEnabled ? 'bg-[#13097D]' : 'bg-[#E5E7EB]'
      }`}
    >
      <div
        className={`absolute w-3.5 h-3.5 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
          isEnabled ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      >
      </div>
    </button>
  </div>;
}
