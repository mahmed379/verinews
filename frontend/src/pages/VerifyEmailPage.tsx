import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { verifyEmail } from "../api/auth";
import { getErrorMessage } from "../api/errors";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();

  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function handleVerification() {
      if (!uid || !token) {
        setLoading(false);
        setSuccess(false);
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const response = await verifyEmail(uid, token);

        setSuccess(true);
        setMessage(response.message);

        toast.success(response.message);
      } catch (error) {
        const errorMessage = getErrorMessage(error);

        setSuccess(false);
        setMessage(errorMessage);

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    handleVerification();
  }, [uid, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">
        <div className="glass-card w-full max-w-md p-10 text-center">

          <div className="flex justify-center mb-6">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Verifying Email
          </h1>

          <p className="mt-4 text-slate-300">
            Please wait while we verify your email address...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">
      <div className="glass-card w-full max-w-md p-10 text-center">

        <div className="flex justify-center mb-6">
          {success ? (
            <CheckCircle className="h-16 w-16 text-green-400" />
          ) : (
            <XCircle className="h-16 w-16 text-red-400" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-white">
          {success ? "Email Verified" : "Verification Failed"}
        </h1>

        <p className="mt-4 text-slate-300">
          {message}
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
