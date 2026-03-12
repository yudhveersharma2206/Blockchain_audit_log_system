import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { blockchainAPI } from "../api/apiClient";

/**
 * Dashboard Component
 * Displays blockchain overview with real-time block updates
 * Features: Status monitoring, visualization, analytics, PDF export
 * Scroll animations applied to all major sections
 */
function Dashboard() {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  // AUTO REFRESH
  useEffect(() => {
    loadBlocks();
    const interval = setInterval(() => {
      loadBlocks();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [currentPage]);

  // Setup scroll animations after blocks load
  useEffect(() => {
    if (blocks.length > 0) {
      setTimeout(() => {
        setupScrollAnimations();
      }, 50);
    }
  }, [blocks]);

  /**
   * Sets up Intersection Observer for scroll animations
   * Animates elements as they come into viewport
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

    const animatableElements = containerRef.current.querySelectorAll(
      ".scroll-animate, .stat-card, .card, .blocks-table"
    );
    animatableElements.forEach((el) => observer.observe(el));
  };

  const loadBlocks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await blockchainAPI.getAllBlocks(currentPage, 100);

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

  const totalBlocks = blocks.length;
  let suspiciousCount = 0;
  let highRiskCount = 0;

  blocks.forEach((block, index) => {
    if (index > 0) {
      const previous = blocks[index - 1];
      if (previous && previous.user === block.user) {
        const currentTime = new Date(block.timestamp).getTime();
        const prevTime = new Date(previous.timestamp).getTime();
        const diffSeconds = (currentTime - prevTime) / 1000;

        if (diffSeconds <= 5) suspiciousCount++;
        if (diffSeconds <= 3) highRiskCount++;
      }
    }
  });

  const blockchainStatus =
    highRiskCount > 0
      ? "🚨 HIGH RISK"
      : suspiciousCount > 0
      ? "⚠ SUSPICIOUS ACTIVITY"
      : "✅ SECURE";

  const latestBlock = blocks[blocks.length - 1];

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Blockchain Audit Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Blocks: ${totalBlocks}`, 14, 38);
    doc.text(`Suspicious Activities: ${suspiciousCount}`, 14, 46);
    doc.text(`High Risk Alerts: ${highRiskCount}`, 14, 54);
    doc.text(`Status: ${blockchainStatus}`, 14, 62);

    const tableData = blocks.map((block) => [
      block.index,
      block.user,
      block.action,
      block.ipAddress || "N/A",
      new Date(block.timestamp).toLocaleString(),
      block.hash.substring(0, 8) + "...",
    ]);

    autoTable(doc, {
      startY: 70,
      head: [["Index", "User", "Action", "IP", "Timestamp", "Hash"]],
      body: tableData,
      styles: { fontSize: 8 },
      columnWidth: "wrap",
    });

    doc.save("Blockchain_Audit_Report.pdf");
  };

  const StatCard = ({ title, value, color = "#3498db" }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <h4>{title}</h4>
      <p className="stat-value">{value}</p>
    </div>
  );

  return (
    <div className="container" ref={containerRef}>
      <h1>Blockchain Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {suspiciousCount > 0 && (
        <div className="alert-card scroll-animate" style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", color: "#856404" }}>
          🚨 ⚠️ {suspiciousCount} Suspicious Activities Detected - {highRiskCount} High Risk Alerts
        </div>
      )}

      {/* STATS */}
      <div className="dashboard-grid">
        <StatCard title="Total Blocks" value={totalBlocks} color="#3498db" />
        <StatCard 
          title="Suspicious Activities" 
          value={suspiciousCount} 
          color={suspiciousCount > 0 ? "#e74c3c" : "#27ae60"}
        />
        <StatCard 
          title="High Risk Alerts" 
          value={highRiskCount} 
          color={highRiskCount > 0 ? "#c0392b" : "#27ae60"}
        />
        <StatCard 
          title="Latest Block" 
          value={latestBlock?.index || "N/A"}
          color="#f39c12"
        />
      </div>

      {/* STATUS */}
      <div className="card scroll-animate status-card">
        <h3>⛓️ Blockchain Status</h3>
        <p className={`status-text ${highRiskCount > 0 ? "danger" : suspiciousCount > 0 ? "warning" : "safe"}`}>
          {blockchainStatus}
        </p>
        {latestBlock && (
          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            Latest Block: #{latestBlock.index} - {new Date(latestBlock.timestamp).toLocaleString()}
          </p>
        )}
      </div>

      {/* BLOCKCHAIN VISUALIZATION */}
      <div className="card scroll-animate">
        <h3>⛓️ Blockchain Visualization</h3>
        {loading ? (
          <p>🔄 Loading blocks...</p>
        ) : (
          <div className="chain-container">
            {blocks.slice(0, 20).map((block, index) => (
              <div key={block._id} className="chain-item">
                <div
                  className={`chain-block ${selectedBlock?._id === block._id ? "active-block" : ""}`}
                  onClick={() => setSelectedBlock(block)}
                  style={{ cursor: "pointer" }}
                >
                  #{block.index}
                </div>
                {index !== Math.min(blocks.length - 1, 19) && <div className="chain-arrow">➜</div>}
              </div>
            ))}
            {blocks.length > 20 && <div className="chain-item">... +{blocks.length - 20} more</div>}
          </div>
        )}
      </div>

      {/* BLOCK DETAILS */}
      {selectedBlock && (
        <div className="card scroll-animate">
          <h3>Block Details</h3>
          <div className="block-details">
            <p><strong>Index:</strong> {selectedBlock.index}</p>
            <p><strong>Log ID:</strong> <code>{selectedBlock.logId}</code></p>
            <p><strong>User:</strong> {selectedBlock.user}</p>
            <p><strong>Action:</strong> {selectedBlock.action}</p>
            <p><strong>IP Address:</strong> {selectedBlock.ipAddress}</p>
            <p><strong>Timestamp:</strong> {new Date(selectedBlock.timestamp).toLocaleString()}</p>
            <p><strong>Hash:</strong> <code style={{ wordBreak: "break-all" }}>{selectedBlock.hash}</code></p>
            <p><strong>Previous Hash:</strong> <code style={{ wordBreak: "break-all" }}>{selectedBlock.previousHash}</code></p>
          </div>
        </div>
      )}

      {/* RECENT BLOCKS TABLE */}
      <div className="card scroll-animate">
        <h3>Recent Blocks</h3>
        {loading ? (
          <p>🔄 Loading...</p>
        ) : blocks.length === 0 ? (
          <p>No blocks found. Add your first block!</p>
        ) : (
          <div className="blocks-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                  <th>Hash (Preview)</th>
                </tr>
              </thead>
              <tbody>
                {blocks.slice(0, 10).map((block) => (
                  <tr
                    key={block._id}
                    onClick={() => setSelectedBlock(block)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>#{block.index}</td>
                    <td>{block.user}</td>
                    <td>{block.action}</td>
                    <td>{new Date(block.timestamp).toLocaleString()}</td>
                    <td><code>{block.hash.substring(0, 16)}...</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="card scroll-animate">
        <button onClick={downloadReport} className="btn-primary">
          📥 Download PDF Report
        </button>
        <button onClick={loadBlocks} className="btn-secondary" style={{ marginLeft: "10px" }}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}

export default Dashboard;