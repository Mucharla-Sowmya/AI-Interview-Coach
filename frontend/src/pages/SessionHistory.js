import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHistory,
  FaArrowLeft,
  FaUserTie,
  FaQuestionCircle,
  FaStar,
  FaClock,
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
        setError(
          err.response?.data?.error ||
            "Failed to load session history. Please re-login."
        );
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
        {error && (
          <p className="text-red-400 text-center text-lg">{error}</p>
        )}
        {!loading && !error && sessions.length === 0 && (
          <p className="text-gray-300 text-center">
            No interview sessions found yet.
          </p>
        )}

        {/* Sessions Grid */}
        <div className="grid gap-5 md:grid-cols-2 mt-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSession(session)}
              className="relative group border border-white/20 bg-white/5 
                         hover:bg-white/10 rounded-2xl p-5 shadow-xl transition-all 
                         duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-400/5 rounded-2xl blur-2xl group-hover:opacity-100 opacity-0 transition-opacity"></div>

              <div className="relative z-10 text-white space-y-3">
                <div className="flex items-center gap-2 text-blue-300">
                  <FaUserTie /> <span className="font-semibold">{session.role}</span>
                </div>

                <div className="flex items-start gap-2 text-gray-200">
                  <FaQuestionCircle className="text-blue-400 mt-1" />
                  <p className="text-sm leading-relaxed line-clamp-3">
                    {session.question}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <FaClock className="text-gray-400" />
                  <span className="text-sm">
                    {new Date(session.started_at).toLocaleString()}
                  </span>
                </div>

                {session.score !== null && (
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span
                      className={`font-bold ${getScoreColor(session.score)} text-lg`}
                    >
                      Score: {session.score} / 10
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===================== Modal (Session Details) ===================== */}
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
        className="bg-gray-900/90 text-white border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative overflow-y-auto max-h-[90vh] backdrop-blur-md"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedSession(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition"
        >
          <FaTimes size={22} />
        </button>

        {/* Elegant Header */}
        <div className="text-center mb-10">
          <h2
            className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text 
                       bg-gradient-to-r from-yellow-400 via-white to-blue-300 drop-shadow-lg"
          >
            {selectedSession.role}
          </h2>
          <p className="text-sm text-gray-400">
            🕒 {new Date(selectedSession.started_at).toLocaleString()}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-gray-100">
          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/10 p-6 rounded-2xl border border-blue-400/20 shadow-md hover:shadow-blue-500/30 transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-blue-200 flex items-center gap-2 mb-3">
              <FaQuestionCircle className="text-blue-400" /> <span className="text-white">Question</span>
            </h3>
            <div className="bg-gray-900/60 p-4 rounded-lg leading-relaxed backdrop-blur-sm text-gray-100">
              <ReactMarkdown>{selectedSession.question}</ReactMarkdown>
            </div>
          </motion.div>

          {/* Answer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/10 p-6 rounded-2xl border border-green-400/20 shadow-md hover:shadow-green-500/30 transition-shadow"
          >
            <h3 className="text-2xl font-semibold text-green-200 flex items-center gap-2 mb-3">
              <FaPenNib className="text-green-400" /> <span className="text-white">Your Answer</span>
            </h3>
            <div className="bg-gray-900/60 p-4 rounded-lg text-gray-200 leading-relaxed whitespace-pre-wrap backdrop-blur-sm">
              <ReactMarkdown>
                {selectedSession.answer || "No answer recorded."}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Feedback */}
          {selectedSession.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/10 p-6 rounded-2xl border border-yellow-400/20 shadow-md hover:shadow-yellow-500/30 transition-shadow"
            >
              <h3 className="text-2xl font-semibold text-yellow-200 flex items-center gap-2 mb-3">
                <FaCommentDots className="text-yellow-400" /> <span className="text-white">AI Feedback</span>
              </h3>
              <div className="bg-gray-900/60 p-4 rounded-lg text-gray-200 leading-relaxed whitespace-pre-wrap backdrop-blur-sm">
                <ReactMarkdown>{selectedSession.feedback}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {/* Final Score */}
          <div className="flex items-center justify-center mt-8">
            <div
              className={`px-10 py-4 rounded-full text-lg font-bold border ${getScoreColor(
                selectedSession.score
              )} border-white/20 bg-gradient-to-r from-white/10 to-white/5 shadow-lg backdrop-blur-sm`}
            >
              🏆 Score: {selectedSession.score ?? "N/A"} / 10
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
}
