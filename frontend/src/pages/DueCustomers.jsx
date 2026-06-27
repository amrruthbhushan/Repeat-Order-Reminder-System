import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Send, 
  MessageSquare, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Building2, 
  Bot
} from 'lucide-react';

const DueCustomers = () => {
  const [dueCustomers, setDueCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messagePreview, setMessagePreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');

  const fetchDueCustomers = () => {
    setLoading(true);
    API.get('/due-customers', { params: { search, priority } })
      .then((res) => setDueCustomers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDueCustomers();
  }, [priority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDueCustomers();
  };

  const handleOpenReminderModal = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const res = await API.post('/reminders/generate', { customerId: customer.id });
      setMessagePreview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReminder = async () => {
    if (!selectedCustomer || !messagePreview) return;
    setSending(true);
    try {
      await API.post('/reminders/send', {
        customerId: selectedCustomer.id,
        method: messagePreview.method,
        message: messagePreview.message
      });
      setToast(`Reminder successfully dispatched to ${selectedCustomer.institutionName}!`);
      setSelectedCustomer(null);
      setMessagePreview(null);
      fetchDueCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      setTimeout(() => setToast(''), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <Sparkles className="w-7 h-7 text-amber-500 animate-pulse" /> AI Due Orders Action Center
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
            Predictive consumption models for B2B institutional clients. One-click WhatsApp & Email reorder outreach.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
            <Filter className="w-4 h-4 text-blue-500" /> Priority:
            {['All', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  priority === p
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter due clients by hospital, hotel name, contact person or email..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
        >
          Search Queue
        </button>
      </form>

      {/* Due Customers Card Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
      ) : dueCustomers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Queue Clear!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No due orders matching your criteria right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dueCustomers.map((cust) => {
            const isOverdue = cust.daysRemaining <= 0;
            return (
              <motion.div
                key={cust.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-250 ${
                  isOverdue ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                      {cust.customerType}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                      isOverdue 
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 animate-pulse' 
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {cust.riskLevel}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                    <Building2 className="w-4.5 h-4.5 text-blue-500 shrink-0" /> {cust.institutionName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Contact: <span className="font-bold text-slate-800 dark:text-slate-200">{cust.contactPerson}</span> ({cust.phone})
                  </p>

                  {/* AI Recommendation Summary Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                      <Bot className="w-4 h-4" /> AI Predictive Forecast
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] font-medium">
                      "{cust.aiSummary}"
                    </p>
                  </div>

                  {/* Suggested Products Pill List */}
                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Likely Reorder Items:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cust.suggestedProducts.map((p, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200/60 dark:border-blue-800/60">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Last Action</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                      {cust.lastReminderStatus}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenReminderModal(cust)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 shrink-0 transition-all"
                  >
                    {cust.preferredReminderMethod === 'WhatsApp' ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    Send {cust.preferredReminderMethod}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedCustomer && messagePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative"
            >
              <button
                onClick={() => { setSelectedCustomer(null); setMessagePreview(null); }}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold ${
                  messagePreview.method === 'WhatsApp' ? 'bg-emerald-600' : 'bg-blue-600'
                }`}>
                  {messagePreview.method === 'WhatsApp' ? <MessageSquare className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Dispatch {messagePreview.method} Reminder</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Recipient: {selectedCustomer.contactPerson} ({selectedCustomer.phone})</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-6">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-blue-500" /> Generated Message Preview:
                </p>
                <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-mono bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  {messagePreview.message}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setSelectedCustomer(null); setMessagePreview(null); }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendReminder}
                  disabled={sending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                >
                  {sending ? 'Dispatching...' : <><Send className="w-4 h-4" /> Confirm & Dispatch Now</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DueCustomers;
