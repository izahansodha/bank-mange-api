import { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  RefreshCw,
  Eye,
  X,
  User,
} from "lucide-react";

import Layout from "../../Components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { getAdminAccounts } from "../../api/adminApi";

function AdminAccounts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [selectedAccount, setSelectedAccount] =
    useState(null);

  // =====================================================
  // LOAD ACCOUNTS
  // =====================================================

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminAccounts();

      setAccounts(data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to view accounts."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK ADMIN
  // =====================================================

  useEffect(() => {
    if (!user) return;

    if (user.role !== "Admin") {
      navigate("/dashboard");
      return;
    }

    loadAccounts();
  }, [user]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredAccounts =
    accounts.filter((account) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        String(account.accountNumber)
          .toLowerCase()
          .includes(searchText) ||
        String(account.customerName || "")
          .toLowerCase()
          .includes(searchText) ||
        String(account.customerEmail || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        account.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        account.accountType === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });

  // =====================================================
  // MONEY FORMAT
  // =====================================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading accounts...</p>
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
            Bank Accounts
          </h1>

          <p style={styles.subtitle}>
            View and manage customer bank accounts.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={loadAccounts}
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
            <CreditCard size={20} />
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

        <div style={styles.summaryCard}>

          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
            }}
          >
            <CreditCard size={20} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Active Accounts
            </span>

            <strong style={styles.summaryValue}>
              {
                accounts.filter(
                  (a) => a.status === "Active"
                ).length
              }
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
            <CreditCard size={20} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Closed Accounts
            </span>

            <strong style={styles.summaryValue}>
              {
                accounts.filter(
                  (a) => a.status === "Closed"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          ACCOUNT LIST
      ================================================= */}

      <section style={styles.section}>

        <div style={styles.sectionTitle}>
          <div>
            <h2>
              All Accounts
            </h2>

            <p>
              {filteredAccounts.length} account
              {filteredAccounts.length !== 1
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
              placeholder="Search account, customer or email..."
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

            <option value="Savings">
              Savings
            </option>

            <option value="Current">
              Current
            </option>

          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>

        </div>

        {/* TABLE */}

        <div style={styles.tableCard}>

          {filteredAccounts.length === 0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                <CreditCard size={26} />
              </div>

              <h3>
                No accounts found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Account
                    </th>

                    <th style={styles.th}>
                      Customer
                    </th>

                    <th style={styles.th}>
                      Type
                    </th>

                    <th style={styles.th}>
                      Balance
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Created
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

                  {filteredAccounts.map(
                    (account) => (

                      <tr
                        key={account.id}
                        style={styles.row}
                      >

                        {/* ACCOUNT */}

                        <td style={styles.td}>

                          <div
                            style={
                              styles.accountCell
                            }
                          >

                            <div
                              style={
                                styles.accountIcon
                              }
                            >
                              <CreditCard
                                size={16}
                              />
                            </div>

                            <div>

                              <strong
                                style={
                                  styles.accountNumber
                                }
                              >
                                {account.accountNumber}
                              </strong>

                              <span
                                style={
                                  styles.accountId
                                }
                              >
                                ID #{account.id}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td style={styles.td}>

                          <div
                            style={
                              styles.customerCell
                            }
                          >

                            <div
                              style={
                                styles.avatar
                              }
                            >
                              {account.customerName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div>

                              <strong>
                                {account.customerName ||
                                  "Unknown"}
                              </strong>

                              <span
                                style={
                                  styles.email
                                }
                              >
                                {account.customerEmail ||
                                  "-"}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* TYPE */}

                        <td style={styles.td}>

                          <span
                            style={
                              styles.typeBadge
                            }
                          >
                            {account.accountType}
                          </span>

                        </td>

                        {/* BALANCE */}

                        <td style={styles.td}>

                          <strong
                            style={
                              styles.balance
                            }
                          >
                            {formatMoney(
                              account.balance
                            )}
                          </strong>

                        </td>

                        {/* STATUS */}

                        <td style={styles.td}>

                          <span
                            style={
                              account.status ===
                              "Active"
                                ? styles.activeBadge
                                : styles.closedBadge
                            }
                          >
                            ● {account.status}
                          </span>

                        </td>

                        {/* CREATED */}

                        <td style={styles.td}>
                          {formatDate(
                            account.createdAt
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
                              setSelectedAccount(
                                account
                              )
                            }
                          >
                            <Eye size={14} />
                            View
                          </button>

                        </td>

                      </tr>

                    )
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

      {selectedAccount && (

        <div
          style={styles.overlay}
          onClick={() =>
            setSelectedAccount(null)
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
                  ACCOUNT DETAILS
                </p>

                <h2>
                  Bank Account
                </h2>

              </div>

              <button
                style={styles.closeButton}
                onClick={() =>
                  setSelectedAccount(null)
                }
              >
                <X size={19} />
              </button>

            </div>

            <div style={styles.modalAccount}>

              <div style={styles.modalIcon}>
                <CreditCard size={24} />
              </div>

              <div>

                <strong>
                  {selectedAccount.accountNumber}
                </strong>

                <span>
                  {selectedAccount.accountType}
                </span>

              </div>

            </div>

            <div style={styles.modalGrid}>

              <div>
                <span>
                  Customer
                </span>

                <strong>
                  {selectedAccount.customerName ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {selectedAccount.customerEmail ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>
                  Balance
                </span>

                <strong>
                  {formatMoney(
                    selectedAccount.balance
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {selectedAccount.status ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>
                  Customer ID
                </span>

                <strong>
                  {selectedAccount.customerId ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>
                  Created
                </span>

                <strong>
                  {formatDate(
                    selectedAccount.createdAt
                  )}
                </strong>
              </div>

            </div>

            <button
              style={styles.doneButton}
              onClick={() =>
                setSelectedAccount(null)
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
      "repeat(auto-fit, minmax(210px, 1fr))",
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
  },

  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "4px",
  },

  summaryValue: {
    color: "#0f172a",
    fontSize: "20px",
  },

  section: {
    marginTop: "32px",
  },

  sectionTitle: {
    marginBottom: "14px",
  },

  sectionTitleH2: {
    margin: 0,
  },

  sectionTitleP: {
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
    minWidth: "1000px",
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

  accountCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  accountIcon: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },

  accountNumber: {
    display: "block",
    color: "#334155",
    fontSize: "12px",
  },

  accountId: {
    display: "block",
    marginTop: "2px",
    color: "#94a3b8",
    fontSize: "9px",
  },

  customerCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  avatar: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
  },

  email: {
    display: "block",
    marginTop: "2px",
    color: "#94a3b8",
    fontSize: "9px",
  },

  typeBadge: {
    padding: "5px 8px",
    borderRadius: "15px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontSize: "10px",
    fontWeight: "600",
  },

  balance: {
    color: "#0f172a",
  },

  activeBadge: {
    color: "#15803d",
    fontSize: "10px",
    fontWeight: "700",
  },

  closedBadge: {
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

  modalAccount: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
  },

  modalIcon: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },

  modalGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
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

export default AdminAccounts;