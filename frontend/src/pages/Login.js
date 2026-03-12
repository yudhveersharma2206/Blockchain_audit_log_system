import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api/apiClient";

/**
 * Login Component
 * User authentication page for blockchain audit system
 * Features: Secure login, role-based access, session management
 * Includes scroll animations and error handling
 */
function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Re-setup animations to ensure DOM is ready
  useEffect(() => {
    setTimeout(() => {
      setupScrollAnimations();
    }, 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Enter username and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(username, password);

      if (!response.success) {
        setError(response.data.message || "Login failed");
        return;
      }

      const { token, user } = response.data;

      // Store in auth context with token and user data
      login(user, token);

      // Redirect to dashboard
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="card scroll-animate">
        <h2>Secure Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "🔄 Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "0.9em", color: "#888" }}>
        </p>  

  
      </div>
    </div>
  );
}

export default Login;