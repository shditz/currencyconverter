"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [currencies, setCurrencies] = useState({});
  const [result, setResult] = useState(
    "Enter the amount and select the currency for conversion."
  );
  const [lastUpdated, setLastUpdated] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const currencyFlags = {
    AED: "ae",
    AFN: "af",
    ALL: "al",
    ANG: "an",
    AOA: "ao",
    ARS: "ar",
    AUD: "au",
    AWG: "aw",
    AZN: "az",
    BAM: "ba",
    BBD: "bb",
    BDT: "bd",
    BGN: "bg",
    BHD: "bh",
    BIF: "bi",
    BMD: "bm",
    BND: "bn",
    BOB: "bo",
    BRL: "br",
    BSD: "bs",
    BTN: "bt",
    BWP: "bw",
    BYN: "by",
    BZD: "bz",
    CAD: "ca",
    CDF: "cd",
    CHF: "ch",
    CLP: "cl",
    CNY: "cn",
    COP: "co",
    CRC: "cr",
    CUP: "cu",
    CVE: "cv",
    CZK: "cz",
    DJF: "dj",
    DKK: "dk",
    DOP: "do",
    DZD: "dz",
    EGP: "eg",
    ERN: "er",
    ETB: "et",
    EUR: "eu",
    FJD: "fj",
    FKP: "fk",
    FOK: "fo",
    GBP: "gb",
    GEL: "ge",
    GGP: "gg",
    GHS: "gh",
    GIP: "gi",
    GMD: "gm",
    GNF: "gn",
    GTQ: "gt",
    GYD: "gy",
    HKD: "hk",
    HNL: "hn",
    HRK: "hr",
    HTG: "ht",
    HUF: "hu",
    IDR: "id",
    ILS: "il",
    IMP: "im",
    INR: "in",
    IQD: "iq",
    IRR: "ir",
    ISK: "is",
    JEP: "je",
    JMD: "jm",
    JOD: "jo",
    JPY: "jp",
    KES: "ke",
    KGS: "kg",
    KHR: "kh",
    KID: "ki",
    KMF: "km",
    KRW: "kr",
    KWD: "kw",
    KYD: "ky",
    KZT: "kz",
    LAK: "la",
    LBP: "lb",
    LKR: "lk",
    LRD: "lr",
    LSL: "ls",
    LYD: "ly",
    MAD: "ma",
    MDL: "md",
    MGA: "mg",
    MKD: "mk",
    MMK: "mm",
    MNT: "mn",
    MOP: "mo",
    MRU: "mr",
    MUR: "mu",
    MVR: "mv",
    MWK: "mw",
    MXN: "mx",
    MYR: "my",
    MZN: "mz",
    NAD: "na",
    NGN: "ng",
    NIO: "ni",
    NOK: "no",
    NPR: "np",
    NZD: "nz",
    OMR: "om",
    PAB: "pa",
    PEN: "pe",
    PGK: "pg",
    PHP: "ph",
    PKR: "pk",
    PLN: "pl",
    PYG: "py",
    QAR: "qa",
    RON: "ro",
    RSD: "rs",
    RUB: "ru",
    RWF: "rw",
    SAR: "sa",
    SBD: "sb",
    SCR: "sc",
    SDG: "sd",
    SEK: "se",
    SGD: "sg",
    SHP: "sh",
    SLE: "sl",
    SOS: "so",
    SRD: "sr",
    SSP: "ss",
    STN: "st",
    SYP: "sy",
    SZL: "sz",
    THB: "th",
    TJS: "tj",
    TMT: "tm",
    TND: "tn",
    TOP: "to",
    TRY: "tr",
    TTD: "tt",
    TVD: "tv",
    TWD: "tw",
    TZS: "tz",
    UAH: "ua",
    UGX: "ug",
    USD: "us",
    UYU: "uy",
    UZS: "uz",
    VES: "ve",
    VND: "vn",
    VUV: "vu",
    WST: "ws",
    XAF: "cf",
    XCD: "vc",
    XDR: "imf",
    XOF: "ci",
    XPF: "pf",
    YER: "ye",
    ZAR: "za",
    ZMW: "zm",
    ZWL: "zw",
  };

  const resultRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("conversionHistory")) || [];
    setHistory(savedHistory);
    loadCurrencies();
  }, []);

  useEffect(() => {
    validateForm();
  }, [amount, fromCurrency, toCurrency]);

  const loadCurrencies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/${apiKey}/codes`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result === "success") {
        const currencyMap = {};
        data.supported_codes.forEach(([code, name]) => {
          currencyMap[code] = name;
        });
        setCurrencies(currencyMap);
        setResult("Select currency to start conversion");
      } else {
        throw new Error(data["error-type"] || "Failed to load currency");
      }
    } catch (error) {
      console.error("Error loading currencies:", error);
      setError("Failed to load currency list. Please try again.");
      setResult("Failed to load currency list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmountInput = (value) => {
    let formattedValue = value.replace(/[^\d,]/g, "");
    const parts = formattedValue.split(",");
    let integerPart = parts[0].replace(/\D/g, "");
    const decimalPart = parts[1] ? parts[1].replace(/\D/g, "") : "";

    if (integerPart.length > 15) {
      integerPart = integerPart.substring(0, 15);
    }

    const limitedDecimalPart = decimalPart.substring(0, 2);

    if (integerPart.length > 3) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    formattedValue = integerPart;
    if (limitedDecimalPart) {
      formattedValue += "," + limitedDecimalPart;
    }

    return formattedValue;
  };

  const handleAmountChange = (e) => {
    const formattedValue = formatAmountInput(e.target.value);
    setAmount(formattedValue);
  };

  const validateForm = () => {
    const rawAmount = amount.replace(/\./g, "").replace(",", ".");
    const amountNum = parseFloat(rawAmount);

    const valid =
      !!amount &&
      !isNaN(amountNum) &&
      fromCurrency &&
      toCurrency &&
      fromCurrency !== toCurrency;

    setIsValid(valid);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (!amount) {
        setError("Please enter a valid amount");
      } else if (fromCurrency === toCurrency) {
        setError("The origin and destination currencies cannot be the same.");
      } else {
        setError("Please complete all fields");
      }
      return;
    }

    const rawAmount = amount.replace(/\./g, "").replace(",", ".");
    const amountNum = parseFloat(rawAmount);

    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${baseUrl}/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amountNum}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result === "success") {
        const convertedAmount = data.conversion_result;
        const rate = data.conversion_rate;
        const lastUpdatedDate = new Date(data.time_last_update_utc);

        setLastUpdated(lastUpdatedDate.toLocaleString("id-ID"));
        showConversionResult(
          amountNum,
          fromCurrency,
          convertedAmount,
          toCurrency,
          rate
        );
        addToHistory(
          amountNum,
          fromCurrency,
          convertedAmount,
          toCurrency,
          lastUpdatedDate
        );
      } else {
        throw new Error(data["error-type"] || "Failed to convert currency");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      setError(`There is an error: ${error.message}`);
      setResult(
        `<p><i class="fas fa-exclamation-circle"></i> There is an error: ${error.message}</p>`
      );
    } finally {
      setLoading(false);
    }
  };

  const showConversionResult = (
    amount,
    fromCurrency,
    convertedAmount,
    toCurrency,
    rate
  ) => {
    setResult(`
      <div>
        <div class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">
          ${formatCurrency(convertedAmount, toCurrency)}
        </div>
        <div class="text-sm sm:text-base opacity-90 mb-1">
          ${formatNumber(amount)} ${fromCurrency} = ${formatNumber(
      convertedAmount
    )} ${toCurrency}
        </div>
        <div class="text-sm sm:text-base opacity-90">
          1 ${fromCurrency} = ${formatNumber(rate, 6)} ${toCurrency}
        </div>
      </div>
    `);
  };

  const formatNumber = (number, maxFractionDigits = 2) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    }).format(number);
  };

  const formatCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      return `${formatNumber(amount)} ${currency}`;
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const addToHistory = (
    amount,
    fromCurrency,
    convertedAmount,
    toCurrency,
    date
  ) => {
    const historyItem = {
      id: Date.now(),
      amount,
      fromCurrency,
      convertedAmount,
      toCurrency,
      date: date.toLocaleString("id-ID"),
    };

    const newHistory = [historyItem, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem("conversionHistory", JSON.stringify(newHistory));
  };

  const removeFromHistory = (id) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem("conversionHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (history.length === 0) return;

    if (confirm("Are you sure you want to delete all history?")) {
      setHistory([]);
      localStorage.removeItem("conversionHistory");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gradient-to-br from-white via-purple-50 to-white text-gray-800">
        <div className="w-full max-w-2xl">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-transparent bg-clip-text">
              Currency Converter
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Real-time currency conversion with the latest exchange rates
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="w-full py-4 px-5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <i className="fas fa-coins text-purple-500"></i>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="relative">
                        <select
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value)}
                          className="w-full py-3 px-4 pr-12 bg-white border border-gray-200 rounded-lg text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                          required
                        >
                          <option value="">Select Currency</option>
                          {Object.entries(currencies)
                            .sort((a, b) => a[1].localeCompare(b[1]))
                            .map(([code, name]) => (
                              <option key={`from-${code}`} value={code}>
                                {code} - {name}
                              </option>
                            ))}
                        </select>
                        {fromCurrency && currencyFlags[fromCurrency] && (
                          <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-5 bg-cover rounded-sm overflow-hidden border"
                            style={{
                              backgroundImage: `url(https://flagcdn.com/48x36/${currencyFlags[fromCurrency]}.png)`,
                              backgroundSize: "cover",
                            }}
                          ></div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={swapCurrencies}
                        className="mt-6 w-12 h-12 bg-white border border-purple-200 rounded-full flex items-center justify-center hover:bg-purple-50 transition-all shadow-md text-purple-600 hover:text-purple-800"
                        title="Swap currencies"
                      >
                        <i className="fas fa-exchange-alt "></i>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="relative">
                        <select
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value)}
                          className="w-full py-3 px-4 pr-12 bg-white border border-gray-200 rounded-lg text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                          required
                        >
                          <option value="">Select Currency</option>
                          {Object.entries(currencies)
                            .sort((a, b) => a[1].localeCompare(b[1]))
                            .map(([code, name]) => (
                              <option key={`to-${code}`} value={code}>
                                {code} - {name}
                              </option>
                            ))}
                        </select>
                        {toCurrency && currencyFlags[toCurrency] && (
                          <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-5 bg-cover rounded-sm overflow-hidden border"
                            style={{
                              backgroundImage: `url(https://flagcdn.com/48x36/${currencyFlags[toCurrency]}.png)`,
                              backgroundSize: "cover",
                            }}
                          ></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`w-full py-4 px-4 rounded-lg font-semibold uppercase tracking-wider transition-all shadow-lg ${
                    isValid && !loading
                      ? "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Converting...
                    </div>
                  ) : (
                    "Convert Now"
                  )}
                </button>
              </form>
            </div>

            {/* Result Section */}
            <div
              ref={resultRef}
              className={`p-6 ${
                error
                  ? "bg-red-50"
                  : result.includes("Enter") || result.includes("Select")
                  ? "bg-gray-50"
                  : "bg-purple-50"
              } border-t border-gray-100 min-h-[120px] flex flex-col items-center justify-center`}
              dangerouslySetInnerHTML={{ __html: result }}
            ></div>

            {error && (
              <div className="text-red-500 text-center py-2 font-medium bg-red-50">
                {error}
              </div>
            )}
          </div>

          {/* History Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-history text-purple-600 mr-2"></i>
                  Conversion History
                </h2>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors flex items-center"
                  >
                    <i className="fas fa-trash-alt mr-1"></i>
                    Clear All
                  </button>
                )}
              </div>

              <div
                ref={historyRef}
                className="space-y-4 max-h-80 overflow-y-auto pr-2"
              >
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-clock text-3xl text-gray-300 mb-3"></i>
                    <p>No conversion history yet</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-center">
                        <div className="bg-white p-2 rounded-lg mr-4 shadow-sm">
                          <i className="fas fa-exchange-alt text-purple-500"></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {formatNumber(item.amount)} {item.fromCurrency} →{" "}
                            <span className="text-purple-600 font-semibold">
                              {formatCurrency(
                                item.convertedAmount,
                                item.toCurrency
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromHistory(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Currency Converter | Real-time Exchange
            Rates
          </p>
        </footer>
      </div>
    </>
  );
}
