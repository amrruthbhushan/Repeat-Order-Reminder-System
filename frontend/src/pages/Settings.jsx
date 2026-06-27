import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Settings as SettingsIcon, MessageSquare, Shield, Building, Save, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    API.get('/settings')
      .then(res => setSettings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key, value) => {
    try {
      await API.post('/settings', { key, value });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {savedToast && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Settings updated successfully!
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-blue-600" /> System Settings & Messaging Templates
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure company profiles, WhatsApp gateway keys, and dynamic message tags.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
      ) : (
        <div className="space-y-6 max-w-3xl">
          {/* Company Config */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" /> Enterprise Organization Profile
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Marketplace Entity Name</label>
                <input
                  type="text"
                  defaultValue={settings.company_name || 'Ganga Maxx Marketplace B2B Solutions'}
                  onBlur={(e) => handleSave('company_name', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Template Customizer */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> WhatsApp Automated Template Blueprint
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Dynamic Message Template</label>
                <textarea
                  rows="4"
                  defaultValue={settings.whatsapp_template || 'Dear {{contactPerson}}, this is {{salesmanName}} from Ganga Maxx Marketplace. Based on your usage cycle, your stock of {{suggestedProducts}} for {{institutionName}} may be running low. Reply YES to auto-generate PO.'}
                  onBlur={(e) => handleSave('whatsapp_template', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400">Supported variables: <code>{'{{contactPerson}}'}</code>, <code>{'{{salesmanName}}'}</code>, <code>{'{{institutionName}}'}</code>, <code>{'{{suggestedProducts}}'}</code></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
