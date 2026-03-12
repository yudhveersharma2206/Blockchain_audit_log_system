import { useState, useEffect, useRef } from "react";
import { authAPI } from "../api/apiClient";

/**
 * UserManagement Component
 * Admin-only page for creating and managing users
 * Features: Create users with roles (viewer, auditor, admin), delete users
 * Enforces password requirements and includes scroll animations
 */
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    loadUsers();
    setupScrollAnimations();
  }, []);

  /**
   * Sets up Intersection Observer for scroll animations
   */
  const setupScrollAnimations = () => {
    if (!containerRef.current) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatableElements = containerRef.current.querySelectorAll(".scroll-animate, .card");
    animatableElements.forEach((el) => observer.observe(el));
  };

  // Setup animations after users load
  useEffect(() => {
    if (users.length > 0 || !loading) {
      setTimeout(() => {
        setupScrollAnimations();
      }, 50);
    }
  }, [users, loading]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.getUsers();

      if (!response.success) {
        setError("Failed to load users");
        return;
      }

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Error:", err);
      setError("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.createUser(username, password, role);

      if (!response.success) {
        setError(response.data.message || "Failed to create user");
        return;
      }

      setMessage("✅ User created successfully");
      setUsername("");
      setPassword("");
      setRole("viewer");

      // Reload users
      setTimeout(() => {
        loadUsers();
        setMessage("");
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authAPI.deleteUser(id);

      if (!response.success) {
        setError(response.data.message || "Failed to delete user");
        return;
      }

      setMessage("✅ User deleted successfully");
      loadUsers();

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <h1>User Management</h1>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {/* CREATE USER FORM */}
      <div className="card scroll-animate">
        <h3>Create New User</h3>

        <form onSubmit={handleCreateUser}>
          <label>    Username    :  </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            maxLength="20"
          />

          <label>  Password  :   </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <label>   Role   :  </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
            <option value="viewer">Viewer</option>
            <option value="auditor">Auditor</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>

        <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#00000087", borderRadius: "5px" }}>
          <p><strong>Password Requirements:</strong></p>
          <ul>
            <li>Minimum 6 characters</li>
            <li>At least one uppercase letter (A-Z)</li>
            <li>At least one lowercase letter (a-z)</li>
            <li>At least one number (0-9)</li>
          </ul>
        </div>
      </div>

      {/* USERS LIST */}
      <div className="card scroll-animate">
        <h3> Users List ({users.length})</h3>

        {loading && <p>🔄 Loading users...</p>}

        {!loading && users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="blocks-table">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.username}</strong>
                    </td>
                    <td>
                      <span style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        backgroundColor:
                          user.role === "admin"
                            ? "#ffe6e6"
                            : user.role === "auditor"
                            ? "#e6f2ff"
                            : "#f0f0f0",
                        color:
                          user.role === "admin"
                            ? "#000000"
                            : user.role === "auditor"
                            ? "#000000"
                            : "#000000"
                      }}>
                        {user.role === "admin"}
                        {user.role === "auditor"}
                        {user.role === "viewer"}
                        {" " + user.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={loading}
                        style={{
                          
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button 
          onClick={loadUsers} 
          disabled={loading} 
          style={{ marginTop: "15px" }}
          className="btn-secondary"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ROLES INFO */}
      <div className="card scroll-animate">
        <h3> Role Descriptions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
          <div style={{ padding: "15px", backgroundColor: "#000000", borderRadius: "5px" }}>
            <h4>Viewer</h4>
            <ul>
              <li>View dashboard</li>
              <li>View blocks</li>
              <li>Limited access</li>
            </ul>
          </div>
          <div style={{ padding: "15px", backgroundColor: "#000000", borderRadius: "5px" }}>
            <h4>Auditor</h4>
            <ul>
              <li>View blocks</li>
              <li>Verify blockchain</li>
              <li>Generate reports</li>
            </ul>
          </div>
          <div style={{ padding: "15px", backgroundColor: "#000000", borderRadius: "5px" }}>
            <h4>Admin</h4>
            <ul>
              <li>Add blocks</li>
              <li>Manage users</li>
              <li>Full access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;