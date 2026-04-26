import { LayoutDashboard, TrendingUp, History } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Prediction', icon: TrendingUp, path: '/prediction' },
  { name: 'History', icon: History, path: '/history' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">CDO TB Health Monitor</h1>
        <p className="text-xs text-gray-500 mt-1">Tuberculosis Monitoring</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}