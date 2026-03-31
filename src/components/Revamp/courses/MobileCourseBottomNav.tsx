import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";

type NavItem = {
  key: string;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { key: "home", label: "Home", path: "/revamp-courses" },
  { key: "courses", label: "Courses", path: "/revamp-courses/course-listing" },
  { key: "tests", label: "Tests", path: "/revamp-courses/test-listing" },
  { key: "sessions", label: "Sessions", path: "/live-sessions" },
];

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10.59 1.91074L18.09 9.41074C18.615 9.93574 18.2433 10.8332 17.5008 10.8332H16.6675V15.8332C16.6675 16.4963 16.4041 17.1322 15.9352 17.601C15.4664 18.0698 14.8305 18.3332 14.1675 18.3332H13.3341V12.4999C13.3342 11.8622 13.0905 11.2486 12.6531 10.7847C12.2156 10.3207 11.6174 10.0415 10.9808 10.0041L10.8341 9.9999H9.16747C8.50443 9.9999 7.86855 10.2633 7.3997 10.7321C6.93086 11.201 6.66747 11.8369 6.66747 12.4999V18.3332H5.83414C5.1711 18.3332 4.53521 18.0698 4.06637 17.601C3.59753 17.1322 3.33414 16.4963 3.33414 15.8332V10.8332H2.50081C1.75914 10.8332 1.38664 9.93574 1.91164 9.41074L9.41164 1.91074C9.56791 1.75451 9.77983 1.66675 10.0008 1.66675C10.2218 1.66675 10.4337 1.75451 10.59 1.91074ZM10.8341 11.6666C11.0552 11.6666 11.2671 11.7544 11.4234 11.9106C11.5797 12.0669 11.6675 12.2789 11.6675 12.4999V18.3332H8.33414V12.4999C8.33416 12.2958 8.4091 12.0988 8.54473 11.9463C8.68037 11.7937 8.86726 11.6963 9.06997 11.6724L9.16747 11.6666H10.8341Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CourseIcon({ className }: { className?: string }) {
  return (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
  <g clip-path="url(#clip0_299_2067)">
    <path d="M15.8327 3.33325V16.6666H5.83268C5.39065 16.6666 4.96673 16.491 4.65417 16.1784C4.34161 15.8659 4.16602 15.4419 4.16602 14.9999V4.99992C4.16602 4.55789 4.34161 4.13397 4.65417 3.82141C4.96673 3.50885 5.39065 3.33325 5.83268 3.33325H15.8327Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.8327 13.3333H5.83268C5.39065 13.3333 4.96673 13.5088 4.65417 13.8214C4.34161 14.134 4.16602 14.5579 4.16602 14.9999" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.5 6.66675H12.5" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_299_2067">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );
}

function TestIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
  <g clip-path="url(#clip0_299_2074)">
    <path d="M5.83398 4.7225C5.83398 4.13306 6.06814 3.56775 6.48494 3.15096C6.90174 2.73416 7.46704 2.5 8.05648 2.5H15.2782C15.57 2.5 15.859 2.55749 16.1287 2.66918C16.3983 2.78087 16.6433 2.94458 16.8497 3.15096C17.0561 3.35733 17.2198 3.60234 17.3315 3.87199C17.4432 4.14163 17.5007 4.43064 17.5007 4.7225V11.9442C17.5007 12.236 17.4432 12.525 17.3315 12.7947C17.2198 13.0643 17.0561 13.3093 16.8497 13.5157C16.6433 13.7221 16.3983 13.8858 16.1287 13.9975C15.859 14.1092 15.57 14.1667 15.2782 14.1667H8.05648C7.46704 14.1667 6.90174 13.9325 6.48494 13.5157C6.06814 13.0989 5.83398 12.5336 5.83398 11.9442V4.7225Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.34333 6.05005C3.08779 6.19573 2.87523 6.4063 2.72715 6.66047C2.57906 6.91464 2.50071 7.20339 2.5 7.49755V15.8309C2.5 16.7475 3.25 17.4975 4.16667 17.4975H12.5C13.125 17.4975 13.465 17.1767 13.75 16.6642" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.16797 6.83301H13.3346" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.16797 9.33301H14.168" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_299_2074">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );
}

function SessionIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
  <g clip-path="url(#clip0_299_2082)">
    <path d="M12.5 8.33343L16.2942 6.43677C16.4212 6.37329 16.5623 6.34333 16.7042 6.34972C16.846 6.35611 16.9839 6.39864 17.1047 6.47327C17.2255 6.5479 17.3252 6.65216 17.3944 6.77616C17.4636 6.90015 17.4999 7.03977 17.5 7.18177V12.8184C17.4999 12.9604 17.4636 13.1 17.3944 13.224C17.3252 13.348 17.2255 13.4523 17.1047 13.5269C16.9839 13.6016 16.846 13.6441 16.7042 13.6505C16.5623 13.6569 16.4212 13.6269 16.2942 13.5634L12.5 11.6668V8.33343Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.5 6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H10.8333C11.2754 5 11.6993 5.17559 12.0118 5.48816C12.3244 5.80072 12.5 6.22464 12.5 6.66667V13.3333C12.5 13.7754 12.3244 14.1993 12.0118 14.5118C11.6993 14.8244 11.2754 15 10.8333 15H4.16667C3.72464 15 3.30072 14.8244 2.98816 14.5118C2.67559 14.1993 2.5 13.7754 2.5 13.3333V6.66667Z" stroke="#0E1629" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_299_2082">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );
}

function getIcon(key: string, className?: string) {
  if (key === "home") return <HomeIcon className={className} />;
  if (key === "courses") return <CourseIcon className={className} />;
  if (key === "tests") return <TestIcon className={className} />;
  return <SessionIcon className={className} />;
}

export default function MobileCourseBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoginToggle, toggleLogin } = useAuthStore();

  const handleNavClick = (item: NavItem) => {
    if (item.key !== "sessions") {
      navigate(item.path);
      return;
    }

    if (isAuthenticated) {
      navigate(item.path);
      return;
    }

    if (!isLoginToggle) {
      toggleLogin(() => navigate(item.path));
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-2 md:hidden">
      <div className="mx-auto flex max-w-[420px] items-end justify-start">
        <div
          aria-label="Course bottom navigation"
          className="flex h-16 w-full max-w-[280px] items-center justify-between rounded-[12px] bg-white px-3 shadow-md"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const toneClass = isActive
              ? "text-[#2F43F2] font-semibold"
              : "text-[var(--text-muted)] font-normal";

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 ${toneClass}`}
                aria-label={item.label}
              >
                <div className="relative flex items-center justify-center">
                  {getIcon(item.key, "h-5 w-5")}
                  {item.key === "sessions" && (
                    <span className="absolute -top-1 -left-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#ff3b30] ring-1 ring-white shadow-sm animate-[pulse_2.4s_ease-in-out_infinite]" />
                  )}
                </div>
                <span className="text-[12px] leading-[1.1]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
