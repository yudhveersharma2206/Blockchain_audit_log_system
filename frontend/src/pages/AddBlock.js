import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { blockchainAPI } from "../api/apiClient";

/**
 * AddBlock Component
 * Admin-only form to add new blocks to the blockchain
 * Validates user credentials and adds audit logs
 * Includes scroll animations for UI elements
 */
function AddBlock() {
  const { user } = useContext(AuthContext);
  const [action, setAction] = useState("");
  const [blockUser, setBlockUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
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

  // Re-setup animations when component mounts to ensure DOM is ready
  useEffect(() => {
    setTimeout(() => {
      setupScrollAnimations();
    }, 100);
  }, []);

  const handleAddBlock = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!action || !blockUser) {
      setError("All fields are required");
      return;
    }

    if (user?.role !== "admin") {
      setError(" Only Admin can add blocks");
      return;
    }

    setLoading(true);

    try {
      const response = await blockchainAPI.addLog(action, blockUser);

      if (!response.success) {
        setError(response.data.message || "Error adding block");
        return;
      }

      setMessage("✅ Block Added Successfully!");
      setAction("");
      setBlockUser("");

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="container" ref={containerRef}>
        <div className="card scroll-animate" style={{ color: "red" }}>
          <h2> Access Denied</h2>
          <p>Only administrators can add blocks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" ref={containerRef}>
      <h2> Add New Block</h2>

      <div className="card scroll-animate">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleAddBlock}>
          <label>    Action   :  </label>
          <input
            type="text"
            placeholder="Enter action (e.g., USER_LOGIN, FILE_ACCESS)"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            disabled={loading}
            maxLength="200"
          />

          <label>    User      :    </label>
          <input
            type="text"
            placeholder="Enter user (e.g., john_doe)"
            value={blockUser}
            onChange={(e) => setBlockUser(e.target.value)}
            disabled={loading}
            maxLength="100"
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "⛏️ Mining..." : " Add Block"}
          </button>
        </form>

        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#00000091", borderRadius: "5px" }}>
          <p><strong> Block Details:</strong></p>
          <ul>
            <li>Action: <code>{action || "N/A"}</code></li>
            <li>User: <code>{blockUser || "N/A"}</code></li>
            <li>Timestamp: <code>{new Date().toISOString()}</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddBlock;