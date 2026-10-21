import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/Forgotpassword";
import Profile from "./pages/Profile";
import Finance from "./pages/Finance";
import ProtectedRoute from "./components/ProtectedRoute";
import { Wallet, ShieldCheck } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Global Responsive Modern Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#05070a]/90 backdrop-blur-xl py-6 sm:py-8 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white font-['Outfit']">
              Aura<span className="text-indigo-600 dark:text-indigo-400">Finance</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>Intelligent Financial Tracking</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Overview</Link>
            <Link to="/finance" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Ledger</Link>
            <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Security</Link>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>256-bit Encrypted • {new Date().getFullYear()} AuraFinance</span>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default App;