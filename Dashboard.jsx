import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const [income] = useState(50000);
  const [expense] = useState(20000);
  const balance = income - expense;

  const dashboardStyle = {
    padding: "2rem",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    color: "#e0e0e0"
  };

  const container = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem"
  };

  const card = {
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    textAlign: "center",
    border: "1px solid #2d2d2d",
    transition: "all 0.3s ease"
  };

  const welcomeCard = {
    padding: "2rem",
    background: "rgba(30, 30, 30, 0.8)",
    border: "1px solid #333",
    borderRadius: "12px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    marginTop: "2rem"
  };

  return (
    <div style={dashboardStyle}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "900",
          color: "#fff",
          margin: 0,
          letterSpacing: "-1px"
        }}>
          📊 Welcome to Dashboard
        </h1>
        <p style={{ color: "#888", marginTop: "0.5rem", fontSize: "1rem" }}>
          Get started with your personal finance management
        </p>
      </div>

      {/* Summary Cards */}
      <div style={container}>
        <div style={{
          ...card,
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
          border: "2px solid #10b981"
        }}>
          <h4 style={{ color: "#888", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", margin: 0, marginBottom: "0.5rem" }}>
            Total Income
          </h4>
          <h2 style={{ color: "#10b981", fontWeight: "bold", margin: 0, fontSize: "2rem" }}>
            ₹ {income.toLocaleString('en-IN')}
          </h2>
        </div>

        <div style={{
          ...card,
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
          border: "2px solid #ef4444"
        }}>
          <h4 style={{ color: "#888", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", margin: 0, marginBottom: "0.5rem" }}>
            Total Expense
          </h4>
          <h2 style={{ color: "#ef4444", fontWeight: "bold", margin: 0, fontSize: "2rem" }}>
            ₹ {expense.toLocaleString('en-IN')}
          </h2>
        </div>

        <div style={{
          ...card,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
          border: "2px solid #3b82f6"
        }}>
          <h4 style={{ color: "#888", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", margin: 0, marginBottom: "0.5rem" }}>
            Balance
          </h4>
          <h2 style={{ color: "#3b82f6", fontWeight: "bold", margin: 0, fontSize: "2rem" }}>
            ₹ {balance.toLocaleString('en-IN')}
          </h2>
        </div>
      </div>

      {/* Welcome Message */}
      <div style={welcomeCard}>
        <h3 style={{ color: "#fff", fontWeight: "bold", fontSize: "1.5rem", margin: "0 0 1rem 0" }}>
          🚀 Ready to Track Your Finances?
        </h3>
        <p style={{ color: "#ccc", margin: "0 0 1.5rem 0", lineHeight: "1.6" }}>
          Head over to the Finance Tracker to manage your income and expenses with detailed analytics and beautiful charts.
        </p>
        <a
          href="/finance"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
          }}
        >
          Go to Finance Tracker →
        </a>
      </div>

      {/* Features Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginTop: "2rem"
      }}>
        <div style={{
          padding: "1.5rem",
          background: "rgba(30, 30, 30, 0.8)",
          border: "1px solid #333",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h4 style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>📈</h4>
          <h3 style={{ color: "#fff", fontWeight: "bold", margin: "0.5rem 0" }}>Track Transactions</h3>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>Add income and expense transactions easily</p>
        </div>

        <div style={{
          padding: "1.5rem",
          background: "rgba(30, 30, 30, 0.8)",
          border: "1px solid #333",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h4 style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>📊</h4>
          <h3 style={{ color: "#fff", fontWeight: "bold", margin: "0.5rem 0" }}>View Analytics</h3>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>Visualize your financial data with charts</p>
        </div>

        <div style={{
          padding: "1.5rem",
          background: "rgba(30, 30, 30, 0.8)",
          border: "1px solid #333",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h4 style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>💡</h4>
          <h3 style={{ color: "#fff", fontWeight: "bold", margin: "0.5rem 0" }}>Smart Insights</h3>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>Get insights on your spending patterns</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;