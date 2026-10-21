import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Utensils,
  Zap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  FileSpreadsheet
} from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isDark } = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  // Derived financial computations
  const incomeTransactions = transactions.filter(t => t.type === "Income");
  const expenseTransactions = transactions.filter(t => t.type === "Expense");

  const totalIncome = incomeTransactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const totalExpense = expenseTransactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Chart configuration
  const barChartData = {
    labels: ["Total Income", "Total Expenses"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalIncome || 0, totalExpense || 0],
        backgroundColor: [
          "rgba(16, 185, 129, 0.85)",
          "rgba(244, 63, 94, 0.85)"
        ],
        borderColor: ["#10b981", "#f43f5e"],
        borderWidth: 2,
        borderRadius: 10,
        hoverBackgroundColor: ["#34d399", "#fb7185"]
      }
    ]
  };

  const doughnutData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [totalIncome || 1, totalExpense || (totalIncome ? 0 : 1)],
        backgroundColor: [
          "rgba(16, 185, 129, 0.9)",
          "rgba(244, 63, 94, 0.9)"
        ],
        borderColor: [isDark ? "#07090e" : "#ffffff", isDark ? "#07090e" : "#ffffff"],
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const getCategoryIcon = (desc = "") => {
    const text = desc.toLowerCase();
    if (text.includes("salary") || text.includes("work") || text.includes("freelance")) {
      return <Briefcase className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    }
    if (text.includes("food") || text.includes("coffee") || text.includes("dinner") || text.includes("lunch")) {
      return <Utensils className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
    }
    if (text.includes("bill") || text.includes("power") || text.includes("recharge") || text.includes("wifi")) {
      return <Zap className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
    }
    if (text.includes("shop") || text.includes("cloth") || text.includes("amazon") || text.includes("flipkart")) {
      return <ShoppingBag className="w-4 h-4 text-pink-500 dark:text-pink-400" />;
    }
    return <Layers className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />;
  };

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
    .slice(0, 5);

  // If NOT logged in, show the showcase landing presentation
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative overflow-hidden pb-16 sm:pb-20 transition-colors duration-300">
        {/* Glow Spheres */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-indigo-500/15 via-violet-500/10 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-10 w-80 h-80 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 space-y-16 sm:space-y-20 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center space-y-5 sm:space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/10 animate-float">
              <span>Next-Generation Financial Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] font-['Outfit']">
              Master Your Money with{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
                Bank-Grade Precision
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto px-2">
              Track multi-stream incomes, control expenses, visualize cash flow dynamics, and build wealth with an ultra-sleek, modern interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 px-4 sm:px-0">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Dashboard</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Forever Plan
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> 2FA Authentication
              </span>
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-teal-500" /> Instant CSV Export
              </span>
            </div>
          </div>

          {/* Interactive Preview Cards Mockup */}
          <div className="p-4 sm:p-7 md:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono ml-1.5">AuraFinance Interactive Demo</span>
              </div>
              <span className="px-2.5 py-0.5 sm:py-1 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                LIVE DEMO
              </span>
            </div>

            {/* Mock KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Demonstration Balance</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-['Outfit']">₹1,48,500.00</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +24% vs last period
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Inflow</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 font-['Outfit']">+₹2,10,000.00</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-source salaries & dividends</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Outflow</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1.5 font-['Outfit']">-₹61,500.00</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Under monthly budget ceiling</p>
              </div>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visual Analytics</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Dynamic Chart.js comparisons, category distribution rings, and cashflow health scores.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rapid Entry</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Log transactions in seconds with smart tag suggestions, search filters, and sorting.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2FA Security</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Email OTP verification, JWT session credentials, and encrypted database protection.
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // If LOGGED IN, show Executive Dashboard
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative pb-16 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-24 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-7 md:p-8 rounded-3xl glass-panel bg-gradient-to-r from-slate-100/90 via-slate-100/50 to-indigo-100/30 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-indigo-950/30 border border-slate-200 dark:border-white/10 shadow-xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1.5">
                Financial Command Center
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                • {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Real-time analytics, cash flow monitoring, and intelligent financial summaries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/finance"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Track New Record</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Net Balance Card */}
          <div className="relative group p-5 sm:p-6 rounded-2xl glass-card glass-card-hover border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Net Balance</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
                ₹{netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                {netBalance >= 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Positive Net Cash
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> Deficit Alert
                  </span>
                )}
                <span className="text-slate-400 dark:text-slate-500">• All Accounts</span>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="relative group p-5 sm:p-6 rounded-2xl glass-card glass-card-hover border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Inflow</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight font-['Outfit']">
                +₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{incomeTransactions.length}</span> recorded inflows
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="relative group p-5 sm:p-6 rounded-2xl glass-card glass-card-hover border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Outflow</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight font-['Outfit']">
                -₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">{expenseTransactions.length}</span> recorded expenses
              </div>
            </div>
          </div>

          {/* Savings Rate Card */}
          <div className="relative group p-5 sm:p-6 rounded-2xl glass-card glass-card-hover border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Savings Margin</span>
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
                  {savingsRate}%
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">of income saved</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>

        {/* Analytics & Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Comparison Chart (2 columns) */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Cash Flow Breakdown</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Comparison of total income generated vs expenses consumed</p>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2 sm:pt-4">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: isDark ? "#0b0f19" : "#ffffff",
                      titleColor: isDark ? "#ffffff" : "#0f172a",
                      bodyColor: isDark ? "#cbd5e1" : "#334155",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      borderWidth: 1,
                      padding: 12,
                      titleFont: { size: 13, family: "Plus Jakarta Sans" },
                      bodyFont: { size: 14, family: "Outfit", weight: "bold" },
                      callbacks: {
                        label: (context) => ` ₹${context.raw.toLocaleString("en-IN")}`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" },
                      ticks: {
                        color: isDark ? "#94a3b8" : "#64748b",
                        callback: (value) => `₹${value.toLocaleString("en-IN")}`
                      }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: isDark ? "#cbd5e1" : "#334155", font: { weight: "600" } }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Distribution Doughnut Chart (1 column) */}
          <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Portfolio Ratio</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Inflow vs Outflow share</p>
                </div>
              </div>
            </div>

            <div className="h-48 sm:h-52 my-auto relative flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "75%",
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: isDark ? "#0b0f19" : "#ffffff",
                      titleColor: isDark ? "#ffffff" : "#0f172a",
                      bodyColor: isDark ? "#cbd5e1" : "#334155",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      borderWidth: 1,
                      callbacks: {
                        label: (context) => ` ₹${context.raw.toLocaleString("en-IN")}`
                      }
                    }
                  }
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Net Ratio</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  {totalIncome > 0 ? `${Math.round((totalExpense / totalIncome) * 100)}%` : "0%"}
                </span>
                <span className="text-[10px] text-slate-400">Expense/Inflow</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-white/5 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div className="truncate">
                  <p className="text-slate-500 dark:text-slate-400">Income</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">₹{totalIncome.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="truncate">
                  <p className="text-slate-500 dark:text-slate-400">Expenses</p>
                  <p className="font-bold text-rose-600 dark:text-rose-400 truncate">₹{totalExpense.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Transactions & Quick Action Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity List (2 columns) */}
          <div className="lg:col-span-2 p-5 sm:p-6 md:p-7 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Recent Transactions</h3>
              </div>
              <Link
                to="/finance"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>View all ({transactions.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 space-y-2">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm">Loading activity logs...</p>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <Wallet className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">No transactions recorded yet</h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Add your first income or expense to generate real-time financial tracking and insights.
                </p>
                <Link
                  to="/finance"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Track First Transaction
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {recentTransactions.map((tx) => {
                  const isIncome = tx.type === "Income";
                  return (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] hover:bg-slate-200/60 dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.05] transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isIncome 
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                            : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
                        }`}>
                          {getCategoryIcon(tx.description)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors truncate">
                            {tx.description}
                          </p>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                            {tx.date ? new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`font-bold text-xs sm:text-sm md:text-base tracking-tight font-['Outfit'] ${
                          isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {isIncome ? "+" : "-"} ₹{parseFloat(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                          {tx.type}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Insights & Pro Tips (1 column) */}
          <div className="p-5 sm:p-6 md:p-7 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-5 sm:space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/5">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Financial Insights</h3>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/20 space-y-1.5 sm:space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">Budget Health</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {savingsRate >= 40 
                    ? "Outstanding savings! You are building solid wealth reserves." 
                    : savingsRate >= 15
                    ? "Healthy balance. Keep an eye on non-essential expenditures."
                    : "High outflow velocity detected. Optimize discretionary spending."}
                </p>
                <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 pt-1">
                  Target savings benchmark: 25% – 35% of total inflow.
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Tracked Operations</span>
                  <span className="font-bold text-slate-900 dark:text-white">{transactions.length} Records</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Net Savings Margin</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{savingsRate}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Platform Security</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">JWT & AES-256 Encrypted</span>
                </div>
              </div>
            </div>

            <Link
              to="/finance"
              className="w-full text-center py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all"
            >
              Open Full Finance Hub →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;