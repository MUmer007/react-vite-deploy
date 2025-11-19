"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ShoppingBasket,
  ArrowLeft,
  Loader2,
  Star,
  Copy,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Check,
  AlertCircle,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Enhanced Price Compare - Fixed issues and added improvements
 * - Fixed: Toggle behavior in ItemSearchSelect
 * - Added: Better empty states
 * - Added: Filter by verified markets
 * - Added: Price difference percentages
 * - Added: Better mobile responsiveness
 * - Added: Savings calculator
 */

/* ----------------------------- Types ------------------------------ */
type Item = { id: string; name: string; unit: string; emoji?: string };
type Market = { id: string; name: string; rating?: number; verified?: boolean };
type PriceMap = Record<string, Record<string, number | null>>;

/* --------------------------- Sample Data -------------------------- */
const ITEMS: Item[] = [
  { id: "sugar", name: "Sugar", unit: "kg", emoji: "🍚" },
  { id: "flour", name: "Flour", unit: "kg", emoji: "🌾" },
  { id: "rice", name: "Rice", unit: "kg", emoji: "🍚" },
  { id: "milk", name: "Milk", unit: "liter", emoji: "🥛" },
  { id: "eggs", name: "Eggs", unit: "dozen", emoji: "🥚" },
  { id: "oil", name: "Cooking Oil", unit: "liter", emoji: "🛢️" },
  { id: "butter", name: "Butter", unit: "pack", emoji: "🧈" },
  { id: "chicken", name: "Chicken", unit: "kg", emoji: "🍗" },
  { id: "beef", name: "Beef", unit: "kg", emoji: "🥩" },
  { id: "potato", name: "Potato", unit: "kg", emoji: "🥔" },
  { id: "tomato", name: "Tomato", unit: "kg", emoji: "🍅" },
  { id: "onion", name: "Onion", unit: "kg", emoji: "🧅" },
  { id: "apple", name: "Apple", unit: "kg", emoji: "🍎" },
  { id: "banana", name: "Banana", unit: "dozen", emoji: "🍌" },
  { id: "salt", name: "Salt", unit: "kg", emoji: "🧂" },
  { id: "tea", name: "Tea", unit: "packet", emoji: "🍵" },
  { id: "coffee", name: "Coffee", unit: "jar", emoji: "☕" },
  { id: "detergent", name: "Detergent", unit: "kg", emoji: "🧺" },
  { id: "soap", name: "Soap", unit: "piece", emoji: "🧼" },
  { id: "toothpaste", name: "Toothpaste", unit: "tube", emoji: "🪥" },
];

const MARKETS: Market[] = [
  { id: "imtiaz", name: "Imtiaz", rating: 4.6, verified: true },
  { id: "carrefour", name: "Carrefour", rating: 4.5, verified: true },
  { id: "chaseup", name: "Chase Up", rating: 4.2 },
  { id: "metro", name: "Metro", rating: 4.4, verified: true },
  { id: "alfatah", name: "Al-Fatah", rating: 4.0 },
  { id: "utility", name: "Utility Store", rating: 3.8 },
  { id: "hyperstar", name: "Hyperstar", rating: 4.1 },
  { id: "freshmart", name: "FreshMart", rating: 3.9 },
  { id: "naheed", name: "Naheed", rating: 4.0 },
  { id: "greenvalley", name: "Green Valley", rating: 4.0 },
  { id: "madina", name: "Madina Cash & Carry", rating: 3.8 },
  { id: "jalals", name: "Jalal Sons", rating: 4.2 },
];

