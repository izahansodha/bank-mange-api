import { useState } from "react";

function Profile() {
  const savedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [profile, setProfile] = useState({
    fullName: savedUser.fullName || "",
    email: savedUser.email || "",
    phone: savedUser.phone || "",
    address: savedUser.address || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...savedUser,
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setMessage("Profile updated successfully.");
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
            style={styles.navItem}
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
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
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
          <h1>My Profile</h1>

          <p style={styles.subtitle}>
            Manage your personal information
          </p>
        </div>


        <div style={styles.grid}>

          {/* Profile Card */}
          <div style={styles.profileCard}>

            <div style={styles.avatar}>
              {profile.fullName
                ? profile.fullName
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <h2>
              {profile.fullName || "Customer"}
            </h2>

            <p style={styles.email}>
              {profile.email ||
                "email@example.com"}
            </p>

            <div style={styles.role}>
              {savedUser.role || "Customer"}
            </div>

          </div>


          {/* Edit Profile */}
          <div style={styles.formCard}>

            <h2>Personal Information</h2>

            <form onSubmit={handleSave}>

              <div style={styles.row}>

                <div style={styles.inputGroup}>

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    style={styles.input}
                  />

                </div>


                <div style={styles.inputGroup}>

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    style={styles.input}
                  />

                </div>

              </div>


              <div style={styles.row}>

                <div style={styles.inputGroup}>

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    style={styles.input}
                  />

                </div>


                <div style={styles.inputGroup}>

                  <label>
                    Role
                  </label>

                  <input
                    type="text"
                    value={
                      savedUser.role ||
                      "Customer"
                    }
                    disabled
                    style={{
                      ...styles.input,
                      backgroundColor:
                        "#f3f4f6",
                    }}
                  />

                </div>

              </div>


              <div style={styles.inputGroup}>

                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="4"
                  style={styles.textarea}
                />

              </div>


              <button
                type="submit"
                style={styles.saveButton}
              >
                Save Changes
              </button>

            </form>


            {message && (
              <div style={styles.success}>
                ✓ {message}
              </div>
            )}

          </div>

        </div>


        {/* Security */}
        <div style={styles.securityCard}>

          <div>
            <h2>🔐 Account Security</h2>

            <p>
              Keep your account secure by
              regularly updating your password.
            </p>
          </div>

          <button
            style={styles.passwordButton}
            onClick={() =>
              alert(
                "Password change page will be connected to the API next."
              )
            }
          >
            Change Password
          </button>

        </div>


        {/* Account Status */}
        <div style={styles.statusCard}>

          <div>
            <h2>Account Status</h2>

            <p>
              Your banking account is currently
              active.
            </p>
          </div>

          <span style={styles.active}>
            ● Active
          </span>

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

  grid: {
    display: "grid",
    gridTemplateColumns:
      "280px minmax(400px, 1fr)",
    gap: "25px",
  },

  profileCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "35px",
    textAlign: "center",
    height: "fit-content",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.05)",
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "38px",
    fontWeight: "bold",
    margin: "0 auto 20px",
  },

  email: {
    color: "#6b7280",
  },

  role: {
    display: "inline-block",
    marginTop: "15px",
    padding: "7px 15px",
    borderRadius: "20px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "14px",
  },

  formCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.05)",
  },

  row: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },

  input: {
    marginTop: "8px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
  },

  textarea: {
    marginTop: "8px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
  },

  saveButton: {
    marginTop: "25px",
    padding: "13px 25px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },

  success: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },

  securityCard: {
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  passwordButton: {
    padding: "11px 18px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#2563eb",
    cursor: "pointer",
  },

  statusCard: {
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  active: {
    color: "#16a34a",
    fontWeight: "bold",
  },
};

export default Profile;