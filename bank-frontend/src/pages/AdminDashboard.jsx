import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  ShieldCheck,
  CreditCard,
  ReceiptText,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

import Layout from "../Components/Layout";
import { getAdminSummary } from "../api/adminApi";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ADMIN SUMMARY
  // =====================================================

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminSummary();

      setSummary(data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access the admin dashboard."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK ADMIN + LOAD
  // =====================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "Admin") {
      navigate("/dashboard");
      return;
    }

    loadSummary();
  }, [user]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>

          <p>
            Loading admin dashboard...
          </p>
        </div>
      </Layout>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Layout>
        <div style={styles.errorPage}>

          <div style={styles.errorIcon}>
            <ShieldAlert size={28} />
          </div>

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            style={styles.primaryButton}
            onClick={loadSummary}
          >
            <RefreshCw size={16} />
            Try Again
          </button>

        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.pageHeader}>

        <div>
          <p style={styles.eyebrow}>
            ADMINISTRATION
          </p>

          <h1 style={styles.title}>
            Admin Dashboard
          </h1>

          <p style={styles.subtitle}>
            Monitor your banking system from one
            place.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={loadSummary}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* =================================================
          WELCOME CARD
      ================================================= */}

      <div style={styles.welcomeCard}>

        <div>

          <span style={styles.welcomeLabel}>
            Welcome back
          </span>

          <h2 style={styles.welcomeTitle}>
            {user?.fullName || "Administrator"}
          </h2>

          <p style={styles.welcomeText}>
            You are signed in as an administrator.
            Here is the current overview of the
            banking system.
          </p>

        </div>

        <div style={styles.adminIcon}>
          <ShieldCheck size={35} />
        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              System Overview
            </h2>

            <p style={styles.sectionSubtitle}>
              Current statistics from the database
            </p>
          </div>

        </div>

        <div style={styles.statsGrid}>

          {/* USERS */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <Users size={21} />
            </div>

            <div style={styles.statContent}>

              <span style={styles.statLabel}>
                Total Users
              </span>

              <strong style={styles.statValue}>
                {summary?.totalUsers || 0}
              </strong>

              <span style={styles.statDescription}>
                Registered users
              </span>

            </div>

          </div>

          {/* CUSTOMERS */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
              }}
            >
              <UserCheck size={21} />
            </div>

            <div style={styles.statContent}>

              <span style={styles.statLabel}>
                Customers
              </span>

              <strong style={styles.statValue}>
                {summary?.totalCustomers || 0}
              </strong>

              <span style={styles.statDescription}>
                Customer accounts
              </span>

            </div>

          </div>

          {/* ADMINS */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#fffbeb",
                color: "#d97706",
              }}
            >
              <ShieldCheck size={21} />
            </div>

            <div style={styles.statContent}>

              <span style={styles.statLabel}>
                Administrators
              </span>

              <strong style={styles.statValue}>
                {summary?.totalAdmins || 0}
              </strong>

              <span style={styles.statDescription}>
                System administrators
              </span>

            </div>

          </div>

          {/* ACCOUNTS */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#f5f3ff",
                color: "#7c3aed",
              }}
            >
              <CreditCard size={21} />
            </div>

            <div style={styles.statContent}>

              <span style={styles.statLabel}>
                Bank Accounts
              </span>

              <strong style={styles.statValue}>
                {summary?.totalAccounts || 0}
              </strong>

              <span style={styles.statDescription}>
                Created accounts
              </span>

            </div>

          </div>

          {/* TRANSACTIONS */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#fff7ed",
                color: "#ea580c",
              }}
            >
              <ReceiptText size={21} />
            </div>

            <div style={styles.statContent}>

              <span style={styles.statLabel}>
                Transactions
              </span>

              <strong style={styles.statValue}>
                {summary?.totalTransactions || 0}
              </strong>

              <span style={styles.statDescription}>
                Recorded transactions
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          ADMIN QUICK ACTIONS
      ================================================= */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              Administration
            </h2>

            <p style={styles.sectionSubtitle}>
              Quickly access management tools
            </p>
          </div>

        </div>

        <div style={styles.actionsGrid}>

          {/* USERS */}

          <button
            style={styles.actionCard}
            onClick={() =>
              navigate("/admin/users")
            }
          >

            <div
              style={{
                ...styles.actionIcon,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <Users size={21} />
            </div>

            <div style={styles.actionContent}>

              <strong>
                Manage Users
              </strong>

              <span>
                View registered customers and
                administrators.
              </span>

            </div>

            <ArrowRight
              size={18}
              color="#94a3b8"
            />

          </button>

          {/* ACCOUNTS */}

          <button
            style={styles.actionCard}
            onClick={() =>
              navigate("/admin/accounts")
            }
          >

            <div
              style={{
                ...styles.actionIcon,
                backgroundColor: "#f5f3ff",
                color: "#7c3aed",
              }}
            >
              <CreditCard size={21} />
            </div>

            <div style={styles.actionContent}>

              <strong>
                Manage Accounts
              </strong>

              <span>
                Review and manage bank accounts.
              </span>

            </div>

            <ArrowRight
              size={18}
              color="#94a3b8"
            />

          </button>

          {/* TRANSACTIONS */}

          <button
            style={styles.actionCard}
            onClick={() =>
              navigate(
                "/admin/transactions"
              )
            }
          >

            <div
              style={{
                ...styles.actionIcon,
                backgroundColor: "#fff7ed",
                color: "#ea580c",
              }}
            >
              <ReceiptText size={21} />
            </div>

            <div style={styles.actionContent}>

              <strong>
                Transactions
              </strong>

              <span>
                Review system-wide transaction
                activity.
              </span>

            </div>

            <ArrowRight
              size={18}
              color="#94a3b8"
            />

          </button>

        </div>

      </section>

      {/* =================================================
          ADMIN INFORMATION
      ================================================= */}

      <div style={styles.infoCard}>

        <div>

          <span style={styles.infoLabel}>
            Administrator
          </span>

          <strong>
            {user?.fullName ||
              "Administrator"}
          </strong>

        </div>

        <div>

          <span style={styles.infoLabel}>
            Email
          </span>

          <strong>
            {user?.email ||
              "Not available"}
          </strong>

        </div>

        <div>

          <span style={styles.infoLabel}>
            Role
          </span>

          <span style={styles.adminBadge}>
            <ShieldCheck size={13} />
            Admin
          </span>

        </div>

        <div>

          <span style={styles.infoLabel}>
            System Status
          </span>

          <span style={styles.onlineBadge}>
            ● Operational
          </span>

        </div>

      </div>

    </Layout>
  );
}

