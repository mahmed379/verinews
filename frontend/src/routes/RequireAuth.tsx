import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  staffOnly?: boolean;
}

export default function RequireAuth({
  staffOnly = false,
}: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (staffOnly && !user.is_staff) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}