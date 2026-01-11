import { useRef } from "react";

type UploadBoxProps = {
  file: File | null;
  setFile: (file: File | null) => void;
};

export default function UploadBox({ file, setFile }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const validateAndSet = (f: File) => {
    const isValidType = ["image/png", "image/jpeg"].includes(f.type);
    const isValidSize = f.size <= 10 * 1024 * 1024;

    if (!isValidType) return alert("Only PNG and JPG allowed");
    if (!isValidSize) return alert("Max size 10MB");

    setFile(f);
  };

  return (
    <div
      onClick={!file ? handleClick : undefined}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) validateAndSet(f);
      }}
      className="w-full h-[174px] border-2 border-dashed border-[#C1C1C1]
                 rounded-xl flex items-center justify-center p-4 bg-[#F4F7FB]"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) validateAndSet(f);
        }}
      />

      {!file ? (
        <div className="flex flex-col items-center justify-center text-center">
            <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="mb-2  text-(--text-app-primary)"
          >
            <path d="M12 16V4M12 4L7 9M12 4L17 9"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="font-semibold text-[1rem] text-(--text-app-primary)">Click to upload or drag and drop</p>
          <p className="text-[0.875rem] font-medium text-[#8C8CA1]">PNG, JPG up to 10MB</p>
        </div>
      ) : (
        <div className="flex gap-4 items-center w-full">
          <img
            src={URL.createObjectURL(file)}
            className="h-20 w-20 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex gap-3 mt-2">
              <button onClick={handleClick} className="text-blue-600 text-xs">
                Change
              </button>
              <button onClick={() => setFile(null)} className="text-red-600 text-xs">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
