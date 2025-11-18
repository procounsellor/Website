import CommunityActions from "@/components/community/CommunityActions";
import DashboardFeed from "@/components/community/DashboardFeed";

export default function CommunityPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="w-full max-w-[900px]">
          <CommunityActions />
        </div>

        <div className="mt-4 w-full max-w-[900px]">
          <DashboardFeed />
        </div>
        
      </div>
    </div>
  );
}