const PRICES: PriceMap = {
  sugar: {
    imtiaz: 150,
    carrefour: 160,
    chaseup: 155,
    metro: 170,
    alfatah: 153,
    utility: 158,
    hyperstar: 165,
    freshmart: 151,
    naheed: 152,
    greenvalley: 154,
    madina: 158,
    jalals: 149,
  },
  flour: {
    imtiaz: 120,
    carrefour: 118,
    chaseup: 122,
    metro: 125,
    alfatah: 119,
    utility: 121,
    hyperstar: 123,
    freshmart: 117,
    naheed: 118,
    greenvalley: 119,
    madina: 122,
    jalals: 120,
  },
  rice: {
    imtiaz: 190,
    carrefour: 195,
    chaseup: 185,
    metro: 200,
    alfatah: 188,
    utility: 192,
    hyperstar: 198,
    freshmart: 187,
    naheed: 186,
    greenvalley: 189,
    madina: 191,
    jalals: 184,
  },
  milk: {
    imtiaz: 120,
    carrefour: 125,
    chaseup: 118,
    metro: 130,
    alfatah: 121,
    utility: 123,
    hyperstar: 127,
    freshmart: 119,
    naheed: 122,
    greenvalley: 121,
    madina: 124,
    jalals: 120,
  },
  eggs: {
    imtiaz: 210,
    carrefour: 215,
    chaseup: 205,
    metro: 220,
    alfatah: 208,
    utility: 199,
    hyperstar: 212,
    freshmart: 202,
    naheed: 205,
    greenvalley: 207,
    madina: 209,
    jalals: 200,
  },
  oil: {
    imtiaz: 420,
    carrefour: 430,
    chaseup: 415,
    metro: 440,
    alfatah: 418,
    utility: 425,
    hyperstar: 435,
    freshmart: 410,
    naheed: 412,
    greenvalley: 420,
    madina: 428,
    jalals: 419,
  },
  butter: {
    imtiaz: 250,
    carrefour: 260,
    chaseup: 255,
    metro: 270,
    alfatah: 248,
    utility: 252,
    hyperstar: 265,
    freshmart: 249,
    naheed: 251,
    greenvalley: 253,
    madina: 257,
    jalals: 245,
  },
  chicken: {
    imtiaz: 480,
    carrefour: 495,
    chaseup: 470,
    metro: 500,
    alfatah: 478,
    utility: 475,
    hyperstar: 490,
    freshmart: 469,
    naheed: 472,
    greenvalley: 475,
    madina: 485,
    jalals: 468,
  },
  beef: {
    imtiaz: 900,
    carrefour: 920,
    chaseup: 890,
    metro: 940,
    alfatah: 905,
    utility: 895,
    hyperstar: 915,
    freshmart: 888,
    naheed: 892,
    greenvalley: 898,
    madina: 910,
    jalals: 885,
  },
  potato: {
    imtiaz: 40,
    carrefour: 45,
    chaseup: 42,
    metro: 48,
    alfatah: 41,
    utility: 43,
    hyperstar: 44,
    freshmart: 39,
    naheed: 40,
    greenvalley: 41,
    madina: 42,
    jalals: 38,
  },
  tomato: {
    imtiaz: 90,
    carrefour: 95,
    chaseup: 88,
    metro: 99,
    alfatah: 92,
    utility: 93,
    hyperstar: 97,
    freshmart: 87,
    naheed: 88,
    greenvalley: 89,
    madina: 90,
    jalals: 86,
  },
  onion: {
    imtiaz: 70,
    carrefour: 72,
    chaseup: 68,
    metro: 75,
    alfatah: 69,
    utility: 71,
    hyperstar: 73,
    freshmart: 67,
    naheed: 68,
    greenvalley: 69,
    madina: 70,
    jalals: 66,
  },
  apple: {
    imtiaz: 220,
    carrefour: 230,
    chaseup: 210,
    metro: 240,
    alfatah: 218,
    utility: 225,
    hyperstar: 235,
    freshmart: 215,
    naheed: 217,
    greenvalley: 219,
    madina: 223,
    jalals: 205,
  },
  banana: {
    imtiaz: 120,
    carrefour: 125,
    chaseup: 115,
    metro: 130,
    alfatah: 118,
    utility: 121,
    hyperstar: 126,
    freshmart: 117,
    naheed: 116,
    greenvalley: 119,
    madina: 122,
    jalals: 114,
  },
  salt: {
    imtiaz: 40,
    carrefour: 45,
    chaseup: 44,
    metro: 49,
    alfatah: 43,
    utility: 42,
    hyperstar: 46,
    freshmart: 41,
    naheed: 42,
    greenvalley: 43,
    madina: 44,
    jalals: 40,
  },
  tea: {
    imtiaz: 500,
    carrefour: 520,
    chaseup: 495,
    metro: 540,
    alfatah: 510,
    utility: 505,
    hyperstar: 525,
    freshmart: 490,
    naheed: 492,
    greenvalley: 503,
    madina: 515,
    jalals: 485,
  },
  coffee: {
    imtiaz: 480,
    carrefour: 500,
    chaseup: 470,
    metro: 510,
    alfatah: 495,
    utility: 490,
    hyperstar: 505,
    freshmart: 468,
    naheed: 472,
    greenvalley: 478,
    madina: 498,
    jalals: 460,
  },
  detergent: {
    imtiaz: 350,
    carrefour: 360,
    chaseup: 340,
    metro: 370,
    alfatah: 345,
    utility: 348,
    hyperstar: 355,
    freshmart: 338,
    naheed: 342,
    greenvalley: 346,
    madina: 352,
    jalals: 335,
  },
  soap: {
    imtiaz: 60,
    carrefour: 65,
    chaseup: 58,
    metro: 68,
    alfatah: 62,
    utility: 61,
    hyperstar: 64,
    freshmart: 57,
    naheed: 59,
    greenvalley: 60,
    madina: 63,
    jalals: 56,
  },
  toothpaste: {
    imtiaz: 120,
    carrefour: 125,
    chaseup: 118,
    metro: 130,
    alfatah: 121,
    utility: 122,
    hyperstar: 127,
    freshmart: 116,
    naheed: 117,
    greenvalley: 119,
    madina: 123,
    jalals: 115,
  },
};

