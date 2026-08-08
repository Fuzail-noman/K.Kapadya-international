import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext(null);

// Aapke saare prices DB/state mein PKR mein stored hain — yehi base currency hai
const BASE_CURRENCY = "PKR";

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(BASE_CURRENCY);
  const [rate, setRate] = useState(1); // 1 PKR = rate * currency
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function detectCurrency() {
      try {
        // 1) User ka country/currency IP se detect karo (free, no key, CORS-enabled)
        const geoRes = await fetch("https://ipwho.is/");
        const geo = await geoRes.json();
        const detected = geo?.currency?.code || BASE_CURRENCY;

        if (cancelled) return;

        if (detected === BASE_CURRENCY) {
          setCurrency(BASE_CURRENCY);
          setRate(1);
          setLoading(false);
          return;
        }

        // 2) Live PKR -> detected currency rate le lo (free, no key)
        const rateRes = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`);
        const rateData = await rateRes.json();
        const liveRate = rateData?.rates?.[detected];

        if (cancelled) return;

        if (liveRate) {
          setCurrency(detected);
          setRate(liveRate);
        } else {
          // Rate nahi mila to safe fallback PKR pe hi rakho
          setCurrency(BASE_CURRENCY);
          setRate(1);
        }
        setLoading(false);
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
  }, []);

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