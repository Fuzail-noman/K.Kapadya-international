import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ShoppingBag, Minus, Plus, ArrowLeft } from "lucide-react";
import { useAuth } from "../Context/AuthContext.jsx";
import { PRODUCTS } from "./Collection.jsx";
import { formatPrice } from "../utils/currency.js";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const product = PRODUCTS.find((p) => p.id === id);

  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSize(null);
    setQty(1);
    setError("");
    setAdded(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-[#9b9488]">
        Product not found.
      </div>
    );
  }

  // Add to cart:
  // 1) requires sign-in (cart is stored per user id)
  // 2) requires a size to be picked
  // 3) merges quantity if the same product+size is already in the cart
  // 4) writes to the correct localStorage key AND dispatches "cartUpdated"
  //    so the Navbar badge (which listens for that event) updates instantly.
  // 5) after adding, sends the user BACK to the collection page (not the cart page)
  //    so they can keep browsing / add more items.
  const handleAddToCart = () => {
    if (!isAuthenticated || !user) {
      navigate("/signin");
      return;
    }
    if (!size) {
      setError("Please select a size to continue.");
      return;
    }

    const cartKey = `cart_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const matchIndex = existingCart.findIndex(
      (item) => item.id === product.id && item.size === size
    );

    let updatedCart;
    if (matchIndex > -1) {
      updatedCart = [...existingCart];
      updatedCart[matchIndex] = {
        ...updatedCart[matchIndex],
        quantity: updatedCart[matchIndex].quantity + qty,
      };
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price, // stored in PKR (base currency); converted at display time
          gradient: product.gradient,
          size,
          quantity: qty,
        },
      ];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setAdded(true);
    setTimeout(() => navigate("/collection"), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0B0B0B] px-5 pb-24 pt-7"
    >
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#9b9488] hover:text-[#D4AF37] text-sm mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to collection
        </button>

        <div className="grid md:grid-cols-2 gap-11">
          <div
            className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-[#D4AF37]/20"
            style={{ background: product.gradient }}
          >
            <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[11px] font-bold px-3 py-1 rounded-full">
              SALE
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-2xl text-white/50 tracking-wide">
                {product.brand}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[#D4AF37] text-xs tracking-wide">{product.brand}</span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#f3ede0] mt-2 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="line-through text-[#9b9488]">
                {formatPrice(product.mrp, user)}
              </span>
              <span className="text-[#D4AF37] font-bold text-xl">
                {formatPrice(product.price, user)}
              </span>
            </div>
            <p className="text-[#9b9488] text-xs mb-6">
              {product.stock} in stock &middot; shipping calculated at checkout
            </p>

            <div className="mb-6">
              <p className="text-[#f3ede0] text-sm mb-2">Size</p>
              <div className="flex gap-2.5 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setError("");
                    }}
                    className={`w-13 h-11 px-4 rounded-lg border text-sm font-semibold transition ${
                      size === s
                        ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                        : "border-[#D4AF37]/20 text-[#f3ede0] hover:border-[#D4AF37]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <div className="mb-7">
              <p className="text-[#f3ede0] text-sm mb-2">Quantity</p>
              <div className="inline-flex items-center border border-[#D4AF37]/20 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#f3ede0] hover:text-[#D4AF37]"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-[#f3ede0]">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#f3ede0] hover:text-[#D4AF37]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* "Buy it now" removed — Add to cart is the only purchase action */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#e8c766] text-black font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <ShoppingBag size={18} />
              {added ? "Added ✓" : "Add to cart"}
            </motion.button>

            {!isAuthenticated && (
              <p className="text-[#9b9488] text-xs mt-3 text-center">
                You'll need to sign in to add items to your cart.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
