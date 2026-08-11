import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
 
const CurrencyContext = createContext(null);
 
// Aapke saare prices DB/state mein PKR mein stored hain — yehi base currency hai
const BASE_CURRENCY = "PKR";
 
// Country ka poora naam -> currency code.
// Ye backend ke countryCurrency map (routes/orderRoutes.js) jaisa hi hai,
// taake dono taraf same currency/fee logic chale.
const COUNTRY_TO_CURRENCY = {
  pakistan: "PKR",
  india: "INR",
  "united states": "USD",
  "united kingdom": "GBP",
  "united arab emirates": "AED",
  "saudi arabia": "SAR",
  canada: "CAD",
  australia: "AUD",
  germany: "EUR",
  france: "EUR",
  italy: "EUR",
  spain: "EUR",
  netherlands: "EUR",
  brazil: "BRL",
  bangladesh: "BDT",
  malaysia: "MYR",
  singapore: "SGD",
  japan: "JPY",
  china: "CNY",
  turkey: "TRY",
  qatar: "QAR",
  kuwait: "KWD",
  oman: "OMR",
  bahrain: "BHD",
};
 
export function CurrencyProvider({ children }) {
  // Logged-in user ki profile country mil jaye to usi se currency tay hogi.
  const { user, isAuthenticated } = useAuth();
 
  const [currency, setCurrency] = useState(BASE_CURRENCY);
  const [rate, setRate] = useState(1); // 1 PKR = rate * currency
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let cancelled = false;
 
    async function loadRate(targetCurrency) {
      if (targetCurrency === BASE_CURRENCY) {
        if (!cancelled) {
          setCurrency(BASE_CURRENCY);
          setRate(1);
          setLoading(false);
        }
        return;
      }
 
      try {
        // Live PKR -> target currency rate (free, no key)
        const rateRes = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`);
        const rateData = await rateRes.json();
        const liveRate = rateData?.rates?.[targetCurrency];
 
        if (cancelled) return;
 
        if (liveRate) {
          setCurrency(targetCurrency);
          setRate(liveRate);
        } else {
          // Rate na mile to safe fallback PKR pe rakho
          setCurrency(BASE_CURRENCY);
          setRate(1);
        }
      } catch {
        if (!cancelled) {
          setCurrency(BASE_CURRENCY);
          setRate(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
 
    async function detectCurrency() {
      setLoading(true);
 
      // 1) Logged-in user ho aur profile mein country ho — usi ke hisab se
      //    currency dikhao. Ye sabse reliable hai kyunki khud user ne di hai.
      if (isAuthenticated && user?.country) {
        const mapped = COUNTRY_TO_CURRENCY[user.country.trim().toLowerCase()];
        if (mapped) {
          await loadRate(mapped);
          return;
        }
      }
 
      // 2) Guest ho, ya profile mein country match na ho — IP se detect karo
      try {
        const geoRes = await fetch("https://ipwho.is/");
        const geo = await geoRes.json();
        const detected = geo?.currency?.code || BASE_CURRENCY;
 
        if (cancelled) return;
        await loadRate(detected);
      } catch (err) {
        console.error("Currency detection failed, defaulting to PKR:", err);
        if (!cancelled) {
          setCurrency(BASE_CURRENCY);
          setRate(1);
          setLoading(false);
        }
      }
    }
 
    detectCurrency();
    return () => {
      cancelled = true;
    };
    // user.country badalte hi (profile update / login) currency dobara detect ho
  }, [isAuthenticated, user?.country]);
 
  // amountPKR -> user ki local currency mein formatted string
  function formatPrice(amountPKR) {
    const converted = amountPKR * rate;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "PKR" ? 0 : 2,
      }).format(converted);
    } catch {
      return `${currency} ${converted.toFixed(2)}`;
    }
  }
 
  return (
    <CurrencyContext.Provider value={{ currency, rate, loading, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}
 
export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}