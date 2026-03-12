import React, { useState, useRef, useEffect } from "react";
import { blockchainAPI } from "../api/apiClient";

/**
 * Verify Component
 * Validates blockchain integrity and detects tampering
 * Features: Full chain verification, hash validation, detailed reports
 * Includes scroll animations for better UX
 */
function Verify() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationDetails, setVerificationDetails] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setupScrollAnimations();
  }, []);

  // Setup animations after verification result loads
  useEffect(() => {
    if (status || verificationDetails) {
      setTimeout(() => {
        setupScrollAnimations();
      }, 50);
    }
  }, [status, verificationDetails]);

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

  const verifyBlockchain = async () => {
    setLoading(true);
    setStatus("");
    setError("");
    setVerificationDetails(null);

    try {
      const response = await blockchainAPI.verifyBlockchain();

      if (!response.success) {
        setError(response.data.message || "Verification failed");
        return;
      }

      const data = response.data;
      setStatus(data.status);
      setVerificationDetails({
        tampered: data.tampered,
        totalBlocks: data.totalBlocks,
        tamperedBlock: data.tamperedBlock,
        brokenAt: data.brokenAt
      });

    } catch (err) {
      console.error("Error:", err);
      setError("❌ Error verifying blockchain");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = () => {
    if (!status) return {};
    if (status.includes("valid")) {
      return { color: "#27ae60", borderColor: "#27ae60", backgroundColor: "#000000" };
    }
    return { color: "#e74c3c", borderColor: "#e74c3c", backgroundColor: "#000000" };
  };

  return (
    <div className="container" ref={containerRef}>
      <h1>Blockchain Verification</h1>

      <div className="card scroll-animate">
        <h3>Verify Blockchain Integrity</h3>
        <p>Click the button below to verify all blocks in the blockchain and detect any tampering.</p>

        <button 
          onClick={verifyBlockchain} 
          disabled={loading} 
          className="btn-primary"
          style={{ marginBottom: "20px" }}
        >
          {loading ? "🔄 Verifying..." : "🔍 Verify Blockchain"}
        </button>

        {error && <div className="error-message">{error}</div>}

        {status && (
          <div
            className="verification-result scroll-animate"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "2px solid",
              marginTop: "20px",
              ...getStatusStyle()
            }}
          >
            <h3>{status}</h3>

            {verificationDetails && (
              <div style={{ marginTop: "15px", fontSize: "14px" }}>
                <p><strong>Total Blocks Checked:</strong> {verificationDetails.totalBlocks}</p>
                <p><strong>Blockchain Status:</strong> {verificationDetails.tampered ? "❌ TAMPERED" : "✅ VALID"}</p>

                {verificationDetails.tamperedBlock && (
                  <p style={{ color: "#e74c3c" }}>
                    <strong>⚠️ Tampering Detected at Block:</strong> #{verificationDetails.tamperedBlock}
                  </p>
                )}

                {verificationDetails.brokenAt && (
                  <p style={{ color: "#e74c3c" }}>
                    <strong>⚠️ Chain Break Detected at Block:</strong> #{verificationDetails.brokenAt}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* VERIFICATION INFO */}
      <div className="card scroll-animate">
        <h3>📖 How Verification Works</h3>
        <ul>
          <li><strong>Hash Validation:</strong> Each block's hash is recalculated and compared with the stored hash</li>
          <li><strong>Chain Linkage:</strong> Each block's previousHash is verified to match the previous block's hash</li>
          <li><strong>Tamper Detection:</strong> If any block is modified, its hash changes, breaking the chain</li>
          <li><strong>Integrity Check:</strong> The entire blockchain must be valid for the system to be secure</li>
        </ul>
      </div>

      {/* BLOCKCHAIN STRUCTURE */}
      <div className="card scroll-animate">
        <h3>⛓️ Blockchain Structure</h3>
        <pre style={{ 
          backgroundColor: "#000000", 
          padding: "10px", 
          borderRadius: "5px",
          overflow: "auto"
        }}>
{`Block Structure:
├── Index: Block number in chain
├── LogID: Unique log identifier
├── Action: The action performed
├── User: Who performed the action
├── IP Address: Source IP
├── Timestamp: When action occurred
├── Previous Hash: Hash of previous block
└── Hash: Current block's SHA-256 hash

Genesis Block: previousHash = "0"
Next Blocks: previousHash = previous block's hash`}
        </pre>
      </div>
    </div>
  );
}

export default Verify;