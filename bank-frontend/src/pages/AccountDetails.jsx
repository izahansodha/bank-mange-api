import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccount } from "../api/accountApi";

function AccountDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccount();
  }, [id]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAccount(id);

      setAccount(data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load account details."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount || 0));
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.loading}>Loading account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <button
            style={styles.backButton}
            onClick={() => navigate("/account")}
          >
            ← Back to Accounts
          </button>

          <div style={styles.error}>
            {error}
          </div>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/account")}
          >
            Go to Accounts
          </button>
        </div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}

        <button
          style={styles.backButton}
          onClick={() => navigate("/account")}
        >
          ← Back to Accounts
        </button>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Account Details
            </h1>

            <p style={styles.subtitle}>
              View your account information
            </p>
          </div>

          <span
            style={
              account.status === "Active"
                ? styles.activeStatus
                : styles.closedStatus
            }
          >
            {account.status}
          </span>
        </div>

        {/* Balance Card */}

        <div style={styles.balanceCard}>
          <div>
            <p style={styles.balanceLabel}>
              Available Balance
            </p>

            <h2 style={styles.balance}>
              {formatMoney(account.balance)}
            </h2>
          </div>

          <div style={styles.balanceIcon}>
            ₹
          </div>
        </div>

        {/* Account Information */}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Account Information
          </h2>

          <div style={styles.infoGrid}>

            <div style={styles.infoItem}>
              <span style={styles.label}>
                Account Number
              </span>

              <strong style={styles.value}>
                {account.accountNumber}
              </strong>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>
                Account Type
              </span>

              <strong style={styles.value}>
                {account.accountType}
              </strong>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>
                Status
              </span>

              <strong style={styles.value}>
                {account.status}
              </strong>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>
                Account ID
              </span>

              <strong style={styles.value}>
                #{account.id}
              </strong>
            </div>

            {account.createdAt && (
              <div style={styles.infoItem}>
                <span style={styles.label}>
                  Created On
                </span>

                <strong style={styles.value}>
                  {new Date(
                    account.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </div>
            )}

          </div>
        </div>

        {/* Actions */}

        {account.status === "Active" && (
          <div style={styles.actions}>

            <button
              style={styles.primaryButton}
              onClick={() =>
                navigate("/transfer")
              }
            >
              Transfer Money
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() =>
                navigate("/transactions")
              }
            >
              View Transactions
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "35px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  backButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    marginBottom: "25px",
    fontSize: "14px",
    fontWeight: "600",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  activeStatus: {
    padding: "7px 14px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "600",
  },

  closedStatus: {
    padding: "7px 14px",
    borderRadius: "20px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    fontSize: "13px",
    fontWeight: "600",
  },

  balanceCard: {
    backgroundColor: "#1e3a8a",
    color: "white",
    borderRadius: "14px",
    padding: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    marginBottom: "25px",
  },

  balanceLabel: {
    margin: 0,
    fontSize: "14px",
    opacity: 0.8,
  },

  balance: {
    margin: "8px 0 0",
    fontSize: "32px",
  },

  balanceIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  section: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "25px",
  },

  sectionTitle: {
    margin: "0 0 25px",
    fontSize: "19px",
    color: "#111827",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "22px",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  value: {
    fontSize: "15px",
    color: "#1f2937",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 18px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  secondaryButton: {
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "11px 18px",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  loading: {
    textAlign: "center",
    color: "#6b7280",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  card: {
    maxWidth: "500px",
    margin: "100px auto",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "30px",
    boxSizing: "border-box",
  },
};

export default AccountDetails;