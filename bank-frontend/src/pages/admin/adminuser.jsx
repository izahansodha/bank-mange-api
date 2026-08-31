import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import { getAdminUsers } from "../../api/adminApi";

function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to view users."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load users."
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

    loadUsers();
  }, [user]);

  // =====================================================
  // FORMAT DATE
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
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return users.filter((item) => {
      const matchesSearch =
        !searchText ||
        String(item.fullName || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.userId || "")
          .toLowerCase()
          .includes(searchText);

      const matchesRole =
        roleFilter === "All" ||
        item.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalUsers = users.length;

  const totalCustomers = users.filter(
    (item) => item.role === "Customer"
  ).length;

  const totalAdmins = users.filter(
    (item) => item.role === "Admin"
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading users...</p>
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
            Users
          </h1>

          <p style={styles.subtitle}>
            View registered users and their roles.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={loadUsers}
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
            <Users size={20} />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Users
            </span>

            <strong style={styles.summaryValue}>
              {totalUsers}
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
            C
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Customers
            </span>

            <strong style={styles.summaryValue}>
              {totalCustomers}
            </strong>
          </div>

        </div>

        <div style={styles.summaryCard}>

          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#fff7ed",
              color: "#ea580c",
            }}
          >
            A
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Administrators
            </span>

            <strong style={styles.summaryValue}>
              {totalAdmins}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          USER LIST
      ================================================= */}

      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              All Users
            </h2>

            <p style={styles.sectionSubtitle}>
              {filteredUsers.length} user
              {filteredUsers.length !== 1
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
              placeholder="Search name, email or user ID..."
              style={styles.searchInput}
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              All Roles
            </option>

            <option value="Customer">
              Customer
            </option>

            <option value="Admin">
              Admin
            </option>

          </select>

        </div>

        {/* TABLE */}

        <div style={styles.tableCard}>

          {filteredUsers.length === 0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                <Users size={25} />
              </div>

              <h3>
                No users found
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
                      User
                    </th>

                    <th style={styles.th}>
                      Email
                    </th>

                    <th style={styles.th}>
                      Role
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

                  {filteredUsers.map(
                    (item) => (

                      <tr
                        key={item.userId}
                        style={styles.row}
                      >

                        {/* USER */}

                        <td style={styles.td}>

                          <div
                            style={
                              styles.userCell
                            }
                          >

                            <div
                              style={
                                styles.avatar
                              }
                            >
                              {item.fullName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div>

                              <strong
                                style={
                                  styles.userName
                                }
                              >
                                {item.fullName ||
                                  "Unknown User"}
                              </strong>

                              <span
                                style={
                                  styles.userId
                                }
                              >
                                {item.userId}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td style={styles.td}>
                          {item.email}
                        </td>

                        {/* ROLE */}

                        <td style={styles.td}>

                          <span
                            style={
                              item.role === "Admin"
                                ? styles.adminBadge
                                : styles.customerBadge
                            }
                          >
                            {item.role}
                          </span>

                        </td>

                        {/* CREATED */}

                        <td style={styles.td}>
                          {formatDate(
                            item.createdAt
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
                              setSelectedUser(
                                item
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
          USER DETAILS MODAL
      ================================================= */}

      {selectedUser && (

        <div
          style={styles.overlay}
          onClick={() =>
            setSelectedUser(null)
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
                  USER DETAILS
                </p>

                <h2>
                  User Profile
                </h2>
              </div>

              <button
                style={styles.closeButton}
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                <X size={19} />
              </button>

            </div>

            <div style={styles.profileHeader}>

              <div style={styles.largeAvatar}>
                {selectedUser.fullName
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div>

                <h3 style={styles.profileName}>
                  {selectedUser.fullName ||
                    "Unknown User"}
                </h3>

                <p style={styles.profileEmail}>
                  {selectedUser.email}
                </p>

              </div>

            </div>

            <div style={styles.modalGrid}>

              <div>
                <span>
                  User ID
                </span>

                <strong>
                  {selectedUser.userId}
                </strong>
              </div>

              <div>
                <span>
                  Role
                </span>

                <strong>
                  {selectedUser.role}
                </strong>
              </div>

              <div>
                <span>
                  Full Name
                </span>

                <strong>
                  {selectedUser.fullName}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {selectedUser.email}
                </strong>
              </div>

              <div>
                <span>
                  Created
                </span>

                <strong>
                  {formatDate(
                    selectedUser.createdAt
                  )}
                </strong>
              </div>

            </div>

            <button
              style={styles.doneButton}
              onClick={() =>
                setSelectedUser(null)
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
    fontSize: "14px",
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
    fontSize: "20px",
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
    minWidth: "800px",
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

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  avatar: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "700",
  },

  userName: {
    display: "block",
    color: "#334155",
  },

  userId: {
    display: "block",
    marginTop: "2px",
    color: "#94a3b8",
    fontSize: "9px",
  },

  customerBadge: {
    padding: "5px 9px",
    borderRadius: "15px",
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    fontSize: "10px",
    fontWeight: "700",
  },

  adminBadge: {
    padding: "5px 9px",
    borderRadius: "15px",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
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
    maxWidth: "520px",
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

  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
  },

  largeAvatar: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    fontSize: "17px",
    fontWeight: "700",
  },

  profileName: {
    margin: 0,
    color: "#0f172a",
  },

  profileEmail: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "11px",
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

export default AdminUsers;