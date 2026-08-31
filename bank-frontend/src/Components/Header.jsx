import {
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

function Header() {
  const { user } = useAuth();

  const firstLetter =
    user?.fullName?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <header style={styles.header}>

      <div>
        <span style={styles.secure}>
          SECURE BANKING
        </span>
      </div>

      <div style={styles.right}>

        <button style={styles.notification}>
          <Bell size={20} />
          <span style={styles.dot}></span>
        </button>

        <div style={styles.user}>

          <div style={styles.avatar}>
            {firstLetter}
          </div>

          <div style={styles.userInfo}>
            <strong>
              {user?.fullName || "Customer"}
            </strong>

            <span>
              {user?.role || "Customer"}
            </span>
          </div>

          <ChevronDown
            size={17}
            color="#64748b"
          />

        </div>

      </div>

    </header>
  );
}

const styles = {
  header: {
    height: "72px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    boxSizing: "border-box",
  },

  secure: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#94a3b8",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  notification: {
    position: "relative",
    border: "none",
    backgroundColor: "transparent",
    color: "#64748b",
    cursor: "pointer",
    padding: "5px",
  },

  dot: {
    position: "absolute",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    top: "3px",
    right: "3px",
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "100px",
  },

  userInfoStrong: {
    fontSize: "13px",
  },

  userInfoSpan: {
    fontSize: "11px",
  },
};

export default Header;