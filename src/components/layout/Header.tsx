import { GlobalSearchBar } from "./GlobalSearchBar";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "../ui";
import {
  User2,
  Search,
  X,
  LogOut,
  LayoutDashboard,
  Library,
  TvMinimalPlay,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import SmartImage from "@/components/ui/SmartImage";
import { BANNER_DISMISS_EVENT } from "@/components/shared/AppInstallBanner";
import { useQuery } from "@tanstack/react-query";
import { getBoughtCourses } from "@/api/course";

// TODO: Update with the actual course ID for the promo page (should match PromoPage.tsx)
const PROMO_COURSE_ID = "a997f3a9-4a36-4395-9f90-847b739fb225";

interface NewHeaderButtonProps {
  label: string;
  onClick: () => void;
}

const NewHeaderButton: React.FC<NewHeaderButtonProps> = ({
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="hidden md:block hover:cursor-pointer text-sm font-semibold text-gray-700 hover:text-[#FF660F] transition-colors duration-200 px-2 py-1"
  >
    {label}
  </button>
);

export default function Header() {
  const { toggleLogin, isAuthenticated, logout, role, userId, user } =
    useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isCounselor = role === "counselor";
  const shouldShowNewHeader = !isAuthenticated || !isCounselor;

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";
  const isPromoPage = location.pathname === "/promo";

  // Check if user is enrolled in the promo course
  const isUserLoaded = user !== null && user !== undefined;
  const { data: boughtCoursesData } = useQuery({
    queryKey: ["boughtCourses", userId],
    queryFn: () => {
      if (isCounselor) {
        return Promise.resolve({
          data: [],
          status: true,
          message: "Counselor cannot buy courses",
        });
      }
      return getBoughtCourses(userId as string);
    },
    enabled:
      isUserLoaded &&
      !!userId &&
      isAuthenticated &&
      !isCounselor &&
      isPromoPage,
    staleTime: 5000,
  });

  const isCoursePurchased =
    boughtCoursesData?.data?.some(
      (course) => course.courseId === PROMO_COURSE_ID
    ) ?? false;

  // Show normal header if on promo page AND user is logged in AND enrolled
  // Show simplified promo header only if on promo page AND (not logged in OR not enrolled)
  const shouldShowSimplifiedPromoHeader =
    isPromoPage && (!isAuthenticated || !isCoursePurchased);

  useEffect(() => {
    const handleBannerDismiss = () => {
      setIsBannerVisible(false);
    };
    window.addEventListener(BANNER_DISMISS_EVENT, handleBannerDismiss);

    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
    };

    const handleHeroSearchBarVisibility = (event: CustomEvent) => {
      if (isHomePage) {
        setShowHeaderSearch(!event.detail.isVisible);
      }
    };

    window.addEventListener("scroll", onScroll);

    if (isHomePage) {
      window.addEventListener(
        "heroSearchBarVisibility",
        handleHeroSearchBarVisibility as EventListener
      );
    } else {
      setShowHeaderSearch(true);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(
        "heroSearchBarVisibility",
        handleHeroSearchBarVisibility as EventListener
      );
      window.removeEventListener(BANNER_DISMISS_EVENT, handleBannerDismiss);
    };
  }, [isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
    toast.success("Logged out successfully!", { duration: 3000 });
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleProfileNavigation = () => {
    if (role === "counselor") {
      navigate("/counsellor-dashboard");
    } else {
      navigate("/dashboard-student");
    }
    setIsDropdownOpen(false);
  };

  const handleNewHeaderNavigation = (path: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to access.", { duration: 3000 });
      toggleLogin();
    } else {
      navigate(path);
    }
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border border-[#d6d6d6] shadow-xs transition-all duration-300 ease-out ${
          isBannerVisible && !scrolled ? "top-[60px] md:top-0" : "top-0"
        } ${
          scrolled || !isHomePage
            ? "bg-white/85 backdrop-blur-xl  shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        {shouldShowSimplifiedPromoHeader ? (
          <div className="flex h-14 md:h-20 items-center justify-between px-5 lg:px-20">
            <div
              className="Logo flex items-center "
            >
              <SmartImage
                src="/logo.png"
                alt="procounsel_logo"
                className="h-7 w-7 md:w-11 md:h-12 rounded-md"
                width={44}
                height={44}
                priority
              />
              <div className="flex items-center leading-tight pl-[9px]">
                <h1 className="text-[#232323] font-semibold text-sm md:text-xl">
                  ProCounsel
                </h1>
              </div>
            </div>

            <Button
              onClick={() => {
                // Access handleEnroll from window object set by PromoPage
                const enrollFn = (window as any).__promoPageEnroll;
                if (enrollFn) {
                  enrollFn();
                } else {
                  console.error("Enroll function not available");
                }
              }}
              className="bg-[#FF660F] hover:bg-[#e15500] text-white px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg font-medium rounded-xl cursor-pointer"
            >
              Enroll Now
            </Button>
          </div>
        ) : shouldShowNewHeader ? (
          <div className="flex h-14 md:h-20 items-center justify-between px-5 lg:px-20">
            <div
              className="Logo flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <SmartImage
                src="/logo.png"
                alt="procounsel_logo"
                className="h-7 w-7 md:w-11 md:h-12 rounded-md"
                width={44}
                height={44}
                priority
              />
              <div className="flex items-center leading-tight pl-[9px]">
                <h1 className="text-[#232323] font-semibold text-sm md:text-xl">
                  ProCounsel
                </h1>
              </div>
            </div>

            {/* Desktop Search Bar - Hidden on PromoPage */}
            {!(role === "counselor" || isPromoPage) && (
              <div
                ref={searchBarRef}
                className={`hidden md:block w-[500px] items-center justify-start transition-all duration-300`}
                style={{
                  marginLeft: "60px",
                  opacity: showHeaderSearch ? 1 : 0,
                  transform: showHeaderSearch
                    ? "translateY(0)"
                    : "translateY(6px)",
                  pointerEvents: showHeaderSearch ? "auto" : "none",
                }}
              >
                <GlobalSearchBar
                  showBackdrop={true}
                  className="w-full h-12 py-3 px-4 border-[1.5px] border-[#DDDDDD] rounded-[12px]"
                />
              </div>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <div
                className="hidden md:flex items-center"
                style={{ gap: "12px" }}
              >
                <NewHeaderButton
                  label="Live Sessions"
                  onClick={() => handleNewHeaderNavigation("/live-sessions")}
                />
                <NewHeaderButton
                  label="My Courses"
                  onClick={() =>
                    handleNewHeaderNavigation(
                      "/dashboard-student?activeTab=My Courses"
                    )
                  }
                />
              </div>
              <div
                className="btn flex items-center gap-3 shrink-0"
                style={{ marginLeft: "66px" }}
              >
                <button
                  className="md:hidden p-2 rounded-full hover:bg-black/5 transition-all shrink-0"
                  style={{
                    opacity: showHeaderSearch ? 1 : 0,
                    pointerEvents: showHeaderSearch ? "auto" : "none",
                  }}
                  onClick={() => setMobileSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-[#232323]" />
                </button>

                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-2 hover:cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <User2 className="h-6 w-6 text-gray-700" />
                    </button>

                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 py-1 border border-gray-200"
                      >
                        <button
                          onClick={handleProfileNavigation}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
                        >
                          <LayoutDashboard size={16} />
                          <span>Profile</span>
                        </button>

                        <button
                          onClick={() =>
                            handleNewHeaderNavigation("/live-sessions")
                          }
                          className="w-full md:hidden  flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <TvMinimalPlay size={16} />
                          Live Sessions
                        </button>

                        <button
                          onClick={() =>
                            handleNewHeaderNavigation(
                              "/dashboard-student?activeTab=My Courses"
                            )
                          }
                          className="w-full md:hidden flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <Library size={16} />
                          My Courses
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:cursor-pointer"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="h-8 md:h-11 border rounded-[12px] font-semibold text-[#FF660F] hover:cursor-pointer border-[#FF660F] text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white px-3 md:px-4"
                    onClick={() => toggleLogin()}
                  >
                    Login/Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-14 md:h-20 items-center justify-between px-5 lg:px-20">
            <div
              className="Logo flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <SmartImage
                src="/logo.png"
                alt="procounsel_logo"
                className="h-7 w-7 md:w-11 md:h-12 rounded-md"
                width={44}
                height={44}
                priority
              />
              <div className="flex items-center leading-tight pl-[9px]">
                <h1 className="text-[#232323] font-semibold text-sm md:text-xl">
                  ProCounsel
                </h1>
              </div>
            </div>
            {/* 
            <div
              ref={searchBarRef}
              className={`hidden md:block w-full max-w-lg transition-all duration-700 ${
                showHeaderSearch
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-6 scale-95 pointer-events-none"
              }`}
            >
              <GlobalSearchBar showBackdrop={true} />
            </div> */}

            <div className="flex items-center gap-3">
              {/* <button
                className="md:hidden p-2 rounded-full hover:bg-black/5 transition-all shrink-0"
                style={{
                  opacity: showHeaderSearch ? 1 : 0,
                  pointerEvents: showHeaderSearch ? "auto" : "none",
                }}
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="h-5 w-5 text-[#232323]" />
              </button> */}

              <div className="btn">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <User2 className="h-6 w-6 text-gray-700" />
                    </button>

                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 py-1 border border-gray-200"
                      >
                        <button
                          onClick={handleProfileNavigation}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <LayoutDashboard size={16} />
                          Profile
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="h-8 md:h-11 border rounded-[12px] font-semibold text-[#FF660F] border-[#FF660F] text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white px-3 md:px-4"
                    onClick={() => toggleLogin()}
                  >
                    Login/Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-60 bg-white/95 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-black/10">
            <h2 className="text-lg font-semibold">Search</h2>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 rounded-full hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <GlobalSearchBar
              showBackdrop={false}
              autoFocus={true}
              className="text-[#F5F5F7]"
              onClose={() => setMobileSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
