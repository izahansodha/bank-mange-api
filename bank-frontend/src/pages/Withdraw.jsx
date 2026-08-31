import { useEffect, useState } from "react";
import { deposit } from "../api/transactionApi";
import { getMyAccounts } from "../api/accountApi";
import { useNavigate } from "react-router-dom";

function Deposit() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await getMyAccounts();

      const activeAccounts = data.filter(
        (account) => account.status === "Active"
      );

      setAccounts(activeAccounts);

      if (activeAccounts.length > 0) {
        setAccountId(activeAccounts[0].id);
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load accounts."
      );
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const numericAmount = Number(amount);

    if (!accountId) {
      setError("Please select an account.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (numericAmount > 1000000) {
      setError("Amount cannot exceed ₹10,00,000.");
      return;
    }

    try {
      setLoading(true);

      await deposit({
        accountId: Number(accountId),
        amount: numericAmount,
      });

      setMessage("Deposit successful!");

      setAmount("");

      setTimeout(() => {
        navigate("/transactions");
      }, 1000);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Deposit failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/account")}
        >
          ← Back to Accounts
        </button>

        <h1 style={styles.title}>Deposit Money</h1>

        <p style={styles.subtitle}>
          Add money to your bank account
        </p>

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {loadingAccounts ? (
          <p>Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <div style={styles.empty}>
            <h3>No active accounts</h3>

            <p>
              You need an active account before making a deposit.
            </p>

            <button
              style={styles.button}
              onClick={() => navigate("/account")}
            >
              Go to Accounts
            </button>
          </div>
        ) : (
          <form onSubmit={handleDeposit}>
            <div style={styles.inputGroup}>
              <label>Account</label>

              <select
                value={accountId}
                onChange={(e) =>
                  setAccountId(e.target.value)
                }
                style={styles.input}
              >
                {accounts.map((account) => (
                  <option
                    key={account.id}
                    value={account.id}
                  >
                    {account.accountType} -{" "}
                    {account.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label>Amount</label>

              <input
                type="number"
                min="1"
                max="1000000"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                style={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.button}
            >
              {loading
                ? "Processing..."
                : "Deposit Money"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "420px",
    backgroundColor: "white",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
  },

  backButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: "0",
    marginBottom: "25px",
    fontSize: "14px",
  },

  title: {
    marginBottom: "5px",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "25px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },

  input: {
    marginTop: "8px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    width: "100%",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  empty: {
    textAlign: "center",
    padding: "20px 0",
  },
};

export default Deposit;