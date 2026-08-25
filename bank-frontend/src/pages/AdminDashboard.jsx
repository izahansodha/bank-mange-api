import { useEffect, useState } from "react";

function AdminDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [stats, setStats] = useState({
    users: 0,
    accounts: 0,
    transactions: 0,
    transfers: 0,
  });

  const [recentTransactions, setRecentTransactions] =
    useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      /*
        Later connect this to:

        GET /api/admin/dashboard

        headers:
        Authorization: Bearer TOKEN
      */

      // Demo data
      setTimeout(() => {
        setStats({
          users: 1248,
          accounts: 1875,
          transactions: 9634,
          transfers: 4218,
        });

        setRecentTransactions([
          {
            id: "TXN001",
            user: "John Doe",
            type: "Transfer",
            amount: 2500,
            status: "Completed",
            date: "24 Aug 2026",
          },
          {
            id: "TXN002",
            user: "Sarah Smith",
            type: "Deposit",
            amount: 5000,
            status: "Completed",
            date: "24 Aug 2026",
          },
          {
            id: "TXN003",
            user: "Mike Johnson",
            type: "Transfer",
            amount: 1200,
            status: "Pending",
            date: "23 Aug 2026",
          },
          {
            id: "TXN004",
            user: "David Brown",
            type: "Withdrawal",
            amount: 800,
            status: "Failed",
            date: "23 Aug 2026",
          },
        ]);

        setLoading(false);
      }, 600);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div style={styles.page}>

      {/* ================= SIDEBAR ================= */}

      <aside style={styles.sidebar}>

        <div>

          <h2 style={styles.logo}>
            🏦 BankApp
          </h2>

          <div style={styles.adminBadge}>
            🛡️ ADMIN PANEL
          </div>

          <nav style={styles.nav}>

            <a
              href="/admin"
              style={{
                ...styles.navItem,
                ...styles.activeNav,
              }}
            >
              📊 Dashboard
            </a>

            <a
              href="/admin/users"
              style={styles.navItem}
            >
              👥 Users
            </a>

            <a
              href="/admin/accounts"
              style={styles.navItem}
            >
              💳 Accounts
            </a>

            <a
              href="/admin/transactions"
              style={styles.navItem}
            >
              💸 Transactions
            </a>

            <a
              href="/admin/transfers"
              style={styles.navItem}
            >
              🔄 Transfers
            </a>

            <a
              href="/admin/reports"
              style={styles.navItem}
            >
              📈 Reports
            </a>

            <a
              href="/admin/security"
              style={styles.navItem}
            >
              🔐 Security
            </a>

          </nav>

        </div>

        <button
          onClick={logout}
          style={styles.logout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* ================= MAIN ================= */}

      <main style={styles.main}>

        {/* Header */}

        <header style={styles.header}>

          <div>

            <h1 style={styles.title}>
              Admin Dashboard
            </h1>

            <p style={styles.subtitle}>
              Monitor and manage the banking system
            </p>

          </div>

          <div style={styles.adminProfile}>

            <div style={styles.avatar}>
              {user.fullName
                ? user.fullName
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div>
              <strong>
                {user.fullName || "Administrator"}
              </strong>

              <small style={styles.role}>
                Administrator
              </small>
            </div>

          </div>

        </header>


        {/* ================= STAT CARDS ================= */}

        <section style={styles.statsGrid}>

          <StatCard
            icon="👥"
            title="Total Users"
            value={stats.users}
            description="+12% this month"
          />

          <StatCard
            icon="💳"
            title="Total Accounts"
            value={stats.accounts}
            description="+8% this month"
          />

          <StatCard
            icon="💸"
            title="Transactions"
            value={stats.transactions}
            description="+18% this month"
          />

          <StatCard
            icon="🔄"
            title="Transfers"
            value={stats.transfers}
            description="+14% this month"
          />

        </section>


        {/* ================= CONTENT ================= */}

        <section style={styles.contentGrid}>

          {/* Recent Transactions */}

          <div style={styles.card}>

            <div style={styles.cardHeader}>

              <div>

                <h2 style={styles.cardTitle}>
                  Recent Transactions
                </h2>

                <p style={styles.cardSubtitle}>
                  Latest banking activity
                </p>

              </div>

              <a
                href="/admin/transactions"
                style={styles.viewAll}
              >
                View All →
              </a>

            </div>


            {loading ? (

              <div style={styles.loading}>
                Loading transactions...
              </div>

            ) : (

              <div style={styles.tableWrapper}>

                <table style={styles.table}>

                  <thead>

                    <tr>

                      <th>ID</th>
                      <th>User</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentTransactions.map(
                      (transaction) => (

                        <tr key={transaction.id}>

                          <td>
                            <strong>
                              {transaction.id}
                            </strong>
                          </td>

                          <td>
                            {transaction.user}
                          </td>

                          <td>
                            {transaction.type}
                          </td>

                          <td>
                            ₹
                            {transaction.amount.toLocaleString()}
                          </td>

                          <td>

                            <StatusBadge
                              status={
                                transaction.status
                              }
                            />

                          </td>

                          <td>
                            {transaction.date}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>


          {/* System Overview */}

          <div style={styles.card}>

            <h2 style={styles.cardTitle}>
              System Overview
            </h2>

            <p style={styles.cardSubtitle}>
              Current platform status
            </p>


            <div style={styles.systemList}>

              <SystemStatus
                name="API Server"
                status="Operational"
              />

              <SystemStatus
                name="Database"
                status="Operational"
              />

              <SystemStatus
                name="Authentication"
                status="Operational"
              />

              <SystemStatus
                name="Payment System"
                status="Operational"
              />

            </div>

          </div>

        </section>


        {/* ================= QUICK ACTIONS ================= */}

        <section style={styles.card}>

          <h2 style={styles.cardTitle}>
            Quick Actions
          </h2>

          <p style={styles.cardSubtitle}>
            Frequently used administration tools
          </p>


          <div style={styles.actions}>

            <ActionButton
              icon="👥"
              text="Manage Users"
              link="/admin/users"
            />

            <ActionButton
              icon="💳"
              text="Manage Accounts"
              link="/admin/accounts"
            />

            <ActionButton
              icon="💸"
              text="Transactions"
              link="/admin/transactions"
            />

            <ActionButton
              icon="📈"
              text="View Reports"
              link="/admin/reports"
            />

            <ActionButton
              icon="🔐"
              text="Security"
              link="/admin/security"
            />

          </div>

        </section>


        {/* ================= SECURITY NOTICE ================= */}

        <div style={styles.securityNotice}>

          <span style={styles.securityIcon}>
            🔐
          </span>

          <div>

            <strong>
              Admin Security
            </strong>

            <p>
              Admin actions are protected by JWT
              authentication and role-based
              authorization.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div style={styles.statCard}>

      <div style={styles.statTop}>

        <div style={styles.statIcon}>
          {icon}
        </div>

        <span style={styles.more}>
          ⋮
        </span>

      </div>

      <h3 style={styles.statTitle}>
        {title}
      </h3>

      <div style={styles.statValue}>
        {value.toLocaleString()}
      </div>

      <p style={styles.statDescription}>
        <span style={styles.green}>
          ↑
        </span>{" "}
        {description}
      </p>

    </div>
  );
}


/* ================= STATUS ================= */

function StatusBadge({ status }) {

  let style = styles.completed;

  if (status === "Pending") {
    style = styles.pending;
  }

  if (status === "Failed") {
    style = styles.failed;
  }

  return (
    <span style={style}>
      {status}
    </span>
  );
}


/* ================= SYSTEM STATUS ================= */

function SystemStatus({
  name,
  status,
}) {
  return (
    <div style={styles.systemItem}>

      <span>
        {name}
      </span>

      <span style={styles.operational}>
        ● {status}
      </span>

    </div>
  );
}


/* ================= ACTION ================= */

function ActionButton({
  icon,
  text,
  link,
}) {
  return (
    <a
      href={link}
      style={styles.action}
    >

      <span style={styles.actionIcon}>
        {icon}
      </span>

      <span>
        {text}
      </span>

      <span>
        →
      </span>

    </a>
  );
}


/* ================= STYLES ================= */

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "240px",
    backgroundColor: "#111827",
    color: "white",
    padding: "25px 15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexShrink: 0,
  },

  logo: {
    textAlign: "center",
    marginBottom: "25px",
  },

  adminBadge: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "8px",
    borderRadius: "6px",
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "bold",
    marginBottom: "25px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  navItem: {
    color: "#d1d5db",
    textDecoration: "none",
    padding: "13px",
    borderRadius: "8px",
    display: "block",
  },

  activeNav: {
    backgroundColor: "#2563eb",
    color: "white",
  },

  logout: {
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "30px",
    overflow: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    color: "#6b7280",
  },

  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },

  role: {
    display: "block",
    color: "#6b7280",
    fontSize: "12px",
    marginTop: "3px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    backgroundColor: "white",
    padding: "22px",
    borderRadius: "14px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.05)",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  statIcon: {
    fontSize: "25px",
  },

  more: {
    color: "#9ca3af",
    fontSize: "20px",
  },

  statTitle: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "5px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "bold",
  },

  statDescription: {
    fontSize: "12px",
    color: "#6b7280",
  },

  green: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(500px, 2fr) minmax(280px, 1fr)",
    gap: "25px",
    marginBottom: "25px",
  },

  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.05)",
    marginBottom: "25px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: 0,
  },

  cardSubtitle: {
    color: "#6b7280",
    fontSize: "13px",
  },

  viewAll: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "13px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  loading: {
    padding: "40px",
    textAlign: "center",
    color: "#6b7280",
  },

  completed: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
  },

  pending: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
  },

  failed: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
  },

  systemList: {
    marginTop: "25px",
  },

  systemItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },

  operational: {
    color: "#16a34a",
    fontSize: "12px",
    fontWeight: "bold",
  },

  actions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, 1fr)",
    gap: "12px",
    marginTop: "20px",
  },

  action: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "15px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#111827",
    fontSize: "13px",
  },

  actionIcon: {
    fontSize: "20px",
  },

  securityNotice: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    padding: "18px",
    backgroundColor: "#eff6ff",
    borderRadius: "12px",
    color: "#1e40af",
  },

  securityIcon: {
    fontSize: "25px",
  },
};

export default AdminDashboard;