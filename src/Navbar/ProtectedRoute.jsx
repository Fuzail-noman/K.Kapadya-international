import { Navigate } from "react-router";
import { useAuth } from "../Context/AuthContext.jsx";

/**
 * Kisi bhi protected page (jaise /home) ko is se wrap karo.
 * Agar user login nahi hai to seedha /signin bhej dega.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // localStorage check ho rahi hai, tab tak kuch flash mat karo
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
