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

  // ✅ Password strength validation
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

    // ✅ Confirm password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ✅ Password strength check
    const pwError = checkPasswordStrength(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    try {
      // ✅ 1. Register user
        await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        email,
        password,
      });

      // ✅ 2. Log in immediately after registration using JWT endpoint
      const loginRes = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      // ✅ 3. Save tokens
      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);
      localStorage.setItem("token", loginRes.data.access); // used for PrivateRoute
      localStorage.setItem("username", username);

      // ✅ 4. Notify app & redirect
      window.dispatchEvent(new Event("authChange"));
      alert("✅ Registration and login successful!");
      navigate("/"); // redirect to Interview Simulator

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <FaUserPlus className="text-5xl mx-auto text-green-400 mb-2" />
          </motion.div>

          <motion.h1
            className="text-4xl font-extrabold text-green-400 tracking-wide"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            Create Account
          </motion.h1>
          <p className="text-gray-400 mt-1">
            Join the AI Interview Coach today 🚀
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-center font-medium mb-4">⚠️ {error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Username</label>
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
            <label className="block text-gray-300 mb-2 font-medium">Email</label>
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

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Register
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
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
