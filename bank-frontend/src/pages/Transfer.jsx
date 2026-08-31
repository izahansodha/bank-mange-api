import { useEffect, useState } from "react";
import { getMyAccounts } from "../api/accountApi";
import { transfer } from "../api/transactionApi";
import { useNavigate } from "react-router-dom";

function Transfer() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);

      const data = await getMyAccounts();

      const activeAccounts = data.filter(
        (account) => account.status === "Active"
      );

      setAccounts(activeAccounts);

      if (activeAccounts.length >= 1) {
        setFromAccountId(activeAccounts[0].id);
      }

      if (activeAccounts.length >= 2) {
        setToAccountId(activeAccounts[1].id);
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

  const selectedFromAccount = accounts.find(
    (account) =>
      Number(account.id) === Number(fromAccountId)
  );

  const handleTransfer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const numericAmount = Number(amount);

    if (!fromAccountId || !toAccountId) {
      setError("Please select both accounts.");
      return;
    }

    if (
      Number(fromAccountId) === Number(toAccountId)
    ) {
      setError(
        "From Account and To Account cannot be the same."
      );
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

    if (
      selectedFromAccount &&
      numericAmount >
        Number(selectedFromAccount.balance)
    ) {
      setError("Insufficient balance.");
      return;
    }

    try {
      setLoading(true);

      await transfer({
        fromAccountId: Number(fromAccountId),
        toAccountId: Number(toAccountId),
        amount: numericAmount,
      });

      setMessage("Transfer successful!");

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
          "Transfer failed."
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

        <h1 style={styles.title}>
          Transfer Money
        </h1>

        <p style={styles.subtitle}>
          Transfer money between bank accounts
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
        ) : accounts.length < 2 ? (
          <div style={styles.empty}>
            <h3>Two active accounts required</h3>

            <p>
              You need at least two active accounts
              to make a transfer.
            </p>

            <button
              style={styles.button}
              onClick={() => navigate("/account")}
            >
              Go to Accounts
            </button>
          </div>
        ) : (
          <form onSubmit={handleTransfer}>

            <div style={styles.inputGroup}>
              <label>From Account</label>

              <select
                value={fromAccountId}
                onChange={(e) =>
                  setFromAccountId(e.target.value)
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

            {selectedFromAccount && (
              <div style={styles.balanceBox}>
                <span>Available Balance</span>

                <strong>
                  {formatMoney(
                    selectedFromAccount.balance
                  )}
                </strong>
              </div>
            )}

            <div style={styles.arrow}>
              ↓
            </div>

            <div style={styles.inputGroup}>
              <label>To Account</label>

              <select
                value={toAccountId}
                onChange={(e) =>
                  setToAccountId(e.target.value)
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
                : "Transfer Money"}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(amount || 0));
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

  balanceBox: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  arrow: {
    textAlign: "center",
    fontSize: "25px",
    marginBottom: "15px",
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

export default Transfer;