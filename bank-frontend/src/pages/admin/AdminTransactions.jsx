import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Eye, X, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import { getAdminTransactions } from "../../api/adminApi";

function AdminTransactions() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // =====================================================
  // LOAD TRANSACTIONS
  // =====================================================

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminTransactions();

      setTransactions(data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError("You do not have permission to view transactions.");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  useEffect(() => {
    if (!user) return;

    if (user.role !== "Admin") {
      navigate("/dashboard");
      return;
    }

    loadTransactions();
  }, [user]);

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // TRANSACTION TYPE
  // =====================================================

  const getTypeLabel = (type) => {
    switch (type) {
      case "Deposit":
        return "Deposit";

      case "Withdrawal":
        return "Withdrawal";

      case "TransferSent":
        return "Transfer Sent";

      case "TransferReceived":
        return "Transfer Received";

      default:
        return type || "Unknown";
    }
  };

  // =====================================================
  // CREDIT / DEBIT
  // =====================================================

  const isCredit = (type) => {
    return (
      type === "Deposit" ||
      type === "TransferReceived"
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredTransactions = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !searchText ||
        String(transaction.id)
          .toLowerCase()
          .includes(searchText) ||
        String(transaction.accountId)
          .toLowerCase()
          .includes(searchText) ||
        String(transaction.type || "")
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        transaction.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalTransactions = transactions.length;

  const totalDeposits = transactions
    .filter((t) => t.type === "Deposit")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === "Withdrawal")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalTransfers = transactions
    .filter(
      (t) =>
        t.type === "TransferSent" ||
        t.type === "TransferReceived"
    )
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading transactions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>
            ADMINISTRATION
          </p>

          <h1 style={styles.title}>
            Transactions
          </h1>

          <p style={styles.subtitle}>
            Monitor all banking transactions.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={loadTransactions}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>
            ↕
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Transactions
            </span>

            <strong style={styles.summaryValue}>
              {totalTransactions}
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
            ↓
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Deposits
            </span>

            <strong style={styles.summaryValue}>
              {formatMoney(totalDeposits)}
            </strong>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#fef2f2",
              color: "#dc2626",
            }}
          >
            ↑
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Withdrawals
            </span>

            <strong style={styles.summaryValue}>
              {formatMoney(totalWithdrawals)}
            </strong>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#eff6ff",
              color: "#2563eb",
            }}
          >
            ↔
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Transfers
            </span>

            <strong style={styles.summaryValue}>
              {formatMoney(totalTransfers)}
            </strong>
          </div>
        </div>
      </div>

      {/* =================================================
          TRANSACTIONS
      ================================================= */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              All Transactions
            </h2>

            <p style={styles.sectionSubtitle}>
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1
                ? "s"
                : ""} found
            </p>
          </div>
        </div>

        {/* FILTERS */}

        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <Search
              size={17}
              color="#94a3b8"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search transaction, account..."
              style={styles.searchInput}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              All Types
            </option>

            <option value="Deposit">
              Deposit
            </option>

            <option value="Withdrawal">
              Withdrawal
            </option>

            <option value="TransferSent">
              Transfer Sent
            </option>

            <option value="TransferReceived">
              Transfer Received
            </option>
          </select>
        </div>

        {/* TABLE */}

        <div style={styles.tableCard}>
          {filteredTransactions.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                ↕
              </div>

              <h3>
                No transactions found
              </h3>

              <p>
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      Transaction
                    </th>

                    <th style={styles.th}>
                      Account
                    </th>

                    <th style={styles.th}>
                      Type
                    </th>

                    <th style={styles.th}>
                      Amount
                    </th>

                    <th style={styles.th}>
                      Date
                    </th>

                    <th
                      style={{
                        ...styles.th,
                        textAlign: "center",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map(
                    (transaction) => {
                      const credit = isCredit(
                        transaction.type
                      );

                      return (
                        <tr
                          key={transaction.id}
                          style={styles.row}
                        >
                          {/* TRANSACTION */}

                          <td style={styles.td}>
                            <div
                              style={
                                styles.transactionCell
                              }
                            >
                              <div
                                style={
                                  credit
                                    ? styles.creditIcon
                                    : styles.debitIcon
                                }
                              >
                                {credit ? (
                                  <ArrowDownLeft
                                    size={16}
                                  />
                                ) : (
                                  <ArrowUpRight
                                    size={16}
                                  />
                                )}
                              </div>

                              <div>
                                <strong
                                  style={
                                    styles.transactionId
                                  }
                                >
                                  #{transaction.id}
                                </strong>

                                <span
                                  style={
                                    styles.transactionType
                                  }
                                >
                                  {getTypeLabel(
                                    transaction.type
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* ACCOUNT */}

                          <td style={styles.td}>
                            <strong>
                              #{transaction.accountId}
                            </strong>
                          </td>

                          {/* TYPE */}

                          <td style={styles.td}>
                            <span
                              style={
                                credit
                                  ? styles.creditBadge
                                  : styles.debitBadge
                              }
                            >
                              {credit
                                ? "Credit"
                                : "Debit"}
                            </span>
                          </td>

                          {/* AMOUNT */}

                          <td style={styles.td}>
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
                          </td>

                          {/* DATE */}

                          <td style={styles.td}>
                            {formatDate(
                              transaction.createdAt
                            )}
                          </td>

                          {/* ACTION */}

                          <td
                            style={{
                              ...styles.td,
                              textAlign: "center",
                            }}
                          >
                            <button
                              style={
                                styles.viewButton
                              }
                              onClick={() =>
                                setSelectedTransaction(
                                  transaction
                                )
                              }
                            >
                              <Eye size={14} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedTransaction && (
        <div
          style={styles.overlay}
          onClick={() =>
            setSelectedTransaction(null)
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
                <p style={styles.eyebrow}>
                  TRANSACTION DETAILS
                </p>

                <h2>
                  Transaction #
                  {selectedTransaction.id}
                </h2>
              </div>

              <button
                style={styles.closeButton}
                onClick={() =>
                  setSelectedTransaction(null)
                }
              >
                <X size={19} />
              </button>
            </div>

            <div style={styles.amountBox}>
              <span>
                Transaction Amount
              </span>

              <strong
                style={{
                  color: isCredit(
                    selectedTransaction.type
                  )
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {isCredit(
                  selectedTransaction.type
                )
                  ? "+"
                  : "-"}
                {formatMoney(
                  selectedTransaction.amount
                )}
              </strong>
            </div>

            <div style={styles.modalGrid}>
              <div>
                <span>
                  Transaction ID
                </span>

                <strong>
                  #{selectedTransaction.id}
                </strong>
              </div>

              <div>
                <span>
                  Account ID
                </span>

                <strong>
                  #{selectedTransaction.accountId}
                </strong>
              </div>

              <div>
                <span>
                  Transaction Type
                </span>

                <strong>
                  {getTypeLabel(
                    selectedTransaction.type
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {isCredit(
                    selectedTransaction.type
                  )
                    ? "Credit"
                    : "Debit"}
                </strong>
              </div>

              <div>
                <span>
                  Amount
                </span>

                <strong>
                  {formatMoney(
                    selectedTransaction.amount
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {formatDate(
                    selectedTransaction.createdAt
                  )}
                </strong>
              </div>
            </div>

            <button
              style={styles.doneButton}
              onClick={() =>
                setSelectedTransaction(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "25px",
  },

  eyebrow: {
    margin: "0 0 7px",
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.1em",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "28px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  error: {
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "12px",
  },

  summary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "18px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
  },

  summaryIcon: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "20px",
    fontWeight: "700",
  },

  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "4px",
  },

  summaryValue: {
    color: "#0f172a",
    fontSize: "17px",
  },

  section: {
    marginTop: "32px",
  },

  sectionHeader: {
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px",
  },

  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },

  searchInput: {
    width: "100%",
    padding: "10px 0",
    border: "none",
    outline: "none",
    fontSize: "12px",
  },

  select: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#475569",
    outline: "none",
    fontSize: "12px",
  },

  tableCard: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
    overflow: "hidden",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "900px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "13px 15px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    color: "#64748b",
    fontSize: "10px",
    textAlign: "left",
    textTransform: "uppercase",
  },

  row: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "14px 15px",
    color: "#475569",
    fontSize: "12px",
  },

  transactionCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  creditIcon: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
  },

  debitIcon: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },

  transactionId: {
    display: "block",
    color: "#334155",
  },

  transactionType: {
    display: "block",
    marginTop: "2px",
    color: "#94a3b8",
    fontSize: "9px",
  },

  creditBadge: {
    padding: "5px 8px",
    borderRadius: "15px",
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    fontSize: "10px",
    fontWeight: "700",
  },

  debitBadge: {
    padding: "5px 8px",
    borderRadius: "15px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontSize: "10px",
    fontWeight: "700",
  },

  viewButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "7px 10px",
    border: "1px solid #dbeafe",
    borderRadius: "7px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "600",
  },

  empty: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#94a3b8",
  },

  emptyIcon: {
    width: "50px",
    height: "50px",
    margin: "0 auto 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    fontSize: "24px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "rgba(15,23,42,0.45)",
  },

  modal: {
    width: "100%",
    maxWidth: "500px",
    padding: "25px",
    backgroundColor: "#fff",
    borderRadius: "14px",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  closeButton: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    cursor: "pointer",
  },

  amountBox: {
    padding: "18px",
    marginBottom: "20px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
  },

  modalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "17px",
  },

  doneButton: {
    width: "100%",
    marginTop: "25px",
    padding: "11px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
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
    marginBottom: "12px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
  },
};

export default AdminTransactions;