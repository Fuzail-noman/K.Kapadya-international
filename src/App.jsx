import { Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { CurrencyProvider } from "./Context/CurrencyContext.jsx";
import RouteLoader from "./Navbar/RouteLoader.jsx";
import Home from "./page/Home.jsx";
import SignIn from "./form/Signin.jsx";
import ProtectedRoute from "./Navbar/ProtectedRoute.jsx";
import CollectionPage from "./page/Collection.jsx";
import ProductPage from "./page/ProductPage.jsx";
import CartPage from "./page/Card.jsx";
import CheckoutPage from "./page/Proceed.jsx";
import OfferPage from "./page/Offer.jsx";
 
function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <RouteLoader>
          <Routes>
            {/* Home page — bina login ke bhi khulega */}
            <Route path="/" element={<Home />} />
 
            {/* Collection — public, browsing ke liye login zaroori nahi */}
            <Route path="/collection" element={<CollectionPage />} />
 
            <Route path="/signin" element={<SignIn />} />
            <Route path="/checkout" element={<CheckoutPage />} />
 
            <Route path="/offer" element={<OfferPage />} />
 
            {/* Product detail bhi public — sirf "Add to cart" pe login maanga jayega
                (ProductPage.jsx mein already yeh logic hai: !isAuthenticated -> /signin) */}
            <Route path="/product/:id" element={<ProductPage />} />
 
            {/* Cart abhi bhi protected — checkout se pehle login zaroori */}
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
      </CurrencyProvider>
    </AuthProvider>
  );
}
 
export default App;