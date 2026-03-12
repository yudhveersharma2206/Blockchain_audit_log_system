import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">SecureChain</div>

      <div className="nav-links">
        {user && (
          <>
            <Link to="/"> Dashboard</Link>
            
            {user.role === "admin" && (
              <>
                <Link to="/add"> Add Block</Link>
                <Link to="/users"> Users</Link>
              </>
            )}
            
            {(user.role === "admin" || user.role === "auditor") && (
              <Link to="/verify"> Verify Chain</Link>
            )}
            
            <Link to="/risk"> Risk Monitor</Link>
            <Link to="/analytics"> Analytics</Link>
          </>
        )}
      </div>

      <div className="auth-section">
        {user ? (
          <>
            <span className="role-badge">
              {user.username} <strong>[{user.role.toUpperCase()}]</strong>
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;