const styles = {
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "25px",
  },

  eyebrow: {
    margin: "0 0 7px",
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.1em",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "28px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 15px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  welcomeCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    padding: "25px",
    borderRadius: "13px",
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
    marginBottom: "35px",
  },

  welcomeLabel: {
    fontSize: "11px",
    opacity: 0.75,
  },

  welcomeTitle: {
    margin: "5px 0 7px",
    fontSize: "22px",
  },

  welcomeText: {
    margin: 0,
    maxWidth: "600px",
    fontSize: "12px",
    lineHeight: "1.6",
    opacity: 0.85,
  },

  adminIcon: {
    width: "70px",
    height: "70px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    backgroundColor:
      "rgba(255,255,255,0.12)",
  },

  section: {
    marginTop: "30px",
  },

  sectionHeader: {
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "15px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "19px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
  },

  statIcon: {
    width: "43px",
    height: "43px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },

  statContent: {
    minWidth: 0,
  },

  statLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "4px",
  },

  statValue: {
    display: "block",
    color: "#0f172a",
    fontSize: "21px",
  },

  statDescription: {
    display: "block",
    marginTop: "3px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    width: "100%",
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
  },

  actionIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
  },

  actionContent: {
    flex: 1,
  },

  actionContentStrong: {
    display: "block",
  },

  actionContentSpan: {
    display: "block",
  },

  infoCard: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
  },

  infoLabel: {
    display: "block",
    marginBottom: "5px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  adminBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "20px",
    backgroundColor: "#fffbeb",
    color: "#b45309",
    fontSize: "10px",
    fontWeight: "700",
  },

  onlineBadge: {
    color: "#15803d",
    fontSize: "11px",
    fontWeight: "600",
  },

  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  loading: {
    minHeight: "450px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },

  spinner: {
    width: "30px",
    height: "30px",
    marginBottom: "12px",
    border: "3px solid #e2e8f0",
    borderTop:
      "3px solid #2563eb",
    borderRadius: "50%",
  },

  errorPage: {
    minHeight: "450px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#64748b",
  },

  errorIcon: {
    width: "55px",
    height: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
    borderRadius: "12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },
};

export default AdminDashboard;