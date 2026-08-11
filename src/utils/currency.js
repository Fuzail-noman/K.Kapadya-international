import { Country } from "country-state-city";

// All product prices in this app are stored in PKR (base currency).
// This file converts + formats that PKR price into the currency of the
// signed-in user's country (user.country = poora country naam, e.g.
// "Pakistan", "India", "United States" — collected at signup in
// SignIn.jsx and saved on the user object as the full name, not ISO code).
//
// ⚠️ NOTE: these are static, approximate rates — NOT live/real-time.
// Some currencies (ARS, VES, SSP, ZWL, LBP, IRR, etc.) move fast and these
// numbers will drift. For production accuracy, replace this table with a
// real FX API (e.g. exchangerate-api.com / openexchangerates.org / fixer.io),
// fetched + cached periodically (rates change daily, some hourly).
//
// Rates are expressed as "units of that currency per 1 USD" — this is the
// standard way FX tables are published, and makes it a one-line swap to
// plug in a live API response later (most APIs return exactly this shape).
const PKR_PER_USD = 278; // how many PKR make up 1 USD — used as our pivot

const UNITS_PER_USD = {
  // Major / G20
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155,
  CNY: 7.25,
  INR: 83.5,
  PKR: PKR_PER_USD,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.9,
  RUB: 90,
  BRL: 5.15,
  ZAR: 18.5,
  KRW: 1370,
  MXN: 17.0,
  IDR: 15900,
  TRY: 32.5,
  SAR: 3.75,

  // Middle East
  AED: 3.67,
  QAR: 3.64,
  KWD: 0.307,
  BHD: 0.376,
  OMR: 0.385,
  JOD: 0.71,
  ILS: 3.7,
  LBP: 89500,
  SYP: 13000,
  IQD: 1310,
  IRR: 42000,
  YER: 250,

  // South / Central Asia
  BDT: 118,
  LKR: 300,
  NPR: 133.6,
  BTN: 83.5,
  MVR: 15.4,
  AFN: 70,
  KZT: 445,
  KGS: 87,
  TJS: 10.9,
  TMT: 3.5,
  UZS: 12700,
  MNT: 3450,
  AMD: 388,
  AZN: 1.7,
  GEL: 2.68,

  // East / Southeast Asia
  HKD: 7.82,
  TWD: 32.4,
  MOP: 8.05,
  SGD: 1.35,
  MYR: 4.7,
  THB: 36.5,
  PHP: 56.5,
  VND: 25400,
  KHR: 4100,
  LAK: 21700,
  MMK: 2100,
  BND: 1.35,
  KPW: 900,

  // Oceania / Pacific
  NZD: 1.66,
  FJD: 2.27,
  PGK: 3.85,
  SBD: 8.4,
  TOP: 2.36,
  VUV: 119,
  WST: 2.74,
  XPF: 110,

  // Europe (non-EUR / non-GBP)
  SEK: 10.5,
  NOK: 10.6,
  DKK: 6.9,
  ISK: 138,
  PLN: 4.0,
  CZK: 23.5,
  HUF: 365,
  RON: 4.6,
  BGN: 1.8,
  HRK: 6.9, // legacy — Croatia now uses EUR, kept for older data
  UAH: 39.5,
  BYN: 3.27,
  MDL: 17.7,
  ALL: 92,
  MKD: 56.5,
  RSD: 107.5,
  BAM: 1.8,
  GIP: 0.78,
  FKP: 0.78,
  SHP: 0.78,

  // Africa
  EGP: 48,
  NGN: 1500,
  KES: 129,
  GHS: 15.5,
  TZS: 2600,
  UGX: 3800,
  ETB: 57,
  MAD: 10.0,
  DZD: 134,
  TND: 3.1,
  LYD: 4.85,
  XOF: 605, // West African CFA franc
  XAF: 605, // Central African CFA franc
  MWK: 1740,
  ZMW: 26.5,
  ZWL: 25000,
  BWP: 13.6,
  NAD: 18.5,
  SZL: 18.5,
  LSL: 18.5,
  MZN: 63.9,
  AOA: 900,
  CDF: 2850,
  RWF: 1330,
  BIF: 2870,
  DJF: 178,
  SOS: 571,
  SDG: 601,
  SSP: 1300,
  ERN: 15,
  KMF: 460,
  MGA: 4500,
  MUR: 46.5,
  SCR: 13.6,
  STN: 22.5,
  CVE: 101,
  GMD: 68,
  GNF: 8600,
  LRD: 190,
  SLE: 20,
  MRU: 39.7,

  // Americas (Latin America / Caribbean)
  ARS: 900,
  CLP: 930,
  COP: 3900,
  PEN: 3.75,
  UYU: 39,
  PYG: 7300,
  BOB: 6.92,
  VES: 36,
  GTQ: 7.75,
  HNL: 24.7,
  NIO: 36.6,
  CRC: 520,
  PAB: 1.0,
  DOP: 59,
  HTG: 132,
  CUP: 24,
  JMD: 156,
  TTD: 6.78,
  BBD: 2.0,
  BSD: 1.0,
  BZD: 2.02,
  BMD: 1.0,
  KYD: 0.83,
  XCD: 2.7,
  AWG: 1.8,
  ANG: 1.8,
  SRD: 33,
  GYD: 209,
};

