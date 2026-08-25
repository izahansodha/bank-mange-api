import { useState } from "react";

function Transfer() {
  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const accounts = [
    {
      id: "4582",
      name: "Savings Account",
      balance: 85500,
    },
    {
      id: "7821",
      name: "Current Account",
      balance: 40000,
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    setMessage("");

    const amount = Number(form.amount);

    if (!form.fromAccount) {
      setMessage("Please select the source account.");
      return;
    }

    if (!form.toAccount) {
      setMessage("Please enter the receiver account.");
      return;
    }

    if (form.fromAccount === form.toAccount) {
      setMessage(
        "Source and receiver account cannot be the same."
      );
      return;
    }

    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const selectedAccount = accounts.find(
      (account) => account.id === form.fromAccount
    );

    if (selectedAccount && amount > selectedAccount.balance) {
      setMessage("Insufficient balance.");
      return;
    }

    setLoading(true);

    /*
      API connection will be added here.

      Example:

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://localhost:7000/api/Transfers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fromAccountId: form.fromAccount,
            toAccountNumber: form.toAccount,
            amount: amount,
            description: form.description,
          }),
        }
      );
    */

    setTimeout(() => {
      setLoading(false);

      setMessage(
        `Transfer request of ₹${amount.toLocaleString(
          "en-IN"
        )} submitted successfully.`
      );

      setForm({
        fromAccount: "",
        toAccount: "",
        amount: "",
        description: "",
      });
    }, 800);
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
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
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
            <h1>Transfer Money</h1>

            <p style={styles.subtitle}>
              Send money securely to another account
            </p>
          </div>
        </div>


        <div style={styles.content}>

          {/* Transfer Form */}
          <div style={styles.card}>

            <h2>Make a Transfer</h2>

            <form onSubmit={handleTransfer}>

              {/* From Account */}
              <div style={styles.inputGroup}>

                <label>
                  From Account
                </label>

                <select
                  name="fromAccount"
                  value={form.fromAccount}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">
                    Select account
                  </option>

                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.name} - ****{" "}
                      {account.id}
                    </option>
                  ))}
                </select>

              </div>


              {/* Receiver */}
              <div style={styles.inputGroup}>

                <label>
                  Receiver Account Number
                </label>

                <input
                  type="text"
                  name="toAccount"
                  value={form.toAccount}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  style={styles.input}
                />

              </div>


              {/* Amount */}
              <div style={styles.inputGroup}>

                <label>
                  Amount
                </label>

                <div style={styles.amountBox}>

                  <span>₹</span>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    style={styles.amountInput}
                  />

                </div>

              </div>


              {/* Description */}
              <div style={styles.inputGroup}>

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Payment description"
                  rows="4"
                  style={styles.textarea}
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                style={styles.transferButton}
              >
                {loading
                  ? "Processing..."
                  : "Transfer Money"}
              </button>

            </form>


            {message && (
              <div style={styles.message}>
                {message}
              </div>
            )}

          </div>


          {/* Information */}
          <div>

            <div style={styles.infoCard}>

              <h2>💡 Transfer Information</h2>

              <p>
                Please verify the receiver account
                number before sending money.
              </p>

              <p>
                Transfers are processed securely
                through the banking system.
              </p>

              <p>
                Make sure you have sufficient
                balance before transferring.
              </p>

            </div>


            <div style={styles.limitCard}>

              <h3>Daily Transfer Limit</h3>

              <h2>₹5,00,000</h2>

              <p>
                Maximum amount you can transfer
                per day.
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
    marginBottom: "30px",
  },

  subtitle: {
    color: "#6b7280",
  },

  content: {
    display: "grid",
    gridTemplateColumns:
      "minmax(400px, 2fr) minmax(280px, 1fr)",
    gap: "25px",
  },

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.06)",
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

  amountBox: {
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    paddingLeft: "12px",
  },

  amountInput: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "18px",
  },

  textarea: {
    marginTop: "8px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    resize: "vertical",
    fontSize: "15px",
  },

  transferButton: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  message: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#ecfdf5",
    color: "#047857",
  },

  infoCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "15px",
    lineHeight: "1.6",
  },

  limitCard: {
    marginTop: "20px",
    backgroundColor: "#1d4ed8",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
  },
};

export default Transfer;