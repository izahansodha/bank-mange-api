import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./css/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await login(email, password);

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            error.response.data ||
            "Invalid email or password."
        );
      } else {
        setMessage(
          "Unable to connect to the Bank API."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">

        {/* Logo / Brand */}

        <div className="login-brand">
          <div className="login-logo">
            B
          </div>

          <h1>BankApp</h1>

          <p>Internet Banking</p>
        </div>

        {/* Heading */}

        <div className="login-heading">
          <h2>Welcome back</h2>

          <p>
            Login to access your account
          </p>
        </div>

        {/* Form */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* Message */}

        {message && (
          <div
            className={
              message === "Login successful!"
                ? "login-message success"
                : "login-message error"
            }
          >
            {message}
          </div>
        )}

        {/* Register */}

        <div className="register-link">
          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </div>

      </section>
    </main>
  );
}

export default Login;

