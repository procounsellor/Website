type ExamInfoTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const tabs = ["Info", "Courses", "FAQs"];

export function ExamInfoTabs({ activeTab, setActiveTab }: ExamInfoTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-3 text-sm font-semibold transition-colors ${
            activeTab === tab
              ? 'text-[#FA660F] border-b-2 border-[#FA660F]'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}