type ExamHeroCardProps = {
  name: string;
  level: string;
  bannerUrl: string;
};

export function ExamHeroCard({ name, level, bannerUrl }: ExamHeroCardProps) {
  return (
    <div className="bg-white rounded-[12px] lg:rounded-xl border border-gray-200 shadow-sm p-3 lg:p-4">
      <img 
        src={bannerUrl} 
        alt={name} 
        className="w-full h-[147px] lg:h-48 object-cover rounded-lg" 
      />
      <h2 className="text-[14px] lg:text-xl font-medium lg:font-bold text-[#343C6A] lg:mt-3">{name}</h2>
      <span className="inline-block bg-slate-100 text-slate-700 text-sm font-medium mt-1 lg:mt-2 px-2 lg:px-3 py-1 rounded-full">
        {level}
      </span>
    </div>
  );
}