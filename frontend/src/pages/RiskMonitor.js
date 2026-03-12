import React, { useState, useEffect, useRef } from "react";
import { blockchainAPI } from "../api/apiClient";

/**
 * RiskMonitor Component
 * Real-time monitoring of suspicious and high-risk blockchain activities
 * Features: Risk detection, activity analysis, detailed risk breakdown
 * Auto-refresh every 10 seconds with scroll animations
 */
function RiskMonitor() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRisk, setSelectedRisk] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    loadBlocks();
    setupScrollAnimations();
    const interval = setInterval(() => {
      loadBlocks();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Setup animations after blocks load
  useEffect(() => {
    if (blocks.length > 0) {
      setTimeout(() => {
        setupScrollAnimations();
      }, 50);
    }
  }, [blocks]);

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

    const animatableElements = containerRef.current.querySelectorAll(".scroll-animate, .card, .stat-card");
    animatableElements.forEach((el) => observer.observe(el));
  };

  const loadBlocks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await blockchainAPI.getAllBlocks(1, 500);

      if (!response.success) {
        setError("Failed to load blocks");
        return;
      }

      const chain = response.data.blockchain || [];
      setBlocks(chain);
    } catch (err) {
      console.error("Error fetching blocks:", err);
      setError("Error fetching blocks");
    } finally {
      setLoading(false);
    }
  };

  // Detect suspicious and high-risk blocks
  const suspiciousBlocks = [];
  const highRiskBlocks = [];

  blocks.forEach((block, index) => {
    if (index > 0) {
      const previous = blocks[index - 1];

      if (previous && previous.user === block.user) {
        const currentTime = new Date(block.timestamp).getTime();
        const prevTime = new Date(previous.timestamp).getTime();
        const diffSeconds = (currentTime - prevTime) / 1000;

        if (diffSeconds <= 5) {
          const riskLevel = diffSeconds <= 3 ? "HIGH" : "MEDIUM";
          suspiciousBlocks.push({
            ...block,
            previousBlock: previous,
            timeDiff: diffSeconds,
            riskLevel
          });

          if (riskLevel === "HIGH") {
            highRiskBlocks.push(block);
          }
        }
      }
    }
  });

  const riskStatus =
    highRiskBlocks.length > 5
      ? "🚨 CRITICAL"
      : highRiskBlocks.length > 0
      ? "⚠️ HIGH RISK"
      : suspiciousBlocks.length > 0
      ? "🟡 SUSPICIOUS"
      : "✅ SAFE";

  return (
    <div className="container" ref={containerRef}>
      <h1>Risk Monitor</h1>

      {error && <div className="error-message">{error}</div>}

      {/* RISK SUMMARY */}
      <div className="card scroll-animate">
        <h3>Risk Assessment</h3>
        <div className="dashboard-grid">
          <div className="stat-card scroll-animate" style={{ borderLeftColor: "#e74c3c" }}>
            <h4>High Risk Alerts</h4>
            <p className="stat-value">{highRiskBlocks.length}</p>
          </div>
          <div className="stat-card scroll-animate" style={{ borderLeftColor: "#f39c12" }}>
            <h4>Suspicious Activities</h4>
            <p className="stat-value">{suspiciousBlocks.length}</p>
          </div>
          <div className="stat-card scroll-animate" style={{ borderLeftColor: "#3498db" }}>
            <h4>Total Blocks</h4>
            <p className="stat-value">{blocks.length}</p>
          </div>
          <div className="stat-card scroll-animate" style={{ borderLeftColor: "var(--color-primary)" }}>
            <h4>Overall Status</h4>
            <p className="stat-value">{riskStatus}</p>
          </div>
        </div>
      </div>

      {/* HIGH RISK BLOCKS */}
      {highRiskBlocks.length > 0 && (
        <div className="card scroll-animate" style={{ borderLeft: "4px solid #e74c3c" }}>
          <h3>🔴 High Risk Blocks ({highRiskBlocks.length})</h3>
          <p style={{ color: "#e74c3c", fontWeight: "bold" }}>
            ⚠️ These blocks were created in very quick succession by the same user
          </p>

          <div className="blocks-table">
            <table>
              <thead>
                <tr style={{ backgroundColor: "#000000b0" }}>
                  <th>#</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                  <th>Time Since Previous</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {suspiciousBlocks
                  .filter(b => b.riskLevel === "HIGH")
                  .map((block) => (
                    <tr
                      key={block._id}
                      onClick={() => setSelectedRisk(block)}
                      style={{ cursor: "pointer", backgroundColor: "#000000b0" }}
                    >
                      <td>#{block.index}</td>
                      <td><strong>{block.user}</strong></td>
                      <td>{block.action}</td>
                      <td>{new Date(block.timestamp).toLocaleString()}</td>
                      <td><strong>{block.timeDiff.toFixed(2)}s</strong></td>
                      <td><span style={{ color: "#e74c3c", fontWeight: "bold" }}>🔴 {block.riskLevel}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUSPICIOUS BLOCKS */}
      {suspiciousBlocks.length > 0 && (
        <div className="card scroll-animate" style={{ borderLeft: "4px solid #f39c12" }}>
          <h3>🟡 Suspicious Activities ({suspiciousBlocks.length})</h3>
          <p style={{ color: "#f39c12", fontWeight: "bold" }}>
            ⚠️ Multiple blocks from the same user within 5 seconds
          </p>

          <div className="blocks-table">
            <table>
              <thead>
                <tr style={{ backgroundColor: "#000000b0" }}>
                  <th>#</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                  <th>Time Diff</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {suspiciousBlocks.map((block) => (
                  <tr
                    key={block._id}
                    onClick={() => setSelectedRisk(block)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>#{block.index}</td>
                    <td>{block.user}</td>
                    <td>{block.action}</td>
                    <td>{new Date(block.timestamp).toLocaleString()}</td>
                    <td>{block.timeDiff.toFixed(2)}s</td>
                    <td>
                      <span style={{ 
                        color: block.riskLevel === "HIGH" ? "#e74c3c" : "#f39c12",
                        fontWeight: "bold"
                      }}>
                        {block.riskLevel === "HIGH" ? "🔴" : "🟡"} {block.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED RISK INFO */}
      {selectedRisk && (
        <div className="card scroll-animate" style={{ backgroundColor: "#f9f9f9" }}>
          <h3>Risk Details</h3>
          <button 
            onClick={() => setSelectedRisk(null)}
            style={{ marginBottom: "10px", padding: "5px 10px" }}
          >
            ✕ Close
          </button>

          <div className="block-details">
            <h4>🔴 Current Block (#{selectedRisk.index})</h4>
            <p><strong>User:</strong> {selectedRisk.user}</p>
            <p><strong>Action:</strong> {selectedRisk.action}</p>
            <p><strong>Timestamp:</strong> {new Date(selectedRisk.timestamp).toLocaleString()}</p>
            <p><strong>IP:</strong> {selectedRisk.ipAddress}</p>

            {selectedRisk.previousBlock && (
              <>
                <hr />
                <h4>Previous Block (#{selectedRisk.previousBlock.index})</h4>
                <p><strong>User:</strong> {selectedRisk.previousBlock.user}</p>
                <p><strong>Action:</strong> {selectedRisk.previousBlock.action}</p>
                <p><strong>Timestamp:</strong> {new Date(selectedRisk.previousBlock.timestamp).toLocaleString()}</p>

                <hr />
                <h4>Risk Analysis</h4>
                <p>
                  <strong>Time Between Blocks:</strong> {selectedRisk.timeDiff.toFixed(2)} seconds
                </p>
                <p>
                  <strong>Risk Level:</strong> 
                  <span style={{
                    color: selectedRisk.riskLevel === "HIGH" ? "#e74c3c" : "#f39c12",
                    fontWeight: "bold",
                    marginLeft: "10px"
                  }}>
                    {selectedRisk.riskLevel === "HIGH" ? "🔴 HIGH" : "🟡 MEDIUM"}
                  </span>
                </p>
                <p style={{ fontSize: "12px", marginTop: "10px", color: "#666" }}>
                  Same user performing actions within {selectedRisk.timeDiff.toFixed(2)} seconds.
                  {selectedRisk.riskLevel === "HIGH" 
                    ? " This is unusually fast and may indicate automated/suspicious activity."
                    : " Verify if this is legitimate activity."}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* SAFE STATUS */}
      {suspiciousBlocks.length === 0 && (
        <div className="card scroll-animate" style={{ backgroundColor: "#000000b0",}}>
          <h3> All Clear!</h3>
          <p>No suspicious or high-risk activities detected.</p>
          <p>All blockchain activities appear normal.</p>
        </div>
      )}

      {/* REFRESH BUTTON */}
      <div className="card scroll-animate">
        <button onClick={loadBlocks} disabled={loading} className="btn-primary">
          🔄 {loading ? "Refreshing..." : "Refresh Risk Analysis"}
        </button>
      </div>
    </div>
  );
}

export default RiskMonitor;