import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Bell className="w-7 h-7 text-blue-600" /> System Notifications & Alerts
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time alerts regarding overdue customer accounts and automated dispatches.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            let IconComp = Info;
            let color = 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            if (n.type === 'urgent') {
              IconComp = AlertTriangle;
              color = 'text-red-500 bg-red-500/10 border-red-500/20';
            } else if (n.type === 'success') {
              IconComp = CheckCircle2;
              color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            }

            return (
              <div key={n.id} className={`glass-card p-4 rounded-2xl flex items-start gap-4 border ${color}`}>
                <div className="p-2 rounded-xl bg-slate-900 text-white shrink-0 mt-0.5">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    <span className="text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
