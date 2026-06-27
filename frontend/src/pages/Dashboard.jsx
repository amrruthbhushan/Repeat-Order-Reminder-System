import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  Plus, 
  Sparkles, 
  ChevronRight,
  MessageSquare,
  Cpu,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, charts, latestActivities } = data || {};

  const statCards = [
    { title: 'Total B2B Clients', value: stats?.totalCustomers || 0, change: '+12% this month', icon: Users, color: 'from-blue-600 to-blue-500' },
    { title: 'Active Contracts', value: stats?.activeCustomers || 0, change: '100% active', icon: CheckCircle2, color: 'from-teal-600 to-teal-500' },
    { title: 'Due Orders Today', value: stats?.dueOrdersToday || 0, change: 'Action required', icon: AlertTriangle, color: 'from-amber-500 to-red-500', highlight: true },
    { title: 'Upcoming (Next 7 Days)', value: stats?.upcomingOrders || 0, change: 'Automated queue', icon: Clock, color: 'from-purple-600 to-indigo-500' },
    { title: 'Completed Reminders', value: stats?.completedReminders || 0, change: '88% conversion', icon: Send, color: 'from-emerald-600 to-teal-500' },
    { title: 'Monthly Revenue', value: `₹${(stats?.monthlyRevenue || 0).toLocaleString()}`, change: '+18.5% YoY', icon: IndianRupee, color: 'from-blue-700 to-indigo-600' },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Top Banner & Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-teal-900 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Ganga Maxx AI Consumption Engine Active
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">Welcome back, Sales Operations Hub</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              You have <span className="font-bold text-amber-400">{stats?.dueOrdersToday || 0} institutional clients</span> due for repeat orders today based on predictive consumption cycles.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/due-customers"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> View AI Due Queue
            </Link>
            <Link
              to="/orders"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create New Order
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card p-5 rounded-2xl relative overflow-hidden ${card.highlight ? 'ring-2 ring-amber-500/50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </div>
              <p className={`text-[11px] font-semibold mt-1 ${card.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {card.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Orders Curve */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Monthly Reorder Revenue Curve
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total institutional orders and revenue trend in 2026</p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold">
              INR (₹)
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthlyOrdersChart || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reminder Success Rate Pie */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Reminder Success Rate
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Conversion outcome of automated follow-ups</p>
            
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.reminderSuccessRate || []}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(charts?.reminderSuccessRate || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            {(charts?.reminderSuccessRate || []).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Selling Products & Live Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-teal-500" /> Top Reordered Products
            </h2>
            <Link to="/products" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All Catalog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {(charts?.topSellingProducts || []).map((prod, idx) => (
              <div key={prod.name} className="p-3.5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>{prod.name}</span>
                  <span className="text-teal-600 dark:text-teal-400">₹{prod.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-teal-400 h-full rounded-full" 
                    style={{ width: `${(prod.sales / 450) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">{prod.sales} units reordered this month</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Timeline */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" /> Live Automation Timeline
            </h2>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Realtime Sync
            </span>
          </div>
          <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {(latestActivities || []).map((act) => {
              let IconComp = MessageSquare;
              if (act.icon === 'ShoppingBag') IconComp = ShoppingBag;
              if (act.icon === 'Cpu') IconComp = Cpu;
              if (act.icon === 'UserPlus') IconComp = UserPlus;

              return (
                <div key={act.id} className="relative pl-12 flex flex-col">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 z-10 shadow-sm">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</h4>
                    <span className="text-[11px] text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{act.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
