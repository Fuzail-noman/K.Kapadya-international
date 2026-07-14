import { motion } from "framer-motion";

export default function TopBar() {
  return (
    <div className="w-full bg-[#252222] border-b border-[#D4AF37]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto py-3 overflow-hidden">

        {/* Animated Text */}
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="whitespace-nowrap text-center text-[#D4AF37] font-semibold tracking-[3px] uppercase"
        >
    ✨ Premium Men's Shalwar Kameez • Worldwide Delivery in 2 Weeks • Full Advance Payment Required Before Shipment ✨
        </motion.div>

      </div>
    </div>
  );
}