import { Link, NavLink, useNavigate } from "react-router-dom";

import { useState } from "react";
import {
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-2 lg:px-4 py-2 text-sm font-medium transition-all duration-300 ${
    isActive
      ?"bg-blue-500/10 text-blue-300 border border-blue-400/20"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:px-6">
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

        <button
          className="
            lg:hidden
            rounded-lg
            border
            border-white/10
            p-2
            text-white
          "
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div
          className={`
            ${
              mobileOpen
                ? "flex"
                : "hidden"
            }
            lg:flex

            absolute
            md:static

            top-16
            left-0
            w-full
            md:w-auto

            flex-col
            md:flex-row

            items-start
            md:items-center

            gap-4
            overflow-x-hidden

            bg-slate-950/95
            md:bg-transparent

            p-6
            md:p-0
          `}
        >
          <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/articles" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            Articles
          </NavLink>

          <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            About
          </NavLink>

          {user && (
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Dashboard
            </NavLink>
          )}

          {user?.is_staff && (
            <NavLink to="/moderation" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Moderation
            </NavLink>
          )}

          {user?.is_superuser && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Admin
            </NavLink>
          )}

          {user ? (
            <div className="flex items-center gap-2 whitespace-nowrap">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className="hidden lg:block">
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
                className="
                rounded-xl
                border
                border-red-500/30
                px-3
                py-2
                text-sm
                font-medium
                text-red-400
                transition
                hover:bg-red-500/10
                whitespace-nowrap
                "
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