import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Shirt } from "lucide-react";
 
/**
 * RouteLoader
 * -----------
 * Wrap the part of your app that renders <Routes> with this component.
 * Har baar jab route (location.pathname) change hoti hai, ye:
 *   1) ek full-screen "clothes moving" loading overlay dikhata hai
 *   2) uske baad naya page fade + slide ho kar andar aata hai
 *
 * NAYI LIBRARY KI ZAROORAT NAHI — sirf framer-motion aur lucide-react use
 * hue hain, jo aapke project mein pehle se hi installed hain.
 */
export default function RouteLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    setLoading(true);
    // overlay kitni der dikhna chahiye (ms). Chahein to 700-1200 ke beech adjust karlein.
    const t = setTimeout(() => setLoading(false), 950);
    return () => clearTimeout(t);
  }, [location.pathname]);
 
  return (
    <>
      <AnimatePresence>{loading && <ClothingLoader />}</AnimatePresence>
 
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
 
// Shirts ki ek row jo conveyor/clothing-rail ki tarah slide karti rehti hai
function ClothesRail({ reverse = false, size = 22, duration = 6 }) {
  const items = Array.from({ length: 10 });
  return (
    <div className="relative w-full overflow-hidden py-2">
      <motion.div
        className="flex items-center gap-6 sm:gap-8 w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((_, i) => (
          <Shirt
            key={i}
            size={size}
            className="text-[#D4AF37]/30 flex-shrink-0"
            strokeWidth={1.5}
          />
        ))}
      </motion.div>
    </div>
  );
}
 
function ClothingLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      className="fixed inset-0 z-[9999] bg-[#0B0B0B] flex flex-col items-center justify-center gap-8 px-6 overflow-hidden"
    >
      {/* ambient gold glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] bg-[#D4AF37]/10 rounded-full blur-[110px]" />
 
      {/* top rail — moving right to left is reversed here (right) */}
      <div className="absolute top-[28%] left-0 right-0">
        <ClothesRail reverse duration={7} size={16} />
      </div>
 
      {/* Hanger + swinging shirt (main animation) */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 0%" }}
        >
          <svg width="80" height="92" viewBox="0 0 90 100" fill="none" className="sm:w-[90px] sm:h-[100px]">
            {/* hook */}
            <path
              d="M45 4c-6 0-9 5-6 9l6 7"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* hanger triangle */}
            <path
              d="M45 20 L8 46 Q4 49 8 52 H82 Q86 49 82 46 Z"
              stroke="#D4AF37"
              strokeWidth="2.5"
              fill="none"
              strokeLinejoin="round"
            />
            {/* shirt hanging below the hanger */}
            <motion.path
              d="M28 52 L28 44 L38 40 Q45 44 52 40 L62 44 L62 52
                 L70 58 L64 68 L62 64 L62 94 H28 V64 L26 68 L20 58 Z"
              fill="#141317"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinejoin="round"
              animate={{ scaleX: [1, 1.03, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "45px 60px" }}
            />
          </svg>
        </motion.div>
 
        <div className="text-center">
          <p className="text-[#D4AF37] font-serif text-base sm:text-lg tracking-[0.3em] uppercase">
            K. Kapadya
          </p>
          <p className="text-gray-500 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mt-1">
            International
          </p>
        </div>
 
        {/* progress bar */}
        <div className="w-36 sm:w-40 h-[3px] rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#e8c766]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
 
      {/* bottom rail — moving left */}
      <div className="absolute bottom-[28%] left-0 right-0">
        <ClothesRail duration={9} size={16} />
      </div>
    </motion.div>
  );
}