import { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";

import Layout from "../Components/Layout";
import { getMyAccounts } from "../api/accountApi";
import { getTransactions } from "../api/transactionApi";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [accountsData, transactionsData] =
        await Promise.all([
          getMyAccounts(),
          getTransactions(),
        ]);

      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load dashboard."
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  );

  const activeAccounts = accounts.filter(
    (account) => account.status === "Active"
  );

  const totalDeposits = transactions
    .filter(
      (transaction) =>
        transaction.type === "Deposit" ||
        transaction.type === "TransferReceived"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const totalWithdrawals = transactions
    .filter(
      (transaction) =>
        transaction.type === "Withdrawal" ||
        transaction.type === "TransferSent"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  const getTransactionType = (transaction) => {
    if (
      transaction.type === "Deposit" ||
      transaction.type === "TransferReceived"
    ) {
      return "Credit";
    }

    return "Debit";
  };

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* PAGE HEADER */}

      <div style={styles.pageHeader}>
        <div>
          <p style={styles.eyebrow}>
            OVERVIEW
          </p>

          <h1 style={styles.title}>
            Good morning,{" "}
            {user?.fullName?.split(" ")[0] ||
              "Customer"}
          </h1>

          <p style={styles.subtitle}>
            Here's what's happening with your
            accounts.
          </p>
        </div>

        <button
          style={styles.primaryButton}
          onClick={() => navigate("/transfer")}
        >
          <ArrowDownToLine size={17} />
          Transfer Money
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* STAT CARDS */}

      <section style={styles.statsGrid}>

        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div>
              <span style={styles.statLabel}>
                Total Balance
              </span>

              <h2 style={styles.statValue}>
                {formatMoney(totalBalance)}
              </h2>
            </div>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <Wallet size={21} />
            </div>
          </div>

          <span style={styles.statFooter}>
            Across all accounts
          </span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div>
              <span style={styles.statLabel}>
                Active Accounts
              </span>

              <h2 style={styles.statValue}>
                {activeAccounts.length}
              </h2>
            </div>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
              }}
            >
              <CreditCard size={21} />
            </div>
          </div>

          <span style={styles.statFooter}>
            {accounts.length} total accounts
          </span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div>
              <span style={styles.statLabel}>
                Total Deposits
              </span>

              <h2
                style={{
                  ...styles.statValue,
                  color: "#16a34a",
                }}
              >
                {formatMoney(totalDeposits)}
              </h2>
            </div>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
              }}
            >
              <ArrowDownToLine size={21} />
            </div>
          </div>

          <span style={styles.statFooter}>
            Credit transactions
          </span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div>
              <span style={styles.statLabel}>
                Total Withdrawals
              </span>

              <h2
                style={{
                  ...styles.statValue,
                  color: "#dc2626",
                }}
              >
                {formatMoney(totalWithdrawals)}
              </h2>
            </div>

            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#fef2f2",
                color: "#dc2626",
              }}
            >
              <ArrowUpFromLine size={21} />
            </div>
          </div>

          <span style={styles.statFooter}>
            Debit transactions
          </span>
        </div>

      </section>

      {/* ACCOUNTS */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              Your Accounts
            </h2>

            <p style={styles.sectionSubtitle}>
              Manage your bank accounts
            </p>
          </div>

          <button
            style={styles.linkButton}
            onClick={() =>
              navigate("/account")
            }
          >
            View all
            <ArrowRight size={16} />
          </button>

        </div>

        <div style={styles.accountsGrid}>

          {accounts.length === 0 ? (
            <div style={styles.emptyCard}>
              <CreditCard size={30} />

              <h3>No accounts yet</h3>

              <p>
                Open your first bank account to
                get started.
              </p>

              <button
                style={styles.primaryButton}
                onClick={() =>
                  navigate("/account")
                }
              >
                <Plus size={17} />
                Open Account
              </button>
            </div>
          ) : (
            accounts.slice(0, 3).map((account) => (
              <div
                key={account.id}
                style={styles.accountCard}
              >

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

                  <CreditCard
                    size={23}
                    color="#2563eb"
                  />

                </div>

                <div style={styles.accountBalance}>

                  <span>
                    Available balance
                  </span>

                  <strong>
                    {formatMoney(
                      account.balance
                    )}
                  </strong>

                </div>

                <div style={styles.accountBottom}>

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

                  <button
                    style={styles.smallButton}
                    onClick={() =>
                      navigate(
                        `/account/${account.id}`
                      )
                    }
                  >
                    Details
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </section>

      {/* QUICK ACTIONS */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              Quick Actions
            </h2>

            <p style={styles.sectionSubtitle}>
              Common banking operations
            </p>
          </div>

        </div>

        <div style={styles.actionsGrid}>

          <button
            style={styles.actionCard}
            onClick={() =>
              navigate("/deposit")
            }
          >
            <div
              style={{
                ...styles.actionIcon,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <Plus size={20} />
            </div>

            <div>
              <strong>Deposit</strong>
              <span>
                Add money to your account
              </span>
            </div>

            <ArrowRight size={17} />

          </button>

          <button
            style={styles.actionCard}
            onClick={() =>
              navigate("/withdraw")
            }
          >
            <div
              style={{
                ...styles.actionIcon,
                backgroundColor: "#fef2f2",
                color: "#dc2626",
              }}
            >
              <Minus size={20} />
            </div>

            <div>
              <strong>Withdraw</strong>
              <span>
                Withdraw money
              </span>
            </div>

            <ArrowRight size={17} />

          </button>

          <button
            style={styles.actionCard}
            onClick={() =>
              navigate("/transfer")
            }
          >
            <div
              style={{
                ...styles.actionIcon,
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
              }}
            >
              <ArrowDownToLine size={20} />
            </div>

            <div>
              <strong>Transfer</strong>
              <span>
                Send money between accounts
              </span>
            </div>

            <ArrowRight size={17} />

          </button>

        </div>

      </section>

      {/* RECENT TRANSACTIONS */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              Recent Transactions
            </h2>

            <p style={styles.sectionSubtitle}>
              Your latest account activity
            </p>
          </div>

          <button
            style={styles.linkButton}
            onClick={() =>
              navigate("/transactions")
            }
          >
            View all
            <ArrowRight size={16} />
          </button>

        </div>

        <div style={styles.transactionCard}>

          {recentTransactions.length ===
          0 ? (
            <div style={styles.empty}>
              <p>
                No transactions yet.
              </p>
            </div>
          ) : (
            recentTransactions.map(
              (transaction) => {

                const type =
                  getTransactionType(
                    transaction
                  );

                const credit =
                  type === "Credit";

                return (
                  <div
                    key={transaction.id}
                    style={
                      styles.transactionRow
                    }
                  >

                    <div
                      style={
                        styles.transactionLeft
                      }
                    >

                      <div
                        style={{
                          ...styles.transactionIcon,
                          backgroundColor:
                            credit
                              ? "#f0fdf4"
                              : "#fef2f2",
                          color: credit
                            ? "#16a34a"
                            : "#dc2626",
                        }}
                      >
                        {credit ? (
                          <ArrowDownToLine
                            size={18}
                          />
                        ) : (
                          <ArrowUpFromLine
                            size={18}
                          />
                        )}
                      </div>

                      <div>

                        <strong
                          style={
                            styles.transactionDescription
                          }
                        >
                          {transaction.description ||
                            transaction.type}
                        </strong>

                        <span
                          style={
                            styles.transactionDate
                          }
                        >
                          {formatDate(
                            transaction.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                    <div
                      style={
                        styles.transactionRight
                      }
                    >

                      <strong
                        style={{
                          color: credit
                            ? "#16a34a"
                            : "#dc2626",
                        }}
                      >
                        {credit ? "+" : "-"}
                        {formatMoney(
                          transaction.amount
                        )}
                      </strong>

                      <span
                        style={
                          styles.transactionType
                        }
                      >
                        {type}
                      </span>

                    </div>

                  </div>
                );
              }
            )
          )}

        </div>

      </section>

    </Layout>
  );
}

const styles = {
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "32px",
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.1em",
    color: "#2563eb",
    margin: "0 0 8px",
  },

  title: {
    fontSize: "28px",
    margin: 0,
    color: "#0f172a",
    fontWeight: "700",
  },

  subtitle: {
    color: "#64748b",
    margin: "8px 0 0",
    fontSize: "14px",
  },

  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "11px 17px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  error: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  statLabel: {
    display: "block",
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "8px",
  },

  statValue: {
    margin: 0,
    fontSize: "23px",
    color: "#0f172a",
  },

  statIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statFooter: {
    display: "block",
    marginTop: "15px",
    fontSize: "12px",
    color: "#94a3b8",
  },

  section: {
    marginTop: "36px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  linkButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  accountsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  accountCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  },

  accountHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  accountLabel: {
    fontSize: "13px",
    color: "#64748b",
  },

  accountNumber: {
    margin: "5px 0 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  accountBalance: {
    marginTop: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  accountBottom: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activeBadge: {
    color: "#15803d",
    backgroundColor: "#f0fdf4",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },

  closedBadge: {
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },

  smallButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "17px",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
    color: "#64748b",
  },

  actionIcon: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  transactionCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  transactionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
  },

  transactionLeft: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  transactionIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  transactionDescription: {
    display: "block",
    fontSize: "13px",
    color: "#334155",
  },

  transactionDate: {
    display: "block",
    marginTop: "4px",
    fontSize: "11px",
    color: "#94a3b8",
  },

  transactionRight: {
    textAlign: "right",
  },

  transactionType: {
    display: "block",
    marginTop: "4px",
    fontSize: "11px",
    color: "#94a3b8",
  },

  empty: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
  },

  loading: {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

export default Dashboard;