import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  Clock, 
  Bell, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const roleName = user?.role?.name || 'Salesman';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Sales Admin', 'Salesman', 'Warehouse Staff', 'Accounts Manager', 'Compliance Admin'] },
    { name: 'Due Customers AI', path: '/due-customers', icon: Sparkles, roles: ['Admin', 'Sales Admin', 'Salesman'], highlight: true },
    { name: 'Customers', path: '/customers', icon: Users, roles: ['Admin', 'Sales Admin', 'Salesman'] },
    { name: 'Products Catalog', path: '/products', icon: Package, roles: ['Admin', 'Warehouse Staff', 'Compliance Admin', 'Sales Admin', 'Salesman'] },
    { name: 'Orders Manager', path: '/orders', icon: ShoppingBag, roles: ['Admin', 'Sales Admin', 'Salesman', 'Warehouse Staff', 'Accounts Manager'] },
    { name: 'Reminder Rules', path: '/reminder-rules', icon: Clock, roles: ['Admin', 'Sales Admin'] },
    { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['Admin', 'Sales Admin', 'Salesman', 'Warehouse Staff', 'Accounts Manager', 'Compliance Admin'] },
    { name: 'Reports & Insights', path: '/reports', icon: BarChart3, roles: ['Admin', 'Sales Admin', 'Accounts Manager', 'Compliance Admin'] },
    { name: 'Settings & Admin', path: '/settings', icon: Settings, roles: ['Admin', 'Compliance Admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(roleName) || roleName === 'Admin');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-between shadow-xl lg:shadow-none`}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25">
              GM
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight leading-none">
                Ganga Maxx
              </h1>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">Reorder Engine v1.0</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold' 
                      : item.highlight
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${item.highlight ? 'text-amber-500' : ''}`} />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-black tracking-wider bg-amber-500 text-slate-950 rounded-md uppercase">
                      AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Role Footer Badge */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Role</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{roleName}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
