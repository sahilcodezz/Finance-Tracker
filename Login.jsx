import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOGIN STEP
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (res.data) {
        setStep(2); // only go to OTP if success
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-login-otp",
        { email, otp }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);

      window.location.href = "/finance";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial"
  };

  const cardStyle = {
    width: "350px",
    padding: "25px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ddd",
    borderRadius: "6px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2>Login</h2>

        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
        )}

        {step === 1 ? (
          <form onSubmit={handleLogin}>
            <input
              style={inputStyle}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button style={buttonStyle} type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <div>
            <input
              style={inputStyle}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              style={buttonStyle}
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;