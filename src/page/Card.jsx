import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import { useAuth } from "../Context/AuthContext.jsx";
import { useCurrency } from "../Context/CurrencyContext.jsx";
 
// Delivery rules — amounts stored in PKR (base currency), just like product
// prices, then converted into the user's local currency at display time.
// Pakistan-based users pay a flat local delivery fee; every other country
// pays the international delivery fee.
const DELIVERY_FEE_PAKISTAN_PKR = 4000;
const DELIVERY_FEE_INTERNATIONAL_PKR = 11000;
 
export default function CartPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const [cart, setCart] = useState([]);
 
  const cartKey = user ? `cart_${user.id}` : null;
 
  // Load cart for the logged-in user, and re-sync if it changes elsewhere
  useEffect(() => {
    if (!isAuthenticated || !cartKey) {
      setCart([]);
      return;
    }
    const load = () => setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
    load();
    window.addEventListener("cartUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("cartUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, [isAuthenticated, cartKey]);
 
  const persist = (updatedCart) => {
    setCart(updatedCart);
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };
 
  const handleQtyChange = (index, quantity) => {
    if (quantity < 1) return;
    const updated = [...cart];
    updated[index] = { ...updated[index], quantity };
    persist(updated);
  };
 
  const handleRemove = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    persist(updated);
  };
 
  // item.price is stored in PKR (base currency); every total below is
  // computed in PKR first, then converted + formatted into the user's
  // local currency once at render time — this keeps the math exact
  // regardless of which currency is being displayed.
  const subtotalInPKR = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
 
  // Determine delivery fee based on the user's country.
  // Assumes `user.country` holds a string like "Pakistan".
  const isPakistan = user?.country?.toLowerCase() === "pakistan";
 
  const deliveryInPKR =
    cart.length === 0
      ? 0
      : isPakistan
      ? DELIVERY_FEE_PAKISTAN_PKR
      : DELIVERY_FEE_INTERNATIONAL_PKR;
 
  const grandTotalInPKR = subtotalInPKR + deliveryInPKR;
 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center gap-4 text-[#9b9488] px-5">
        <ShoppingBag size={34} className="text-[#D4AF37]" />
        <p>Please sign in to view your cart.</p>
        <button
          onClick={() => navigate("/signin")}
          className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition"
        >
          Sign In
        </button>
      </div>
    );
  }
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0B0B0B] px-4 sm:px-5 pb-24 pt-6 sm:pt-7"
    >
      <div className="max-w-2xl mx-auto">
        {/* Back — uses browser/router history, no full page reload */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#f3ede0] hover:text-[#D4AF37] text-sm px-4 py-2 rounded-full mb-6 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
 
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f3ede0] mb-6">
          Your Cart
        </h1>
 
        {cart.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#D4AF37]/20 rounded-2xl text-[#9b9488]">
            <ShoppingBag size={34} className="text-[#D4AF37] mx-auto mb-4" />
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate("/collection")}
              className="text-[#D4AF37] text-sm mt-3"
            >
              Browse the collection →
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3 sm:gap-4 bg-[#141317] border border-[#D4AF37]/20 rounded-2xl p-3 sm:p-3.5"
                  >
                    <div
                      className="w-16 h-20 sm:w-19 sm:h-24 rounded-lg flex-shrink-0"
                      style={{ background: item.gradient }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[#9b9488]">{item.brand}</span>
                      <h3 className="font-serif text-[#f3ede0] text-base sm:text-lg my-0.5 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#9b9488] text-xs mb-2">
                        Size: <span className="text-[#D4AF37]">{item.size}</span>
                      </p>
                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                        <div className="inline-flex items-center border border-[#D4AF37]/20 rounded-full">
                          <button
                            onClick={() => handleQtyChange(i, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#f3ede0]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-[#f3ede0] text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(i, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#f3ede0]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(i)}
                          className="flex items-center gap-1 text-red-500 text-xs"
                        >
                          <X size={13} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-[#D4AF37] font-bold text-sm whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
 
            <div className="mt-6 pt-5 border-t border-[#D4AF37]/20 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#9b9488]">Subtotal</span>
                <span className="text-[#f3ede0]">{formatPrice(subtotalInPKR)}</span>
              </div>
 
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#9b9488] flex items-center gap-1.5">
                  <Truck size={14} className="text-[#D4AF37]" /> Delivery
                </span>
                <span className="text-[#f3ede0]">{formatPrice(deliveryInPKR)}</span>
              </div>
 
              <div className="flex justify-between items-center pt-3 mt-1 border-t border-[#D4AF37]/20">
                <span className="text-[#9b9488]">Total</span>
                <span className="font-serif text-xl sm:text-2xl text-[#f3ede0]">
                  {formatPrice(grandTotalInPKR)}
                </span>
              </div>
            </div>
 
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-5 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#e8c766] text-black font-bold"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
 