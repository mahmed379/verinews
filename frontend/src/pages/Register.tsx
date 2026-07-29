import { ShieldCheck } from "lucide-react";
import RegisterForm from "../Components/auth/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <div className="glass-card w-full max-w-md p-10">

        <div className="text-center mb-8">

          <div className="flex justify-center mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-600/20">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white">
            Join VeriNews
          </h1>

          <p className="mt-3 text-slate-300">
            Create your account and start verifying news with AI.
          </p>

        </div>

        <RegisterForm />

      </div>

    </div>
  );
}

export default Register;