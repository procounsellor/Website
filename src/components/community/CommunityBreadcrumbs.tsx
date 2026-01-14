import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface BreadcrumbPath {
  name: string;
  link?: string;
}

interface CommunityBreadcrumbsProps {
  paths: BreadcrumbPath[];
  showMobileBack?: boolean;
}

export default function CommunityBreadcrumbs({ paths, showMobileBack = true }: CommunityBreadcrumbsProps) {
  const navigate = useNavigate();
  const currentTitle = paths.length > 0 ? paths[paths.length - 1].name : '';

  return (
    <div className="w-full flex flex-col mt-16 gap-2 mb-4">
      <div className="md:hidden flex items-center">
        {showMobileBack ? (
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-[#343C6A] gap-1 active:opacity-70 transition-opacity"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span 
              className="font-medium text-sm text-[#343C6A]"
              style={{ fontFamily: 'Montserrat' }}
            >
              Back
            </span>
          </button>
        ) : (
          <h1 
            className="text-[#13097D] font-semibold text-[20px] leading-tight"
            style={{ fontFamily: 'Montserrat' }}
          >
            {currentTitle}
          </h1>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2">
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          
          return (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight size={16} className="text-[#6C6969]" />
              )}
              
              {isLast ? (
                <span 
                  className="text-[#13097D] font-semibold text-[16px] leading-none"
                  style={{ fontFamily: 'Montserrat', fontWeight: 600 }}
                >
                  {path.name}
                </span>
              ) : (
                <Link 
                  to={path.link || '#'}
                  className="text-[#6C6969] font-medium text-[16px] leading-none tracking-[-0.41px] hover:text-[#13097D] transition-colors"
                  style={{ fontFamily: 'Montserrat', fontWeight: 500 }}
                >
                  {path.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}