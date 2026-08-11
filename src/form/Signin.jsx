import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";
import { Country, City } from "country-state-city";
import kapadyaLogo from "../assets/logo9.png";
import { useAuth } from "../Context/AuthContext.jsx";
import { API_BASE_URL } from "../auth/config.js";
 
// Auth endpoints backend ke "/api/auth" prefix ke andar hain
const AUTH_URL = `${API_BASE_URL}/api/auth`;
 
export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("register"); // "register" | "login" — register pehle dikhega
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false); // 🐎 2-sec running animation before /collection
 
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: "", // ISO code, e.g. "PK" — dropdown/city lookup ke liye zaroori
    city: "",
    email: "",
    password: "",
  });
 
  const countries = useMemo(() => Country.getAllCountries(), []);
 
  const cities = useMemo(() => {
    if (!formData.country) return [];
    return City.getCitiesOfCountry(formData.country) || [];
  }, [formData.country]);
 
  // detectedRef: user ne khud country choose ki hai to IP-detection usko
  // overwrite na kare — sirf tab tak auto-fill karo jab tak user khud
  // dropdown se kuch select nahi kar leta.
  const userPickedCountry = useRef(false);
 
  // Register form khulte hi IP se country detect karke khud-ba-khud
  // dropdown mein select kar do — user ko khud dhoondna na pade.
  useEffect(() => {
    if (mode !== "register") return;
 
    let cancelled = false;
 
    async function detectCountry() {
      try {
        const res = await fetch("https://ipwho.is/");
        const geo = await res.json();
 
        if (cancelled || userPickedCountry.current) return;
 
        // ipwho.is "country_code" ISO-2 format mein deta hai (e.g. "PK"),
        // jo hamare Country dropdown ki value se seedha match ho jata hai.
        const isoCode = geo?.country_code;
        if (isoCode && Country.getCountryByCode(isoCode)) {
          setFormData((prev) =>
            prev.country ? prev : { ...prev, country: isoCode }
          );
        }
      } catch {
        // Detection fail ho to kuch nahi — user khud select kar lega
      }
    }
 
    detectCountry();
    return () => {
      cancelled = true;
    };
  }, [mode]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      userPickedCountry.current = true;
      setFormData((prev) => ({ ...prev, country: value, city: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 
    if (mode === "register") {
      if (formData.fullName.trim().length < 2) {
        setError("Please enter your full name.");
        return;
      }
      if (formData.phone.trim().length < 7) {
        setError("Please enter a valid phone number.");
        return;
      }
      if (!formData.country) {
        setError("Please select your country.");
        return;
      }
      if (!formData.city) {
        setError("Please select your city.");
        return;
      }
    }
 
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
 
    setLoading(true);
 
    try {
      const endpoint = mode === "login" ? "/login" : "/signup";
 
      let body;
      if (mode === "login") {
        body = { email: formData.email, password: formData.password };
      } else {
        // formData.country abhi tak ISO code hai (e.g. "PK") kyunki wo
        // City.getCitiesOfCountry() ke liye zaroori tha. Backend/Cart/Checkout
        // saare "Pakistan" jaisa poora naam expect karte hain (delivery fee
        // aur currency dono isi naam se match hote hain) — isliye submit
        // karne se pehle poora naam nikaal lete hain.
        const countryName = Country.getCountryByCode(formData.country)?.name || formData.country;
        body = { ...formData, country: countryName };
      }
 
      const res = await fetch(`${AUTH_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
 
      const data = await res.json();
 
      if (!data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
 
      // ⭐ Yehi asal step hai: AuthContext ke through user + token
      // localStorage mein save hote hain, aur poori app ko pata chal jata hai.
      login(data.user, data.token);
 
      // Ab loading band karke 2 sec ka running animation dikhayenge,
      // uske baad /collection page pe navigate karenge.
      setLoading(false);
      setRedirecting(true);
 
      setTimeout(() => {
        navigate("/collection");
      }, 2000);
    } catch (err) {
      setError("Could not connect to server. Please try again.");
      setLoading(false);
    }
  };
 
  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setError("");
    userPickedCountry.current = false;
    setFormData({
      fullName: "",
      phone: "",
      country: "",
      city: "",
      email: "",
      password: "",
    });
  };
 
  return (
    <section className="relative min-h-screen w-full bg-[#0B0B0B] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient gold glow orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#D4AF37]/10 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#D4AF37]/10 blur-[100px]"
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.8, 0.5, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
 
      {/* Fine grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
 
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-[#111111] border border-[#D4AF37]/25 rounded-3xl shadow-2xl shadow-black/60 px-6 py-8 sm:px-10 sm:py-12 my-8"
      >
        {/* Redirect overlay — original galloping horse silhouette before /collection */}
        <AnimatePresence>
          {redirecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#111111]/95 rounded-3xl overflow-hidden"
            >
              {/* Running track */}
              <div className="relative w-64 h-32 flex items-center justify-center">
                {/* Speed lines behind the horse */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-2"
                  animate={{ opacity: [0, 1, 0], x: [30, -14, 30] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="block w-9 h-[3px] bg-[#D4AF37]/50 rounded-full" />
                  <span className="block w-7 h-[3px] bg-[#D4AF37]/40 rounded-full" />
                  <span className="block w-8 h-[3px] bg-[#D4AF37]/30 rounded-full" />
                </motion.div>
 
                {/* Horse wrapper — handles left-right run + direction flip */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    x: [-70, 70, -70],
                    y: [0, -10, 0, -10, 0],
                    scaleX: [1, 1, -1, -1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 0.5, 1, 1],
                  }}
                >
                  <svg
                    width="160"
                    height="100"
                    viewBox="0 0 240 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Body */}
                    <ellipse cx="120" cy="66" rx="58" ry="27" fill="#D4AF37" />
 
                    {/* Chest / neck */}
                    <path
                      d="M162,50 C178,32 196,28 208,36 L200,52 C188,48 176,60 168,72 Z"
                      fill="#D4AF37"
                    />
 
                    {/* Head + muzzle */}
                    <path
                      d="M204,34 C218,28 232,32 234,42 C235,50 224,55 210,53 C202,52 198,46 200,40 Z"
                      fill="#D4AF37"
                    />
 
                    {/* Ear */}
                    <path d="M210,32 L214,18 L219,33 Z" fill="#D4AF37" />
 
                    {/* Tail */}
                    <path
                      d="M66,54 C42,42 22,46 14,56 C24,58 34,64 44,72 C52,68 60,64 66,58 C58,62 50,64 44,62 C50,58 58,56 66,54 Z"
                      fill="#D4AF37"
                    />
 
                    {/* Mane flicks */}
                    <path d="M160,42 L168,30 L172,44 Z" fill="#D4AF37" />
                    <path d="M148,40 L155,28 L160,42 Z" fill="#D4AF37" />
 
                    {/* Front legs (shoulder pivot) */}
                    <motion.g
                      style={{ transformOrigin: "163px 84px" }}
                      animate={{ rotate: [-38, 42, -38] }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <line
                        x1="163" y1="84" x2="148" y2="126"
                        stroke="#D4AF37" strokeWidth="12" strokeLinecap="round"
                      />
                    </motion.g>
                    <motion.g
                      style={{ transformOrigin: "175px 84px" }}
                      animate={{ rotate: [42, -38, 42] }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <line
                        x1="175" y1="84" x2="190" y2="126"
                        stroke="#D4AF37" strokeWidth="12" strokeLinecap="round"
                      />
                    </motion.g>
 
                    {/* Back legs (hip pivot) — opposite phase for gallop feel */}
                    <motion.g
                      style={{ transformOrigin: "82px 84px" }}
                      animate={{ rotate: [42, -38, 42] }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.08 }}
                    >
                      <line
                        x1="82" y1="84" x2="67" y2="126"
                        stroke="#D4AF37" strokeWidth="12" strokeLinecap="round"
                      />
                    </motion.g>
                    <motion.g
                      style={{ transformOrigin: "96px 84px" }}
                      animate={{ rotate: [-38, 42, -38] }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.08 }}
                    >
                      <line
                        x1="96" y1="84" x2="111" y2="126"
                        stroke="#D4AF37" strokeWidth="12" strokeLinecap="round"
                      />
                    </motion.g>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Logo + brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.img
            src={kapadyaLogo}
            alt="Kapadya International"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[3px] text-white">
            KAPADYA
          </h1>
          <p className="text-[#D4AF37] text-xs tracking-[4px] uppercase mt-1">
            International — By Action
          </p>
        </div>
 
        {/* Tab switcher */}
        <div className="relative flex bg-[#1A1A1A] rounded-full p-1 mb-8 border border-[#D4AF37]/15">
          <button
            onClick={() => switchMode("register")}
            className={`relative z-10 flex-1 py-3 text-sm font-semibold tracking-wide rounded-full transition-colors duration-300 ${
              mode === "register" ? "text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => switchMode("login")}
            className={`relative z-10 flex-1 py-3 text-sm font-semibold tracking-wide rounded-full transition-colors duration-300 ${
              mode === "login" ? "text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#D4AF37] rounded-full"
            animate={{ left: mode === "register" ? "4px" : "calc(50% + 0px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        </div>
 
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div
                key="registerFields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-5"
              >
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>
 
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37] pointer-events-none z-10" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full appearance-none bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors [&>option]:bg-[#1A1A1A] [&>option]:text-white"
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
 
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={formData.country ? "city-enabled" : "city-disabled"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <label className="block text-white text-sm font-medium mb-2">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37] pointer-events-none z-10" />
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!formData.country}
                          className="w-full appearance-none bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors disabled:opacity-40 disabled:cursor-not-allowed [&>option]:bg-[#1A1A1A] [&>option]:text-white"
                        >
                          <option value="">
                            {formData.country ? "Select city" : "Select country first"}
                          </option>
                          {cities.map((city, idx) => (
                            <option key={`${city.name}-${idx}`} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
 
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>
 
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
 
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
 
          <motion.button
            type="submit"
            disabled={loading || redirecting}
            whileHover={{ scale: loading || redirecting ? 1 : 1.02 }}
            whileTap={{ scale: loading || redirecting ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-semibold py-3.5 rounded-xl hover:bg-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : mode === "login" ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>
 
        <p className="text-center text-gray-500 text-xs mt-8">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => switchMode("register")}
                className="text-[#D4AF37] hover:underline font-medium"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("login")}
                className="text-[#D4AF37] hover:underline font-medium"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </motion.div>
    </section>
  );
}