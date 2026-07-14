import { motion } from "framer-motion";
import {
  Sparkles,
  Award,
  Shield,
  Truck,
  HeadphonesIcon,
  BadgeCheck,
} from "lucide-react";
import kapadyaLogo from "../assets/logo9.png";
 
import Footer1 from "../Footer/footer1.jsx";
import { useNavigate } from "react-router";

import { useAuth } from "../Context/AuthContext.jsx";
import Carousel from "../Navbar/CAROUSEL.jsx";
// import Extra from "./Extra.jsx";
import Extra1 from "./Extra1.jsx";

 
const features = [
  {
    icon: Sparkles,
    title: "Premium Fabric",
    desc: "Finest wash & wear fabric, handpicked for luxury, comfort and everyday elegance.",
  },
  {
    icon: Award,
    title: "Tailored Craftsmanship",
    desc: "Every stitch crafted with precision by master tailors for a flawless fit.",
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    desc: "100% secure checkout with easy returns and nationwide delivery.",
  },
  {
    icon: Truck,
    title: "Worldwide Delivery",
    desc: "Fast and reliable worldwide shipping with delivery within 2 weeks.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    desc: "Dedicated customer support team ready to assist you anytime.",
  },
  {
    icon: BadgeCheck,
    title: "Order Confirmation",
    desc: "All confirmed orders are final and are not eligible for replacement.",
  },
];
 
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};
 
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
 
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
 
  // ⚠️ Yahan pehle useEffect tha jo load hote hi /home ya /signin
  // par redirect kar deta tha — isi wajah se ye page kabhi dikhta hi nahi tha.
  // Wo hata diya gaya hai taake KapadyaHero hamesha "/" par sab se pehle dikhe.
 
  // "Shop Collection" button smart hai: login hai to seedha protected page (/about),
  // warna pehle /signin par le jayega.
  const handleShopClick = () => {
    navigate(isAuthenticated ? "/about" : "/signin");
  };
 
  const handleRegisterClick = () => {
    navigate("/signin");
  };
 
  return (
    <>
      <section className="relative bg-[#0B0B0B] overflow-hidden px-6 py-20 sm:py-28">
        {/* Ambient glow background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        </div>
 
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          {/* Logo with floating animation */}
          <motion.div
            variants={itemVariants}
            animate={{ y: [0, -10, 0] }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="flex justify-center mb-6"
          >
            <img
              src={kapadyaLogo}
              alt="Kapadya International Logo"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.35)]"
            />
          </motion.div>
 
          {/* Brand name */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#D4AF37] via-[#F4E19C] to-[#D4AF37] bg-clip-text text-transparent"
          >
            KAPADYA INTERNATIONAL
          </motion.h1>
 
          <motion.p
            variants={itemVariants}
            className="mt-2 text-xs sm:text-sm tracking-[6px] text-[#D4AF37]/70 uppercase"
          >
            By Action
          </motion.p>
 
          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            K. Kapadya International offers premium Shalwar Kameez, elegant
            Waistcoats, and luxurious Shalwani, crafted with precision from
            high-quality wash &amp; wear fabrics.
          </motion.p>
 
          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShopClick}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/20 hover:bg-white transition-colors"
            >
              Shop Collection
              <span className="text-lg">→</span>
            </motion.button>
 
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRegisterClick}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#d7cfb7] text-black font-semibold shadow-lg shadow-[#D4AF37]/20 hover:bg-[#a78a2b] transition-colors"
            >
              Register
            </motion.button>
          </motion.div>
        </motion.div>
        <br /><br />
 <Carousel/>
        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-10 mt-20 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, borderColor: "rgba(212,175,55,0.6)" }}
                transition={{ duration: 0.3 }}
                className="bg-[#111111] border border-[#D4AF37]/20 rounded-3xl p-8 text-left shadow-xl"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-5"
                >
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </motion.div>
 
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
      <Extra1 />
      <Footer1 />
    </>
  );
}