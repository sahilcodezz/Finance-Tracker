import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Fetch Profile Info
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/auth/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  // Handle Password Update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/api/auth/change-password", {
        oldPassword,
        newPassword
      });

      setFeedback({ type: "success", message: res.data.message || "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || "Failed to update password." });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative pb-16 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-80 h-80 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Header Hero */}
        <div className="p-5 sm:p-7 md:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <div className="w-full h-full bg-slate-50 dark:bg-[#0a0e1a] rounded-[14px] flex items-center justify-center text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {user?.username || "AuraFinance Member"}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1 flex-shrink-0">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{user?.email || "user@example.com"}</span>
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 dark:hover:bg-rose-500 border border-rose-200 dark:border-rose-500/20 transition-all self-start sm:self-auto w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-xl animate-in fade-in duration-300 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-500/40 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-500/40 dark:text-rose-300"
          }`}>
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span className="text-sm font-semibold">{feedback.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Details Card */}
          <div className="p-5 sm:p-7 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-5 sm:space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Profile Overview</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Account identity and credentials</p>
              </div>
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Display Name</span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{user?.username || "N/A"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Email</span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">{user?.email || "N/A"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Security Clearance</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                    2FA Email OTP Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="p-5 sm:p-7 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-5 sm:space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Security & Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your access key</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5 sm:space-y-4">
              
              {/* Old Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showOld ? "text" : "password"}
                    required
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm placeholder-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Security Key...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;