import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Toaster position="top-right" />

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} VeriNews. Built by Hafiz Muhammad Ahmed.
        </p>
      </footer>
    </div>
  );
}