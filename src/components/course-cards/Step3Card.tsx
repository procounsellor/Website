import { EllipsisVertical, X } from "lucide-react";

export default function () {
  // const folderPath = ()=>{
  //    let  currentPath = 'root'
  //    const rootPath = ''

  //    if(currentPath=='root'){
  //     return rootPath
  //    }

  // }
  return (
    <div className="flex flex-col gap-5 bg-white w-234 min-h-[29.688rem] p-6 rounded-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-[1.25rem] font-medium text-[#9499B2]">Content</h1>
        <button className="flex  items-center gap-2 py-2 px-6 border border-[#13097D] text-[#13097D] rounded-[0.75rem] font-semibold text-[1rem] hover:bg-[#13097D] hover:text-white transition-all duration-200">
          Add
        </button>
      </div>

      <div className="flex py-3 px-4 bg-[#f5f5f7] justify-between h-14 rounded-2xl items-center">
        <div className="flex gap-2 items-start">
          <img src="/folder.svg" alt="" />
          <p className="flex flex-col text-[1rem] font-semibold text-[#242645]">
            IIT Jee
            <span className="text-[0.875rem] text-[#8C8CA1] font-normal">
              size or items
            </span>
          </p>
        </div>
        <EllipsisVertical />
      </div>

      <div className="w-222 bg-white rounded-2xl shadow-sm border border-[#f5f5f7] p-3">
        <div className="flex justify-between">
          <div className="flex gap-2 items-start">
            <img src="/video.svg" alt="" />
            <p className="flex flex-col text-[1rem] font-semibold text-[#242645]">
              IIT Jee
              <span className="text-[0.875rem] text-[#8C8CA1] font-normal">
                size or items
              </span>
            </p>
          </div>
              <button
          onClick={() => {}}
          className="group  hover:bg-gray-900 h-5 w-5 flex items-center justify-center hover:text-white rounded-full transition-colors duration-200"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-white" />
        </button>
        </div>

        <div className="h-1.5 bg-[#D9D9D9] rounded-2xl mt-3">

        </div>
      </div>
    </div>
  );
}