/* --------------------------- Components --------------------------- */

const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

const Header: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
  <header className="w-full max-w-4xl mx-auto py-4 px-4">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <ShoppingBasket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">PRIZELY</h1>
          <p className="text-xs text-slate-500">Find the best grocery deals</p>
        </div>
      </div>

      {onReset && (
        <button
          type="button"
          aria-label="Reset selections"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-sm border hover:bg-gray-50 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Reset
        </button>
      )}
    </div>
  </header>
);

const ItemSearchSelect: React.FC<{
  items: Item[];
  selected: string[];
  setSelected: (s: string[]) => void;
}> = ({ items, selected, setSelected }) => {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => items.filter((it) => it.name.toLowerCase().includes(q.toLowerCase())),
    [q, items]
  );

  const toggle = useCallback(
    (id: string) => {
      setSelected(
        selected.includes(id)
          ? selected.filter((item) => item !== id)
          : [...selected, id]
      );
    },
    [selected, setSelected]
  );

  return (
    <section aria-labelledby="items-label" className="bg-white p-4 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 id="items-label" className="text-sm font-semibold text-slate-700">Select Items</h2>
        <span className="text-xs text-slate-500">{selected.length} selected</span>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            className="w-full rounded-xl border bg-slate-50 py-2 pl-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="Search items..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search items"
          />
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-auto pr-1">
            {filtered.map((it) => {
              const isSel = selected.includes(it.id);
              return (
                <button
                  key={it.id}
                  onClick={() => toggle(it.id)}
                  className={`flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg transition-all border ${
                    isSel
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-slate-700 border-gray-200 hover:border-blue-300"
                  }`}
                  aria-pressed={isSel}
                >
                  {isSel && <Check className="w-3 h-3 flex-shrink-0" />}
                  <span className="text-lg">{it.emoji ?? "🛒"}</span>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium leading-tight truncate">{it.name}</div>
                    <div className="text-[10px] opacity-70">{it.unit}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const MarketChips: React.FC<{
  markets: Market[];
  selected: string[];
  setSelected: (s: string[]) => void;
}> = ({ markets, selected, setSelected }) => {
  const [q, setQ] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const filtered = useMemo(
    () => markets.filter((m) => 
      m.name.toLowerCase().includes(q.toLowerCase()) &&
      (!verifiedOnly || m.verified)
    ),
    [q, markets, verifiedOnly]
  );

  const toggle = useCallback(
    (id: string) => setSelected(selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]),
    [selected, setSelected]
  );

  return (
    <section aria-labelledby="markets-label" className="bg-white p-4 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 id="markets-label" className="text-sm font-semibold text-slate-700">Select Markets</h2>
        <span className="text-xs text-slate-500">{selected.length} selected</span>
      </div>

      <div className="space-y-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search markets..."
          className="w-full rounded-xl border bg-slate-50 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
          aria-label="Search markets"
        />

        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition ${
            verifiedOnly ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          <Filter className="w-3 h-3" />
          Verified only
        </button>

        {filtered.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <p className="text-sm">No markets found</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filtered.map((m) => {
              const isSel = selected.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className={`px-3 py-2 rounded-full text-sm border transition-all ${
                    isSel
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white text-slate-700 border-gray-200 hover:border-indigo-300"
                  }`}
                  aria-pressed={isSel}
                >
                  <span className="font-medium">{m.name}</span>
                  {m.verified && <span className="ml-1">✓</span>}
                  <span className="ml-2 text-xs opacity-70">★{m.rating ?? "—"}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; highlight?: boolean }> = ({
  title,
  value,
  icon,
  highlight,
}) => (
  <div
    className={`p-4 bg-white rounded-2xl shadow-sm border text-center min-w-[140px] ${
      highlight ? "ring-2 ring-blue-400 bg-blue-50" : ""
    }`}
  >
    {icon && <div className="flex justify-center mb-2">{icon}</div>}
    <div className="text-xs text-slate-500 mb-1">{title}</div>
    <div className={`text-lg font-bold ${highlight ? "text-blue-600" : "text-slate-800"}`}>{value}</div>
  </div>
);

const SavingsCalculator: React.FC<{ itemIds: string[]; marketIds: string[]; prices: PriceMap }> = ({
  itemIds,
  marketIds,
  prices,
}) => {
  const savings = useMemo(() => {
    let totalCheapest = 0;
    let totalExpensive = 0;

    itemIds.forEach((it) => {
      const marketPrices = marketIds
        .map((m) => prices[it]?.[m])
        .filter((p): p is number => typeof p === "number");
      
      if (marketPrices.length > 0) {
        totalCheapest += Math.min(...marketPrices);
        totalExpensive += Math.max(...marketPrices);
      }
    });

    const saved = totalExpensive - totalCheapest;
    const percentage = totalExpensive > 0 ? ((saved / totalExpensive) * 100).toFixed(1) : "0";

    return { saved, percentage, totalCheapest, totalExpensive };
  }, [itemIds, marketIds, prices]);

  if (savings.saved === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-green-900 mb-1">💰 Potential Savings</h3>
          <p className="text-xs text-green-700 mb-3">
            By shopping smartly across markets
          </p>
          <div className="text-3xl font-bold text-green-600">Rs {savings.saved.toFixed(0)}</div>
          <div className="text-xs text-green-600 mt-1">{savings.percentage}% savings possible</div>
        </div>
        <div className="text-right text-xs space-y-1">
          <div className="text-slate-600">
            <span className="font-medium">Best:</span> Rs {savings.totalCheapest.toFixed(0)}
          </div>
          <div className="text-slate-600">
            <span className="font-medium">Worst:</span> Rs {savings.totalExpensive.toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsPerItem: React.FC<{
  itemIds: string[];
  marketIds: string[];
  prices: PriceMap;
}> = ({ itemIds, marketIds, prices }) => {
  const rows = useMemo(() => {
    return itemIds.map((itemId) => {
      const marketPrices = marketIds.map((m) => {
        const price = prices[itemId]?.[m] ?? null;
        return { marketId: m, price };
      });
      const numeric = marketPrices.filter((p) => typeof p.price === "number").map((p) => p.price as number);
      const lowest = numeric.length ? Math.min(...numeric) : null;
      const highest = numeric.length ? Math.max(...numeric) : null;
      return { itemId, marketPrices, lowest, highest };
    });
  }, [itemIds, marketIds, prices]);

  return (
    <section aria-labelledby="compare-results" className="mt-4">
      <h3 id="compare-results" className="text-sm font-semibold text-slate-700 mb-3">
        Detailed Comparison
      </h3>

      <div className="space-y-4">
        {rows.map((r) => {
          const item = ITEMS.find((i) => i.id === r.itemId)!;
          const priceDiff = r.highest && r.lowest ? r.highest - r.lowest : 0;
          const diffPercent = r.lowest && priceDiff ? ((priceDiff / r.lowest) * 100).toFixed(1) : "0";

          return (
            <article key={r.itemId} className="bg-white p-4 rounded-2xl shadow-sm border">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{item.emoji}</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{item.name}</h4>
                    <div className="text-xs text-slate-400">per {item.unit}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {r.lowest !== null && (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Low: Rs {r.lowest}
                    </span>
                  )}
                  {r.highest !== null && (
                    <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                      High: Rs {r.highest}
                    </span>
                  )}
                  {priceDiff > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                      Δ {diffPercent}%
                    </span>
                  )}
                </div>
              </header>

              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b">
                      <th className="py-2 px-2 font-medium">Market</th>
                      <th className="py-2 px-2 font-medium text-right">Price</th>
                      <th className="py-2 px-2 font-medium text-center">Rating</th>
                      <th className="py-2 px-2 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.marketPrices.map(({ marketId, price }) => {
                      const market = MARKETS.find((m) => m.id === marketId)!;
                      const isLowest = price !== null && price === r.lowest;
                      const isHighest = price !== null && price === r.highest;
                      return (
                        <tr key={marketId} className="border-b last:border-0 hover:bg-slate-50 transition">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{market?.name}</span>
                              {market?.verified && (
                                <span className="text-blue-500 text-xs">✓</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="font-bold text-slate-800">
                              {price === null ? (
                                <span className="text-slate-400 text-sm">N/A</span>
                              ) : (
                                `Rs ${price}`
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-medium">{market?.rating ?? "—"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {isLowest && (
                              <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Best
                              </span>
                            )}
                            {isHighest && !isLowest && (
                              <span className="inline-block text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                Highest
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-500 mb-2 font-medium">Price Comparison</div>
                <div className="space-y-2">
                  {r.marketPrices.map(({ marketId, price }) => {
                    const market = MARKETS.find((m) => m.id === marketId)!;
                    const max = Math.max(
                      ...r.marketPrices.map((p) => (typeof p.price === "number" ? p.price : 0))
                    );
                    const pct = typeof price === "number" && max ? (price / max) * 100 : 0;
                    const isLowest = price !== null && price === r.lowest;
                    
                    return (
                      <div key={marketId} className="flex items-center gap-3">
                        <div className="w-24 text-xs text-slate-600 truncate">{market?.name}</div>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-3 rounded-full ${
                              isLowest
                                ? "bg-gradient-to-r from-green-400 to-green-500"
                                : "bg-gradient-to-r from-blue-400 to-indigo-500"
                            }`}
                          />
                        </div>
                        <div className="w-20 text-right text-xs font-semibold text-slate-700">
                          {price === null ? "N/A" : `Rs ${price}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

const SummaryAnalytics: React.FC<{ itemIds: string[]; marketIds: string[]; prices: PriceMap }> = ({
  itemIds,
  marketIds,
  prices,
}) => {
  const totalsByMarket = useMemo(() => {
    const totals: Record<string, number[]> = {};
    marketIds.forEach((m) => (totals[m] = []));
    itemIds.forEach((it) => {
      marketIds.forEach((m) => {
        const price = prices[it]?.[m];
        if (typeof price === "number") totals[m].push(price);
      });
    });
    const stats = marketIds.map((m) => {
      const arr = totals[m];
      const sum = arr.length ? arr.reduce((a, b) => a + b, 0) : 0;
      return { marketId: m, sum, avg: arr.length ? sum / arr.length : 0, count: arr.length };
    });
    return stats;
  }, [itemIds, marketIds, prices]);

  const cheapest = useMemo(() => {
    const valid = totalsByMarket.filter((s) => s.count > 0);
    if (!valid.length) return null;
    return valid.reduce((a, b) => (a.sum < b.sum ? a : b));
  }, [totalsByMarket]);

  const highest = useMemo(() => {
    const valid = totalsByMarket.filter((s) => s.count > 0);
    if (!valid.length) return null;
    return valid.reduce((a, b) => (a.sum > b.sum ? a : b));
  }, [totalsByMarket]);

  const avgAcross = useMemo(() => {
    const all = totalsByMarket.flatMap((t) => (t.count ? [t.avg] : []));
    if (!all.length) return "0";
    return (all.reduce((a, b) => a + b, 0) / all.length).toFixed(0);
  }, [totalsByMarket]);

  return (
    <section aria-labelledby="summary-analytics" className="mt-4">
      <h3 id="summary-analytics" className="text-sm font-semibold text-slate-700 mb-3">
        Summary Statistics
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <StatCard
          title="Cheapest Overall"
          value={
            cheapest
              ? `${MARKETS.find((m) => m.id === cheapest.marketId)?.name} - Rs ${cheapest.sum.toFixed(0)}`
              : "N/A"
          }
          icon={<TrendingDown className="w-5 h-5 text-green-600" />}
          highlight
        />
        <StatCard
          title="Most Expensive"
          value={
            highest
              ? `${MARKETS.find((m) => m.id === highest.marketId)?.name} - Rs ${highest.sum.toFixed(0)}`
              : "N/A"
          }
          icon={<TrendingUp className="w-5 h-5 text-red-600" />}
        />
        <StatCard title="Avg Price/Market" value={`Rs ${avgAcross}`} />
        <StatCard title="Markets Compared" value={marketIds.length} />
        <StatCard title="Items Compared" value={itemIds.length} />
      </div>
    </section>
  );
};

export default function PriceComparePage() {
  const [selectedItems, setSelectedItems] = useState<string[]>(["sugar", "milk", "eggs"]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(["imtiaz", "carrefour", "metro"]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  const isValid = selectedItems.length > 0 && selectedMarkets.length >= 2;

  const handleCompare = useCallback(() => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 800);
  }, [isValid]);

  const resetAll = useCallback(() => {
    setSelectedItems([]);
    setSelectedMarkets([]);
    setShowResults(false);
    setCopied(false);
  }, []);

  const copyResults = useCallback(() => {
    const lines: string[] = [];
    lines.push("═══════════════════════════════════");
    lines.push("     PRICE COMPARISON RESULTS");
    lines.push("═══════════════════════════════════");
    lines.push("");
    
    selectedItems.forEach((it) => {
      const item = ITEMS.find((i) => i.id === it)!;
      lines.push(`📦 ${item.name.toUpperCase()} (${item.unit})`);
      lines.push("─────────────────────────────────");
      
      const prices = selectedMarkets
        .map((m) => ({
          market: MARKETS.find((mk) => mk.id === m)?.name,
          price: PRICES[it]?.[m],
        }))
        .sort((a, b) => {
          if (a.price === null || a.price === undefined) return 1;
          if (b.price === null || b.price === undefined) return -1;
          return a.price - b.price;
        });

      prices.forEach((p, idx) => {
        const priceStr = p.price === undefined || p.price === null ? "N/A" : `Rs ${p.price}`;
        const badge = idx === 0 && p.price ? " ✓ BEST" : "";
        lines.push(`  ${p.market}: ${priceStr}${badge}`);
      });
      lines.push("");
    });

    lines.push("═══════════════════════════════════");
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    
    navigator.clipboard?.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedItems, selectedMarkets]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Header onReset={showResults ? undefined : resetAll} />

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 mt-6"
          >
            <ItemSearchSelect items={ITEMS} selected={selectedItems} setSelected={setSelectedItems} />
            <MarketChips markets={MARKETS} selected={selectedMarkets} setSelected={setSelectedMarkets} />

            {selectedItems.length > 0 && selectedMarkets.length > 0 && (
              <SavingsCalculator itemIds={selectedItems} marketIds={selectedMarkets} prices={PRICES} />
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleCompare}
                disabled={!isValid || loading}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-semibold transition-all ${
                  !isValid
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  "Compare Prices"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedItems([]);
                  setSelectedMarkets([]);
                }}
                className="sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border-2 bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-50 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">💡 Quick Tips</p>
                  <ul className="text-xs space-y-1 text-blue-800">
                    <li>• Select at least 1 item and 2 markets to compare</li>
                    <li>• Use search to quickly find items and markets</li>
                    <li>• Toggle "Verified only" to filter trusted markets</li>
                    <li>• View potential savings before comparing</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border p-4 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowResults(false)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Comparison Results</h2>
                    <div className="text-xs text-slate-500">
                      {selectedItems.length} items • {selectedMarkets.length} markets
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyResults}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Report
                  </button>
                  <AnimatePresence>
                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium text-green-600"
                      >
                        ✓ Copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <SavingsCalculator itemIds={selectedItems} marketIds={selectedMarkets} prices={PRICES} />
            <SummaryAnalytics itemIds={selectedItems} marketIds={selectedMarkets} prices={PRICES} />
            <ResultsPerItem itemIds={selectedItems} marketIds={selectedMarkets} prices={PRICES} />
          </motion.section>
        )}

        <footer className="mt-12 text-center text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <ShoppingBasket className="w-4 h-4" />
            <span>Price Compare • Smart Shopping Assistant</span>
          </div>
          <div>Built with React, Tailwind CSS & Framer Motion</div>
        </footer>
      </div>
    </main>
  );}