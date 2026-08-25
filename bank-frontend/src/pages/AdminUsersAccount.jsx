import { useEffect, useState } from "react";

function AdminUsersAccounts() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    /*
      REAL API:

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://localhost:7000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setUsers(data);
    */

    // Demo data
    setTimeout(() => {
      setUsers([
        {
          id: "USR001",
          name: "John Doe",
          email: "john@gmail.com",
          phone: "9876543210",
          role: "Customer",
          status: "Active",
          accountNumber: "1000012345",
          accountType: "Savings",
          balance: 45000,
          createdAt: "12 Aug 2026",
        },
        {
          id: "USR002",
          name: "Sarah Smith",
          email: "sarah@gmail.com",
          phone: "9876543211",
          role: "Customer",
          status: "Active",
          accountNumber: "1000012346",
          accountType: "Savings",
          balance: 78000,
          createdAt: "10 Aug 2026",
        },
        {
          id: "USR003",
          name: "Mike Johnson",
          email: "mike@gmail.com",
          phone: "9876543212",
          role: "Customer",
          status: "Blocked",
          accountNumber: "1000012347",
          accountType: "Current",
          balance: 12500,
          createdAt: "05 Aug 2026",
        },
        {
          id: "USR004",
          name: "Admin User",
          email: "admin@bank.com",
          phone: "9876543213",
          role: "Admin",
          status: "Active",
          accountNumber: "ADMIN001",
          accountType: "Admin",
          balance: 0,
          createdAt: "01 Aug 2026",
        },
      ]);

      setLoading(false);
    }, 500);
  };

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.accountNumber
        .toLowerCase()
        .includes(search.toLowerCase());

    const roleMatch =
      roleFilter === "ALL" ||
      user.role === roleFilter;

    const statusMatch =
      statusFilter === "ALL" ||
      user.status === statusFilter;

    return (
      searchMatch &&
      roleMatch &&
      statusMatch
    );
  });

  const toggleUserStatus = (id) => {
    setUsers((previous) =>
      previous.map((user) => {
        if (user.id !== id) return user;

        return {
          ...user,
          status:
            user.status === "Active"
              ? "Blocked"
              : "Active",
        };
      })
    );

    /*
      REAL API:

      PATCH /api/admin/users/{id}/status

      {
        status: "Blocked"
      }
    */
  };

  const formatMoney = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
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

        <h2 style={styles.logo}>
          🏦 BankApp
        </h2>

        <div style={styles.adminBadge}>
          🛡️ ADMIN PANEL
        </div>

        <nav>

          <a
            href="/admin"
            style={styles.navItem}
          >
            📊 Dashboard
          </a>

          <a
            href="/admin/users"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            👥 Users & Accounts
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

        <div style={styles.header}>

          <div>

            <h1>
              User & Account Management
            </h1>

            <p style={styles.subtitle}>
              Manage customers, accounts and
              account status
            </p>

          </div>

          <button
            style={styles.addButton}
            onClick={() =>
              alert("Create user page coming next")
            }
          >
            + Create User
          </button>

        </div>


        {/* ================= STATISTICS ================= */}

        <div style={styles.stats}>

          <Stat
            title="Total Users"
            value={users.length}
            icon="👥"
          />

          <Stat
            title="Active Users"
            value={
              users.filter(
                (u) => u.status === "Active"
              ).length
            }
            icon="🟢"
          />

          <Stat
            title="Blocked Users"
            value={
              users.filter(
                (u) => u.status === "Blocked"
              ).length
            }
            icon="🔴"
          />

          <Stat
            title="Total Balance"
            value={formatMoney(
              users.reduce(
                (sum, user) =>
                  sum + user.balance,
                0
              )
            )}
            icon="💰"
          />

        </div>


        {/* ================= FILTERS ================= */}

        <div style={styles.filterCard}>

          <input
            type="text"
            placeholder="Search name, email or account number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.search}
          />

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">
              All Roles
            </option>

            <option value="Customer">
              Customer
            </option>

            <option value="Admin">
              Admin
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Blocked">
              Blocked
            </option>
          </select>

        </div>


        {/* ================= TABLE ================= */}

        <div style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <div>

              <h2>
                Users & Accounts
              </h2>

              <p style={styles.subtitle}>
                {filteredUsers.length} users found
              </p>

            </div>

            <button
              style={styles.exportButton}
              onClick={() =>
                alert("Export CSV coming next")
              }
            >
              ⬇ Export
            </button>

          </div>


          {loading ? (

            <div style={styles.loading}>
              Loading users...
            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th>User</th>
                    <th>Account</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map(
                    (user) => (

                      <tr key={user.id}>

                        {/* USER */}

                        <td>

                          <div style={styles.userCell}>

                            <div
                              style={
                                styles.avatar
                              }
                            >
                              {user.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {user.name}
                              </strong>

                              <small
                                style={
                                  styles.email
                                }
                              >
                                {user.email}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* ACCOUNT */}

                        <td>

                          <strong>
                            {user.accountNumber}
                          </strong>

                        </td>


                        {/* TYPE */}

                        <td>
                          {user.accountType}
                        </td>


                        {/* BALANCE */}

                        <td>

                          <strong>
                            {formatMoney(
                              user.balance
                            )}
                          </strong>

                        </td>


                        {/* ROLE */}

                        <td>

                          <span
                            style={
                              user.role ===
                              "Admin"
                                ? styles.adminRole
                                : styles.customerRole
                            }
                          >
                            {user.role}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            style={
                              user.status ===
                              "Active"
                                ? styles.active
                                : styles.blocked
                            }
                          >
                            ● {user.status}
                          </span>

                        </td>


                        {/* CREATED */}

                        <td>
                          {user.createdAt}
                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div
                            style={
                              styles.actions
                            }
                          >

                            <button
                              style={
                                styles.viewButton
                              }
                              onClick={() =>
                                setSelectedUser(
                                  user
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              style={
                                user.status ===
                                "Active"
                                  ? styles.blockButton
                                  : styles.activateButton
                              }
                              onClick={() =>
                                toggleUserStatus(
                                  user.id
                                )
                              }
                            >
                              {user.status ===
                              "Active"
                                ? "Block"
                                : "Activate"}
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>


              {filteredUsers.length === 0 && (

                <div style={styles.empty}>
                  No users found.
                </div>

              )}

            </div>

          )}

        </div>

      </main>


      {/* ================= USER DETAILS MODAL ================= */}

      {selectedUser && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>

              <h2>
                User Details
              </h2>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                style={styles.close}
              >
                ✕
              </button>

            </div>


            <div style={styles.modalProfile}>

              <div style={styles.largeAvatar}>
                {selectedUser.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {selectedUser.name}
              </h2>

              <p>
                {selectedUser.email}
              </p>

            </div>


            <div style={styles.details}>

              <Detail
                label="User ID"
                value={selectedUser.id}
              />

              <Detail
                label="Phone"
                value={selectedUser.phone}
              />

              <Detail
                label="Account Number"
                value={
                  selectedUser.accountNumber
                }
              />

              <Detail
                label="Account Type"
                value={
                  selectedUser.accountType
                }
              />

              <Detail
                label="Balance"
                value={formatMoney(
                  selectedUser.balance
                )}
              />

              <Detail
                label="Role"
                value={selectedUser.role}
              />

              <Detail
                label="Status"
                value={selectedUser.status}
              />

              <Detail
                label="Created"
                value={selectedUser.createdAt}
              />

            </div>


            <div style={styles.modalActions}>

              <button
                style={styles.editButton}
                onClick={() =>
                  alert("Edit user page coming next")
                }
              >
                ✏️ Edit User
              </button>

              <button
                style={styles.closeButton}
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/* ================= COMPONENTS ================= */

function Stat({
  title,
  value,
  icon,
}) {
  return (
    <div style={styles.stat}>

      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>

        <p style={styles.statTitle}>
          {title}
        </p>

        <h2>
          {value}
        </h2>

      </div>

    </div>
  );
}


function Detail({
  label,
  value,
}) {
  return (
    <div style={styles.detail}>

      <span style={styles.detailLabel}>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
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

  navItem: {
    display: "block",
    padding: "13px",
    marginBottom: "7px",
    borderRadius: "8px",
    color: "#d1d5db",
    textDecoration: "none",
  },

  activeNav: {
    backgroundColor: "#2563eb",
    color: "white",
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
    overflow: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "13px",
  },

  addButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "22px",
  },

  stat: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.04)",
  },

  statIcon: {
    fontSize: "28px",
  },

  statTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  filterCard: {
    backgroundColor: "white",
    padding: "18px",
    borderRadius: "12px",
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },

  search: {
    flex: 1,
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
  },

  select: {
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    backgroundColor: "white",
  },

  tableCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "22px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.04)",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  exportButton: {
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    padding: "9px 15px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  email: {
    display: "block",
    color: "#6b7280",
    fontSize: "11px",
    marginTop: "3px",
  },

  customerRole: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 9px",
    borderRadius: "15px",
    fontSize: "11px",
  },

  adminRole: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "5px 9px",
    borderRadius: "15px",
    fontSize: "11px",
  },

  active: {
    color: "#15803d",
    fontWeight: "bold",
  },

  blocked: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: "5px",
  },

  viewButton: {
    border: "1px solid #2563eb",
    backgroundColor: "white",
    color: "#2563eb",
    padding: "6px 9px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  blockButton: {
    border: "none",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "6px 9px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  activateButton: {
    border: "none",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "6px 9px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  loading: {
    padding: "50px",
    textAlign: "center",
    color: "#6b7280",
  },

  empty: {
    padding: "50px",
    textAlign: "center",
    color: "#6b7280",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    backgroundColor: "white",
    width: "550px",
    maxWidth: "90%",
    borderRadius: "15px",
    padding: "25px",
    maxHeight: "90vh",
    overflowY: "auto",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  close: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "20px",
    cursor: "pointer",
  },

  modalProfile: {
    textAlign: "center",
    padding: "20px",
    borderBottom: "1px solid #eee",
  },

  largeAvatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 auto",
  },

  details: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    padding: "20px 0",
  },

  detail: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  detailLabel: {
    color: "#6b7280",
    fontSize: "12px",
  },

  modalActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },

  editButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  closeButton: {
    backgroundColor: "#e5e7eb",
    border: "none",
    padding: "10px 15px",
    borderRadius: "7px",
    cursor: "pointer",
  },
};

export default AdminUsersAccounts;