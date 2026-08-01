import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  staffOnly?: boolean;
  superuserOnly?: boolean;
}

export default function RequireAuth({
  staffOnly = false,
  superuserOnly = false,
}: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-500 border-t-blue-500" />
      </div>
    );
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

  if (superuserOnly && !user.is_superuser) {
    return (
      <Navigate
        to="/"
        replace
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
