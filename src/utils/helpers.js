export const randInt = (n) => {
  return Math.round(Math.random() * n);
};

export const randSlice = (arr, min = 1) => {
  return arr.sort(() => Math.random() <= 0.5).slice(0, Math.max(min, randInt(arr.length)));
};

export const randFloat = (n) => {
  return Math.random() * n;
};

export const round = (n, places) => {
  return parseFloat(n.toFixed(places)) || 0;
};

export const clamp = (min, n, max) => {
  return Math.max(min, Math.min(n, max));
};

export const formatTime = (t) => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);

  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const sleep = async (t) => await new Promise((res) => setTimeout(() => res(), t * 1000));

const minorUnits = {
  USD: 2, // US Dollar
  EUR: 2, // Euro
  GBP: 2, // British Pound
  JPY: 0, // Japanese Yen
  AUD: 2, // Australian Dollar
  CAD: 2, // Canadian Dollar
  CHF: 2, // Swiss Franc
  CNY: 2, // Chinese Yuan
  HKD: 2, // Hong Kong Dollar
  NZD: 2, // New Zealand Dollar
  SEK: 2, // Swedish Krona
  KRW: 0, // South Korean Won
  SGD: 2, // Singapore Dollar
  NOK: 2, // Norwegian Krone
  MXN: 2, // Mexican Peso
  INR: 2, // Indian Rupee
  RUB: 2, // Russian Ruble
  ZAR: 2, // South African Rand
  TRY: 2, // Turkish Lira
  BRL: 2, // Brazilian Real
  TWD: 2, // Taiwan Dollar
  DKK: 2, // Danish Krone
  PLN: 2, // Polish Zloty
  THB: 2, // Thai Baht
  IDR: 0, // Indonesian Rupiah
  HUF: 2, // Hungarian Forint
  CZK: 2, // Czech Koruna
  ILS: 2, // Israeli Shekel
  MYR: 2, // Malaysian Ringgit
  PHP: 2, // Philippine Peso
  SAR: 2, // Saudi Riyal
  AED: 2, // UAE Dirham
  CLP: 0, // Chilean Peso
  COP: 2, // Colombian Peso
  PKR: 2, // Pakistani Rupee
  VND: 0, // Vietnamese Dong
  ARS: 2, // Argentine Peso
  UAH: 2, // Ukrainian Hryvnia
  NGN: 2, // Nigerian Naira
  BGN: 2, // Bulgarian Lev
  RON: 2, // Romanian Leu
  PEN: 2, // Peruvian Sol
  LKR: 2, // Sri Lankan Rupee
  BDT: 2, // Bangladeshi Taka
  EGP: 2, // Egyptian Pound
  KZT: 2, // Kazakhstani Tenge
  MAD: 2, // Moroccan Dirham
  KES: 2, // Kenyan Shilling
  DZD: 2, // Algerian Dinar
  BHD: 3, // Bahraini Dinar
  KWD: 3, // Kuwaiti Dinar
};

export const formatPrice = (price, currency) => {
  try {
    const decimals = minorUnits[currency] ?? 2;
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    const amount = price / Math.pow(10, decimals);
    return formatter.format(amount);
  } catch (err) {
    // uh oh
  }

  return `${currency} ${price}`;
};
