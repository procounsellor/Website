import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export default function RevampBreadcrumbs() {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const crumbs: BreadcrumbItem[] = [];

    // Admissions page — no breadcrumb needed (it's the home page of revamp)
    if (path === '/admissions') {
      return [];
    }

    // Always start with Home for non-admission pages
    crumbs.push({ label: 'Home', path: '/admissions' });

    // Courses routes
    if (path.includes('/revamp-courses')) {
      crumbs.push({ label: 'Courses' });
    }
    // Community routes
    else if (path.includes('/community')) {
      crumbs.push({ label: 'Community', path: '/community' });

      if (path.includes('/community/question/')) {
        crumbs.push({ label: 'Question' });
      } else if (path.includes('/community/answer')) {
        crumbs.push({ label: 'Answer' });
      } else if (path.includes('/community/my-activity')) {
        crumbs.push({ label: 'My Activity' });
      }
    }
    // ProBuddies routes
    else if (path.includes('/pro-buddies')) {
      crumbs.push({ label: 'ProBuddies' });
    }
    // About routes
    else if (path.includes('/revamp-about')) {
      crumbs.push({ label: 'About Us' });
    }
    // Counsellor listing
    else if (path === '/counsellors') {
      crumbs.push({ label: 'Counsellors' });
    }
    // Counsellor detail
    else if (path.includes('/counsellor/')) {
      crumbs.push({ label: 'Counsellors', path: '/counsellors' });
      crumbs.push({ label: 'Profile' });
    }
    // Exams listing
    else if (path === '/exams') {
      crumbs.push({ label: 'Exams' });
    }
    // Exam details
    else if (path.includes('/exams/')) {
      crumbs.push({ label: 'Exams', path: '/exams' });
      crumbs.push({ label: 'Details' });
    }
    // Courses details
    else if (path.includes('/courses/')) {
      crumbs.push({ label: 'Courses', path: '/revamp-courses' });
      crumbs.push({ label: 'Details' });
    }
    // Course detail page (/detail/:courseId/:role)
    else if (path.includes('/detail/')) {
      crumbs.push({ label: 'Courses', path: '/revamp-courses' });
      crumbs.push({ label: 'Course Details' });
    }
    // College details
    else if (path.includes('/colleges/') || path.includes('/college-details/')) {
      crumbs.push({ label: 'Colleges' });
      crumbs.push({ label: 'Details' });
    }
    // Other generic pages
    else if (path.includes('/about')) {
      crumbs.push({ label: 'About' });
    }
    else if (path.includes('/contact')) {
      crumbs.push({ label: 'Contact' });
    }
    else if (path.includes('/privacy-policy')) {
      crumbs.push({ label: 'Privacy Policy' });
    }
    else if (path.includes('/terms')) {
      crumbs.push({ label: 'Terms' });
    }
    else {
      // For any other unmatched page, just show Home  
      // Remove Home if it's the only crumb
      if (crumbs.length === 1 && crumbs[0].label === 'Home') {
        return [];
      }
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-[60px] py-3">
        <div className="flex items-center gap-2 text-sm font-[Poppins]">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                )}
                {crumb.path && !isLast ? (
                  <Link
                    to={crumb.path}
                    className="text-[#6B7280] hover:text-[#0E1629] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`${isLast && breadcrumbs.length > 1 ? 'text-[#0E1629] font-semibold' : 'text-[#6B7280]'}`}>
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
