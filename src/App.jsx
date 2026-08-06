import { Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./Context/AuthContext.jsx";
import RouteLoader from "./Navbar/RouteLoader.jsx";
import Home from "./page/Home.jsx";
import SignIn from "./form/Signin.jsx";
import ProtectedRoute from "./Navbar/ProtectedRoute.jsx";
import CollectionPage from "./page/Collection.jsx";
import ProductPage from "./page/ProductPage.jsx";
import CartPage from "./page/Card.jsx";
import CheckoutPage from "./page/Proceed.jsx";
 
function App() {
  const user = localStorage.getItem("user");
 
  return (
    <AuthProvider>
      <RouteLoader>
        <Routes>
          {/* Agar user login hai to collection par bhej do */}
          <Route
            path="/"
            element={user ? <Navigate to="/collection" replace /> : <Home />}
          />
 
          <Route path="/signin" element={<SignIn />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/collection"
            element={
              <ProtectedRoute>
                <CollectionPage />
              </ProtectedRoute>
            }
          />
 
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
 
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouteLoader>
    </AuthProvider>
  );
}
 
export default App;