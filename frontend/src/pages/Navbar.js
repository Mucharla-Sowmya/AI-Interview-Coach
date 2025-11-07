import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("access"));
    };

    // ✅ Listen for auth changes (login/logout)
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []); // ✅ empty dependency array (important!)

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-400">
          AI Interview Coach
        </Link>

        {isAuthenticated ? (
          <div className="flex gap-4 items-center">
            <Link to="/sessions" className="hover:text-blue-300">Sessions</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4 items-center">          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
