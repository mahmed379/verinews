import LoginForm from "../Components/auth/LoginForm";


function Login() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-5">
        Login
      </h1>

      <LoginForm />
    </div>
  );
}

export default Login;