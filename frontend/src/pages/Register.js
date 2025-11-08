import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) return "Password must be at least 8 characters long.";
    if (!hasUpper) return "Password must include at least one uppercase letter.";
    if (!hasLower) return "Password must include at least one lowercase letter.";
    if (!hasNumber) return "Password must include at least one number.";
    if (!hasSymbol) return "Password must include at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const pwError = checkPasswordStrength(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/users/register/", {
        username,
        email,
        password,
      });

      const loginRes = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);
      localStorage.setItem("token", loginRes.data.access);
      localStorage.setItem("username", username);

      window.dispatchEvent(new Event("authChange"));
      alert("✅ Registration and login successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      const data = err.response?.data;
      if (data?.error) {
        setError(Array.isArray(data.error) ? data.error.join(", ") : data.error);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-950 via-slate-900 to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-card p-6 w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col justify-center"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <FaUserPlus className="text-4xl mx-auto text-green-400 mb-2" />
          </motion.div>

          <motion.h1
            className="text-3xl font-extrabold text-green-400 tracking-wide"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            Create Account
          </motion.h1>
          <p className="text-gray-400 mt-1 text-sm">
            Join the AI Interview Coach today 🚀
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-center font-medium mb-4 text-sm">⚠️ {error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
          <div>
            <label className="block text-gray-300 mb-1 font-medium text-sm">Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-medium text-sm">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="username@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-medium text-sm">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-medium text-sm">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary text-sm py-2">
            Register
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:text-green-300 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
