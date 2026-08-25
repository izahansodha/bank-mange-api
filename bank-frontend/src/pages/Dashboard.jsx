import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

          <div style={styles.navItem}>
            📊 Dashboard
          </div>

          <div style={styles.navItem}>
            💳 Accounts
          </div>

          <div style={styles.navItem}>
            💸 Transactions
          </div>

          <div style={styles.navItem}>
              🔄 Transfer
          </div>

          <div style={styles.navItem}>
            👤 Profile
          </div>

        </nav>

        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </button>

      </aside>


      {/* Main Content */}
      <main style={styles.main}>

        {/* Header */}
        <header style={styles.header}>

          <div>
            <h1>Dashboard</h1>

            <p style={styles.welcome}>
              Welcome back,{" "}
              <strong>
                {user?.fullName || "Customer"}
              </strong>
            </p>
          </div>

          <div style={styles.user}>
            👤
            <span>
              {user?.email || "user@example.com"}
            </span>
          </div>

        </header>


        {/* Cards */}
        <section style={styles.cards}>

          <div style={styles.card}>
            <p>Total Balance</p>

            <h2>₹ 1,25,500.00</h2>

            <span>
              Available balance
            </span>
          </div>


          <div style={styles.card}>
            <p>Savings Account</p>

            <h2>₹ 85,500.00</h2>

            <span>
              **** 4582
            </span>
          </div>


          <div style={styles.card}>
            <p>Current Account</p>

            <h2>₹ 40,000.00</h2>

            <span>
              **** 7821
            </span>
          </div>


          <div style={styles.card}>
            <p>Credit Due</p>

            <h2>₹ 12,500.00</h2>

            <span>
              Due this month
            </span>
          </div>

        </section>


        {/* Quick Actions */}
        <section style={styles.section}>

          <h2>Quick Actions</h2>

          <div style={styles.actions}>

            <button style={styles.actionButton}>
              💸
              <span>Transfer Money</span>
            </button>

            <button style={styles.actionButton}>
              💰
              <span>Deposit</span>
            </button>

            <button style={styles.actionButton}>
              📄
              <span>Transactions</span>
            </button>

            <button style={styles.actionButton}>
              🏦
              <span>Accounts</span>
            </button>

          </div>

        </section>


        {/* Recent Transactions */}
        <section style={styles.section}>

          <div style={styles.transactionHeader}>
            <h2>Recent Transactions</h2>

            <button style={styles.viewButton}>
              View All
            </button>
          </div>

          <div style={styles.tableContainer}>

            <table style={styles.table}>

              <thead>

                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>Amazon Shopping</td>
                  <td>24 Aug 2026</td>
                  <td>Debit</td>
                  <td style={styles.debit}>
                    - ₹2,500
                  </td>
                </tr>

                <tr>
                  <td>Salary Credit</td>
                  <td>23 Aug 2026</td>
                  <td>Credit</td>
                  <td style={styles.credit}>
                    + ₹50,000
                  </td>
                </tr>

                <tr>
                  <td>Electricity Bill</td>
                  <td>22 Aug 2026</td>
                  <td>Debit</td>
                  <td style={styles.debit}>
                    - ₹1,850
                  </td>
                </tr>

                <tr>
                  <td>UPI Transfer</td>
                  <td>21 Aug 2026</td>
                  <td>Debit</td>
                  <td style={styles.debit}>
                    - ₹5,000
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

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
    padding: "14px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
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
    padding: "30px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  welcome: {
    color: "#6b7280",
  },

  user: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  section: {
    marginTop: "35px",
  },

  actions: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  actionButton: {
    padding: "18px 25px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "white",
    cursor: "pointer",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.05)",
  },

  transactionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  tableContainer: {
    marginTop: "15px",
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  debit: {
    color: "#dc2626",
  },

  credit: {
    color: "#16a34a",
  },
};


export default Dashboard;