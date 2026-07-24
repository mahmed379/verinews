import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

import { getErrorMessage } from "../../api/errors";

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        username,
        email,
        password,
        password2,
      });

      toast.success("Account created successfully.");

    navigate("/");
    } 
    catch (error) {
      const message = getErrorMessage(error);
      setError(message);
      toast.error(message);
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
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
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


      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={password2}
          onChange={(e) =>
            setPassword2(e.target.value)
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
        {loading ? "Creating..." : "Register"}
      </button>

    </form>
  );
}


export default RegisterForm;