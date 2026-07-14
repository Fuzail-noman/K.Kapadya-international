import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import logo from "../assets/logo9.png";
import { Link, useLocation, useNavigate } from "react-router";

import { useAuth } from "../Context/AuthContext.jsx";
import TopBar from "./Topbar.jsx";



export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Cart count ko sync karo — user badalte hi (login/logout) ya cart update hote hi
  useEffect(() => {
    const syncCart = () => {
      if (isAuthenticated && user) {
        const cartKey = `cart_${user.id}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQty);
      } else {
        setCartCount(0);
      }
    };

    syncCart();

    window.addEventListener("storage", syncCart);
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("authChanged", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("authChanged", syncCart);
    };
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setCartCount(0);
    navigate("/signin");
  };

  const navItems = [

    { name: "COLLECTION", path: "/collection" },
    { name: "OFFER", path: "/offer" },
  ];

  return (
    <>
      <TopBar />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-6 md:px-16 py-4 bg-[#0B0B0B] border-b border-[#D4AF37]/20 relative z-50 shadow-lg"
      >
        {/* LOGO */}
        <Link to="/home">
          <motion.img
            whileHover={{ scale: 1.08 }}
            src={logo}
            alt="Logo"
            className="w-30 cursor-pointer"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative pb-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
                location.pathname === item.path
                  ? "text-[#D4AF37]"
                  : "text-white hover:text-[#D4AF37]"
              }`}
            >
              {item.name}
              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-[#D4AF37] transition-all duration-300 ${
                  location.pathname === item.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/signin">
                <button className="px-5 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition duration-300">
                  Sign In
                </button>
              </Link>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
            >
              Sign Out
            </motion.button>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart
              size={25}
              className="text-[#D4AF37] hover:text-white transition duration-300 cursor-pointer"
            />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="text-[#D4AF37]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#D4AF37]">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute top-full left-0 w-full bg-[#0B0B0B] border-t border-[#D4AF37]/20 shadow-lg flex flex-col items-center gap-5 py-8 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`group relative pb-2 text-lg font-semibold transition-all duration-300 ${
                  location.pathname === item.path
                    ? "text-[#D4AF37]"
                    : "text-white hover:text-[#D4AF37]"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-[#D4AF37] transition-all duration-300 ${
                    location.pathname === item.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}

            {!isAuthenticated ? (
              <Link to="/signin" onClick={() => setMenuOpen(false)}>
                <button className="w-48 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition duration-300">
                  Sign In
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-full"
              >
                Sign Out
              </button>
            )}
          </motion.div>
        )}
      </motion.nav>

      
    </>
  );
}
