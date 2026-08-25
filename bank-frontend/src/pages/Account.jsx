import { useState } from "react";

function Accounts() {
  const [accounts] = useState([
    {
      id: 1,
      type: "Savings Account",
      number: "4582",
      balance: 85500,
      status: "Active",
      interest: "4.00%",
    },
    {
      id: 2,
      type: "Current Account",
      number: "7821",
      balance: 40000,
      status: "Active",
      interest: "0.00%",
    },
  ]);

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0
  );

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div style={styles.page}>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🏦 BankApp</h2>

        <nav>
          <a href="/" style={styles.navItem}>
            📊 Dashboard
          </a>

          <a
            href="/accounts"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            💳 Accounts
          </a>

          <a href="/transactions" style={styles.navItem}>
            💸 Transactions
          </a>

          <a href="/transfer" style={styles.navItem}>
            🔄 Transfer
          </a>

          <a href="/profile" style={styles.navItem}>
            👤 Profile
          </a>
        </nav>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main style={styles.main}>

        <div style={styles.header}>
          <div>
            <h1>My Accounts</h1>
            <p style={styles.subtitle}>
              Manage your bank accounts
            </p>
          </div>

          <button style={styles.addButton}>
            + Open Account
          </button>
        </div>

        {/* Total Balance */}
        <div style={styles.totalCard}>
          <div>
            <p>Total Balance</p>

            <h1>
              {formatMoney(totalBalance)}
            </h1>
          </div>

          <div style={styles.balanceIcon}>
            💰
          </div>
        </div>

        {/* Accounts */}
        <h2 style={styles.heading}>
          Your Accounts
        </h2>

        <div style={styles.accountGrid}>

          {accounts.map((account) => (
            <div
              key={account.id}
              style={styles.accountCard}
            >

              <div style={styles.accountTop}>

                <div>
                  <p style={styles.accountType}>
                    {account.type}
                  </p>

                  <h3>
                    **** **** {account.number}
                  </h3>
                </div>

                <div style={styles.cardIcon}>
                  💳
                </div>

              </div>

              <div style={styles.balanceSection}>
                <p>Available Balance</p>

                <h2>
                  {formatMoney(account.balance)}
                </h2>
              </div>

              <div style={styles.details}>

                <div>
                  <small>Status</small>

                  <p style={styles.active}>
                    ● {account.status}
                  </p>
                </div>

                <div>
                  <small>Interest Rate</small>

                  <p>{account.interest}</p>
                </div>

              </div>

              <button
                style={styles.detailsButton}
                onClick={() =>
                  alert(
                    `Account: ${account.type}\nBalance: ${formatMoney(
                      account.balance
                    )}`
                  )
                }
              >
                View Details
              </button>

            </div>
          ))}

        </div>

        {/* Account Information */}
        <div style={styles.infoCard}>

          <h2>Account Information</h2>

          <div style={styles.infoGrid}>

            <div>
              <small>Account Holder</small>
              <p>
                {JSON.parse(
                  localStorage.getItem("user") || "{}"
                ).fullName || "Customer"}
              </p>
            </div>

            <div>
              <small>Email</small>
              <p>
                {JSON.parse(
                  localStorage.getItem("user") || "{}"
                ).email || "Not available"}
              </p>
            </div>

            <div>
              <small>Total Accounts</small>
              <p>{accounts.length}</p>
            </div>

            <div>
              <small>Account Status</small>
              <p style={styles.active}>
                Active
              </p>
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
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  subtitle: {
    color: "#6b7280",
  },

  addButton: {
    padding: "12px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  totalCard: {
    backgroundColor: "#1d4ed8",
    color: "white",
    padding: "30px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  balanceIcon: {
    fontSize: "45px",
  },

  heading: {
    marginBottom: "20px",
  },

  accountGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },

  accountCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.06)",
  },

  accountTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  accountType: {
    color: "#6b7280",
    marginBottom: "5px",
  },

  cardIcon: {
    fontSize: "35px",
  },

  balanceSection: {
    marginTop: "30px",
  },

  details: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  },

  active: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  detailsButton: {
    width: "100%",
    marginTop: "25px",
    padding: "11px",
    border: "1px solid #2563eb",
    color: "#2563eb",
    backgroundColor: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },

  infoCard: {
    marginTop: "35px",
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "15px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "25px",
    marginTop: "20px",
  },
};

export default Accounts;    