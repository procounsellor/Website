import { useState } from "react";

interface BlogCardProps {
  title: string;
  author: string;
  readTime: string;
  imageUrl: string;
}

export default function BlogCard({ title, author, readTime, imageUrl }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
    className="relative w-[338px] h-[331px] group"
    >
      <svg
       className="absolute inset-0 w-full h-full"
       xmlns="http://www.w3.org/2000/svg" width="338" height="331" viewBox="0 0 338 331" fill="none">
        <g
        transform="scale(0.95) translate(8, 8)"
        >
           <path 
       d="M325 0C332.18 4.54258e-06 338 5.26132 338
        11.7515V256.325C338 262.953 332.627 268.325 
        326 268.325H281.155C275.151 268.325 270.071 
        272.762 269.264 278.711L263.576 320.614C262.769
        326.563 257.689 331 251.685 331H13C5.8203 331 
        9.16083e-08 325.739 0 319.249V11.7515C2.30329e-06
         5.26132 5.8203 2.36593e-07 13 0H325Z" fill="white"/>
        </g>
      </svg>

      <div className="w-full h-full relative p-3 flex flex-col">

        <img src={imageUrl} alt={title} className="w-full h-[167px] shrink-0 object-contain" />

      </div>


      
    </div>
  );
}