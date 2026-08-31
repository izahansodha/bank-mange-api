import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

function Register() {
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
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          Create Account
        </h1>

        <p style={styles.subtitle}>
          Register for Bank Management
        </p>

        <form onSubmit={handleRegister}>

          <div style={styles.inputGroup}>
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
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
    textAlign: "center",
    marginTop: "20px",
  },
};

export default Register;