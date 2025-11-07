import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHistory, FaArrowLeft } from "react-icons/fa";
import api from "../api/axios";

export default function SessionHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/interviews/session-history/");
        setSessions(res.data);
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
        setError(err.response?.data?.error || "Failed to load session history. Make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900 flex flex-col items-center p-6">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="w-full max-w-3xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300">
          <FaArrowLeft /> Back to Interview
        </button>

        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
          <FaHistory /> Interview Session History
        </h1>

        {loading && <p className="text-gray-300">Loading sessions...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && sessions.length === 0 && (
          <p className="text-gray-300">No interview sessions found.</p>
        )}

        <div className="space-y-4">
          {sessions.map((session) => (
            <motion.div key={session.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="bg-white/10 border border-white/20 p-4 rounded-lg text-white">
              <p><strong>Role:</strong> {session.role}</p>
              <p><strong>Question:</strong> {session.question}</p>
              <p><strong>Score:</strong> {session.score}</p>
              <p><strong>Started at:</strong> {new Date(session.started_at).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
