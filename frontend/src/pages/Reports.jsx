import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { BarChart3, Download, TrendingUp, Users, CheckCircle2, FileText } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    API.get('/reports')
      .then(res => setReports(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8,Month,Total Orders,Total Revenue (INR),Repeat Orders\nJan 2026,42,512000,35\nFeb 2026,48,590000,40\nMar 2026,56,680000,49\nApr 2026,62,740000,54\nMay 2026,70,850000,62\nJun 2026,78,960000,71";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "GangaMaxx_RepeatOrders_Report_2026.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-indigo-500" /> Executive Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sales team conversion rates, monthly repeat order revenue growth, and export tools.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" /> {exporting ? 'Generating CSV...' : 'Export CSV Report'}
        </button>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Repeat Order Revenue</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{reports?.summary?.totalRepeatRevenue}</h3>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Automated Success Rate</span>
              <h3 className="text-2xl font-black text-teal-500 mt-1">{reports?.summary?.overallSuccessRate}</h3>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Contracted Clients</span>
              <h3 className="text-2xl font-black text-blue-500 mt-1">{reports?.summary?.activeContractClients}</h3>
            </div>
          </div>

          {/* Salesman Performance Table */}
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sales Team Reorder Conversion</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-bold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="p-3">Sales Representative</th>
                    <th className="p-3">Completed Followups</th>
                    <th className="p-3">Converted Orders</th>
                    <th className="p-3">Revenue Generated</th>
                    <th className="p-3">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {reports?.salesmanPerformance?.map((sp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{sp.salesman}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{sp.completedFollowups}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{sp.convertedOrders}</td>
                      <td className="p-3 font-bold text-teal-500">₹{sp.revenueGenerated.toLocaleString()}</td>
                      <td className="p-3 font-bold text-blue-600">{sp.successRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
