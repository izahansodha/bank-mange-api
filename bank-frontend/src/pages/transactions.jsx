import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  X,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Layout from "../Components/Layout";
import { getTransactions } from "../api/transactionApi";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const itemsPerPage = 10;

  // =====================================================
  // LOAD TRANSACTIONS
  // =====================================================

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTransactions();

      setTransactions(data);
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
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

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
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
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

  const getTransactionType = (transaction) => {
    const type = transaction.type?.toLowerCase();

    if (type === "deposit") {
      return "Credit";
    }

    if (type === "withdrawal") {
      return "Debit";
    }

    if (
      type === "transfersent" ||
      type === "transfer"
    ) {
      return "Debit";
    }

    if (type === "transferreceived") {
      return "Credit";
    }

    return "Debit";
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionType =
        getTransactionType(transaction);

      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        transaction.referenceNumber
          ?.toLowerCase()
          .includes(searchText) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchText) ||
        transaction.accountId
          ?.toString()
          .includes(searchText) ||
        transaction.type
          ?.toLowerCase()
          .includes(searchText);

      const matchesType =
        filterType === "All" ||
        transactionType === filterType;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, filterType]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredTransactions.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const displayedTransactions =
    filteredTransactions.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  const changeSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const changeFilter = (value) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const creditTotal = transactions
    .filter(
      (transaction) =>
        getTransactionType(transaction) ===
        "Credit"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const debitTotal = transactions
    .filter(
      (transaction) =>
        getTransactionType(transaction) ===
        "Debit"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

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

      <div style={styles.pageHeader}>

        <div>
          <p style={styles.eyebrow}>
            ACTIVITY
          </p>

          <h1 style={styles.title}>
            Transactions
          </h1>

          <p style={styles.subtitle}>
            Review your recent banking activity.
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
        <div style={styles.errorMessage}>
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
            <ReceiptText size={20} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Transactions
            </span>

            <strong style={styles.summaryValue}>
              {transactions.length}
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
            <ArrowDownLeft size={20} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Credit
            </span>

            <strong
              style={{
                ...styles.summaryValue,
                color: "#16a34a",
              }}
            >
              {formatMoney(creditTotal)}
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
            <ArrowUpRight size={20} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Debit
            </span>

            <strong
              style={{
                ...styles.summaryValue,
                color: "#dc2626",
              }}
            >
              {formatMoney(debitTotal)}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TRANSACTION SECTION
      ================================================= */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              Transaction History
            </h2>

            <p style={styles.sectionSubtitle}>
              Search and filter your transactions
            </p>
          </div>

        </div>

        {/* FILTER BAR */}

        <div style={styles.filterCard}>

          <div style={styles.searchWrapper}>

            <Search
              size={17}
              color="#94a3b8"
            />

            <input
              type="text"
              placeholder="Search reference, description or account..."
              value={search}
              onChange={(e) =>
                changeSearch(e.target.value)
              }
              style={styles.searchInput}
            />

          </div>

          <select
            value={filterType}
            onChange={(e) =>
              changeFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              All Transactions
            </option>

            <option value="Credit">
              Credit
            </option>

            <option value="Debit">
              Debit
            </option>
          </select>

        </div>

        {/* TABLE */}

        <div style={styles.tableCard}>

          {displayedTransactions.length ===
          0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                <ReceiptText size={27} />
              </div>

              <h3>
                No transactions found
              </h3>

              <p>
                Try changing your search or
                filter.
              </p>

            </div>

          ) : (

            <>

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
                        Date
                      </th>

                      <th style={styles.th}>
                        Type
                      </th>

                      <th
                        style={{
                          ...styles.th,
                          textAlign: "right",
                        }}
                      >
                        Amount
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

                    {displayedTransactions.map(
                      (transaction) => {

                        const type =
                          getTransactionType(
                            transaction
                          );

                        const isCredit =
                          type === "Credit";

                        return (
                          <tr
                            key={
                              transaction.id
                            }
                            style={
                              styles.tableRow
                            }
                          >

                            {/* TRANSACTION */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <div
                                style={
                                  styles.transactionCell
                                }
                              >

                                <div
                                  style={{
                                    ...styles.transactionIcon,
                                    backgroundColor:
                                      isCredit
                                        ? "#f0fdf4"
                                        : "#fef2f2",
                                    color: isCredit
                                      ? "#16a34a"
                                      : "#dc2626",
                                  }}
                                >
                                  {isCredit ? (
                                    <ArrowDownLeft
                                      size={17}
                                    />
                                  ) : (
                                    <ArrowUpRight
                                      size={17}
                                    />
                                  )}
                                </div>

                                <div>

                                  <strong
                                    style={
                                      styles.description
                                    }
                                  >
                                    {transaction.description ||
                                      transaction.type}
                                  </strong>

                                  <span
                                    style={
                                      styles.reference
                                    }
                                  >
                                    {transaction.referenceNumber ||
                                      `Transaction #${transaction.id}`}
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* ACCOUNT */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <span
                                style={
                                  styles.accountNumber
                                }
                              >
                                Account #
                                {transaction.accountId}
                              </span>

                            </td>

                            {/* DATE */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <span
                                style={
                                  styles.date
                                }
                              >
                                {formatDate(
                                  transaction.createdAt
                                )}
                              </span>

                            </td>

                            {/* TYPE */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <span
                                style={
                                  isCredit
                                    ? styles.creditBadge
                                    : styles.debitBadge
                                }
                              >
                                {type}
                              </span>

                            </td>

                            {/* AMOUNT */}

                            <td
                              style={{
                                ...styles.td,
                                textAlign:
                                  "right",
                              }}
                            >

                              <strong
                                style={{
                                  color: isCredit
                                    ? "#16a34a"
                                    : "#dc2626",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                {isCredit
                                  ? "+"
                                  : "-"}
                                {formatMoney(
                                  transaction.amount
                                )}
                              </strong>

                            </td>

                            {/* ACTION */}

                            <td
                              style={{
                                ...styles.td,
                                textAlign:
                                  "center",
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
                                <Eye
                                  size={15}
                                />
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

              {/* PAGINATION */}

              <div style={styles.pagination}>

                <span
                  style={
                    styles.paginationInfo
                  }
                >
                  Showing{" "}
                  <strong>
                    {startIndex + 1}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {Math.min(
                      startIndex +
                        itemsPerPage,
                      filteredTransactions.length
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {
                      filteredTransactions.length
                    }
                  </strong>
                </span>

                <div
                  style={
                    styles.paginationButtons
                  }
                >

                  <button
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage - 1
                      )
                    }
                    style={
                      styles.pageButton
                    }
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span
                    style={
                      styles.pageNumber
                    }
                  >
                    {currentPage} /{" "}
                    {totalPages || 1}
                  </span>

                  <button
                    disabled={
                      currentPage >=
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage + 1
                      )
                    }
                    style={
                      styles.pageButton
                    }
                  >
                    Next
                    <ChevronRight
                      size={16}
                    />
                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </section>

      {/* =================================================
          USER INFORMATION
      ================================================= */}

      <div style={styles.infoCard}>

        <div>
          <span style={styles.infoLabel}>
            Account Holder
          </span>

          <strong>
            {user?.fullName || "Customer"}
          </strong>
        </div>

        <div>
          <span style={styles.infoLabel}>
            Email
          </span>

          <strong>
            {user?.email || "Not available"}
          </strong>
        </div>

        <div>
          <span style={styles.infoLabel}>
            Filtered Results
          </span>

          <strong>
            {filteredTransactions.length}
          </strong>
        </div>

      </div>

      {/* =================================================
          TRANSACTION MODAL
      ================================================= */}

      {selectedTransaction && (

        <div
          style={styles.modalOverlay}
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
                  TRANSACTION
                </p>

                <h2>
                  Transaction Details
                </h2>
              </div>

              <button
                style={styles.modalClose}
                onClick={() =>
                  setSelectedTransaction(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div
              style={styles.modalAmount}
            >

              <div
                style={{
                  ...styles.modalIcon,
                  backgroundColor:
                    getTransactionType(
                      selectedTransaction
                    ) === "Credit"
                      ? "#f0fdf4"
                      : "#fef2f2",
                  color:
                    getTransactionType(
                      selectedTransaction
                    ) === "Credit"
                      ? "#16a34a"
                      : "#dc2626",
                }}
              >
                {getTransactionType(
                  selectedTransaction
                ) === "Credit" ? (
                  <ArrowDownLeft
                    size={22}
                  />
                ) : (
                  <ArrowUpRight
                    size={22}
                  />
                )}
              </div>

              <div>

                <span>
                  {getTransactionType(
                    selectedTransaction
                  )}
                </span>

                <strong
                  style={{
                    color:
                      getTransactionType(
                        selectedTransaction
                      ) === "Credit"
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {getTransactionType(
                    selectedTransaction
                  ) === "Credit"
                    ? "+"
                    : "-"}
                  {formatMoney(
                    selectedTransaction.amount
                  )}
                </strong>

              </div>

            </div>

            <div style={styles.detailsList}>

              <div>
                <span>
                  Reference
                </span>

                <strong>
                  {selectedTransaction.referenceNumber ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>
                  Description
                </span>

                <strong>
                  {selectedTransaction.description ||
                    selectedTransaction.type ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>
                  Account
                </span>

                <strong>
                  #{selectedTransaction.accountId}
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

              <div>
                <span>
                  Type
                </span>

                <strong>
                  {getTransactionType(
                    selectedTransaction
                  )}
                </strong>
              </div>

            </div>

            <button
              style={styles.modalDone}
              onClick={() =>
                setSelectedTransaction(null)
              }
            >
              Done
            </button>

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
    fontSize: "13px",
    fontWeight: "600",
  },

  errorMessage: {
    padding: "12px 15px",
    marginBottom: "18px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    fontSize: "13px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "19px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  summaryIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },

  summaryLabel: {
    display: "block",
    marginBottom: "5px",
    color: "#64748b",
    fontSize: "12px",
  },

  summaryValue: {
    display: "block",
    color: "#0f172a",
    fontSize: "20px",
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

  filterCard: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "15px",
    marginBottom: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
  },

  searchWrapper: {
    flex: 1,
    minWidth: "200px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  },

  searchInput: {
    width: "100%",
    padding: "11px 0",
    border: "none",
    outline: "none",
    fontSize: "13px",
    color: "#334155",
  },

  select: {
    padding: "11px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#475569",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },

  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px 17px",
    textAlign: "left",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  tableRow: {
    transition: "background-color 0.15s",
  },

  td: {
    padding: "15px 17px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "13px",
    color: "#475569",
    verticalAlign: "middle",
  },

  transactionCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  transactionIcon: {
    width: "37px",
    height: "37px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
  },

  description: {
    display: "block",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "600",
  },

  reference: {
    display: "block",
    maxWidth: "250px",
    marginTop: "4px",
    color: "#94a3b8",
    fontSize: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  accountNumber: {
    color: "#475569",
    fontSize: "12px",
  },

  date: {
    color: "#64748b",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  creditBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    fontSize: "10px",
    fontWeight: "700",
  },

  debitBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
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
    fontSize: "11px",
    fontWeight: "600",
  },

  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "15px 17px",
    borderTop: "1px solid #f1f5f9",
  },

  paginationInfo: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  paginationButtons: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  pageButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "7px 10px",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "11px",
  },

  pageNumber: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "600",
  },

  empty: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#94a3b8",
  },

  emptyIcon: {
    width: "52px",
    height: "52px",
    margin: "0 auto 13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
  },

  infoCard: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  infoLabel: {
    display: "block",
    marginBottom: "5px",
    color: "#94a3b8",
    fontSize: "11px",
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

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor:
      "rgba(15,23,42,0.45)",
  },

  modal: {
    width: "100%",
    maxWidth: "480px",
    padding: "25px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.15)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
  },

  modalClose: {
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

  modalAmount: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "17px",
    marginBottom: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
  },

  modalIcon: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },

  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  detailsListItem: {
    display: "flex",
    justifyContent: "space-between",
  },

  modalDone: {
    width: "100%",
    marginTop: "25px",
    padding: "11px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Transactions;