import { useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function RevampBreadcrumbs() {
  const location = useLocation();
  
  const getBreadcrumbText = () => {
    const path = location.pathname;
    if (path.includes('/community')) return 'Community';
    if (path.includes('/pro-buddies')) return 'ProBuddies';
    if (path.includes('/about')) return 'About Us';
    return 'Home';
  };

  return (
    <div className="w-full bg-white py-4 px-[60px]">
      <div className="flex items-center gap-2 text-sm">
        <Home className="w-4 h-4 text-(--text-muted)" />
        <span className="text-(--text-muted)">/</span>
        <span className="text-(--text-main) font-medium">{getBreadcrumbText()}</span>
      </div>
    </div>
  );
}
