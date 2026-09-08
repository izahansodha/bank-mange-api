import { useState } from "react";

const API_URL = "https://localhost:7191/api/AI";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed.");
        }

        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setMessages((prev) => [
  ...prev,
  {
    role: "ai",
    text: data.message,
    transferPending: data.transferPending,
    confirmationId: data.confirmationId,
    sourceAccountId: data.sourceAccountId,
    destinationAccountId: data.destinationAccountId,
    amount: data.amount,
  },
]);

    } catch (error) {
      console.error("AI Error:", error);

      let errorMessage =
        "Unable to connect to the banking assistant.";

      if (
        error.message ===
        "Authentication failed."
      ) {
        errorMessage =
          "Your session has expired. Please login again.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const confirmTransfer = async (confirmationId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/transfer/confirm/${confirmationId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Transfer confirmation failed."
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text:
          data.message ||
          "Transfer confirmation received.",
      },
    ]);
  } catch (error) {
    console.error(
      "Transfer confirmation error:",
      error
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text:
          error.message ||
          "Unable to confirm the transfer.",
      },
    ]);
  }
};
const cancelTransfer = async (confirmationId) => {
  setMessages((prev) => [
    ...prev,
    {
      role: "ai",
      text: "Transfer cancelled.",
    },
  ]);
};

  return (
    <>
      {/* =====================================================
          AI BUTTON
      ===================================================== */}

      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",

          width: "60px",
          height: "60px",

          borderRadius: "50%",
          border: "none",

          background: "#111827",
          color: "white",

          fontSize: "24px",

          cursor: "pointer",

          boxShadow:
            "0 8px 25px rgba(0,0,0,0.2)",

          zIndex: 999,
        }}
      >
        ✨
      </button>


      {/* =====================================================
          OVERLAY
      ===================================================== */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,

            background:
              "rgba(0,0,0,0.25)",

            zIndex: 1000,
          }}
        />
      )}


      {/* =====================================================
          SLIDE PANEL
      ===================================================== */}

      <div
        style={{
          position: "fixed",

          top: 0,
          right: 0,

          height: "100vh",

          width: "400px",
          maxWidth: "90%",

          background: "white",

          zIndex: 1001,

          boxShadow:
            "-10px 0 30px rgba(0,0,0,0.15)",

          display: "flex",
          flexDirection: "column",

          transform: isOpen
            ? "translateX(0)"
            : "translateX(100%)",

          transition:
            "transform 0.3s ease",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            padding: "20px",

            borderBottom:
              "1px solid #e5e7eb",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",
          }}
        >
          <div>

            <h2
              style={{
                margin: 0,

                fontSize: "20px",

                color: "#111827",
              }}
            >
              AI Assistant
            </h2>

            <span
              style={{
                fontSize: "13px",

                color: "#6b7280",
              }}
            >
              Banking assistant
            </span>

          </div>


          {/* CLOSE BUTTON */}

          <button
            onClick={() =>
              setIsOpen(false)
            }
            style={{
              border: "none",

              background:
                "transparent",

              fontSize: "24px",

              cursor: "pointer",

              color: "#6b7280",
            }}
          >
            ×
          </button>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        <div
          style={{
            flex: 1,

            overflowY: "auto",

            padding: "20px",

            background: "#f9fafb",
          }}
        >

          {/* EMPTY STATE */}

          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",

                marginTop: "80px",

                color: "#6b7280",
              }}
            >

              <div
                style={{
                  fontSize: "40px",

                  marginBottom: "15px",
                }}
              >
                ✨
              </div>


              <h3
                style={{
                  margin:
                    "0 0 8px",

                  color: "#111827",
                }}
              >
                How can I help?
              </h3>


              <p
                style={{
                  fontSize: "14px",
                }}
              >
                Ask about your banking
                account.
              </p>

            </div>
          )}


          {/* MESSAGE LIST */}

          {messages.map(
            (item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",

                  justifyContent:
                    item.role === "user"
                      ? "flex-end"
                      : "flex-start",

                  marginBottom: "12px",
                }}
              >

                <div
                  style={{
                    maxWidth: "80%",

                    padding:
                      "11px 14px",

                    borderRadius:
                      "14px",

                    background:
                      item.role === "user"
                        ? "#111827"
                        : "white",

                    color:
                      item.role === "user"
                        ? "white"
                        : "#111827",

                    border:
                      item.role === "user"
                        ? "none"
                        : "1px solid #e5e7eb",

                    fontSize: "14px",

                    lineHeight: "1.5",

                    whiteSpace:
                      "pre-wrap",
                  }}
                >
                  {item.text}

{item.transferPending && (
  <div
    style={{
      marginTop: "12px",
      padding: "14px",
      borderRadius: "10px",
      background: "#f9fafb",
      border: "1px solid #d1d5db",
    }}
  >
    <div
      style={{
        fontWeight: "600",
        marginBottom: "10px",
      }}
    >
      Confirm Transfer
    </div>

    <div style={{ marginBottom: "6px" }}>
      Amount: ₹
      {Number(item.amount).toLocaleString("en-IN")}
    </div>

    <div
      style={{
        display: "flex",
        gap: "8px",
        marginTop: "12px",
      }}
    >
      <button
        type="button"
        onClick={() =>
          cancelTransfer(item.confirmationId)
        }
        style={{
          padding: "8px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "white",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() =>
          confirmTransfer(item.confirmationId)
        }
        style={{
          padding: "8px 12px",
          border: "none",
          borderRadius: "8px",
          background: "#111827",
          color: "white",
          cursor: "pointer",
        }}
      >
        Confirm Transfer
      </button>
    </div>
  </div>
)}
                </div>

              </div>
            )
          )}


          {/* LOADING */}

          {loading && (
            <div
              style={{
                display: "flex",

                justifyContent:
                  "flex-start",

                marginBottom: "12px",
              }}
            >

              <div
                style={{
                  padding:
                    "11px 14px",

                  borderRadius:
                    "14px",

                  background: "white",

                  border:
                    "1px solid #e5e7eb",

                  color: "#6b7280",

                  fontSize: "14px",
                }}
              >
                AI is thinking...
              </div>

            </div>
          )}

        </div>


        {/* =================================================
            INPUT
        ================================================= */}

        <form
          onSubmit={sendMessage}
          style={{
            padding: "15px",

            borderTop:
              "1px solid #e5e7eb",

            background: "white",

            display: "flex",

            gap: "10px",
          }}
        >

          <input
            value={message}

            onChange={(e) =>
              setMessage(e.target.value)
            }

            placeholder="Ask something..."

            disabled={loading}

            style={{
              flex: 1,

              padding:
                "12px 14px",

              borderRadius: "10px",

              border:
                "1px solid #d1d5db",

              outline: "none",

              fontSize: "14px",
            }}
          />


          <button
            type="submit"

            disabled={
              loading ||
              !message.trim()
            }

            style={{
              padding:
                "0 18px",

              border: "none",

              borderRadius: "10px",

              background:
                loading ||
                !message.trim()
                  ? "#d1d5db"
                  : "#111827",

              color: "white",

              cursor:
                loading ||
                !message.trim()
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "..." : "Send"}
          </button>

        </form>

      </div>
    </>
  );
}