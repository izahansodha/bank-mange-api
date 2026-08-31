import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!profile) {
    return (
      <div style={styles.loading}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ================= SIDEBAR ================= */}

      <aside style={styles.sidebar}>

        <h2 style={styles.logo}>
          🏦 BankApp
        </h2>

        <nav>

          <button
            style={styles.navItem}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            📊 Dashboard
          </button>

          <button
            style={styles.navItem}
            onClick={() =>
              navigate("/account")
            }
          >
            💳 Accounts
          </button>

          <button
            style={styles.navItem}
            onClick={() =>
              navigate("/transactions")
            }
          >
            💸 Transactions
          </button>

          <button
            style={styles.navItem}
            onClick={() =>
              navigate("/transfer")
            }
          >
            🔄 Transfer
          </button>

          <button
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            👤 Profile
          </button>

        </nav>

        <button
          style={styles.logout}
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main style={styles.main}>

        <div style={styles.header}>
          <div>
            <h1>My Profile</h1>

            <p style={styles.subtitle}>
              View your account information
            </p>
          </div>
        </div>

        {/* ================= PROFILE CARD ================= */}

        <div style={styles.profileCard}>

          <div style={styles.avatar}>
            {profile.fullName
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <h2>
            {profile.fullName || "Customer"}
          </h2>

          <p style={styles.role}>
            {profile.role || "Customer"}
          </p>

        </div>

        {/* ================= INFORMATION ================= */}

        <div style={styles.infoCard}>

          <h2>Personal Information</h2>

          <div style={styles.infoGrid}>

            <div style={styles.infoItem}>
              <small>Full Name</small>

              <p>
                {profile.fullName ||
                  "Not available"}
              </p>
            </div>

            <div style={styles.infoItem}>
              <small>Email Address</small>

              <p>
                {profile.email ||
                  "Not available"}
              </p>
            </div>

            <div style={styles.infoItem}>
              <small>Role</small>

              <p>
                {profile.role ||
                  "Customer"}
              </p>
            </div>

            <div style={styles.infoItem}>
              <small>User ID</small>

              <p style={styles.userId}>
                {profile.userId ||
                  "Not available"}
              </p>
            </div>

          </div>

        </div>

        {/* ================= SECURITY ================= */}

        <div style={styles.securityCard}>

          <h2>Security</h2>

          <div style={styles.securityRow}>

            <div>
              <strong>
                Password
              </strong>

              <p style={styles.muted}>
                Your password is securely
                stored as a hash.
              </p>
            </div>

            <button
              style={styles.securityButton}
              onClick={() =>
                alert(
                  "Password change feature will be added in the next phase."
                )
              }
            >
              Change Password
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "230px",
    backgroundColor: "#111827",
    color: "white",
    padding: "25px 15px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    textAlign: "center",
    marginBottom: "40px",
  },

  navItem: {
    display: "block",
    width: "100%",
    padding: "14px",
    marginBottom: "8px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    color: "white",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
  },

  activeNav: {
    backgroundColor: "#2563eb",
  },

  logout: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "35px",
    overflowX: "auto",
  },

  header: {
    marginBottom: "30px",
  },

  subtitle: {
    color: "#6b7280",
  },

  profileCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "35px",
    textAlign: "center",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.06)",
    marginBottom: "25px",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 15px",
    fontSize: "32px",
    fontWeight: "bold",
  },

  role: {
    color: "#6b7280",
  },

  infoCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.06)",
    marginBottom: "25px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginTop: "25px",
  },

  infoItem: {
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },

  userId: {
    fontSize: "12px",
    wordBreak: "break-all",
  },

  securityCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.06)",
  },

  securityRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  muted: {
    color: "#6b7280",
    fontSize: "14px",
  },

  securityButton: {
    padding: "10px 18px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#2563eb",
    cursor: "pointer",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
};

export default Profile;