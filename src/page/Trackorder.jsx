import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  PackageSearch,
  Clock,
  Loader2,
  XCircle,
  CheckCircle2,
  Truck,
  PackageCheck,
  Ban,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext.jsx";
import { formatPrice } from "../utils/currency.js";
import { API_BASE_URL } from "../auth/config.js";
 
// Backend ke CANCELLATION_WINDOW_MS (orderRoutes.js) se match hona chahiye
const CANCELLATION_WINDOW_MS = 2 * 24 * 60 * 60 * 1000; // 2 days
 
const STATUS_META = {
  pending: { label: "Pending", color: "#D4AF37", Icon: Clock },
  confirmed: { label: "Confirmed", color: "#4ade80", Icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "#60a5fa", Icon: Truck },
  delivered: { label: "Delivered", color: "#4ade80", Icon: PackageCheck },
  cancelled: { label: "Cancelled", color: "#f87171", Icon: Ban },
};
 
// Order abhi bhi cancel ho sakta hai ya nahi — status + 2-din window dono check
function canCancel(order) {
  if (["shipped", "delivered", "cancelled"].includes(order.status)) return false;
  const elapsed = Date.now() - new Date(order.createdAt).getTime();
  return elapsed <= CANCELLATION_WINDOW_MS;
}
 
// Kitna time bacha hai cancel karne ke liye — UI mein dikhane ke liye
function timeLeftLabel(order) {
  const elapsed = Date.now() - new Date(order.createdAt).getTime();
  const remainingMs = CANCELLATION_WINDOW_MS - elapsed;
  if (remainingMs <= 0) return null;
 
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `Cancellable for ${days} more day${days > 1 ? "s" : ""}`;
  }
  return `Cancellable for ${hours} more hour${hours !== 1 ? "s" : ""}`;
}
 
export default function TrackOrderPage() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState({});
 
  useEffect(() => {
    if (!isAuthenticated) return;
 
    const fetchOrders = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
 
        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Orders load nahi ho sakay");
        }
        setOrders(data.orders || []);
      } catch (err) {
        setLoadError(err.message || "Kuch masla ho gaya. Dobara koshish karein.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchOrders();
  }, [isAuthenticated, token]);
 
  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    setCancelError((prev) => ({ ...prev, [orderId]: "" }));
 
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
 
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Order cancel nahi ho saka");
      }
 
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      setCancelError((prev) => ({
        ...prev,
        [orderId]: err.message || "Kuch masla ho gaya. Dobara koshish karein.",
      }));
    } finally {
      setCancellingId(null);
    }
  };
 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center gap-4 text-[#9b9488] px-5">
        <p>Please sign in to view your orders.</p>
        <button
          onClick={() => navigate("/signin")}
          className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition"
        >
          Sign In
        </button>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-[#0B0B0B] px-5 pb-24 pt-7">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#f3ede0] hover:text-[#D4AF37] text-sm px-4 py-2 rounded-full mb-6 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
 
        <h1 className="font-serif text-3xl text-[#f3ede0] mb-6 flex items-center gap-2">
          <PackageSearch className="text-[#D4AF37]" size={26} />
          Track Your Order
        </h1>
 
        {loading && (
          <div className="flex items-center justify-center gap-2 text-[#9b9488] py-16">
            <Loader2 className="animate-spin" size={20} /> Loading orders…
          </div>
        )}
 
        {!loading && loadError && (
          <div className="text-red-400 text-sm text-center py-10">{loadError}</div>
        )}
 
        {!loading && !loadError && orders.length === 0 && (
          <div className="text-[#9b9488] text-sm text-center py-16">
            Aapne abhi tak koi order place nahi kiya.
          </div>
        )}
 
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {orders.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.pending;
              const { Icon } = meta;
              const showCancel = canCancel(order);
              const countdown = timeLeftLabel(order);
 
              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#141317] border border-[#D4AF37]/20 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#9b9488] text-[11px] font-mono">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        color: meta.color,
                        border: `1px solid ${meta.color}55`,
                        backgroundColor: `${meta.color}15`,
                      }}
                    >
                      <Icon size={13} /> {meta.label}
                    </span>
                  </div>
 
                  <div className="flex flex-col gap-1 mb-3">
                    {order.items.map((it, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-[#9b9488]"
                      >
                        <span className="truncate pr-2">
                          {it.name} × {it.quantity}
                        </span>
                        <span className="flex-shrink-0">
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
 
                  <div className="h-px bg-[#D4AF37]/20 my-3" />
 
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#f3ede0] text-sm font-bold">Total</span>
                    <span className="text-[#f3ede0] text-sm font-bold">
                      {formatPrice(order.totalPKR)}
                    </span>
                  </div>
 
                  <p className="text-[10px] text-[#6b6558] mb-3">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
 
                  {showCancel ? (
                    <>
                      {countdown && (
                        <p className="text-[10px] text-[#D4AF37] mb-2 flex items-center gap-1">
                          <Clock size={11} /> {countdown}
                        </p>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={cancellingId === order._id}
                        onClick={() => handleCancel(order._id)}
                        className="w-full py-2.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                      >
                        {cancellingId === order._id ? (
                          <>
                            <Loader2 size={15} className="animate-spin" /> Cancelling…
                          </>
                        ) : (
                          <>
                            <XCircle size={15} /> Cancel Order
                          </>
                        )}
                      </motion.button>
                      {cancelError[order._id] && (
                        <p className="text-red-400 text-[11px] mt-1.5 text-center">
                          {cancelError[order._id]}
                        </p>
                      )}
                    </>
                  ) : (
                    order.status !== "cancelled" && (
                      <p className="text-[10px] text-[#6b6558] text-center">
                        Cancellation window has closed
                      </p>
                    )
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
 