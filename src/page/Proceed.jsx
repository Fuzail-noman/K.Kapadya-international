import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Check,
  Copy,
  ImagePlus,
  Loader2,
  PartyPopper,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext.jsx";
import { formatPrice } from "../utils/currency.js";
import { API_BASE_URL } from "../auth/config.js";
 
const DELIVERY_FEE_PAKISTAN_PKR = 4000;
const DELIVERY_FEE_INTERNATIONAL_PKR = 11000;
 
const PAYMENT_DETAILS = {
  accountTitle: "Aurelle Studio",
  accountNumber: "0312-3456789-01",
  bank: "JazzCash / EasyPaisa", // apna asal bank/service name daal dein
};
 
const STEP = { SUMMARY: 0, SHIPPING: 1, SUCCESS: 2 };
 
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
 
  const [step, setStep] = useState(STEP.SUMMARY);
  const [cart, setCart] = useState([]);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
 
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
  });
  const [receipt, setReceipt] = useState(null); // { file, previewUrl }
  const [errors, setErrors] = useState({});
 
  const cartKey = user ? `cart_${user.id}` : null;
 
  useEffect(() => {
    if (!isAuthenticated || !cartKey) {
      setCart([]);
      return;
    }
    setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
  }, [isAuthenticated, cartKey]);
 
  // Pre-fill name / phone / country / city straight from the signed-in
  // user's profile, so they never have to type them again at checkout.
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.fullName || user.name || "",
      phone: prev.phone || user.phone || "",
      country: prev.country || user.country || "",
      city: prev.city || user.city || "",
    }));
  }, [user]);
 
  useEffect(() => {
    return () => {
      if (receipt?.previewUrl) URL.revokeObjectURL(receipt.previewUrl);
    };
  }, [receipt]);
 
  const subtotalInPKR = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
 
  const isPakistan = (form.country || user?.country || "").trim().toLowerCase() === "pakistan";
 
  const deliveryInPKR =
    cart.length === 0
      ? 0
      : isPakistan
      ? DELIVERY_FEE_PAKISTAN_PKR
      : DELIVERY_FEE_INTERNATIONAL_PKR;
 
  const grandTotalInPKR = subtotalInPKR + deliveryInPKR;
 
  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_DETAILS.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };
 
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (receipt?.previewUrl) URL.revokeObjectURL(receipt.previewUrl);
    setReceipt({ file, previewUrl: URL.createObjectURL(file) });
    setErrors((prev) => ({ ...prev, receipt: undefined }));
  };
 
  const handleRemoveReceipt = () => {
    if (receipt?.previewUrl) URL.revokeObjectURL(receipt.previewUrl);
    setReceipt(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
 
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
 
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.phone.trim()) next.phone = "Missing phone — please update your profile";
    if (!form.country.trim()) next.country = "Missing country — please update your profile";
    if (!form.city.trim()) next.city = "Missing city — please update your profile";
    if (!receipt) next.receipt = "Upload your payment screenshot";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
 
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
 
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("country", form.country);
      formData.append("city", form.city);
      formData.append("items", JSON.stringify(cart));
      formData.append("subtotalPKR", subtotalInPKR);
      formData.append("receipt", receipt.file);
 
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data?.message || "Order place nahi ho saka. Dobara koshish karein.");
      }
 
      if (cartKey) {
        localStorage.setItem(cartKey, JSON.stringify([]));
        window.dispatchEvent(new Event("cartUpdated"));
      }
      setStep(STEP.SUCCESS);
    } catch (err) {
      console.error("Place order error:", err);
      setSubmitError(err.message || "Kuch masla ho gaya. Dobara koshish karein.");
    } finally {
      setSubmitting(false);
    }
  };
 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center gap-4 text-[#9b9488] px-5">
        <p>Please sign in to checkout.</p>
        <button
          onClick={() => navigate("/signin")}
          className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition"
        >
          Sign In
        </button>
      </div>
    );
  }
 
  const stepVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };
 
  return (
    <div className="min-h-screen bg-[#0B0B0B] px-5 pb-24 pt-7">
      <div className="max-w-md mx-auto">
        {step !== STEP.SUCCESS && (
          <button
            onClick={() => (step === STEP.SUMMARY ? navigate(-1) : setStep(STEP.SUMMARY))}
            className="flex items-center gap-2 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#f3ede0] hover:text-[#D4AF37] text-sm px-4 py-2 rounded-full mb-6 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
 
        {step !== STEP.SUCCESS && (
          <div className="flex items-center gap-2 mb-6 px-1">
            {["Summary", "Shipping & Payment"].map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-colors ${
                    i <= step
                      ? "bg-[#D4AF37] text-black"
                      : "bg-[#141317] text-[#9b9488] border border-[#D4AF37]/20"
                  }`}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    i <= step ? "text-[#f3ede0]" : "text-[#9b9488]"
                  }`}
                >
                  {label}
                </span>
                {i === 0 && (
                  <div className="flex-1 h-px bg-[#D4AF37]/20 mx-1 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-[#D4AF37]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: step > 0 ? 1 : 0 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
 
        <AnimatePresence mode="wait" custom={step}>
          {step === STEP.SUMMARY && (
            <motion.div
              key="summary"
              custom={1}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h1 className="font-serif text-3xl text-[#f3ede0] mb-6">Checkout Summary</h1>
 
              <div className="bg-[#141317] border border-[#D4AF37]/20 rounded-2xl p-5">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-[#f3ede0]">Subtotal</span>
                  <span className="text-[#f3ede0]">{formatPrice(subtotalInPKR, user)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#D4AF37] flex items-center gap-1.5">
                    <Truck size={14} /> Delivery
                  </span>
                  <span className="text-[#D4AF37]">{formatPrice(deliveryInPKR, user)}</span>
                </div>
                <div className="h-px bg-[#D4AF37]/20 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#f3ede0]">Total</span>
                  <span className="font-bold text-[#f3ede0] text-xl">
                    {formatPrice(grandTotalInPKR, user)}
                  </span>
                </div>
              </div>
 
              <motion.button
                whileHover={{ scale: cart.length ? 1.015 : 1 }}
                whileTap={{ scale: cart.length ? 0.98 : 1 }}
                disabled={cart.length === 0}
                onClick={() => setStep(STEP.SHIPPING)}
                className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#e8c766] text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </motion.button>
            </motion.div>
          )}
 
          {step === STEP.SHIPPING && (
            <motion.div
              key="shipping"
              custom={1}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h1 className="font-serif text-3xl text-[#f3ede0] mb-6 text-center">
                Shipping Details
              </h1>
 
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-3.5">
                <Field
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange("name")}
                  error={errors.name}
                />
 
                {/* Phone / Country / City are pulled from the signed-in
                    profile — read-only here, no retyping needed. */}
                <div className="bg-[#141317] border border-[#D4AF37]/20 rounded-xl px-4 py-3.5">
                  <p className="text-[10px] uppercase tracking-wide text-[#9b9488] mb-1">
                    From your profile
                  </p>
                  <p className="text-[#f3ede0] text-sm">{form.phone || "—"}</p>
                  <p className="text-[#f3ede0] text-sm">
                    {[form.city, form.country].filter(Boolean).join(", ") || "—"}
                  </p>
                  {(errors.phone || errors.country || errors.city) && (
                    <p className="text-red-400 text-[11px] mt-1.5">
                      {errors.phone || errors.country || errors.city}
                    </p>
                  )}
                </div>
 
                <p className="text-[10px] text-[#9b9488] -mt-1.5 px-1">
                  Delivery: {isPakistan ? "Pakistan rate" : "International rate"} —{" "}
                  <span className="text-[#D4AF37]">{formatPrice(deliveryInPKR, user)}</span>
                </p>
 
                {/* Full Payment */}
                <div className="mt-3 rounded-2xl border border-[#D4AF37]/20 bg-[#141317] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-[#D4AF37]" />
                    <h2 className="text-[#D4AF37] text-sm font-semibold">Payment</h2>
                  </div>
                  <p className="text-[#9b9488] text-xs leading-relaxed mb-3">
                    Please send your full payment of{" "}
                    <span className="text-[#f3ede0] font-semibold">
                      {formatPrice(grandTotalInPKR, user)}
                    </span>{" "}
                    via {PAYMENT_DETAILS.bank} to the account below to confirm your order,
                    then upload the payment screenshot.
                  </p>
 
                  <div className="flex items-center justify-between gap-3 bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-xl px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-[#9b9488]">
                        {PAYMENT_DETAILS.accountTitle} · Account Number
                      </p>
                      <p className="text-[#f3ede0] font-mono text-sm tracking-wide truncate">
                        {PAYMENT_DETAILS.accountNumber}
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopyAccount}
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span
                            key="copied"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5"
                          >
                            <Check size={13} /> Copied
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5"
                          >
                            <Copy size={13} /> Copy
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
 
                  {/* Receipt upload */}
                  <div className="mt-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <AnimatePresence mode="wait">
                      {!receipt ? (
                        <motion.label
                          key="upload-box"
                          htmlFor="receipt-upload"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          whileHover={{ borderColor: "#D4AF37" }}
                          className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl py-6 cursor-pointer text-center transition-colors ${
                            errors.receipt ? "border-red-500/60" : "border-[#D4AF37]/30"
                          }`}
                        >
                          <ImagePlus size={22} className="text-[#D4AF37]" />
                          <span className="text-xs text-[#9b9488]">
                            Tap to upload payment screenshot
                          </span>
                        </motion.label>
                      ) : (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30"
                        >
                          <img
                            src={receipt.previewUrl}
                            alt="Payment screenshot"
                            className="w-full max-h-56 object-contain bg-black"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveReceipt}
                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500 transition"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {errors.receipt && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-[11px] mt-1.5"
                      >
                        {errors.receipt}
                      </motion.p>
                    )}
                  </div>
                </div>
 
                {submitError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs text-center -mt-1"
                  >
                    {submitError}
                  </motion.p>
                )}
 
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.015 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="w-full mt-2 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#e8c766] text-black font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Placing Order…
                    </>
                  ) : (
                    "Place Order"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
 
          {step === STEP.SUCCESS && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-[#141317] border border-[#D4AF37]/20 rounded-2xl p-8 text-center mt-10"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 14 }}
                className="mx-auto mb-4 w-fit"
              >
                <PartyPopper size={44} className="text-[#D4AF37]" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-serif text-2xl text-green-400 font-bold mb-2"
              >
                Order Placed Successfully
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-[#9b9488] text-sm mb-6"
              >
                We will contact you soon on WhatsApp
              </motion.p>
 
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/track-order")}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#e8c766] text-black font-bold"
                >
                  Track Your Order
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/collection")}
                  className="px-8 py-3 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition font-bold"
                >
                  Back to Shop
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
 
function Field({ placeholder, value, onChange, error, type = "text" }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#141317] border rounded-xl px-4 py-3.5 text-[#f3ede0] placeholder-[#6b6558] text-sm outline-none transition-colors focus:border-[#D4AF37] ${
          error ? "border-red-500/60" : "border-[#D4AF37]/20"
        }`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-[11px] mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}