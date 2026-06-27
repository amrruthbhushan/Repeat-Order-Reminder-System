import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { ShoppingBag, Plus, Search, Calendar, Building2, CheckCircle2, X, Trash2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1, price: 0 }]);

  const fetchOrders = () => {
    setLoading(true);
    API.get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    API.get('/customers').then(r => setCustomers(r.data));
    API.get('/products').then(r => setProducts(r.data));
  }, []);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, prodId) => {
    const prod = products.find(p => p.id === prodId);
    const updated = [...orderItems];
    updated[index].productId = prodId;
    updated[index].price = prod ? prod.price : 0;
    setOrderItems(updated);
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...orderItems];
    updated[index].quantity = Math.max(1, parseInt(qty) || 1);
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || orderItems.some(i => !i.productId)) return;
    try {
      await API.post('/orders', {
        customerId: selectedCustomer,
        items: orderItems
      });
      setShowModal(false);
      setSelectedCustomer('');
      setOrderItems([{ productId: '', quantity: 1, price: 0 }]);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <ShoppingBag className="w-7 h-7 text-blue-600 dark:text-blue-400" /> B2B Purchase Orders
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
            Track institutional purchase orders, delivery statuses, and contract dispatches.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Generate Purchase Order
        </button>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 tracking-wider">
                <tr>
                  <th className="p-4.5">Order PO #</th>
                  <th className="p-4.5">Customer Institution</th>
                  <th className="p-4.5">Date</th>
                  <th className="p-4.5">Total Amount</th>
                  <th className="p-4.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors font-medium">
                    <td className="p-4.5 font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{o.orderNumber}</td>
                    <td className="p-4.5 font-bold text-slate-900 dark:text-white text-sm">{o.customer?.institutionName}</td>
                    <td className="p-4.5 text-slate-600 dark:text-slate-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                    <td className="p-4.5 font-black text-slate-900 dark:text-white text-sm">₹{o.totalAmount.toLocaleString()}</td>
                    <td className="p-4.5">
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs inline-flex items-center gap-1.5 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="text-lg font-black tracking-tight">New Institutional Purchase Order</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">Select B2B Client</label>
                <select
                  required
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Institutional Client --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.institutionName} ({c.customerType})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">Order Line Items</label>
                  <button type="button" onClick={handleAddItem} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Product Line
                  </button>
                </div>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <select
                        required
                        value={item.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-xs"
                      >
                        <option value="">-- Select Product --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(idx, e.target.value)}
                        className="w-20 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs text-center"
                      />

                      <span className="w-24 text-right font-black text-blue-600 dark:text-blue-400 text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>

                      {orderItems.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItem(idx)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">Estimated Total PO:</span>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{calculateTotal().toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25">Confirm & Issue Order</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
