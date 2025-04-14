
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page but save the current location to redirect back after login
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return user ? <>{children}</> : null;
};
