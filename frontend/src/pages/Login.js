import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Use your actual backend login API
        const res = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username,
        password,
      });

      // ✅ Store tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("token", res.data.access); // for PrivateRoute

      // ✅ Trigger auth change & navigate
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);

      const data = err.response?.data;
      if (data?.error) {
        setError(data.error);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Invalid username or password. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <FaRobot className="text-5xl mx-auto text-blue-400 mb-2" />
          <motion.h1
            className="text-4xl font-extrabold text-blue-400 tracking-wide"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            AI Interview Coach
          </motion.h1>
          <p className="text-gray-400 mt-1">Welcome back! Please sign in.</p>
        </div>

        {error && (
          <p className="text-red-400 text-center font-medium mb-3">⚠️ {error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
