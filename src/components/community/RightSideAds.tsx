import React from 'react';

const RightSideAds: React.FC = () => {
  const adBlocks = [1, 2, 3];

  return (
    <div className="flex flex-col gap-5 mt-15">
      {adBlocks.map((id) => (
        <div
          key={id}
          className="w-[250px] h-[200px] bg-white rounded-lg border border-gray-200 shadow-sm p-[10px_12px]"
        >
        </div>
      ))}
    </div>
  );
};

export default RightSideAds;