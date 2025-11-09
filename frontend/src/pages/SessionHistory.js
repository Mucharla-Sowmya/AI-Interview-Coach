import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHistory,
  FaArrowLeft,
  FaUserTie,
  FaQuestionCircle,
  FaStar,
  FaTimes,
  FaCommentDots,
  FaPenNib,
} from "react-icons/fa";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";

export default function SessionHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError("");
      try {
  const res = await api.get("/interviews/session-history/");
  setSessions(res.data);
} catch (err) {
  console.error("❌ Error fetching sessions:", err);

  if (err.response?.status === 401) {
    // 🔒 Token expired or invalid → logout and redirect
    localStorage.removeItem("access"); // if you store token here
    localStorage.removeItem("refresh");
    navigate("/login");
  } else {
    setError(
      err.response?.data?.error ||
        "Failed to load session history. Please re-login."
    );
  }
} finally {
  setLoading(false);
}

    };

    fetchSessions();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-gray-950 flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft /> Back to Interview
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaHistory className="text-blue-400 text-3xl" />
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Interview Session History
          </h1>
        </div>

        {/* States */}
        {loading && (
          <p className="text-gray-300 text-center text-lg animate-pulse">
            Loading sessions...
          </p>
        )}

        {error && <p className="text-red-400 text-center text-lg">{error}</p>}

        {!loading && !error && sessions.length === 0 && (
          <p className="text-gray-300 text-center">
            No interview sessions found yet.
          </p>
        )}

        {/* Session Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSession(session)}
              className="border border-blue-400/30 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-blue-950/60 
                         rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-blue-500/30 transition-all cursor-pointer group"
            >
              <div className="space-y-3 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold">
                    <FaUserTie /> {session.role}
                  </div>
                  {session.score !== null && (
                    <span
                      className={`font-bold ${getScoreColor(
                        session.score
                      )} text-lg flex items-center gap-1`}
                    >
                      <FaStar /> {session.score}/10
                    </span>
                  )}
                </div>

                <div className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                  <ReactMarkdown>{session.question}</ReactMarkdown>
                </div>

                <div className="text-xs text-gray-400 italic text-right">
                  🕒 {new Date(session.started_at).toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===================== Session Details Modal ===================== */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative text-white overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSession(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition"
              >
                <FaTimes size={22} />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-white to-blue-300 drop-shadow-lg">
                  {selectedSession.role}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(selectedSession.started_at).toLocaleString()}
                </p>
              </div>

              {/* Question */}
              <div className="border border-blue-400/30 bg-gradient-to-br from-gray-900/80 to-blue-950/60 rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2 mb-3">
                  <FaQuestionCircle /> Question
                </h3>
                <div className="text-gray-100 leading-relaxed prose prose-invert max-w-none">
                  <ReactMarkdown>{selectedSession.question}</ReactMarkdown>
                </div>
              </div>

              {/* Answer */}
              <div className="border border-green-400/30 bg-gradient-to-br from-green-900/40 to-gray-900/60 rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2 mb-3">
                  <FaPenNib /> Your Answer
                </h3>
                <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  <ReactMarkdown>
                    {selectedSession.answer || "No answer recorded."}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Feedback */}
              {selectedSession.feedback && (
                <div className="border border-yellow-400/30 bg-gradient-to-br from-yellow-900/40 to-gray-900/60 rounded-2xl p-6 shadow-lg mb-6">
                  <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2 mb-3">
                    <FaCommentDots /> AI Feedback
                  </h3>
                  <div className="text-gray-100 leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{selectedSession.feedback}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Score */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-green-950/40 border border-green-400/50 rounded-xl text-center shadow-inner"
              >
                <p className="text-2xl font-bold text-green-300 tracking-wide">
                  🏆 Score: {selectedSession.score ?? "N/A"}{" "}
                  <span className="text-green-200 text-lg">/ 10</span>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
