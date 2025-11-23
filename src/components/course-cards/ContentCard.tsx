import { EllipsisVertical, Lock } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";

export default function () {
//   const { role } = useAuthStore();
  const isCounselor = false

  return (
    <div className="bg-white rounded-2xl border p-4 relative">
      <h1 className="text-[#343C6A] font-semibold text-[1.25rem] mb-3">
        Content
      </h1>
      <div className={`flex gap-4 ${isCounselor ? "blur-md pointer-events-none" : ""}`}>
        <div className="h-14.5 bg-[#F5F5F5] w-90 rounded-[12px] flex justify-between items-center p-4">
          <div className="flex gap-3">
            <img src="/folder.svg" alt="" />
            <div className="flex flex-col">
              <h1 className="text-[1rem] font-semibold text-[#242645]">
                IIT Jee
              </h1>
              <p className="text-[0.875rem] font-normal text-[#8C8CA1]">
                1 video(s), 2 file(s)
              </p>
            </div>
          </div>

          <EllipsisVertical />
        </div>

        <div className="h-14.5 bg-[#F5F5F5] w-90 rounded-[12px] flex justify-between items-center p-4">
          <div className="flex gap-3">
            <img src="/pdf.svg" alt="" />
            <div className="flex flex-col">
              <h1 className="text-[1rem] font-semibold text-[#242645]">
                research.pdf
              </h1>
              <p className="text-[0.875rem] font-normal text-[#8C8CA1]">
                1 file
              </p>
            </div>
          </div>

          <EllipsisVertical />
        </div>

        <div className="h-14.5 bg-[#F5F5F5] w-90 rounded-[12px] flex justify-between items-center p-4">
          <div className="flex gap-3">
            <img src="/video.svg" alt="" />
            <div className="flex flex-col">
              <h1 className="text-[1rem] font-semibold text-[#242645]">
                aamd2d.mp4
              </h1>
              <p className="text-[0.875rem] font-normal text-[#8C8CA1]">
                1 video
              </p>
            </div>
          </div>

          <EllipsisVertical />
        </div>

        
      </div>

      {isCounselor && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
          <Lock className="w-12 h-12 text-[#343C6A] mb-3" />
          <p className="text-[#343C6A] font-semibold text-lg">
            Buy the course to see content
          </p>
        </div>
      )}
    </div>
  );
}
