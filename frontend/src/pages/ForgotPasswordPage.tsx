import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { requestPasswordReset } from "../api/auth";
import { getErrorMessage } from "../api/errors";
import { ShieldCheck, Mail } from "lucide-react";

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await requestPasswordReset(email);

            toast.success(response.message);

            setSuccess(true);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
        }
    
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">
            <div className="glass-card w-full max-w-md p-10 text-center">

                <h1 className="text-3xl font-bold text-white">
                Check Your Email
                </h1>

                <p className="mt-4 text-slate-300">
                If an account with that email exists, we've sent you a password reset link.
                </p>

                <Link
                to="/login"
                className="mt-8 inline-block rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-3 font-semibold text-white"
                >
                Back to Login
                </Link>

            </div>
            </div>
        );
        }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">
      <div className="glass-card w-full max-w-md p-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-400/30">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Forgot Password
          </h1>

          <p className="mt-3 text-slate-300">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder:text-slate-400 backdrop-blur-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Sending...
                </span>
            ) : (
                "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}