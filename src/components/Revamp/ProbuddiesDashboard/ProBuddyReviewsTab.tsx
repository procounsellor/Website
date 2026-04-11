import React from 'react';

const FilledStar = () => (
  <svg width="24" height="24" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#FFC107"/>
  </svg>
);

const OutlinedStar = () => (
  <svg width="24" height="24" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2.11283L11.6661 7.24147L11.8385 7.77189H12.3961H17.7885L13.4259 10.9419L12.9748 11.2696L13.1471 11.8001L14.8132 16.9287L10.4506 13.7587L10 13.431L9.54942 13.7587L5.18683 16.9287L6.85293 11.8001L7.02525 11.2696L6.57413 10.9419L2.21148 7.77189H7.60389H8.16147L8.33385 7.24147L10 2.11283ZM10 0L7.75486 6.90983H0.489435L6.36729 11.1803L4.12215 18.0902L10 13.8197L15.8779 18.0902L13.6327 11.1803L19.5106 6.90983H12.2451L10 0Z" fill="#FFC107"/>
  </svg>
);

const ratingProgressData = [
  { stars: 5, percentage: 65, color: '#0CA525' },
  { stars: 4, percentage: 38, color: '#1EB68B' },
  { stars: 3, percentage: 28, color: '#6FC3A4' },
  { stars: 2, percentage: 38, color: '#FCB302' },
  { stars: 1, percentage: 15, color: '#F16565' },
];

const reviewsData = [
  {
    id: 1,
    name: 'Josheph kuruvilla',
    time: '2 week ago',
    rating: 5,
    avatar: '/profile1.jpg',
    text: 'the guidance on my mern stack expense tracker was phenomenal! we resolved the authentication issues and finalized the data visualization features quickly.'
  },
  {
    id: 2,
    name: 'Josheph kuruvilla',
    time: '2 week ago',
    rating: 5,
    avatar: '/profile2.jpg',
    text: 'really clear explanations on high-level and low-level system design. i feel so much more prepared for my upcoming technical interviews now.'
  },
  {
    id: 3,
    name: 'Josheph kuruvilla',
    time: '2 week ago',
    rating: 5,
    avatar: '/profile1.jpg',
    text: 'super helpful session going over react components, typescript, and tailwind css. the procounsel website interface is looking fantastic after applying these.'
  }
];

const ProBuddyReviewsTab: React.FC = () => {
  return (
    <div className="w-[880px] h-[499px] p-[12px] flex flex-col font-poppins relative">
      
      <h2 className="text-[16px] font-medium text-[#0E1629] leading-none ml-[12px] mt-[12px] mb-[24px]">
        Reviews
      </h2>

      <div className="flex w-full h-full">
        
        <div className="w-[320px] h-[391px] ml-[12px] flex flex-col items-center pt-[10px]">
          
          <div className="flex flex-col items-center justify-center w-[168px] ml-[36px] mb-[24px]">
            <span className="text-[60px] font-semibold text-[#0E1629] leading-none mb-[24px]">
              4.5
            </span>
            
            <div className="flex flex-col gap-[4px] items-center w-full">
              <div className="flex gap-[6px]">
                <FilledStar />
                <FilledStar />
                <FilledStar />
                <FilledStar />
                <OutlinedStar />
              </div>
              <span className="text-[16px] font-medium text-[#0E1629] mt-[4px]">
                ( 234 )
              </span>
            </div>
          </div>

          <div className="w-[320px] h-[213px] ml-[36px] mt-[12px] flex flex-col gap-[12px]">
            {ratingProgressData.map((data) => (
              
              <div key={data.stars} className="w-full h-[33px] flex items-center gap-[24px]">
                
                <span className="w-[13px] h-[33px] flex items-center justify-center text-[22px] font-medium text-[#0E1629] leading-none">
                  {data.stars}
                </span>
                
                <div className="flex items-center justify-center">
                  <FilledStar />
                </div>
                
                <div className="w-[239px] h-[10px] bg-[#E9E9E9] rounded-[12px] relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-[12px]" 
                    style={{ 
                      width: `${data.percentage}%`, 
                      backgroundColor: data.color 
                    }}
                  />
                </div>

              </div>
            ))}
          </div>

        </div>

        <div className="w-[1px] h-[475px] bg-[#E9E9E9] -mt-[36px] ml-[42px]"></div>

        <div className="flex-1 h-[482px] ml-[24px] -mt-[36px] flex flex-col gap-[16px] overflow-y-auto pb-[20px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {reviewsData.map((review) => (
            <div 
              key={review.id} 
              className="w-full h-[150px] shrink-0 rounded-[12px] border border-[#EBEBEB] p-[12px] flex flex-col"
            >
              
              <div className="flex justify-between items-start w-full h-[50px]">
                
                <div className="flex gap-[12px]">
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="w-[142px] h-[48px] relative">
                    <span className="absolute top-[1px] left-0 text-[16px] font-medium text-[#0E1629] leading-[150%] lowercase whitespace-nowrap">
                      {review.name}
                    </span>
                    <span className="absolute top-[28px] left-0 text-[14px] font-normal text-[#6B7280] leading-[150%] lowercase whitespace-nowrap">
                      {review.time}
                    </span>
                  </div>
                </div>

                <div className="flex gap-[8px]">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}>
                      {i < review.rating ? <FilledStar /> : <OutlinedStar />}
                    </div>
                  ))}
                </div>

              </div>

              <p className="w-full h-[63px] text-[14px] font-normal text-[#6B7280] leading-[150%] lowercase mt-[12px]">
                {review.text}
              </p>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProBuddyReviewsTab;