import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Send,
  User,
  LogOut,
  WalletCards,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Accounts",
      path: "/account",
      icon: CreditCard,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: ArrowLeftRight,
    },
    {
      name: "Transfer",
      path: "/transfer",
      icon: Send,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside style={styles.sidebar}>

      {/* Logo */}

      <div style={styles.logoSection}>
        <div style={styles.logoIcon}>
          <WalletCards size={22} />
        </div>

        <div>
          <h2 style={styles.logo}>BankApp</h2>
          <span style={styles.logoSubtitle}>
            Internet Banking
          </span>
        </div>
      </div>

      {/* Navigation */}

      <div style={styles.menuTitle}>
        MENU
      </div>

      <nav style={styles.nav}>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() =>
                navigate(item.path)
              }
              style={{
                ...styles.navItem,
                ...(active
                  ? styles.activeNav
                  : {}),
              }}
            >
              <Icon size={19} />

              <span>{item.name}</span>
            </button>
          );
        })}

      </nav>
      {/* Admin Navigation */}

{user?.role === "Admin" && (
  <>
    <div style={styles.menuTitle}>
      ADMIN
    </div>

    <nav style={styles.nav}>

      <button
        onClick={() => navigate("/admin")}
        style={{
          ...styles.navItem,
          ...(location.pathname === "/admin"
            ? styles.adminActiveNav
            : {}),
        }}
      >
        <LayoutDashboard size={19} />
        <span>Admin Dashboard</span>
      </button>

      <button
        onClick={() => navigate("/admin/users")}
        style={{
          ...styles.navItem,
          ...(location.pathname === "/admin/users"
            ? styles.adminActiveNav
            : {}),
        }}
      >
        <User size={19} />
        <span>Admin Users</span>
      </button>

      <button
        onClick={() => navigate("/admin/accounts")}
        style={{
          ...styles.navItem,
          ...(location.pathname === "/admin/accounts"
            ? styles.adminActiveNav
            : {}),
        }}
      >
        <CreditCard size={19} />
        <span>Admin Accounts</span>
      </button>

      <button
        onClick={() => navigate("/admin/transactions")}
        style={{
          ...styles.navItem,
          ...(location.pathname === "/admin/transactions"
            ? styles.adminActiveNav
            : {}),
        }}
      >
        <ArrowLeftRight size={19} />
        <span>Admin Transactions</span>
      </button>

    </nav>
  </>
)}

      {/* Bottom */}

      <div style={styles.bottom}>

        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          <LogOut size={19} />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "24px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "5px 8px 30px",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
    fontWeight: "700",
  },

  logoSubtitle: {
    fontSize: "11px",
    color: "#94a3b8",
  },

  menuTitle: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: "0.08em",
    padding: "0 12px 10px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  navItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    border: "none",
    borderRadius: "9px",
    backgroundColor: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
    transition: "0.2s",
  },

  activeNav: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontWeight: "600",
  },
  adminActiveNav: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontWeight: "600",
  },

  bottom: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
  },

  logout: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    border: "none",
    borderRadius: "9px",
    backgroundColor: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
  },
};

export default Sidebar;