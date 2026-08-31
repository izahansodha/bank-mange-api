import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Eye,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";

import Layout from "../Components/Layout";

import {
  getMyAccounts,
  createAccount,
  closeAccount,
} from "../api/accountApi";
import { useNavigate } from "react-router-dom";

function Accounts() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showOpenModal, setShowOpenModal] = useState(false);
  const [accountType, setAccountType] =
    useState("Savings");

  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ACCOUNTS
  // =====================================================

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyAccounts();

      setAccounts(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount || 0));
  };

  // =====================================================
  // TOTAL BALANCE
  // =====================================================

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  );

  const activeAccounts = accounts.filter(
    (account) => account.status === "Active"
  );

  // =====================================================
  // OPEN ACCOUNT
  // =====================================================

  const handleCreateAccount = async () => {
    try {
      setCreating(true);
      setMessage("");
      setError("");

      await createAccount({
        accountType,
      });

      setMessage(
        "Account opened successfully."
      );

      setShowOpenModal(false);

      await loadAccounts();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to open account."
      );
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // CLOSE ACCOUNT
  // =====================================================

  const handleCloseAccount = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this account?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await closeAccount(id);

      setMessage(
        "Account closed successfully."
      );

      await loadAccounts();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to close account."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading your accounts...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div style={styles.pageHeader}>

        <div>
          <p style={styles.eyebrow}>
            BANKING
          </p>

          <h1 style={styles.title}>
            My Accounts
          </h1>

          <p style={styles.subtitle}>
            Manage your savings and current
            accounts.
          </p>
        </div>

        <button
          style={styles.primaryButton}
          onClick={() =>
            setShowOpenModal(true)
          }
        >
          <Plus size={17} />
          Open Account
        </button>

      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {message && (
        <div style={styles.successMessage}>
          <CheckCircle size={18} />
          {message}
        </div>
      )}

      {error && (
        <div style={styles.errorMessage}>
          <XCircle size={18} />
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div style={styles.summaryGrid}>

        <div style={styles.summaryCard}>

          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#eff6ff",
              color: "#2563eb",
            }}
          >
            <CreditCard size={21} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Balance
            </span>

            <strong style={styles.summaryValue}>
              {formatMoney(totalBalance)}
            </strong>
          </div>

        </div>

        <div style={styles.summaryCard}>

          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
            }}
          >
            <CheckCircle size={21} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Active Accounts
            </span>

            <strong style={styles.summaryValue}>
              {activeAccounts.length}
            </strong>
          </div>

        </div>

        <div style={styles.summaryCard}>

          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#f8fafc",
              color: "#64748b",
            }}
          >
            <CreditCard size={21} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Accounts
            </span>

            <strong style={styles.summaryValue}>
              {accounts.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          ACCOUNT LIST
      ================================================= */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              Your Accounts
            </h2>

            <p style={styles.sectionSubtitle}>
              All your bank accounts in one place
            </p>
          </div>

        </div>

        {accounts.length === 0 ? (

          <div style={styles.emptyCard}>

            <div style={styles.emptyIcon}>
              <CreditCard size={28} />
            </div>

            <h3>
              No bank accounts
            </h3>

            <p>
              You don't have any accounts yet.
              Open your first account to get
              started.
            </p>

            <button
              style={styles.primaryButton}
              onClick={() =>
                setShowOpenModal(true)
              }
            >
              <Plus size={17} />
              Open Account
            </button>

          </div>

        ) : (

          <div style={styles.accountGrid}>

            {accounts.map((account) => (

              <div
                key={account.id}
                style={styles.accountCard}
              >

                {/* ACCOUNT HEADER */}

                <div style={styles.accountHeader}>

                  <div>

                    <span
                      style={
                        styles.accountLabel
                      }
                    >
                      {account.accountType}
                    </span>

                    <p
                      style={
                        styles.accountNumber
                      }
                    >
                      ••••{" "}
                      {account.accountNumber?.slice(
                        -4
                      )}
                    </p>

                  </div>

                  <div style={styles.cardIcon}>
                    <CreditCard
                      size={23}
                    />
                  </div>

                </div>

                {/* BALANCE */}

                <div style={styles.balanceSection}>

                  <span
                    style={
                      styles.balanceLabel
                    }
                  >
                    Available Balance
                  </span>

                  <strong
                    style={
                      styles.balanceValue
                    }
                  >
                    {formatMoney(
                      account.balance
                    )}
                  </strong>

                </div>

                {/* DETAILS */}

                <div style={styles.details}>

                  <div>
                    <span
                      style={styles.detailLabel}
                    >
                      Status
                    </span>

                    <span
                      style={
                        account.status ===
                        "Active"
                          ? styles.activeBadge
                          : styles.closedBadge
                      }
                    >
                      {account.status}
                    </span>
                  </div>

                  <div>
                    <span
                      style={styles.detailLabel}
                    >
                      Opened
                    </span>

                    <span
                      style={
                        styles.detailValue
                      }
                    >
                      {account.createdAt
                        ? new Date(
                            account.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </span>
                  </div>

                </div>

                {/* ACTIONS */}

                <div style={styles.actions}>

                  <button
                    style={styles.detailsButton}
                    onClick={() =>
                      navigate(
                        `/account/${account.id}`
                      )
                    }
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  {account.status ===
                    "Active" && (
                    <button
                      style={
                        styles.closeButton
                      }
                      onClick={() =>
                        handleCloseAccount(
                          account.id
                        )
                      }
                    >
                      <X size={16} />
                      Close
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* =================================================
          OPEN ACCOUNT MODAL
      ================================================= */}

      {showOpenModal && (

        <div
          style={styles.modalOverlay}
          onClick={() =>
            setShowOpenModal(false)
          }
        >

          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div style={styles.modalHeader}>

              <div>
                <h2>
                  Open New Account
                </h2>

                <p>
                  Choose the type of account
                  you want to open.
                </p>
              </div>

              <button
                style={styles.closeModal}
                onClick={() =>
                  setShowOpenModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div style={styles.accountOptions}>

              <button
                style={{
                  ...styles.accountOption,
                  ...(accountType ===
                  "Savings"
                    ? styles.selectedOption
                    : {}),
                }}
                onClick={() =>
                  setAccountType("Savings")
                }
              >

                <CreditCard size={22} />

                <div>
                  <strong>
                    Savings Account
                  </strong>

                  <span>
                    For personal savings
                  </span>
                </div>

              </button>

              <button
                style={{
                  ...styles.accountOption,
                  ...(accountType ===
                  "Current"
                    ? styles.selectedOption
                    : {}),
                }}
                onClick={() =>
                  setAccountType("Current")
                }
              >

                <CreditCard size={22} />

                <div>
                  <strong>
                    Current Account
                  </strong>

                  <span>
                    For regular transactions
                  </span>
                </div>

              </button>

            </div>

            <div style={styles.modalActions}>

              <button
                style={styles.cancelButton}
                onClick={() =>
                  setShowOpenModal(false)
                }
              >
                Cancel
              </button>

              <button
                style={styles.primaryButton}
                disabled={creating}
                onClick={
                  handleCreateAccount
                }
              >
                <Plus size={17} />

                {creating
                  ? "Opening..."
                  : "Open Account"}
              </button>

            </div>

          </div>

        </div>

      )}

    </Layout>
  );
}

const styles = {

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "28px",
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
    fontSize: "28px",
    color: "#0f172a",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 17px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 15px",
    marginBottom: "18px",
    borderRadius: "8px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: "13px",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 15px",
    marginBottom: "18px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "13px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  },

  summaryIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "5px",
  },

  summaryValue: {
    display: "block",
    color: "#0f172a",
    fontSize: "21px",
  },

  section: {
    marginTop: "35px",
  },

  sectionHeader: {
    marginBottom: "16px",
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

  accountGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },

  accountCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
  },

  accountHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  accountLabel: {
    color: "#64748b",
    fontSize: "13px",
  },

  accountNumber: {
    margin: "5px 0 0",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.04em",
  },

  cardIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  balanceSection: {
    marginTop: "28px",
  },

  balanceLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
    marginBottom: "6px",
  },

  balanceValue: {
    color: "#0f172a",
    fontSize: "24px",
  },

  details: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #f1f5f9",
    marginTop: "22px",
    paddingTop: "17px",
  },

  details: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    borderTop: "1px solid #f1f5f9",
    marginTop: "22px",
    paddingTop: "17px",
  },

  detailLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
    marginBottom: "6px",
  },

  detailValue: {
    color: "#475569",
    fontSize: "12px",
  },

  activeBadge: {
    display: "inline-block",
    color: "#15803d",
    backgroundColor: "#f0fdf4",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },

  closedBadge: {
    display: "inline-block",
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "20px",
  },

  detailsButton: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    padding: "9px",
    border: "1px solid #dbeafe",
    borderRadius: "7px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  closeButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    padding: "9px 13px",
    border: "1px solid #fecaca",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "12px",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "50px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 15px",
    borderRadius: "12px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor:
      "rgba(15,23,42,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    boxSizing: "border-box",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.15)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "25px",
  },

  closeModal: {
    width: "35px",
    height: "35px",
    flexShrink: 0,
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  accountOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  accountOption: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "100%",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#64748b",
    cursor: "pointer",
    textAlign: "left",
  },

  selectedOption: {
    border: "1px solid #2563eb",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "25px",
  },

  cancelButton: {
    padding: "11px 17px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "13px",
  },

  loading: {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#64748b",
  },

  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    marginBottom: "12px",
  },
};

export default Accounts;