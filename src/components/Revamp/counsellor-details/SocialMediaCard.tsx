import type { JSX } from 'react';

export function RevampSocialMediaCard(): JSX.Element {
  const socialLinks = [
    {
      platform: 'LinkedIn',
      description: 'Career tips and industry insights',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="#0A66C2" />
          <path d="M12.5 16H9V27H12.5V16Z" fill="white" />
          <path d="M10.75 14.5C9.645 14.5 8.75 13.605 8.75 12.5C8.75 11.395 9.645 10.5 10.75 10.5C11.855 10.5 12.75 11.395 12.75 12.5C12.75 13.605 11.855 14.5 10.75 14.5Z" fill="white" />
          <path d="M27 27H23.5V20.5C23.5 18.5 22.8 17.5 21 17.5C19.2 17.5 18.5 18.8 18.5 20.5V27H15V16H18.5V17.5C19.5 15.8 21 15.5 22.8 15.5C25.5 15.5 27 17.2 27 20.5V27Z" fill="white" />
        </svg>
      )
    },
    {
      platform: 'Instagram',
      description: 'Career success stories and reels',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="url(#paint0_linear)" />
          <path d="M23 10H13C11.3431 10 10 11.3431 10 13V23C10 24.6569 11.3431 26 13 26H23C24.6569 26 26 24.6569 26 23V13C26 11.3431 24.6569 10 23 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 17.3701C21.1234 18.2023 20.9813 19.0523 20.5938 19.7991C20.2063 20.5459 19.5931 21.1515 18.8416 21.5298C18.0901 21.908 17.2384 22.0402 16.4077 21.9067C15.5771 21.7732 14.8105 21.381 14.2148 20.7853C13.6191 20.1896 13.2269 19.423 13.0934 18.5924C12.9599 17.7617 13.0921 16.91 13.4703 16.1585C13.8486 15.407 14.4542 14.7938 15.201 14.4063C15.9478 14.0188 16.7978 13.8767 17.63 14.0001C18.4789 14.126 19.2649 14.5216 19.8717 15.1284C20.4785 15.7352 20.8741 16.5212 21 17.3701Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.5 14.5H21.51" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="paint0_linear" x1="10" y1="26" x2="26" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEDA75" />
              <stop offset="0.3" stopColor="#FA7E1E" />
              <stop offset="0.6" stopColor="#D62976" />
              <stop offset="0.8" stopColor="#962FBF" />
              <stop offset="1" stopColor="#4F5BD5" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      platform: 'YouTube Video',
      description: 'Latest career advice and updates',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="#F5F5F5" />
          <path d="M27.6 12.8C27.3 11.6 26.4 10.7 25.2 10.4C23.1 9.8 18 9.8 18 9.8C18 9.8 12.9 9.8 10.8 10.4C9.6 10.7 8.7 11.6 8.4 12.8C7.8 15 7.8 18 7.8 18C7.8 18 7.8 21 8.4 23.2C8.7 24.4 9.6 25.3 10.8 25.6C12.9 26.2 18 26.2 18 26.2C18 26.2 23.1 26.2 25.2 25.6C26.4 25.3 27.3 24.4 27.6 23.2C28.2 21 28.2 18 28.2 18C28.2 18 28.2 15 27.6 12.8Z" fill="#FF0000" />
          <path d="M16 21.5L21.5 18L16 14.5V21.5Z" fill="white" />
        </svg>
      )
    },
    {
      platform: 'Facebook Post',
      description: 'counselling videos and webinars',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="#1877F2" />
          <path d="M23.5 18H20.5V28H16.5V18H14.5V14.5H16.5V12.5C16.5 9.5 18 8 21.5 8H24V11.5H22C20.5 11.5 20.5 12 20.5 13V14.5H24L23.5 18Z" fill="white" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-[719px] bg-white rounded-[16px] border border-[#EFEFEF] p-[24px] font-poppins shadow-sm">
      <h2 className="text-[20px] font-semibold text-[#0E1629] leading-[125%] font-montserrat mb-[20px]">
        Latest Posts & Updates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        {socialLinks.map((social, index) => (
          <div 
            key={index}
            className="w-full h-[71px] bg-[#F5F5F5] rounded-[12px] p-[12px] flex items-center gap-[12px] cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="w-[36px] h-[36px] shrink-0">
              {social.icon}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="text-[20px] font-medium text-[#0E1629] leading-none truncate">
                {social.platform}
              </h3>
              <p className="text-[14px] font-medium text-[#6B7280] leading-none mt-[6px] truncate">
                {social.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}