import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Clock, Plus, Sliders, Check, Power } from 'lucide-react';

const ReminderRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = () => {
    setLoading(true);
    API.get('/reminder-rules')
      .then(res => setRules(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggle = async (id) => {
    try {
      await API.patch(`/reminder-rules/${id}/toggle`);
      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Clock className="w-7 h-7 text-amber-500" /> Automated Reminder Rules Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure intervals, buffer days before/after due date, priority levels, and default dispatch channels.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <div key={rule.id} className={`glass-card p-6 rounded-3xl space-y-4 ${rule.isActive ? 'border-l-4 border-l-emerald-500' : 'opacity-60 border-l-4 border-l-slate-400'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{rule.name}</h3>
                <button
                  onClick={() => handleToggle(rule.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                    rule.isActive ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" /> {rule.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-2xl">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Interval Cycle</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{rule.intervalType} ({rule.intervalDays} Days)</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Priority Level</span>
                  <p className="font-bold text-amber-500">{rule.priorityLevel}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Pre-Due Buffer</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{rule.reminderBefore} Days Before</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Post-Due Escalation</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{rule.reminderAfter} Days After</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderRules;
