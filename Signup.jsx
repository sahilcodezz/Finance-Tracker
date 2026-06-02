import axios from "axios";
import { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial",
  };

  const cardStyle = {
    width: "360px",
    padding: "30px",
    background: "white",
    borderRadius: "14px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "600",
  };

  return (
    <div style={pageStyle}>
      <form style={cardStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          Signup
        </h2>

        <input
          style={inputStyle}
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button style={buttonStyle} type="submit">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;