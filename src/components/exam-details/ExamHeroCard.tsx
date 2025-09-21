type ExamHeroCardProps = {
  name: string;
  level: string;
  bannerUrl: string;
};

export function ExamHeroCard({ name, level, bannerUrl }: ExamHeroCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <img 
        src={bannerUrl} 
        alt={name} 
        className="w-full h-48 object-cover rounded-lg" 
      />
      <h2 className="text-xl font-bold text-[#343C6A] mt-3">{name}</h2>
      <span className="inline-block bg-slate-100 text-slate-700 text-sm font-medium mt-2 px-3 py-1 rounded-full">
        {level}
      </span>
    </div>
  );
}