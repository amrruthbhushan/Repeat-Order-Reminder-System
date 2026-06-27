import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Users, Plus, Search, Building2, Mail, Phone, MapPin, Calendar, CheckCircle2, X, ChevronRight, ShoppingBag } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    institutionName: '',
    contactPerson: '',
    phone: '',
    email: '',
    location: 'Delhi NCR',
    customerType: 'Hospital',
    preferredReminderMethod: 'WhatsApp'
  });

  const fetchCustomers = () => {
    setLoading(true);
    API.get('/customers', { params: { search } })
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/customers', formData);
      setShowAddModal(false);
      setFormData({
        institutionName: '',
        contactPerson: '',
        phone: '',
        email: '',
        location: 'Delhi NCR',
        customerType: 'Hospital',
        preferredReminderMethod: 'WhatsApp'
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" /> B2B Institutional Clients
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Manage corporate contracts, contacts, and replenishment preferences.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" /> Add New B2B Client
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={fetchCustomers}
          placeholder="Search by hospital, hotel name, location or contact..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="h-64 bg-slate-200 dark:bg-slate-800/80 rounded-3xl animate-pulse" />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 tracking-wider">
                <tr>
                  <th className="p-4.5">Institution</th>
                  <th className="p-4.5">Contact Person</th>
                  <th className="p-4.5">Type</th>
                  <th className="p-4.5">Location</th>
                  <th className="p-4.5">Reminder Channel</th>
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors font-medium">
                    <td className="p-4.5 font-bold text-slate-900 dark:text-white text-sm flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/60 dark:border-blue-800/60">
                        <Building2 className="w-4.5 h-4.5" />
                      </div>
                      {c.institutionName}
                    </td>
                    <td className="p-4.5">
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{c.contactPerson}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{c.phone}</p>
                    </td>
                    <td className="p-4.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {c.customerType}
                      </span>
                    </td>
                    <td className="p-4.5 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location}</span>
                    </td>
                    <td className="p-4.5">
                      <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        c.preferredReminderMethod === 'WhatsApp' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                      }`}>
                        {c.preferredReminderMethod}
                      </span>
                    </td>
                    <td className="p-4.5 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 ml-auto"
                      >
                        Profile <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Profile Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 h-full overflow-y-auto shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="text-lg font-black tracking-tight">Institutional Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Institution</span>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{selectedCustomer.institutionName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Contact Person</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{selectedCustomer.contactPerson}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Phone</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{selectedCustomer.phone}</p>
                </div>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Contract Period</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 text-xs">
                  {new Date(selectedCustomer.contractStart).toLocaleDateString()} to {new Date(selectedCustomer.contractEnd).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4 text-blue-500" /> Recent Orders History
                </h4>
                {selectedCustomer.orders?.length === 0 ? (
                  <p className="text-slate-500">No previous orders recorded.</p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedCustomer.orders?.map((ord) => (
                      <div key={ord.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{ord.orderNumber}</p>
                          <p className="text-[10px] text-slate-500">{new Date(ord.orderDate).toLocaleDateString()}</p>
                        </div>
                        <span className="font-black text-blue-600 dark:text-blue-400 text-xs">₹{ord.totalAmount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="text-lg font-black tracking-tight">Register New B2B Client</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="e.g. Apollo Multi-Specialty Hospital"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                    placeholder="Procurement Head Name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                    placeholder="+91 98765 00000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                    placeholder="procurement@client.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Institution Type</label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Hospital">Hospital</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Corporate">Corporate</option>
                    <option value="School">School</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
