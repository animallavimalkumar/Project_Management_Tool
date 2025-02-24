import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">My App</h1>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/projects" className="px-4 py-2 bg-blue-500 rounded mr-2">Projects</Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 bg-green-500 rounded mr-2">Sign In</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-500 rounded">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;