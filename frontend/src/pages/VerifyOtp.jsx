import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOtp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(res.data.message);
      navigate("/login"); // after verifying signup OTP, go to login

    } catch (error) {
      alert(error.response.data.message);
    }
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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-[350px]"
      >

        <h1 className="text-2xl font-bold mb-4 text-center">
          Verify OTP
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Verify OTP
        </button>

      </form>

    </div>
  );
}

export default VerifyOtp;