import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BlogsPageCardProps {
  id: number | string;
  title: string;
  author: string;
  publishedOn: string;
  tag: string;
  imageUrl: string;
}

export default function BlogsPageCard({
  id,
  title,
  author,
  publishedOn,
  tag,
  imageUrl,
}: BlogsPageCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-none md:max-w-[308px] h-[160px] md:h-[292px] md:mx-auto cursor-pointer"
      onClick={() => navigate(`/admissions/blogs/${id}`)}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card background shape (mobile uses your provided Figma path) */}
      <svg
        className="absolute inset-0 w-full h-full md:hidden"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 450 260"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 438.154 0 C 444.696 0 450 5.2613 450 11.7515 V 156 C 448 189 442 189 419 189 H 397 C 391 189 391 196 389 208 L 384 249 C 383 256 376.348 260 370.29 260 H 11.8462 C 5.3037 260 0 254.739 0 248.249 V 11.7515 C 0 5.2613 5.3037 0 11.8462 0 H 438.154 Z"
          fill="white"
        />
      </svg>
      <svg
        className="absolute inset-0 w-full h-full hidden md:block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 308 331"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M296.154 0C302.696 4.54258e-06 308 5.26132 308 11.7515V256.325C308 262.953 302.627 268.325 296 268.325H257.257C251.199 268.325 246.091 272.84 245.347 278.852L240.199 320.473C239.456 326.485 234.348 331 228.29 331H11.8462C5.30371 331 8.34774e-08 325.739 0 319.249V11.7515C2.09886e-06 5.26132 5.30371 2.36593e-07 11.8462 0H296.154Z"
          fill="white"
        />
      </svg>

      <div className="absolute flex flex-row md:flex-col w-full h-full z-10 p-2 md:p-3 gap-2 md:gap-0 pb-1.5 md:pb-3 items-center md:items-stretch">
        <div className="relative shrink-0 w-[140px] h-[136px] md:w-full md:h-[128px] rounded-[8px] md:rounded-[8px] overflow-hidden md:self-auto">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-1 left-1 md:hidden inline-flex items-center px-1.5 py-0.5 rounded-[999px] bg-[#A2AECA] text-[10px] font-normal text-[#0E1629] max-w-[calc(100%-8px)] truncate">
            {tag}
          </span>
        </div>

        <div className="flex flex-col flex-1 min-w-0 min-h-0 pr-[48px] md:pr-0 self-stretch justify-center md:justify-start">
          <div className="hidden md:flex items-center justify-between mt-2 mb-0.5">
            <span className="inline-flex items-center px-2 py-1 rounded-[999px] bg-[#A2AECA] text-[11px] font-normal text-[#0E1629]">
              {tag}
            </span>
            <span className="text-[11px] font-normal text-(--text-muted)">
              {publishedOn}
            </span>
          </div>

          <h2 className="mt-0 md:mt-1.5 text-[16px] font-medium text-[#0E1629] leading-snug line-clamp-2 md:line-clamp-3">
            {title}
          </h2>

          <span className="md:hidden text-[10px] font-normal text-(--text-muted) mt-0.5 shrink-0 leading-tight">
            {publishedOn}
          </span>

          <div className="mt-auto mb-0 md:mb-0.5 pt-0.5 md:pt-0 md:mt-2">
            <p className="text-(--text-muted) text-[12px] md:text-[14px] font-medium md:font-normal">
              By: <span className="md:font-medium">{author}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 -right-px overflow-hidden h-[41px] w-[45px] md:h-[57px] md:w-[61px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 61 57"
          fill="none"
          className="h-full w-full transition-all duration-300"
          preserveAspectRatio="none"
        >
          <path
            d="M5.0628 7.03103C5.55256 3.01727 8.96036 0 13.0039 0H52.9656C57.3838 0 60.9656 3.58172 60.9656 8V49C60.9656 53.4183 57.3839 57 52.9656 57H8.00107C3.1985 57 -0.521724 52.7982 0.0599715 48.031L5.0628 7.03103Z"
            fill={isHovered ? "white" : "#0E1629"}
            className="transition-colors duration-300"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[15px] md:size-5">
          <img
            src="/arrow.svg"
            alt="arrow"
            className={`absolute inset-0 w-full h-full transition-all duration-600 ${
              isHovered
                ? "translate-x-[30px] opacity-0"
                : "translate-x-0 opacity-100"
            }`}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <img
            src="/arrow.svg"
            alt="arrow"
            className={`absolute inset-0 w-full h-full transition-all duration-600 ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "-translate-x-[30px] opacity-0"
            }`}
            style={{ filter: "brightness(0)" }}
          />
        </div>
      </div>
    </div>
  );
}

