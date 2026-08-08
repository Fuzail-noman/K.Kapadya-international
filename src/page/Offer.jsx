import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Flame, Tag, Timer } from "lucide-react";
import Navbar from "../Navbar/navbar.jsx";
import Footer2 from "../Footer/footer.jsx";
import { PRODUCTS, ProductCard, getDiscountPercent } from "./Collection.jsx";

// Countdown target — resets every time it "expires" so the banner always
// shows an active-looking sale (swap for a real end-date from your backend
// whenever you want a genuine, non-repeating flash sale).
function getNextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d;
}

function useCountdown(target) {
  const [msLeft, setMsLeft] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const diff = target - Date.now();
      setMsLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
  };
}

function CountdownBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-black/40 border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 min-w-[64px]">
      <span className="font-serif text-2xl text-[#D4AF37] leading-none">{value}</span>
      <span className="text-[10px] text-white/60 tracking-wide mt-1">{label}</span>
    </div>
  );
}

export default function OfferPage() {
  const target = useMemo(getNextMidnight, []);
  const { hours, minutes, seconds } = useCountdown(target);

  // Offer items = flagged as featuredOffer, sorted by biggest discount first
  const offerProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.featuredOffer).sort(
      (a, b) => getDiscountPercent(b) - getDiscountPercent(a)
    );
  }, []);

  const maxDiscount = offerProducts.length
    ? Math.max(...offerProducts.map(getDiscountPercent))
    : 0;

  return (
    <>
      <Navbar />

      <div className="w-full bg-[#0B0B0B] min-h-screen">
        {/* Hero banner — CSS-only gold shimmer, no external images */}
        <div className="relative overflow-hidden px-5 py-16 sm:py-20 text-center border-b border-[#D4AF37]/20">
          {/* Animated ambient glows, consistent with Signin.jsx styling */}
          <motion.div
            className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-[#D4AF37]/15 blur-[110px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-[#D4AF37]/15 blur-[110px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.85, 0.5, 0.85] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Diagonal shimmer sweep */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 20%, rgba(212,175,55,0.12) 40%, transparent 60%)",
            }}
            animate={{ x: ["-30%", "30%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <span className="inline-flex items-center gap-1.5 text-[#D4AF37] text-xs tracking-[0.3em] mb-4">
              <Flame size={14} /> LIMITED TIME OFFER
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#f3ede0] leading-tight">
              Up to {maxDiscount}% Off
            </h1>
            <p className="text-[#9b9488] mt-3 max-w-md mx-auto text-sm sm:text-base">
              Handpicked stitched pieces at our steepest prices this season.
              Stock is limited — once it's gone, it's gone.
            </p>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Timer size={16} className="text-[#D4AF37] mr-1" />
              <CountdownBlock value={hours} label="HRS" />
              <span className="text-[#D4AF37] font-serif text-xl">:</span>
              <CountdownBlock value={minutes} label="MIN" />
              <span className="text-[#D4AF37] font-serif text-xl">:</span>
              <CountdownBlock value={seconds} label="SEC" />
            </div>

            <div className="w-16 h-[2px] mx-auto mt-8 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </motion.div>
        </div>

        {/* Offer grid */}
        <div className="w-full px-5 py-14">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Tag size={16} className="text-[#D4AF37]" />
            <h2 className="text-[#f3ede0] font-serif text-2xl">Today's Best Deals</h2>
          </div>

          {offerProducts.length === 0 ? (
            <div className="text-center py-16 text-[#9b9488]">
              No active offers right now — check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {offerProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer2 />
    </>
  );
}