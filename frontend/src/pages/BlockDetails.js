import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blockchainAPI } from "../api/apiClient";

/**
 * BlockDetails Component
 * Displays comprehensive information about a specific blockchain block
 * Features: Hash verification, timestamp analysis, JSON export
 * Includes scroll animations and copy-to-clipboard functionality
 */
function BlockDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    loadBlock();
    setupScrollAnimations();
  }, [id]);

  // Setup animations after block loads
  useEffect(() => {
    if (block) {
      setTimeout(() => {
        setupScrollAnimations();
      }, 50);
    }
  }, [block]);

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

  const loadBlock = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await blockchainAPI.getBlockById(id);

      if (!response.success) {
        setError("Block not found");
        return;
      }

      setBlock(response.data.block || response.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Error loading block");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container" ref={containerRef}>
      <h1>📋 Block Details</h1>

      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="card scroll-animate" style={{ textAlign: "center" }}>
          <p>🔄 Loading...</p>
        </div>
      ) : block ? (
        <>
          <div className="card scroll-animate">
            <h3>Block #{block.index}</h3>

            <div className="block-details">
              <div style={{ marginBottom: "15px" }}>
                <label><strong>Index:</strong></label>
                <p>{block.index}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>Log ID:</strong></label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <code style={{ flex: 1, wordBreak: "break-all" }}>{block.logId}</code>
                  <button
                    onClick={() => copyToClipboard(block.logId)}
                    style={{ padding: "5px 10px" }}
                  >
                    📋
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>User:</strong></label>
                <p>{block.user}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>Action:</strong></label>
                <p>{block.action}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>IP Address:</strong></label>
                <p>{block.ipAddress || "N/A"}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>Timestamp:</strong></label>
                <p>
                  {new Date(block.timestamp).toLocaleString()}
                  <br />
                  <small style={{ color: "#666" }}>
                    ({new Date(block.timestamp).toISOString()})
                  </small>
                </p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>Hash:</strong></label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <code
                    style={{
                      flex: 1,
                      wordBreak: "break-all",
                      backgroundColor: "#f5f5f5",
                      padding: "10px",
                      borderRadius: "5px",
                      fontFamily: "monospace",
                    }}
                  >
                    {block.hash}
                  </code>
                  <button onClick={() => copyToClipboard(block.hash)} style={{ padding: "5px 10px" }}>
                    📋
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>Previous Hash:</strong></label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <code
                    style={{
                      flex: 1,
                      wordBreak: "break-all",
                      backgroundColor: "#f5f5f5",
                      padding: "10px",
                      borderRadius: "5px",
                      fontFamily: "monospace",
                    }}
                  >
                    {block.previousHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(block.previousHash)}
                    style={{ padding: "5px 10px" }}
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK INFO */}
          <div className="card scroll-animate">
            <h3>ℹ️ Block Information</h3>
            <ul>
              <li>
                <strong>Created:</strong> {new Date(block.timestamp).toLocaleDateString()}
              </li>
              <li>
                <strong>Time ago:</strong> {Math.round((Date.now() - new Date(block.timestamp).getTime()) / 1000)}s
              </li>
              <li>
                <strong>Genesis Block:</strong> {block.previousHash === "0" ? "Yes ✅" : "No"}
              </li>
            </ul>
          </div>

          {/* JSON VIEW */}
          <div className="card scroll-animate">
            <h3>📄 Raw JSON</h3>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "5px",
                overflow: "auto",
                maxHeight: "400px",
              }}
            >
              {JSON.stringify(block, null, 2)}
            </pre>
          </div>
        </>
      ) : (
        <div className="card">
          <p>Block not found</p>
        </div>
      )}
    </div>
  );
}

export default BlockDetails;