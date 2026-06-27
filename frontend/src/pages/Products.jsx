import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Package, Plus, Search, AlertTriangle, ShieldCheck, Warehouse, Tag } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <Package className="w-7 h-7 text-blue-600 dark:text-blue-400" /> Cleaning & Hygiene Catalog
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
            Institutional products, safety compliance specs, and warehouse inventory balance.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product by title or SKU..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800/80 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock <= p.minStock;
            return (
              <div 
                key={p.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-250 flex flex-col justify-between"
              >
                <div>
                  {/* Category & SKU Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[11px] font-bold tracking-wide border border-blue-200/60 dark:border-blue-800/60">
                      {p.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      SKU: {p.sku}
                    </span>
                  </div>

                  {/* Product Title - Ultra High Contrast */}
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                    {p.name}
                  </h3>

                  {/* Price */}
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-2">
                    ₹{p.price.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ unit</span>
                  </p>

                  {/* Warehouse Location & Stock Level Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Warehouse className="w-3.5 h-3.5 text-blue-500" /> {p.warehouse}
                      </span>
                      <span className={`font-black px-2 py-0.5 rounded-md ${
                        isLowStock 
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {p.stock} units
                      </span>
                    </div>
                    {isLowStock && (
                      <div className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Below Safety Buffer ({p.minStock})
                      </div>
                    )}
                  </div>

                  {/* Safety Information Compliance Pill */}
                  {p.safetyInfo && (
                    <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2.5 leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 dark:text-amber-200">Compliance Spec:</span> {p.safetyInfo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
