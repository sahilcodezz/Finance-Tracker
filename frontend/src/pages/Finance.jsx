import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Trash2,
  Download,
  Filter,
  ArrowUpDown,
  Calendar,
  Layers,
  Utensils,
  ShoppingBag,
  Briefcase,
  Zap,
  HeartPulse,
  Car,
  Wallet,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const QUICK_CATEGORIES = {
  Income: ["Salary", "Freelance", "Investments", "Bonus", "Crypto", "Side Project"],
  Expense: ["Dining & Food", "Groceries", "Rent & Bills", "Shopping", "Tech & SaaS", "Transport", "Healthcare"]
};

const Finance = () => {
  const token = localStorage.getItem("token");
  const { isDark } = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form State
  const [form, setForm] = useState({
    type: "Expense",
    description: "",
    amount: ""
  });

  // Filter & Search & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "highest", "lowest"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;

    setSubmitting(true);
    try {
      await api.post("/api/transactions", {
        type: form.type,
        description: form.description,
        amount: parseFloat(form.amount)
      });

      setForm({ type: form.type, description: "", amount: "" });
      setFeedback({ type: "success", message: "Transaction recorded successfully!" });
      setTimeout(() => setFeedback(null), 3000);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to save transaction." });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
      setFeedback({ type: "success", message: "Transaction removed." });
      setTimeout(() => setFeedback(null), 2500);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Unable to delete record." });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleQuickTagClick = (tag) => {
    setForm(prev => ({
      ...prev,
      description: prev.description ? `${prev.description} - ${tag}` : tag
    }));
  };

  // Export to CSV function
  const exportToCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["ID,Type,Description,Amount,Date\n"];
    const rows = transactions.map(t => 
      `"${t._id}","${t.type}","${t.description.replace(/"/g, '""')}","${t.amount}","${t.date || ''}"`
    );
    const blob = new Blob([headers.concat(rows.join("\n"))], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `aurafinance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "All" || t.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.date || 0) - new Date(a.date || 0);
        if (sortBy === "oldest") return new Date(a.date || 0) - new Date(b.date || 0);
        if (sortBy === "highest") return parseFloat(b.amount) - parseFloat(a.amount);
        if (sortBy === "lowest") return parseFloat(a.amount) - parseFloat(b.amount);
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Financial aggregates
  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const expense = transactions
    .filter(t => t.type === "Expense")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const balance = income - expense;

  const doughnutData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income || 1, expense || (income ? 0 : 1)],
        backgroundColor: ["#10b981", "#f43f5e"],
        borderColor: [isDark ? "#07090e" : "#ffffff", isDark ? "#07090e" : "#ffffff"],
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const getCategoryIcon = (desc = "") => {
    const text = desc.toLowerCase();
    if (text.includes("salary") || text.includes("freelance") || text.includes("work")) {
      return <Briefcase className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    }
    if (text.includes("food") || text.includes("grocer") || text.includes("dine") || text.includes("restaurant")) {
      return <Utensils className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
    }
    if (text.includes("bill") || text.includes("power") || text.includes("rent") || text.includes("electric")) {
      return <Zap className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
    }
    if (text.includes("shop") || text.includes("amazon") || text.includes("cloth")) {
      return <ShoppingBag className="w-4 h-4 text-pink-500 dark:text-pink-400" />;
    }
    if (text.includes("health") || text.includes("med") || text.includes("doctor")) {
      return <HeartPulse className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
    }
    if (text.includes("car") || text.includes("fuel") || text.includes("travel") || text.includes("uber")) {
      return <Car className="w-4 h-4 text-sky-500 dark:text-sky-400" />;
    }
    return <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative pb-16 sm:pb-20 transition-colors duration-300">
      {/* Background ambient orbs */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-80 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Toast / Notification banner */}
        {feedback && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
            feedback.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-500/40 dark:text-emerald-300" 
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-500/40 dark:text-rose-300"
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{feedback.message}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 md:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                Live Financial Ledger
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                • {transactions.length} Total Records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Transaction Hub
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400">
              Record cash flows, categorize expenditures, and analyze portfolio balance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={transactions.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Download your transactions as a CSV spreadsheet"
            >
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          
          {/* Net Balance Card */}
          <div className="p-5 sm:p-6 rounded-2xl glass-card border border-slate-200 dark:border-white/10 glass-card-hover relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Net Portfolio</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
                ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                {balance >= 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> Positive Balance
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> Net Negative
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Income Card */}
          <div className="p-5 sm:p-6 rounded-2xl glass-card border border-slate-200 dark:border-white/10 glass-card-hover relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recorded Income</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight font-['Outfit']">
                +₹{income.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {transactions.filter(t => t.type === "Income").length} inflow entries
              </p>
            </div>
          </div>

          {/* Expense Card */}
          <div className="p-5 sm:p-6 rounded-2xl glass-card border border-slate-200 dark:border-white/10 glass-card-hover relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recorded Expenses</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight font-['Outfit']">
                -₹{expense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {transactions.filter(t => t.type === "Expense").length} outflow entries
              </p>
            </div>
          </div>

        </div>

        {/* Add Transaction Section & Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Add Transaction Form (7 columns) */}
          <div className="lg:col-span-7 p-5 sm:p-7 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Create New Entry</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Fast logging for expenses or income</p>
                </div>
              </div>

              {/* Type Switcher Pills */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: "Income" }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    form.type === "Income"
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  + Income
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: "Expense" }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    form.type === "Expense"
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  - Expense
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Amount Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-base font-bold pointer-events-none">
                      ₹
                    </span>
                    <input
                      name="amount"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                      className="w-full pl-9 pr-4 py-3 rounded-xl glass-input text-base sm:text-lg font-bold placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Description / Category
                  </label>
                  <input
                    name="description"
                    type="text"
                    placeholder="e.g. Freelance Client, Grocery, Rent"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium placeholder-slate-400 transition-all"
                  />
                </div>

              </div>

              {/* Quick Category Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quick Suggestion Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CATEGORIES[form.type].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQuickTagClick(tag)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                    form.type === "Income"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40"
                      : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-500/25 hover:shadow-rose-500/40"
                  } hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving to ledger...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                      <span>Record {form.type}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Mini Visualization Hub (5 columns) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Volume Distribution</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chart Preview</span>
            </div>

            <div className="h-48 sm:h-52 flex items-center justify-center relative">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: isDark ? "#0b0f19" : "#ffffff",
                      titleColor: isDark ? "#ffffff" : "#0f172a",
                      bodyColor: isDark ? "#cbd5e1" : "#334155",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      borderWidth: 1,
                      callbacks: {
                        label: (ctx) => ` ₹${ctx.raw.toLocaleString("en-IN")}`
                      }
                    }
                  }
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Net Balance</span>
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                  ₹{balance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 flex items-center justify-around text-xs">
              <div className="text-center">
                <span className="text-slate-500 dark:text-slate-400 block">Total Inflow</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{income.toLocaleString("en-IN")}</span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>
              <div className="text-center">
                <span className="text-slate-500 dark:text-slate-400 block">Total Outflow</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">₹{expense.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Transactions Table & Filtering Section */}
        <div className="p-5 sm:p-7 md:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          
          {/* Filter, Search & Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">All Transactions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {filteredTransactions.length} of {transactions.length} records
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              
              {/* Search Bar */}
              <div className="relative min-w-[180px] sm:min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm placeholder-slate-400"
                />
              </div>

              {/* Type Filter Buttons */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
                {["All", "Income", "Expense"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      typeFilter === type
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/80 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 outline-none cursor-pointer text-xs font-medium"
                >
                  <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Newest First</option>
                  <option value="oldest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Oldest First</option>
                  <option value="highest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Highest Amount</option>
                  <option value="lowest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Lowest Amount</option>
                </select>
              </div>

            </div>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-medium">Synchronizing transactions...</p>
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">No transactions match your search</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try clearing search filters or add a new transaction above.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {paginatedTransactions.map((tx) => {
                const isIncome = tx.type === "Income";
                return (
                  <div
                    key={tx._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] hover:bg-slate-200/60 dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.06] transition-all duration-200 group gap-3"
                  >
                    {/* Left: Icon & Description */}
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isIncome
                          ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400"
                      }`}>
                        {getCategoryIcon(tx.description)}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors truncate">
                            {tx.description}
                          </p>
                          <span className={`px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-md tracking-wider uppercase flex-shrink-0 ${
                            isIncome
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}>
                            {tx.type}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {tx.date ? new Date(tx.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }) : "Recent"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount & Delete Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-white/5">
                      <div className="text-left sm:text-right">
                        <span className={`text-sm sm:text-base md:text-lg font-extrabold tracking-tight font-['Outfit'] ${
                          isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {isIncome ? "+" : "-"} ₹{parseFloat(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all opacity-80 hover:opacity-100"
                        title="Delete transaction"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-white/10 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-white/10 transition-all"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Finance;