import { Link } from "react-router-dom";

function Navbar() {
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
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>

          <Link to="/login" className="hover:text-blue-400 transition-colors">
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;