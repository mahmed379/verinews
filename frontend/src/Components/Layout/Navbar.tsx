import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-primary" : "text-slate-600 hover:text-primary"
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
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          to="/"
          className="text-lg font-bold text-primary"
        >
          VeriNews
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/articles" className={navLinkClass}>
            Articles
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

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
              <span className="text-sm font-medium text-slate-600">
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-red-600"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-primary"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
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