// Currencies where showing decimals looks odd / isn't customary
// (zero-decimal or effectively-zero-decimal currencies)
const ZERO_DECIMAL_CURRENCIES = new Set([
  "PKR", "INR", "JPY", "KRW", "IDR", "VND", "CLP", "PYG", "HUF",
  "TZS", "UGX", "RWF", "BIF", "DJF", "GNF", "KMF", "MGA", "XOF",
  "XAF", "XPF", "LAK", "MMK", "KHR", "COP", "ISK",
]);

// Saari countries ek dafa nikaal lo — har call pe dobara compute na karna pade
const ALL_COUNTRIES = Country.getAllCountries();

/**
 * Figures out which currency to display for a given user, based on the
 * country they registered with. Falls back to PKR if we don't know the
 * user's country at all, or to USD if we know the country but don't have
 * a rate for its currency yet.
 *
 * NOTE: user.country DB mein poora naam store hota hai (e.g. "Pakistan"),
 * ISO code nahi — Signin.jsx signup ke waqt ISO code ko poore naam mein
 * convert karke bhejta hai. Isliye yahan naam se match karo, code se nahi
 * (pehle Country.getCountryByCode(user.country) use ho raha tha jo hamesha
 * undefined return karta tha aur currency chup-chaap USD pe fallback ho
 * jati thi — chahe user Pakistan se hi kyun na ho).
 */
export function getUserCurrency(user) {
  if (!user?.country) return "PKR";

  const country = ALL_COUNTRIES.find(
    (c) => c.name.toLowerCase() === user.country.trim().toLowerCase()
  );
  const currencyCode = country?.currency;

  if (currencyCode && UNITS_PER_USD[currencyCode] !== undefined) {
    return currencyCode;
  }
  // We know the country but don't have a rate for its currency — show USD
  // rather than silently defaulting to PKR for a non-Pakistani user.
  return "USD";
}

/** Converts a PKR amount into the target currency via USD as the pivot. */
export function convertFromPKR(amountInPKR, currency) {
  const amountInUSD = amountInPKR / PKR_PER_USD;
  const rate = UNITS_PER_USD[currency] ?? 1;
  return amountInUSD * rate;
}

/**
 * One-stop helper: given a base PKR amount and the current user, returns a
 * nicely formatted, currency-symbol-prefixed string in the user's local
 * currency (e.g. "$3.24", "₹269", "Rs.899", "€2.98").
 */
export function formatPrice(amountInPKR, user) {
  const currency = getUserCurrency(user);
  const converted = convertFromPKR(amountInPKR, currency);
  const fractionDigits = ZERO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(converted);
  } catch {
    // Unknown/unsupported currency code — safe fallback
    return `${currency} ${converted.toFixed(fractionDigits)}`;
  }
}