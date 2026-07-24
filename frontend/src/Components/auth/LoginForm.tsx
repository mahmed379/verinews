import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import axios from "axios";

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } 
    catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ??
          "Invalid username or password.";

        setError(message);
      } else {
        setError("Something went wrong.");
      }
    }
     finally {
      setLoading(false);
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <div>
        <label>Username</label>
        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="border p-2 w-full"
          required
        />
      </div>


      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-2 w-full"
          required
        />
      </div>


      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}


      <button
        type="submit"
        disabled={loading}
        className="border px-4 py-2"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </form>
  );
}


export default LoginForm;