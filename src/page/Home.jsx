import { motion } from "framer-motion";
import {
  Sparkles,
  Award,
  Shield,
  Truck,
  HeadphonesIcon,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router";
 
// import Footer1 from "../Footer/footer1.jsx";
import Carousel from "../Navbar/CAROUSEL.jsx";
// import Extra1 from "./Extra1.jsx";
import { PRODUCTS, ProductCard } from "./Collection.jsx";
import Navbar from "../Navbar/navbar.jsx";
import Footer2 from "../Footer/footer.jsx";
 
// NOTE: `features` yahan sirf icon-based feature cards ke liye hai
// (neeche "Feature cards" section mein use hota hai).
// Product data ke liye "./Collection.jsx" se PRODUCTS use karo — usay yahan
// dobara define/overwrite mat karo, warna feature.icon undefined ho jayega
// aur "Element type is invalid" crash aayega.
//
// Price display: ProductCard (Collection.jsx se import hui) andar hi
// useCurrency() use karta hai, isliye yahan currency ke liye kuch alag
// karne ki zaroorat nahi — jo currency Collection/Offer page par dikh rahi
// hai wahi yahan bhi automatically dikhegi.
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
  // Homepage par sirf pehle 4 products dikhayenge, poori collection
  // "/collection" par jaake dekhi ja sakti hai.
  const featuredProducts = PRODUCTS.slice(0, 4);
 
  return (
    <>
      <Navbar />
      <section className="relative bg-[#0B0B0B] overflow-hidden px-6 py-14 sm:py-20">
        {/* Ambient glow background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        </div>
 
        {/* Welcome greeting */}
       <motion.div
  initial={{ opacity: 0, y: -16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="relative z-10 text-center mb-12"
>
  <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-wide bg-gradient-to-r from-[#D4AF37] via-[#F4E19C] to-[#D4AF37] bg-clip-text text-transparent">
    K. Kapadya
  </h1>
 
  <p className="mt-2 text-sm sm:text-base tracking-[6px] text-[#D4AF37]/70 uppercase">
    International
  </p>
 
  <p className="mt-2 text-sm sm:text-base tracking-[6px] text-[#D4AF37]/70 uppercase">
    by
  </p>
 
  <p className="mt-2 text-sm sm:text-base tracking-[6px] text-[#D4AF37]/70 uppercase">
    Action
  </p>
 
  <div className="w-16 h-[2px] mx-auto mt-5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
</motion.div>
        <div className="relative z-10">
          <Carousel />
        </div>
 
        {/* Product showcase — right after the carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 mt-16 max-w-6xl mx-auto"
        >
          <div className="text-center mb-10">
            <span className="text-[#D4AF37] text-xs tracking-[0.3em]">
              HANDPICKED FOR YOU
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#f3ede0] mt-3">
              Featured Pieces
            </h2>
            <div className="w-16 h-[2px] mx-auto mt-3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>
 
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
 
          <div className="text-center mt-10">
            <Link to="/collection">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-full border border-[#D4AF37] text-[#D4AF37] font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors"
              >
                View Full Collection →
              </motion.button>
            </Link>
          </div>
        </motion.div>
 
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
      {/* <Extra1 /> */}
      <Footer2 />
    </>
  );
}