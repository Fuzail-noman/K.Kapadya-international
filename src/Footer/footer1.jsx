import { motion } from "framer-motion";

// ==================== Social Icons ====================
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.256 1.216.6 1.772 1.153.5.5.888 1.11 1.153 1.772.248.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.217 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.248-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.217-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428A4.89 4.89 0 013.678 3.678 4.9 4.9 0 015.45 2.525c.637-.248 1.363-.415 2.428-.465C8.944 2.01 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.567.683-.748 1.15-.137.352-.3.881-.344 1.857-.05 1.054-.06 1.37-.06 4.04 0 2.67.01 2.987.06 4.04.045.977.207 1.506.344 1.858.181.466.398.8.748 1.15.35.35.684.567 1.15.748.353.137.882.3 1.857.344 1.054.05 1.37.06 4.04.06 2.67 0 2.987-.01 4.04-.06.977-.045 1.506-.207 1.858-.344a3.09 3.09 0 001.15-.748c.35-.35.567-.684.748-1.15.137-.352.3-.881.344-1.857.05-1.054.06-1.37.06-4.04 0-2.67-.01-2.986-.06-4.04-.045-.976-.207-1.505-.344-1.858a3.09 3.09 0 00-.748-1.15 3.09 3.09 0 00-1.15-.748c-.352-.137-.881-.3-1.857-.344-1.054-.05-1.37-.06-4.04-.06zm0 4.594a4.605 4.605 0 110 9.21 4.605 4.605 0 010-9.21zm0 7.594a2.99 2.99 0 100-5.98 2.99 2.99 0 000 5.98zm5.862-7.777a1.076 1.076 0 11-2.152 0 1.076 1.076 0 012.152 0z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export default function Footer1() {
  const socialLinks = [
    { key: "fb", icon: <FacebookIcon />, href: "#", label: "Facebook" },
    { key: "ig", icon: <InstagramIcon />, href: "#", label: "Instagram" },
    { key: "yt", icon: <YoutubeIcon />, href: "#", label: "YouTube" },
    { key: "tt", icon: <TiktokIcon />, href: "#", label: "TikTok" },
  ];

  return (
    <footer className="bg-[#0B0B0B] px-6 lg:px-16 relative overflow-hidden">
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 pt-16 max-w-7xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center lg:justify-start pb-10"
        >
          <a href="/" className="flex items-center gap-3">
            {/* <img src="/logo.png" alt="K. Kapadya International" className="h-10 w-auto" /> */}
            <span className="text-2xl lg:text-3xl font-bold tracking-widest text-[#D4AF37]">
              K. KAPADYA
              <span className="block text-[10px] tracking-[0.4em] text-gray-400 font-normal text-center">
                INTERNATIONAL
              </span>
            </span>
          </a>
        </motion.div>

        {/* Main grid: About / Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pb-12 text-center lg:text-left max-w-3xl mx-auto lg:mx-0 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[#D4AF37] font-semibold tracking-wide mb-4 uppercase text-sm">
              About Us
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto lg:mx-0">
              K. Kapadya International specializes in luxury Shalwar Kameez,
              handcrafted Waistcoats and premium Shalwani, tailored from the
              finest wash & wear fabric for timeless elegance — delivered
              worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[#D4AF37] font-semibold tracking-wide mb-4 uppercase text-sm">
              Get In Touch
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: info@kapadyainternational.com</li>
              <li>Phone: +92 300 0000000</li>
              <li>Karachi, Pakistan</li>
            </ul>
          </motion.div>
        </div>

        {/* Gold Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        <div className="py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm text-center lg:text-left"
          >
            © {new Date().getFullYear()}{" "}
            <span className="text-[#D4AF37] font-semibold">
              K. KAPADYA INTERNATIONAL
            </span>
            . All Rights Reserved.
          </motion.p>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialLinks.map(({ key, icon, href, label }) => (
              <motion.a
                key={key}
                href={href}
                aria-label={label}
                whileHover={{
                  rotate: 360,
                  scale: 1.15,
                  backgroundColor: "#D4AF37",
                  color: "#000",
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-11 h-11 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]"
              >
                {icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center pb-8"
        >
          <p className="text-gray-500 text-xs sm:text-sm tracking-widest uppercase px-2">
            Luxury Pakistani Shalwar Kameez • Worldwide Shipping • Premium
            Quality Since 2026
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}