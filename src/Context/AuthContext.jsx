import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/**
 * AuthProvider — poori app ke around lagega (App.jsx mein).
 * Yeh "user" aur "token" dono ko localStorage mein rakhta hai,
 * aur Navbar / ProtectedRoute / Signin sab isi ek context ko use karte hain
 * — is liye ab do alag auth systems (auth.js vs AuthContext) wali confusion nahi rahegi.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // page reload pe localStorage check hone tak true

  // App load / refresh hote hi check karo pehle se login hai ya nahi
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        // corrupted data ho to safely clear kardo
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Login / Signup success ke baad yeh call hoga (Signin.jsx se)
  const login = (userData, authToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
    setToken(authToken);
    // Navbar jaise components ko batane ke liye (dusre tabs mein bhi sync ho jaye)
    window.dispatchEvent(new Event("authChanged"));
  };

  // Sign Out par yeh call hoga
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event("authChanged"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
