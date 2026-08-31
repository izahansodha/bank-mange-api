import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await login(email, password);

      console.log("Login successful:", data);

      setMessage("Login successful!");

      // Temporary:
      // We'll add proper navigation after routing is configured.
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
          error.response.data ||
          "Invalid email or password"
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Bank Management
        </h1>

        <p style={styles.subtitle}>
          Login to your account
        </p>

        <form onSubmit={handleLogin}>

          <div style={styles.inputGroup}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {message && (
          <p style={styles.message}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },

  card: {
    width: "380px",
    padding: "35px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "5px",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "25px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  message: {
    marginTop: "20px",
    textAlign: "center",
  },
};

export default Login;