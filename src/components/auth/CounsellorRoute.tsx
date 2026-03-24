import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

/**
 * CounsellorRoute
 *
 * Guards routes that should only be accessible to authenticated counsellors.
 * - Not logged in  → opens login modal, shows spinner
 * - Logged-in student/user → redirects to home
 * - Logged-in counsellor → renders <Outlet />
 */
const CounsellorRoute = () => {
  const { isAuthenticated, role, toggleLogin } = useAuthStore();
  const navigate = useNavigate();
  const hasTriggeredLoginModal = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in: open the login modal (same behaviour as ProtectedRoute)
      if (!hasTriggeredLoginModal.current) {
        toggleLogin();
        hasTriggeredLoginModal.current = true;
      }
      return;
    }

    // Logged in but NOT a counsellor → kick them to home
    if (role !== "counselor") {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, role, navigate, toggleLogin]);

  if (!isAuthenticated) {
    return (
      <div
        className="flex justify-center items-center w-full"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        <Loader2 className="w-10 h-10 animate-spin text-blue-800" />
      </div>
    );
  }

  if (role !== "counselor") {
    // Redirect is in-flight; render nothing to avoid flash
    return null;
  }

  return <Outlet />;
};

export default CounsellorRoute;
