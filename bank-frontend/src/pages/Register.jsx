import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./css/Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await register(
        form.fullName,
        form.email,
        form.password
      );

      setMessage(
        "Registration successful! You can now login."
      );

      setForm({
        fullName: "",
        email: "",
        password: "",
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            error.response.data ||
            "Registration failed."
        );
      } else {
        setMessage(
          "Unable to connect to Bank API."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">

        {/* Brand */}

        <div className="register-brand">
          <div className="register-logo">
            B
          </div>

          <h1>BankApp</h1>

          <p>Internet Banking</p>
        </div>

        {/* Heading */}

        <div className="register-heading">
          <h2>Create your account</h2>

          <p>
            Register to access your banking account
          </p>
        </div>

        {/* Form */}

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <div className="form-group">
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Message */}

        {message && (
          <div
            className={
              message.startsWith("Registration successful")
                ? "register-message success"
                : "register-message error"
            }
          >
            {message}
          </div>
        )}

        {/* Login */}

        <div className="login-link">
          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

      </section>
    </main>
  );
}

export default Register;