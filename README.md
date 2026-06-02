# 💰 Finance Tracker Web Application (MERN Stack)

A full-stack Finance Tracker application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
It allows users to manage income and expenses with authentication, OTP verification, and a modern dashboard UI.

---

## 🚀 Features

### 🔐 Authentication System
- User Signup with OTP verification
- Login with OTP verification
- Forgot Password with OTP
- JWT-based authentication
- Protected routes (Home & Profile)

---

### 💰 Finance Tracker (Dashboard)
- Add Income / Expense transactions
- View recent transactions
- Delete transactions
- Dashboard summary:
  - Total Income
  - Total Expense
  - Balance

---

### 🔍 Advanced Features
- Server-side pagination
- Filters:
  - By type (Income / Expense)
  - Amount range
- Sorting options:
  - Date
  - Amount
  - Type
- Real-time UI updates

---

### 👤 Profile Page
- View user details:
  - Username
  - Email
- Change password
- Logout functionality

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Axios
- React Router DOM
- Inline CSS / Custom Styling

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js
- OTP Generator

---

## 📁 Project Structure
Finance Tracker/
│
├── frontend/
│ ├── src/pages
│ ├── components
│ └── App.jsx
│
├── backend/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── server.js
│
└── .env

---

how to run the project:

backend:-
cd backend
node server.js


frontend:-
cd frontend
npm run dev

---

Create .env file:-
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OTP_SECRET=your_otp_secret