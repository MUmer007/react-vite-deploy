"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Home, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Market = { id: string; name: string; rating?: number | null; verified?: boolean };

export default function ManageMarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", rating: "", verified: false });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/markets");
      if (!response.ok) throw new Error("Failed to fetch markets");
      const data = await response.json();
      setMarkets(data);
      setError(null);
    } catch (err) {
      setError("Failed to load markets. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const handleAdd = async () => {
    if (!formData.name) return;
    
    try {
      const response = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          rating: formData.rating ? parseFloat(formData.rating) : null,
          verified: formData.verified,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to add market");
        return;
      }

      await fetchMarkets();
      setFormData({ id: "", name: "", rating: "", verified: false });
      setIsAdding(false);
    } catch (error) {
      alert("Failed to add market");
      console.error(error);
    }
  };

  const handleEdit = (market: Market) => {
    setEditingId(market.id);
    setFormData({
      id: market.id,
      name: market.name,
      rating: market.rating?.toString() || "",
      verified: market.verified || false,
    });
  };

  const handleSaveEdit = async () => {
    if (!formData.name) return;
    
    try {
      const response = await fetch(`/api/markets/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          rating: formData.rating ? parseFloat(formData.rating) : null,
          verified: formData.verified,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to update market");
        return;
      }

      await fetchMarkets();
      setEditingId(null);
      setFormData({ id: "", name: "", rating: "", verified: false });
    } catch (error) {
      alert("Failed to update market");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this market? This will also delete all associated prices.")) return;
    
    try {
      const response = await fetch(`/api/markets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to delete market");
        return;
      }

      await fetchMarkets();
    } catch (error) {
      alert("Failed to delete market");
      console.error(error);
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Manage Markets</h1>
              <p className="text-sm text-slate-500">Add, edit, or remove markets</p>
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
                href="/admin/prices"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Manage Prices
              </Link>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Add New Market Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium mb-4"
          >
            <Plus className="w-4 h-4" />
            Add New Market
          </button>

          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-xl"
            >
              <input
                type="text"
                placeholder="Name (required)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0-5)"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
                />
                <span>Verified</span>
              </label>
              <div className="flex gap-2 md:col-span-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({ id: "", name: "", rating: "", verified: false });
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Markets List */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            All Markets ({markets.length})
          </h2>

          <div className="space-y-2">
            {markets.map((market) => (
              <div
                key={market.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {editingId === market.id ? (
                  <>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-24 px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                    <label className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.verified}
                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Verified</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ id: "", name: "", rating: "", verified: false });
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {market.name}
                        {market.verified && (
                          <span className="text-blue-500 text-xs">✓ Verified</span>
                        )}
                      </div>
                    </div>
                    {market.rating && (
                      <div className="inline-flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{market.rating}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(market)}
                        className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(market.id)}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
