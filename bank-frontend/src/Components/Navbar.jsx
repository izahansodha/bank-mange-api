import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Send,
  Bot,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/account",
      label: "Accounts",
      icon: CreditCard,
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: ArrowLeftRight,
    },
    {
      path: "/transfer",
      label: "Transfer",
      icon: Send,
    },
    {
      path: "/ai-assistant",
      label: "AI Assistant",
      icon: Bot,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <nav style={styles.navbar}>

      <div style={styles.container}>

        {/* ================================
            LOGO
        ================================= */}

        <Link
          to="/dashboard"
          style={styles.logo}
          onClick={closeMobile}
        >
          <div style={styles.logoIcon}>
            🏦
          </div>

          <div>
            <strong style={styles.logoTitle}>
              BankApp
            </strong>

            <span style={styles.logoSubtitle}>
              Banking Management
            </span>
          </div>
        </Link>

        {/* ================================
            DESKTOP NAVIGATION
        ================================= */}

        <div style={styles.desktopLinks}>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(isActive(item.path)
                    ? styles.activeLink
                    : {}),
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          {/* Admin */}

          {user?.role === "Admin" && (
            <Link
              to="/admin"
              style={{
                ...styles.link,
                color: "#b45309",
                ...(isActive("/admin")
                  ? styles.adminActive
                  : {}),
              }}
            >
              <ShieldCheck size={16} />
              Admin
            </Link>
          )}
          {user?.role === "Admin" && (
  <>
    <Link to="/admin" style={styles.adminLink}>
      Admin Dashboard
    </Link>

    <Link
      to="/admin/users"
      style={styles.adminLink}
    >
      Admin Users
    </Link>

    <Link
      to="/admin/accounts"
      style={styles.adminLink}
    >
      Admin Accounts
    </Link>

    <Link
      to="/admin/transactions"
      style={styles.adminLink}
    >
      Admin Transactions
    </Link>
  </>
)}

        </div>

        {/* ================================
            USER AREA
        ================================= */}

        <div style={styles.userArea}>

          {user && (
            <div style={styles.userInfo}>

              <div style={styles.avatar}>
                {user.fullName
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div style={styles.userText}>

                <strong>
                  {user.fullName ||
                    "Customer"}
                </strong>

                <span>
                  {user.role ||
                    "Customer"}
                </span>

              </div>

            </div>
          )}

          <button
            onClick={handleLogout}
            style={styles.logout}
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

        {/* ================================
            MOBILE BUTTON
        ================================= */}

        <button
          style={styles.mobileButton}
          onClick={() =>
            setMobileOpen(!mobileOpen)
          }
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>

      {/* ================================
          MOBILE MENU
      ================================= */}

      {mobileOpen && (

        <div style={styles.mobileMenu}>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                style={{
                  ...styles.mobileLink,
                  ...(isActive(item.path)
                    ? styles.mobileActive
                    : {}),
                }}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}

          {user?.role === "Admin" && (
            <Link
              to="/admin"
              onClick={closeMobile}
              style={styles.mobileAdmin}
            >
              <ShieldCheck size={17} />
              Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            style={styles.mobileLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      )}

    </nav>
  );
}

const styles = {

  navbar: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderBottom:
      "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "70px",
    padding: "0 30px",
    display: "flex",
    alignItems: "center",
    gap: "25px",
    boxSizing: "border-box",
  },

  /* LOGO */

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#0f172a",
    minWidth: "180px",
  },

  logoIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    borderRadius: "9px",
    fontSize: "19px",
  },

  logoTitle: {
    display: "block",
    fontSize: "15px",
    lineHeight: "18px",
  },

  logoSubtitle: {
    display: "block",
    color: "#94a3b8",
    fontSize: "9px",
    marginTop: "2px",
  },

  /* DESKTOP LINKS */

  desktopLinks: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 11px",
    borderRadius: "7px",
    color: "#64748b",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  activeLink: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },

  adminActive: {
    backgroundColor: "#fffbeb",
  },

  /* USER */

  userArea: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
  },

  userText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  userTextStrong: {
    fontSize: "11px",
  },

  logout: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 11px",
    border: "1px solid #fecaca",
    borderRadius: "7px",
    backgroundColor: "#fff",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "600",
  },

  /* MOBILE */

  mobileButton: {
    display: "none",
    marginLeft: "auto",
    width: "38px",
    height: "38px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#475569",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  mobileMenu: {
    padding: "10px 20px 20px",
    borderTop: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
  },

  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    marginBottom: "4px",
    borderRadius: "7px",
    color: "#475569",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },

  mobileActive: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },

  mobileAdmin: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    color: "#b45309",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },

  mobileLogout: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    marginTop: "8px",
    padding: "11px",
    border: "1px solid #fecaca",
    borderRadius: "7px",
    backgroundColor: "#fff",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

};

export default Navbar;