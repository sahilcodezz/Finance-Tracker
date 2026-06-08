import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

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

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email
      });

      alert("OTP sent to email");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        <h2 style={{ textAlign: "center" }}>Forgot Password</h2>

        <input
          style={inputStyle}
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button style={buttonStyle} onClick={handleSubmit}>
          Send OTP
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;