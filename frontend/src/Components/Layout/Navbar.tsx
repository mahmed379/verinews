import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
    isActive
      ?"bg-blue-500/10 text-blue-300 border border-blue-400/20"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 backdrop-blur-md">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              VeriNews
            </h1>

            <p className="text-xs text-slate-400">
              AI News Verification
            </p>
          </div>
        </Link>

        <div className="
          flex
          items-center
          gap-4
          flex-wrap
          justify-end
        ">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/articles" className={navLinkClass}>
            Articles
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          {user && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}

          {user?.is_staff && (
            <NavLink to="/moderation" className={navLinkClass}>
              Moderation
            </NavLink>
          )}

          {user?.is_superuser && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}

          {user ? (
            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">
                  {user.username}
                </p>

                <p className="text-xs text-slate-400">
                  {user.is_superuser
                    ? "Administrator"
                    : user.is_staff
                    ? "Moderator"
                    : "Member"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                Log Out
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Register
              </Link>

            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;