import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  async function handleLogout() {
    await logout();

    toast.success("Logged out successfully.");

    navigate("/login");
    }


  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-400 hover:text-blue-300"
        >
          VeriNews
        </Link>


        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="hover:text-blue-400 transition-colors"
          >
            Home
          </Link>


          {user ? (
            <>
              <span className="text-sm text-slate-300">
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;