import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Outlet } from "react-router-dom";



const ProtectedRoute = () => {
  const { isAuthenticated, toggleLogin } = useAuthStore();
  const hasTriggeredLoginModal = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasTriggeredLoginModal.current) {
      toggleLogin();
      hasTriggeredLoginModal.current = true;
    }
  }, [isAuthenticated, toggleLogin]);

  if (isAuthenticated) {
    return <><Outlet/></>;
  }

  return (
    <div className="flex justify-center items-center w-full" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <Loader2 className="w-10 h-10 animate-spin text-blue-800" />
    </div>
  );
};

export default ProtectedRoute;