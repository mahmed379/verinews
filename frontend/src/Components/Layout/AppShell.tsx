import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

      <Toaster position="top-right" />

      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-10">

            <Outlet />

          </div>

        </div>
      </main>


      <footer className="border-t border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-center md:flex-row">

          <div>

            <h3 className="text-xl font-bold tracking-tight text-white">
              Veri<span className="text-emerald-400">News</span>
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              AI-powered News Verification Platform
            </p>

          </div>


          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Built by Hafiz Muhammad Ahmed
          </div>

        </div>

      </footer>

    </div>
  );
}