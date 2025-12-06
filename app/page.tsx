"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
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
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Enhanced Price Compare - Fixed issues and added improvements
 * - Fixed: Toggle behavior in ItemSearchSelect
 * - Added: Better empty states
 * - Added: Filter by verified markets
 * - Added: Price difference percentages
 * - Added: Better mobile responsiveness
 * - Added: Savings calculator
 * - Added: Dynamic items and markets management
 */

/* ----------------------------- Types ------------------------------ */
type Item = { id: string; name: string; unit: string; emoji?: string };
type Market = { id: string; name: string; rating?: number | null; verified?: boolean };
type PriceMap = Record<string, Record<string, number | null>>;
type PriceData = { id: string; itemId: string; marketId: string; price: number };

/* --------------------------- Utility Functions -------------------------- */
// Convert price array to price map for easier lookup
const convertToPriceMap = (prices: PriceData[]): PriceMap => {
  const map: PriceMap = {};
  prices.forEach((price) => {
    if (!map[price.itemId]) {
      map[price.itemId] = {};
    }
    map[price.itemId][price.marketId] = price.price;
  });
  return map;
};

/* --------------------------- Components --------------------------- */

// Utility component for screen readers (currently unused but kept for future accessibility enhancements)
// const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <span className="sr-only">{children}</span>
// );

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

      <div className="flex items-center gap-2">
        <Link
          href="/admin/items"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-sm border hover:bg-gray-50 text-sm transition-colors"
          aria-label="Manage data"
        >
          <Settings className="w-4 h-4" /> Manage
        </Link>
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
  items: Item[];
  markets: Market[];
}> = ({ itemIds, marketIds, prices, items, markets }) => {
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
          const item = items.find((i) => i.id === r.itemId)!;
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
                      const market = markets.find((m) => m.id === marketId)!;
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
                    const market = markets.find((m) => m.id === marketId)!;
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

const SummaryAnalytics: React.FC<{
  itemIds: string[];
  marketIds: string[];
  prices: PriceMap;
  markets: Market[];
}> = ({ itemIds, marketIds, prices, markets }) => {
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
              ? `${markets.find((m) => m.id === cheapest.marketId)?.name} - Rs ${cheapest.sum.toFixed(0)}`
              : "N/A"
          }
          icon={<TrendingDown className="w-5 h-5 text-green-600" />}
          highlight
        />
        <StatCard
          title="Most Expensive"
          value={
            highest
              ? `${markets.find((m) => m.id === highest.marketId)?.name} - Rs ${highest.sum.toFixed(0)}`
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
  const [items, setItems] = useState<Item[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [prices, setPrices] = useState<PriceMap>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, marketsRes, pricesRes] = await Promise.all([
          fetch("/api/items"),
          fetch("/api/markets"),
          fetch("/api/prices"),
        ]);

        if (!itemsRes.ok || !marketsRes.ok || !pricesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [itemsData, marketsData, pricesData] = await Promise.all([
          itemsRes.json(),
          marketsRes.json(),
          pricesRes.json(),
        ]);

        setItems(itemsData);
        setMarkets(marketsData);
        setPrices(convertToPriceMap(pricesData));

        // Set default selections if available
        if (itemsData.length >= 3) {
          setSelectedItems([itemsData[0].id, itemsData[1].id, itemsData[2].id]);
        }
        if (marketsData.length >= 3) {
          setSelectedMarkets([marketsData[0].id, marketsData[1].id, marketsData[2].id]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      const item = items.find((i) => i.id === it)!;
      lines.push(`📦 ${item.name.toUpperCase()} (${item.unit})`);
      lines.push("─────────────────────────────────");
      
      const itemPrices = selectedMarkets
        .map((m) => ({
          market: markets.find((mk) => mk.id === m)?.name,
          price: prices[it]?.[m],
        }))
        .sort((a, b) => {
          if (a.price === null || a.price === undefined) return 1;
          if (b.price === null || b.price === undefined) return -1;
          return a.price - b.price;
        });

      itemPrices.forEach((p, idx) => {
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
  }, [selectedItems, selectedMarkets, items, markets, prices]);

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
            <ItemSearchSelect items={items} selected={selectedItems} setSelected={setSelectedItems} />
            <MarketChips markets={markets} selected={selectedMarkets} setSelected={setSelectedMarkets} />

            {selectedItems.length > 0 && selectedMarkets.length > 0 && (
              <SavingsCalculator itemIds={selectedItems} marketIds={selectedMarkets} prices={prices} />
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
                    <li>• Toggle &ldquo;Verified only&rdquo; to filter trusted markets</li>
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

            <SavingsCalculator itemIds={selectedItems} marketIds={selectedMarkets} prices={prices} />
            <SummaryAnalytics itemIds={selectedItems} marketIds={selectedMarkets} prices={prices} markets={markets} />
            <ResultsPerItem itemIds={selectedItems} marketIds={selectedMarkets} prices={prices} items={items} markets={markets} />
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