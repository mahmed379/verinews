    import { ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
    import { useState } from "react";
    import { Link, useSearchParams } from "react-router-dom";
    import toast from "react-hot-toast";

    import { confirmPasswordReset } from "../api/auth";
    import { getErrorMessage } from "../api/errors";

    function ResetPasswordPage() {
    const [searchParams] = useSearchParams();

    const uid = searchParams.get("uid") ?? "";
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
    }

    if (!uid || !token) {
        toast.error("Invalid password reset link.");
        return;
    }

    setLoading(true);

    try {
        const response = await confirmPasswordReset(
        uid,
        token,
        password
        );

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
            Password Reset Successful
            </h1>

            <p className="mt-4 text-slate-300">
            Your password has been updated successfully.
            </p>

            <Link
            to="/login"
            className="mt-8 inline-block rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-3 font-semibold text-white"
            >
            Go to Login
            </Link>

        </div>
        </div>
    );
    }

    if (!uid || !token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">
            <div className="glass-card w-full max-w-md p-10 text-center">

                <h1 className="text-3xl font-bold text-white">
                Invalid Reset Link
                </h1>

                <p className="mt-4 text-slate-300">
                This password reset link is invalid or incomplete. Please request a new password reset email.
                </p>

                <Link
                to="/forgot-password"
                className="mt-8 inline-block rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-3 font-semibold text-white"
                >
                Request New Link
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
            Reset Password
            </h1>

            <p className="mt-3 text-slate-300">
            Enter your new password below.
            </p>

        </div>

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
                New Password
            </label>

            <div className="relative">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

                <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-12 text-white placeholder:text-slate-400 backdrop-blur-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />

                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
                </button>

            </div>
            </div>

            <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
                Confirm Password
            </label>

            <div className="relative">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

                <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-12 text-white placeholder:text-slate-400 backdrop-blur-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />

                <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
                </button>

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
                Resetting...
                </span>
            ) : (
                "Reset Password"
            )}
            </button>

        </form>

        </div>
    </div>
    );
    }

    export default ResetPasswordPage;

