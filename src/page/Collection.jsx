import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../Navbar/navbar.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import { formatPrice } from "../utils/currency.js";
import Footer2 from "../Footer/footer.jsx";


// Product data — imported by CollectionPage.jsx (ProductPage.jsx also imports this)
// Prices are stored in PKR (base currency); they're converted + displayed in
// each user's local currency at render time via formatPrice().
// NOTE: `category` values used by the filter dropdown are:
//   "waistcoat" | "shalwar-kameez" | "shalwar-kameez-waistcoat"
export const PRODUCTS = [
  {
    id: "sana-purple",
    brand: "SANA SAFINAZ",
    name: "Purple Stitched Shirt Piece",
    price: 899,
    mrp: 1590,
    stock: 39,
    category: "shalwar-kameez",
    gradient: "linear-gradient(150deg,#8f7fc7 0%,#6d5aa8 45%,#463a6e 100%)",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "binsaeed-green-pink",
    brand: "BINSAEED & SANA SAFINAZ",
    name: "Green + Pink Stitched Shirt Piece",
    price: 899,
    mrp: 1590,
    stock: 24,
    category: "shalwar-kameez",
    gradient: "linear-gradient(150deg,#e06b9c 0%,#c94f7f 40%,#4f9c6b 100%)",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sana-green-blue",
    brand: "SANA SAFINAZ",
    name: "Green / Blue Stitched Shirt Piece",
    price: 899,
    mrp: 1590,
    stock: 17,
    category: "shalwar-kameez",
    gradient: "linear-gradient(150deg,#5fae7a 0%,#3f8f6a 45%,#2f5f7a 100%)",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "lakhany-trouser",
    brand: "LAKHANY",
    name: "Randomly Stitched Trouser in White",
    price: 900,
    mrp: 1900,
    stock: 52,
    category: "shalwar-kameez",
    gradient: "linear-gradient(150deg,#efe9da 0%,#d9d0ba 45%,#b8ac8f 100%)",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "poonas-trouser",
    brand: "POONAS COLLECTION",
    name: "Stitched White Trouser, Random Designs",
    price: 700,
    mrp: 1990,
    stock: 61,
    category: "shalwar-kameez",
    gradient: "linear-gradient(150deg,#f2eee2 0%,#e2dbc7 45%,#c4b998 100%)",
    sizes: ["S", "M", "L", "XL"],
  },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "waistcoat", label: "Waistcoat" },
  { value: "shalwar-kameez", label: "Shalwar Kameez" },
  { value: "shalwar-kameez-waistcoat", label: "Shalwar Kameez + Waistcoat" },
];

function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-[#141317] border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-colors duration-300"
    >
      <div
        className="relative aspect-[3/4]"
        style={{ background: product.gradient }}
      >
        <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[11px] font-bold px-3 py-1 rounded-full">
          SALE
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-4 w-full text-center text-white/60 text-sm tracking-wide font-serif">
          {product.brand}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] text-[#9b9488] tracking-wide">{product.brand}</span>
        <h3 className="font-serif text-lg text-[#f3ede0] my-1 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="line-through text-[#9b9488] text-sm">
            {formatPrice(product.mrp, user)}
          </span>
          <span className="text-[#D4AF37] font-bold">
            {formatPrice(product.price, user)}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-auto text-center border border-[#D4AF37] text-[#D4AF37] py-2.5 rounded-full text-sm hover:bg-[#D4AF37] hover:text-black transition duration-300"
        >
          Choose options
        </Link>
      </div>
    </motion.div>
  );
}

export default function CollectionPage() {
  const [category, setCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    if (category === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  return (
    <>
      <Navbar />

      <div className="w-full px-5 pb-20 bg-[#0B0B0B] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-14"
        >
          <span className="text-[#D4AF37] text-xs tracking-[0.3em]">NEW SEASON</span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#f3ede0] mt-3">
            Stitched Collection
          </h1>
          <div className="w-16 h-[2px] mx-auto mt-3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </motion.div>

        {/* Category filter dropdown */}
        <div className="flex justify-center md:justify-end mb-8">
          <div className="relative w-full max-w-[260px]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-[#141317] border border-[#D4AF37]/30 text-[#f3ede0] text-sm rounded-full px-5 py-2.5 pr-10 cursor-pointer focus:outline-none focus:border-[#D4AF37] transition"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141317] text-[#f3ede0]">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] text-xs">
              ▼
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-[#9b9488]">
            No products found in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer2/>
    </>
  );
}
