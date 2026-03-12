import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

/**
 * Authentication Context Provider
 * Manages user authentication state and persistence
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}