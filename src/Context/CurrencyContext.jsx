import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
 
const CurrencyContext = createContext(null);
 
// Saare prices DB/state mein PKR mein stored hain — yehi base currency hai
const BASE_CURRENCY = "PKR";
 
// Country ka poora naam -> currency code (backend ke countryCurrency map jaisa hi).
// Yahi map do jagah use hota hai:
//  1) logged-in user ki profile country ke liye
//  2) fallback ke liye jab IP API currency code na de (sirf country naam de) —
//     VPN / datacenter IPs ke sath ipwho.is aksar currency field khali chhod deta hai
const COUNTRY_TO_CURRENCY = {
  pakistan: "PKR",
  india: "INR",
  "united states": "USD",
  "united states of america": "USD",
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
 
// Cache — taake har page load par baar baar IP/rate API na maarni pade
const CACHE_KEY = "kk_currency_cache_v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
 
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}
 
function writeCache(currency, rate) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ currency, rate, savedAt: Date.now() })
    );
  } catch {
    /* localStorage unavailable — ignore */
  }
}
 
export function CurrencyProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
 
  const [currency, setCurrency] = useState(BASE_CURRENCY);
  const [rate, setRate] = useState(1); // 1 PKR = rate * currency
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let cancelled = false;
 
    async function fetchLiveRate(targetCurrency) {
      // PKR -> PKR, koi API call zaroori nahi
      if (targetCurrency === BASE_CURRENCY) return 1;
 
      // Do alag providers try karo — agar ek fail ho to dusra chal jaye
      const providers = [
        async () => {
          const res = await fetch(
            `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`
          );
          const data = await res.json();
          return data?.rates?.[targetCurrency];
        },
        async () => {
          const res = await fetch(
            `https://api.frankfurter.dev/v1/latest?base=${BASE_CURRENCY}&symbols=${targetCurrency}`
          );
          const data = await res.json();
          return data?.rates?.[targetCurrency];
        },
      ];
 
      for (const provider of providers) {
        try {
          const r = await provider();
          if (r) return r;
        } catch {
          // agla provider try karo
        }
      }
      return null;
    }
 
    async function detectTargetCurrency() {
      // 1) Logged-in user ki profile country ho to wahi sabse reliable hai
      if (isAuthenticated && user?.country) {
        const mapped =
          COUNTRY_TO_CURRENCY[user.country.trim().toLowerCase()];
        if (mapped) return mapped;
      }
 
      // 2) Guest ho ya country match na ho — IP se detect karo
      try {
        const geoRes = await fetch("https://ipwho.is/");
        const geo = await geoRes.json();
 
        if (geo?.success !== false) {
          // 2a) ipwho.is ne currency code diya to seedha wahi use karo
          if (geo?.currency?.code) {
            return geo.currency.code;
          }
          // 2b) currency code khali hai (VPN/datacenter IP ke sath aksar
          //     hota hai) — country ke poore naam se apne map mein dhoondo
          const countryName = geo?.country?.trim().toLowerCase();
          if (countryName && COUNTRY_TO_CURRENCY[countryName]) {
            return COUNTRY_TO_CURRENCY[countryName];
          }
        }
      } catch {
        /* IP detection fail — fallback neeche */
      }
 
      // 3) ipwho.is bilkul fail ho gaya — ek backup IP provider try karo
      try {
        const geoRes2 = await fetch("https://ipapi.co/json/");
        const geo2 = await geoRes2.json();
        if (geo2?.currency) return geo2.currency;
        const countryName2 = geo2?.country_name?.trim().toLowerCase();
        if (countryName2 && COUNTRY_TO_CURRENCY[countryName2]) {
          return COUNTRY_TO_CURRENCY[countryName2];
        }
      } catch {
        /* dono providers fail — PKR par fallback */
      }
 
      return BASE_CURRENCY;
    }
 
    async function run() {
      setLoading(true);
 
      const target = await detectTargetCurrency();
 
      if (target === BASE_CURRENCY) {
        if (!cancelled) {
          setCurrency(BASE_CURRENCY);
          setRate(1);
          setLoading(false);
        }
        return;
      }
 
      // Cache check — agar recent hai aur same currency hai to API call skip karo
      const cached = readCache();
      if (cached && cached.currency === target) {
        if (!cancelled) {
          setCurrency(cached.currency);
          setRate(cached.rate);
          setLoading(false);
        }
        return;
      }
 
      const liveRate = await fetchLiveRate(target);
 
      if (cancelled) return;
 
      if (liveRate) {
        setCurrency(target);
        setRate(liveRate);
        writeCache(target, liveRate);
      } else {
        // Koi bhi provider rate na de saka — safe fallback PKR
        setCurrency(BASE_CURRENCY);
        setRate(1);
      }
      setLoading(false);
    }
 
    run();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.country]);
 
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
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}