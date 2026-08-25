import { useState } from "react";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! 👋 I'm your BankApp AI Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "What is my account balance?",
    "Show my recent transactions",
    "How can I transfer money?",
    "How can I change my password?",
  ];

  const sendMessage = async (messageText = input) => {
    const text = messageText.trim();

    if (!text || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    /*
      REAL AI API WILL BE CONNECTED HERE.

      Example:

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://localhost:7000/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          sender: "ai",
          text: data.response,
        },
      ]);
    */

    // Temporary demo response
    setTimeout(() => {
      let response =
        "I can help you with accounts, transactions, transfers and general banking questions.";

      const lowerText = text.toLowerCase();

      if (
        lowerText.includes("balance") ||
        lowerText.includes("money")
      ) {
        response =
          "You can view your current account balances from the Accounts page. 🔐 For security, I will retrieve the real balance from your authenticated banking API.";
      } else if (
        lowerText.includes("transaction")
      ) {
        response =
          "You can see your recent transactions on the Transactions page. I can also help you understand a particular transaction.";
      } else if (
        lowerText.includes("transfer")
      ) {
        response =
          "To transfer money, open the Transfer page, select your account, enter the receiver account number and amount, then confirm the transfer.";
      } else if (
        lowerText.includes("password")
      ) {
        response =
          "You can change your password from your Profile page. Never share your password or OTP with anyone.";
      } else if (
        lowerText.includes("hello") ||
        lowerText.includes("hi")
      ) {
        response =
          "Hello! 👋 How can I help with your banking today?";
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          sender: "ai",
          text: response,
        },
      ]);

      setLoading(false);
    }, 700);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
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

          <a
            href="/"
            style={styles.navItem}
          >
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
            style={styles.navItem}
          >
            👤 Profile
          </a>

          <a
            href="/ai"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            🤖 AI Assistant
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

            <h1>
              AI Banking Assistant
            </h1>

            <p style={styles.subtitle}>
              Get help with your banking
            </p>

          </div>

          <div style={styles.online}>
            <span style={styles.dot}></span>
            AI Online
          </div>

        </div>


        <div style={styles.chatCard}>

          {/* Chat Header */}
          <div style={styles.chatHeader}>

            <div style={styles.aiAvatar}>
              🤖
            </div>

            <div>

              <h3 style={{ margin: 0 }}>
                BankApp Assistant
              </h3>

              <span style={styles.smallText}>
                Secure banking assistant
              </span>

            </div>

          </div>


          {/* Messages */}
          <div style={styles.messages}>

            {messages.map((message) => (

              <div
                key={message.id}
                style={
                  message.sender === "user"
                    ? styles.userRow
                    : styles.aiRow
                }
              >

                {message.sender === "ai" && (
                  <div style={styles.messageAvatar}>
                    🤖
                  </div>
                )}

                <div
                  style={
                    message.sender === "user"
                      ? styles.userMessage
                      : styles.aiMessage
                  }
                >
                  {message.text}
                </div>

              </div>

            ))}

            {loading && (
              <div style={styles.aiRow}>

                <div style={styles.messageAvatar}>
                  🤖
                </div>

                <div style={styles.aiMessage}>
                  Thinking...
                </div>

              </div>
            )}

          </div>


          {/* Quick Questions */}
          <div style={styles.quickSection}>

            <p style={styles.quickTitle}>
              Quick questions
            </p>

            <div style={styles.quickButtons}>

              {quickQuestions.map(
                (question) => (

                  <button
                    key={question}
                    onClick={() =>
                      sendMessage(question)
                    }
                    style={styles.quickButton}
                  >
                    {question}
                  </button>

                )
              )}

            </div>

          </div>


          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={styles.inputArea}
          >

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask me anything about your banking..."
              style={styles.chatInput}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={styles.sendButton}
            >
              ➤
            </button>

          </form>


          {/* Security Notice */}
          <div style={styles.security}>
            🔒 Never share your password, PIN or OTP
            with the AI assistant.
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
    display: "flex",
    flexDirection: "column",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  subtitle: {
    color: "#6b7280",
  },

  online: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#16a34a",
    fontWeight: "bold",
  },

  dot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    backgroundColor: "#16a34a",
  },

  chatCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow:
      "0 4px 20px rgba(0,0,0,0.07)",
    maxWidth: "1000px",
    width: "100%",
    margin: "0 auto",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: "650px",
  },

  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px 25px",
    borderBottom: "1px solid #eee",
  },

  aiAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  smallText: {
    color: "#6b7280",
    fontSize: "13px",
  },

  messages: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
    minHeight: "350px",
  },

  aiRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "18px",
  },

  userRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "18px",
  },

  messageAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  aiMessage: {
    backgroundColor: "#f3f4f6",
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "70%",
    lineHeight: "1.5",
  },

  userMessage: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "70%",
    lineHeight: "1.5",
  },

  quickSection: {
    padding: "15px 25px",
    borderTop: "1px solid #eee",
  },

  quickTitle: {
    margin: "0 0 10px",
    color: "#6b7280",
    fontSize: "13px",
  },

  quickButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  quickButton: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "20px",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "13px",
  },

  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "18px 25px",
    borderTop: "1px solid #eee",
  },

  chatInput: {
    flex: 1,
    padding: "13px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    fontSize: "15px",
  },

  sendButton: {
    width: "50px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  },

  security: {
    padding: "10px",
    textAlign: "center",
    fontSize: "12px",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
  },
};

export default AIAssistant;