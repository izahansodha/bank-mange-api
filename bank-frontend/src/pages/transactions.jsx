import { useMemo, useState } from "react";

function Transactions() {
  const [transactions] = useState([
    {
      id: "TXN1001",
      description: "Salary Credit",
      account: "Savings ****4582",
      date: "2026-08-24",
      type: "Credit",
      amount: 50000,
      status: "Completed",
    },
    {
      id: "TXN1002",
      description: "Amazon Shopping",
      account: "Savings ****4582",
      date: "2026-08-23",
      type: "Debit",
      amount: 2500,
      status: "Completed",
    },
    {
      id: "TXN1003",
      description: "Electricity Bill",
      account: "Current ****7821",
      date: "2026-08-22",
      type: "Debit",
      amount: 1850,
      status: "Completed",
    },
    {
      id: "TXN1004",
      description: "UPI Transfer",
      account: "Savings ****4582",
      date: "2026-08-21",
      type: "Debit",
      amount: 5000,
      status: "Completed",
    },
    {
      id: "TXN1005",
      description: "Interest Credit",
      account: "Savings ****4582",
      date: "2026-08-20",
      type: "Credit",
      amount: 1250,
      status: "Completed",
    },
    {
      id: "TXN1006",
      description: "ATM Withdrawal",
      account: "Savings ****4582",
      date: "2026-08-19",
      type: "Debit",
      amount: 10000,
      status: "Completed",
    },
    {
      id: "TXN1007",
      description: "Mobile Recharge",
      account: "Savings ****4582",
      date: "2026-08-18",
      type: "Debit",
      amount: 599,
      status: "Completed",
    },
    {
      id: "TXN1008",
      description: "Refund",
      account: "Savings ****4582",
      date: "2026-08-17",
      type: "Credit",
      amount: 2200,
      status: "Completed",
    },
    {
      id: "TXN1009",
      description: "Bank Transfer",
      account: "Current ****7821",
      date: "2026-08-16",
      type: "Debit",
      amount: 15000,
      status: "Completed",
    },
    {
      id: "TXN1010",
      description: "Cash Deposit",
      account: "Current ****7821",
      date: "2026-08-15",
      type: "Credit",
      amount: 30000,
      status: "Completed",
    },
    {
      id: "TXN1011",
      description: "Insurance Payment",
      account: "Current ****7821",
      date: "2026-08-14",
      type: "Debit",
      amount: 4500,
      status: "Completed",
    },
    {
      id: "TXN1012",
      description: "Salary Credit",
      account: "Savings ****4582",
      date: "2026-08-13",
      type: "Credit",
      amount: 50000,
      status: "Completed",
    },
  ]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 5;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Search + filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.account
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" ||
        transaction.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const startIndex =
    (currentPage - 1) * transactionsPerPage;

  const currentTransactions =
    filteredTransactions.slice(
      startIndex,
      startIndex + transactionsPerPage
    );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={styles.page}>

      {/* Sidebar */}
      <aside style={styles.sidebar}>

        <h2 style={styles.logo}>
          🏦 BankApp
        </h2>

        <nav>

          <a href="/" style={styles.navItem}>
            📊 Dashboard
          </a>

          <a
            href="/accounts"
            style={styles.navItem}
          >
            💳 Accounts
          </a>

          <a
            href="/transactions"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            💸 Transactions
          </a>

          <a
            href="/transfer"
            style={styles.navItem}
          >
            🔄 Transfer
          </a>

          <a
            href="/profile"
            style={styles.navItem}
          >
            👤 Profile
          </a>

        </nav>

        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </button>

      </aside>

      {/* Main */}
      <main style={styles.main}>

        <div style={styles.header}>
          <div>
            <h1>Transaction History</h1>

            <p style={styles.subtitle}>
              View and manage your account transactions
            </p>
          </div>
        </div>

        {/* Summary */}
        <div style={styles.summaryGrid}>

          <div style={styles.summaryCard}>
            <p>Total Transactions</p>
            <h2>{transactions.length}</h2>
          </div>

          <div style={styles.summaryCard}>
            <p>Credits</p>

            <h2 style={styles.credit}>
              {formatMoney(
                transactions
                  .filter((x) => x.type === "Credit")
                  .reduce(
                    (sum, x) => sum + x.amount,
                    0
                  )
              )}
            </h2>
          </div>

          <div style={styles.summaryCard}>
            <p>Debits</p>

            <h2 style={styles.debit}>
              {formatMoney(
                transactions
                  .filter((x) => x.type === "Debit")
                  .reduce(
                    (sum, x) => sum + x.amount,
                    0
                  )
              )}
            </h2>
          </div>

        </div>

        {/* Filters */}
        <div style={styles.filterCard}>

          <input
            type="text"
            placeholder="Search transaction..."
            value={search}
            onChange={handleSearch}
            style={styles.search}
          />

          <select
            value={typeFilter}
            onChange={handleTypeChange}
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

        {/* Table */}
        <div style={styles.tableCard}>

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Description</th>
                  <th>Account</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {currentTransactions.length > 0 ? (

                  currentTransactions.map(
                    (transaction) => (
                      <tr key={transaction.id}>

                        <td>
                          <strong>
                            {transaction.id}
                          </strong>
                        </td>

                        <td>
                          {transaction.description}
                        </td>

                        <td>
                          {transaction.account}
                        </td>

                        <td>
                          {transaction.date}
                        </td>

                        <td>

                          <span
                            style={
                              transaction.type ===
                              "Credit"
                                ? styles.creditBadge
                                : styles.debitBadge
                            }
                          >
                            {transaction.type}
                          </span>

                        </td>

                        <td
                          style={
                            transaction.type ===
                            "Credit"
                              ? styles.credit
                              : styles.debit
                          }
                        >
                          {transaction.type === "Credit"
                            ? "+"
                            : "-"}{" "}
                          {formatMoney(
                            transaction.amount
                          )}
                        </td>

                        <td>

                          <span
                            style={styles.statusBadge}
                          >
                            {transaction.status}
                          </span>

                        </td>

                      </tr>
                    )
                  )

                ) : (

                  <tr>
                    <td
                      colSpan="7"
                      style={styles.empty}
                    >
                      No transactions found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div style={styles.pagination}>

            <div style={styles.pageInfo}>
              Showing{" "}
              {filteredTransactions.length === 0
                ? 0
                : startIndex + 1}{" "}
              -
              {Math.min(
                startIndex + transactionsPerPage,
                filteredTransactions.length
              )}{" "}
              of {filteredTransactions.length}
            </div>

            <div style={styles.pageButtons}>

              <button
                onClick={() =>
                  goToPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                style={styles.pageButton}
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() =>
                    goToPage(page)
                  }
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === page
                      ? styles.activePage
                      : {}),
                  }}
                >
                  {page}
                </button>

              ))}

              <button
                onClick={() =>
                  goToPage(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                style={styles.pageButton}
              >
                Next →
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "230px",
    backgroundColor: "#111827",
    color: "white",
    padding: "25px 15px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    textAlign: "center",
    marginBottom: "40px",
  },

  navItem: {
    display: "block",
    padding: "14px",
    marginBottom: "8px",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
  },

  activeNav: {
    backgroundColor: "#2563eb",
  },

  logout: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "35px",
    overflow: "auto",
  },

  header: {
    marginBottom: "30px",
  },

  subtitle: {
    color: "#6b7280",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  summaryCard: {
    backgroundColor: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.05)",
  },

  filterCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  search: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
  },

  select: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "white",
  },

  tableCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  credit: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  debit: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  creditBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "13px",
  },

  debitBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
  },

  statusBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "13px",
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
  },

  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderTop: "1px solid #eee",
    gap: "20px",
    flexWrap: "wrap",
  },

  pageInfo: {
    color: "#6b7280",
  },

  pageButtons: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },

  pageButton: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "white",
    cursor: "pointer",
  },

  activePage: {
    backgroundColor: "#2563eb",
    color: "white",
    borderColor: "#2563eb",
  },
};

export default Transactions;