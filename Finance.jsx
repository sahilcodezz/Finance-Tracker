import { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Finance = () => {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: "Income", description: "", amount: "" });
  const [page, setPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        params: { page },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/transactions", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ type: "Income", description: "", amount: "" });
      setPage(1);
      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const expense = transactions
    .filter(t => t.type === "Expense")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const balance = income - expense;

  // Chart data for bar chart
  const groupedByType = {
    income: income,
    expense: expense
  };

  const barChartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#10b981", "#ef4444"],
        borderColor: ["#059669", "#dc2626"],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: ["#06b6d4", "#f97316"]
      }
    ]
  };

  const pieChartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#10b981", "#ef4444"],
        borderColor: ["#059669", "#dc2626"],
        borderWidth: 2,
        hoverBackgroundColor: ["#06b6d4", "#f97316"]
      }
    ]
  };

  return (
    <div style={{
      padding: "2rem",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
      color: "#e0e0e0"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "900",
          color: "#fff",
          margin: 0,
          letterSpacing: "-1px"
        }}>
          💰 Finance Tracker
        </h1>
        <p style={{ color: "#888", marginTop: "0.5rem", fontSize: "1rem" }}>
          Manage your income and expenses with ease
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* Income Card */}
        <div style={{
          padding: "2rem",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
          border: "2px solid #10b981",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
          transition: "all 0.3s ease"
        }}>
          <h4 style={{ color: "#888", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", margin: 0, marginBottom: "0.5rem" }}>
            Income
          </h4>
          <h2 style={{ color: "#10b981", fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
            ₹ {income.toLocaleString('en-IN')}
          </h2>
        </div>

        {/* Expense Card */}
        <div style={{
          padding: "2rem",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
          border: "2px solid #ef4444",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(239, 68, 68, 0.1)",
          transition: "all 0.3s ease"
        }}>
          <h4 style={{ color: "#888", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", margin: 0, marginBottom: "0.5rem" }}>
            Expense
          </h4>
          <h2 style={{ color: "#ef4444", fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
            ₹ {expense.toLocaleString('en-IN')}
          </h2>
        </div>

        {/* Balance Card */}
        <div style={{
          padding: "2rem",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.1)",
          transition: "all 0.3s ease"
        }}>
          <h4 style={{ color: "#888", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", margin: 0, marginBottom: "0.5rem" }}>
            Balance
          </h4>
          <h2 style={{ color: "#3b82f6", fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
            ₹ {balance.toLocaleString('en-IN')}
          </h2>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div style={{
        padding: "2rem",
        background: "rgba(30, 30, 30, 0.8)",
        border: "1px solid #333",
        borderRadius: "12px",
        marginBottom: "2rem",
        backdropFilter: "blur(10px)"
      }}>
        <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
          Add Transaction
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{
              padding: "0.75rem",
              background: "#252525",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              background: "#252525",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none"
            }}
          />

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              background: "#252525",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
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
            ➕ Add Transaction
          </button>
        </form>
      </div>

      {/* Charts Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        {/* Bar Chart */}
        <div style={{
          padding: "2rem",
          background: "rgba(30, 30, 30, 0.8)",
          border: "1px solid #333",
          borderRadius: "12px",
          backdropFilter: "blur(10px)"
        }}>
          <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
            📊 Income vs Expense
          </h3>
          <Bar data={barChartData} options={{
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#888" },
                grid: { color: "#333" }
              },
              x: {
                ticks: { color: "#888" },
                grid: { display: false }
              }
            }
          }} />
        </div>

        {/* Pie Chart */}
        <div style={{
          padding: "2rem",
          background: "rgba(30, 30, 30, 0.8)",
          border: "1px solid #333",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
            🍰 Distribution
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Pie data={pieChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: "#888" }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{
        padding: "2rem",
        background: "rgba(30, 30, 30, 0.8)",
        border: "1px solid #333",
        borderRadius: "12px",
        backdropFilter: "blur(10px)"
      }}>
        <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
          📝 Recent Transactions
        </h3>

        {transactions.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>
            No transactions yet. Add one to get started!
          </p>
        ) : (
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {transactions.map((t) => (
              <div
                key={t._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  background: "rgba(50, 50, 50, 0.6)",
                  border: `1px solid ${t.type === "Income" ? "#10b98133" : "#ef444433"}`,
                  borderRadius: "8px",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ color: t.type === "Income" ? "#10b981" : "#ef4444", fontWeight: "bold", margin: 0, fontSize: "0.875rem", textTransform: "uppercase" }}>
                    {t.type}
                  </p>
                  <p style={{ color: "#ccc", margin: "0.25rem 0 0 0" }}>
                    {t.description}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{
                    color: t.type === "Income" ? "#10b981" : "#ef4444",
                    fontWeight: "bold",
                    fontSize: "1.1rem"
                  }}>
                    {t.type === "Income" ? "+" : "-"} ₹ {parseFloat(t.amount).toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => handleDelete(t._id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#dc2626";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#ef4444";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid #333"
        }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: "0.5rem 1rem",
              background: page === 1 ? "#555" : "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: page === 1 ? 0.5 : 1
            }}
          >
            ⬅️ Prev
          </button>

          <span style={{
            color: "#ccc",
            fontWeight: "bold",
            fontSize: "1rem",
            minWidth: "100px",
            textAlign: "center"
          }}>
            Page {page}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            style={{
              padding: "0.5rem 1rem",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Next ➡️
          </button>
        </div>
      </div>

    </div>
  );
};

export default Finance;