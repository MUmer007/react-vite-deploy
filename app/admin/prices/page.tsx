"use client";

import React, { useState, useEffect } from "react";
import { Home, Loader2, Save, DollarSign } from "lucide-react";
import Link from "next/link";

type Item = { id: string; name: string; unit: string; emoji?: string };
type Market = { id: string; name: string };
type Price = { id: string; itemId: string; marketId: string; price: number };

export default function ManagePricesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      // Initialize price inputs
      const inputs: Record<string, string> = {};
      pricesData.forEach((price: Price) => {
        inputs[`${price.itemId}-${price.marketId}`] = price.price.toString();
      });
      setPriceInputs(inputs);
      setError(null);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPrice = (itemId: string, marketId: string): string => {
    return priceInputs[`${itemId}-${marketId}`] || "";
  };

  const handlePriceChange = (itemId: string, marketId: string, value: string) => {
    setPriceInputs({
      ...priceInputs,
      [`${itemId}-${marketId}`]: value,
    });
  };

  const handleSavePrice = async (itemId: string, marketId: string) => {
    const key = `${itemId}-${marketId}`;
    const priceValue = priceInputs[key];

    if (!priceValue || isNaN(parseFloat(priceValue))) {
      alert("Please enter a valid price");
      return;
    }

    try {
      setSaving(key);
      const response = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          marketId,
          price: parseFloat(priceValue),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to save price");
        return;
      }

      await fetchData();
    } catch (error) {
      alert("Failed to save price");
      console.error(error);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Manage Prices</h1>
              <p className="text-sm text-slate-500">
                Set prices for items across different markets
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/admin/items"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Manage Items
              </Link>
              <Link
                href="/admin/markets"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Manage Markets
              </Link>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {items.length === 0 || markets.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl">
            Please add items and markets first before setting prices.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-800">Price Matrix</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter prices and click the save button to update. Leave empty for items not available.
            </p>

            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-3 font-semibold text-slate-700 sticky left-0 bg-white z-10">
                    Item
                  </th>
                  {markets.map((market) => (
                    <th
                      key={market.id}
                      className="text-center p-3 font-semibold text-slate-700 min-w-[120px]"
                    >
                      {market.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800 sticky left-0 bg-white">
                      <div className="flex items-center gap-2">
                        <span>{item.emoji}</span>
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-slate-500">per {item.unit}</div>
                        </div>
                      </div>
                    </td>
                    {markets.map((market) => {
                      const key = `${item.id}-${market.id}`;
                      const isSaving = saving === key;
                      return (
                        <td key={market.id} className="p-2">
                          <div className="flex gap-1">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Price"
                              value={getPrice(item.id, market.id)}
                              onChange={(e) =>
                                handlePriceChange(item.id, market.id, e.target.value)
                              }
                              className="flex-1 px-2 py-1 text-sm rounded border focus:ring-2 focus:ring-blue-300 outline-none"
                              disabled={isSaving}
                            />
                            <button
                              onClick={() => handleSavePrice(item.id, market.id)}
                              disabled={isSaving}
                              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                              title="Save"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

