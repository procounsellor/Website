import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

/**
 * RoleBasedRoute: Protects routes by checking authentication and user role
 * @param allowedRoles - Array of roles allowed to access this route (e.g., ['counselor'])
 * 
 * Usage:
 * <Route element={<RoleBasedRoute allowedRoles={['counselor']} />}>
 *   <Route path="/protected" element={<ProtectedPage />} />
 * </Route>
 */
const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const { isAuthenticated, role, toggleLogin } = useAuthStore();
  const hasTriggeredLoginModal = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // User not authenticated
    if (!isAuthenticated && !hasTriggeredLoginModal.current) {
      toggleLogin();
      hasTriggeredLoginModal.current = true;
      return;
    }

    // User authenticated but doesn't have required role
    if (isAuthenticated && role && !allowedRoles.includes(role)) {
      console.warn(`Access denied: User role '${role}' not in allowed roles [${allowedRoles.join(', ')}]`);
      navigate('/');
      return;
    }
  }, [isAuthenticated, role, toggleLogin, navigate, allowedRoles]);

  // Still loading or showing login modal
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center w-full" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Loader2 className="w-10 h-10 animate-spin text-blue-800" />
      </div>
    );
  }

  // User has required role
  if (role && allowedRoles.includes(role)) {
    return <><Outlet /></>;
  }

  // Fallback: redirect to home
  return (
    <div className="flex justify-center items-center w-full" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <div className="text-center">
        <p className="text-red-600 font-semibold mb-4">Access Denied</p>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    </div>
  );
};

export default RoleBasedRoute;
