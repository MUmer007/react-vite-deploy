"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Item = { id: string; name: string; unit: string; emoji?: string };

export default function ManageItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", unit: "", emoji: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Failed to load items. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!formData.name || !formData.unit) return;
    
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          unit: formData.unit,
          emoji: formData.emoji || "🛒",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to add item");
        return;
      }

      await fetchItems();
      setFormData({ id: "", name: "", unit: "", emoji: "" });
      setIsAdding(false);
    } catch (error) {
      alert("Failed to add item");
      console.error(error);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setFormData({
      id: item.id,
      name: item.name,
      unit: item.unit,
      emoji: item.emoji || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.unit) return;
    
    try {
      const response = await fetch(`/api/items/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          unit: formData.unit,
          emoji: formData.emoji,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to update item");
        return;
      }

      await fetchItems();
      setEditingId(null);
      setFormData({ id: "", name: "", unit: "", emoji: "" });
    } catch (error) {
      alert("Failed to update item");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This will also delete all associated prices.")) return;
    
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to delete item");
        return;
      }

      await fetchItems();
    } catch (error) {
      alert("Failed to delete item");
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
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Manage Items</h1>
              <p className="text-sm text-slate-500">Add, edit, or remove grocery items</p>
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
                href="/admin/markets"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Manage Markets
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

        {/* Add New Item Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium mb-4"
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </button>

          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl"
            >
              <input
                type="text"
                placeholder="Name (required)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              >
                <option value="">Select Unit</option>
                <option value="kg">kg (kilogram)</option>
                <option value="gram">gram</option>
                <option value="liter">liter</option>
                <option value="ml">ml (milliliter)</option>
                <option value="piece">piece</option>
                <option value="dozen">dozen</option>
                <option value="pack">pack</option>
                <option value="bottle">bottle</option>
                <option value="can">can</option>
                <option value="bag">bag</option>
                <option value="box">box</option>
              </select>
              <input
                type="text"
                placeholder="Emoji (optional)"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                className="px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />
              <div className="flex gap-2">
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
                    setFormData({ id: "", name: "", unit: "", emoji: "" });
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Items List */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            All Items ({items.length})
          </h2>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={formData.emoji}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      className="w-16 px-3 py-2 rounded-lg border bg-white text-sm text-center focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="🛒"
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-32 px-3 py-2 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    >
                      <option value="">Select Unit</option>
                      <option value="kg">kg (kilogram)</option>
                      <option value="gram">gram</option>
                      <option value="liter">liter</option>
                      <option value="ml">ml (milliliter)</option>
                      <option value="piece">piece</option>
                      <option value="dozen">dozen</option>
                      <option value="pack">pack</option>
                      <option value="bottle">bottle</option>
                      <option value="can">can</option>
                      <option value="bag">bag</option>
                      <option value="box">box</option>
                    </select>
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
                          setFormData({ id: "", name: "", unit: "", emoji: "" });
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-2xl w-12 text-center">{item.emoji || "🛒"}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">per {item.unit}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
