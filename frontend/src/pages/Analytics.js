import React, { useState, useEffect, useRef } from "react";
import { blockchainAPI } from "../api/apiClient";

/**
 * Analytics Component
 * Displays blockchain statistics with scroll-triggered animations
 * Elements slide in from left/right as user scrolls down the page
 */
function Analytics() {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    // Setup animations after stats are loaded
    if (Object.keys(stats).length > 0) {
      setTimeout(() => {
        setupScrollAnimations();
      }, 50);
    }
  }, [stats]);

  /**
   * Sets up Intersection Observer for scroll animations
   * Adds animation classes when elements come into viewport
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
          // Add animation class when element enters viewport
          entry.target.classList.add("scroll-animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = containerRef.current.querySelectorAll(
      ".scroll-animate, .stat-card, .card, .blocks-table"
    );
    animatableElements.forEach((el) => observer.observe(el));
  };

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await blockchainAPI.getAllBlocks(1, 1000);

      if (!response.success) {
        setError("Failed to load analytics");
        return;
      }

      const chain = response.data.blockchain || [];
      setBlocks(chain);
      calculateStats(chain);
    } catch (err) {
      console.error("Error:", err);
      setError("Error loading analytics");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (blockData) => {
    if (blockData.length === 0) {
      setStats({});
      return;
    }

    // User statistics
    const userMap = {};
    const actionMap = {};
    const hourlyMap = {};

    blockData.forEach((block) => {
      // Count by user
      userMap[block.user] = (userMap[block.user] || 0) + 1;

      // Count by action
      actionMap[block.action] = (actionMap[block.action] || 0) + 1;

      // Count by hour
      const date = new Date(block.timestamp);
      const hour = date.toISOString().split("T")[0];
      hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
    });

    const mostActiveUser = Object.entries(userMap).sort((a, b) => b[1] - a[1])[0];
    const mostCommonAction = Object.entries(actionMap).sort((a, b) => b[1] - a[1])[0];
    const avgBlocksPerDay = blockData.length / Math.max(1, Object.keys(hourlyMap).length);

    setStats({
      totalBlocks: blockData.length,
      uniqueUsers: Object.keys(userMap).length,
      uniqueActions: Object.keys(actionMap).length,
      mostActiveUser: mostActiveUser ? { name: mostActiveUser[0], count: mostActiveUser[1] } : null,
      mostCommonAction: mostCommonAction ? { name: mostCommonAction[0], count: mostCommonAction[1] } : null,
      avgBlocksPerDay: avgBlocksPerDay.toFixed(2),
      topUsers: Object.entries(userMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      topActions: Object.entries(actionMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    });
  };

  return (
    <div className="container" ref={containerRef}>
      <h1>📈 Analytics Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="card scroll-animate" style={{ textAlign: "center" }}>
          <p>🔄 Loading analytics...</p>
        </div>
      ) : Object.keys(stats).length === 0 ? (
        <div className="card scroll-animate">
          <p>No data available yet. Add some blocks first!</p>
        </div>
      ) : (
        <>
          {/* KEY METRICS */}
          <div className="dashboard-grid">
            <div className="stat-card scroll-animate" style={{ borderLeftColor: "#3498db" }}>
              <h4>Total Blocks</h4>
              <p className="stat-value">{stats.totalBlocks}</p>
            </div>
            <div className="stat-card scroll-animate" style={{ borderLeftColor: "#2ecc71" }}>
              <h4>Unique Users</h4>
              <p className="stat-value">{stats.uniqueUsers}</p>
            </div>
            <div className="stat-card scroll-animate" style={{ borderLeftColor: "#f39c12" }}>
              <h4>Unique Actions</h4>
              <p className="stat-value">{stats.uniqueActions}</p>
            </div>
            <div className="stat-card scroll-animate" style={{ borderLeftColor: "#9b59b6" }}>
              <h4>Avg Blocks/Day</h4>
              <p className="stat-value">{stats.avgBlocksPerDay}</p>
            </div>
          </div>

          {/* MOST ACTIVE USER */}
          {stats.mostActiveUser && (
            <div className="card scroll-animate">
              <h3>👤 Most Active User</h3>
              <div style={{ padding: "20px", backgroundColor: "#000000a0", borderRadius: "8px" }}>
                <p>
                  <strong>{stats.mostActiveUser.name}</strong> has performed{" "}
                  <strong style={{ color: "#3498db" }}>{stats.mostActiveUser.count}</strong> actions
                </p>
              </div>
            </div>
          )}

          {/* MOST COMMON ACTION */}
          {stats.mostCommonAction && (
            <div className="card scroll-animate">
              <h3>⚙️ Most Common Action</h3>
              <div style={{ padding: "20px", backgroundColor: "#000000a0", borderRadius: "8px" }}>
                <p>
                  <strong>{stats.mostCommonAction.name}</strong> has been performed{" "}
                  <strong style={{ color: "#2ecc71" }}>{stats.mostCommonAction.count}</strong> times
                </p>
              </div>
            </div>
          )}

          {/* TOP 5 USERS */}
          <div className="card scroll-animate">
            <h3>👥 Top 5 Most Active Users</h3>
            <div className="blocks-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Number of Actions</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topUsers.map((user, idx) => (
                    <tr key={idx}>
                      <td><strong>#{idx + 1}</strong></td>
                      <td>{user[0]}</td>
                      <td><strong>{user[1]}</strong></td>
                      <td>{((user[1] / stats.totalBlocks) * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP 5 ACTIONS */}
          <div className="card scroll-animate">
            <h3>⚙️ Top 5 Most Common Actions</h3>
            <div className="blocks-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Action</th>
                    <th>Frequency</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topActions.map((action, idx) => (
                    <tr key={idx}>
                      <td><strong>#{idx + 1}</strong></td>
                      <td>{action[0]}</td>
                      <td><strong>{action[1]}</strong></td>
                      <td>{((action[1] / stats.totalBlocks) * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* REFRESH BUTTON */}
          <div className="card scroll-animate">
            <button onClick={loadAnalytics} className="btn-primary">
              🔄 Refresh Analytics
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
