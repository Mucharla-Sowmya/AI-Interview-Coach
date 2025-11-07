import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github-dark.css";
import {
  FaRobot,
  FaBrain,
  FaPaperPlane,
  FaRedoAlt,
  FaHistory,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TypingLoader = ({ text = "AI is thinking" }) => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex justify-center text-gray-300 text-lg font-medium italic py-4 animate-pulse">
      {text}
      {dots}
    </div>
  );
};

const ProgressBar = ({ duration = 5 }) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden mt-2">
    <motion.div
      className="h-full bg-blue-500"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration, ease: "easeInOut" }}
    />
  </div>
);

export default function InterviewSimulator() {
  const [role, setRole] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE = "http://127.0.0.1:8000/api/interviews";
  const token = localStorage.getItem("access");

  const roles = [
    "Python Developer",
    "React Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Machine Learning Engineer",
  ];

  // ✅ Generate Question
  const generateQuestion = async () => {
    if (!role) return alert("Please select a role first!");

    setLoading(true);
    setMode("question");

    try {
      const res = await axios.post(
        `${API_BASE}/generate-question/`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setQuestion(res.data.question);
      setSessionId(res.data.session_id);
      setFeedback("");
      setAnswer("");
      setScore(null);
    } catch (error) {
      console.error("❌ Error generating question:", error);
      alert("⚠️ Error generating question. Check backend connection or token.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Evaluate Answer
  const evaluateAnswer = async () => {
    if (!answer.trim()) return alert("Please enter your answer first!");

    setLoading(true);
    setMode("feedback");

    try {
      const res = await axios.post(
        `${API_BASE}/evaluate-answer/`,
        {
          session_id: sessionId,
          question,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFeedback(res.data.feedback);
      setScore(res.data.score ?? null);
    } catch (error) {
      console.error("❌ Error evaluating answer:", error);
      alert("⚠️ Error getting feedback. Please re-login if session expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-3xl p-8 space-y-6 text-white"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center text-5xl text-blue-400 drop-shadow-lg">
            <FaRobot />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">AI Interview Coach</h1>
          <p className="text-gray-300 text-sm">
            Practice mock interviews with real-time AI feedback.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-blue-400 bg-gray-900/70 text-blue-200 p-3 w-full rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="">🎯 Select your desired role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button
            onClick={generateQuestion}
            disabled={!role || loading}
            className={`w-full text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/40"
            }`}
          >
            <FaBrain />
            {loading && mode === "question" ? "Generating..." : "Generate AI Question"}
          </button>
        </div>

        {/* Loader */}
        {loading && (
          <div className="mt-4 flex flex-col items-center text-gray-300 text-sm">
            <TypingLoader
              text={mode === "question" ? "🤖 Generating question" : "🧠 Evaluating answer"}
            />
            <ProgressBar duration={5} />
          </div>
        )}

        {/* Question Section */}
        {!loading && question && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            ref={scrollRef}
            className="border border-white/20 bg-white/5 rounded-xl p-6 space-y-3 shadow-inner"
          >
            <h2 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
              <FaPaperPlane className="text-blue-400" />
              <span>Interview Question</span>
            </h2>

            <div
              className="bg-gray-800/40 rounded-lg p-4 text-gray-100 leading-relaxed space-y-3"
              style={{ lineHeight: "1.9" }}
            >
              <ReactMarkdown>{question}</ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Answer Input */}
        {question && !loading && (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="📝 Type your answer here..."
            className="border border-gray-500 bg-white/10 focus:ring-2 focus:ring-green-400 p-3 w-full rounded-lg min-h-[130px] text-white placeholder-gray-400 resize-none"
          />
        )}

        {/* Feedback Button */}
        {question && !loading && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={evaluateAnswer}
            disabled={!answer || loading}
            className={`w-full text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/40"
            }`}
          >
            <FaRedoAlt />
            {loading && mode === "feedback" ? "Evaluating..." : "Get Feedback"}
          </motion.button>
        )}

        {/* Feedback Section */}
        {!loading && feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-green-400/40 bg-green-900/30 rounded-xl p-5 text-green-100"
          >
            <h2 className="text-lg font-semibold text-green-300 flex items-center gap-2">
              💡 Feedback
            </h2>
            <div className="bg-green-800/30 rounded-lg p-4 leading-relaxed">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>

            {score !== null && (
              <div className="mt-6 p-4 bg-green-800/40 border border-green-400/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-300 tracking-wide">
                  🏆 Score: {score}{" "}
                  <span className="text-green-200 text-lg">out of 10</span>
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* View History */}
        <button
          onClick={() => navigate("/sessions")}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-purple-500/40"
        >
          <FaHistory /> View Interview History
        </button>
      </motion.div>
    </div>
  );
}
