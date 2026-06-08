import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ================= GET PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          oldPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(res.data.message || "Password updated successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating password");
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ================= UI =================
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

        <h2 style={{ textAlign: "center" }}>Profile</h2>

        {user && (
          <div style={{ marginBottom: "15px" }}>
            <p><b>Name:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>
        )}

        <hr />

        <h3>Change Password</h3>

        <input
          style={inputStyle}
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button style={buttonStyle} onClick={handleChangePassword}>
          Update Password
        </button>

        <hr />

        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            background: "red"
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;