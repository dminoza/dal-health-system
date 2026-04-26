import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronDown, User, BadgeCheck } from 'lucide-react';

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">{user.avatar}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-800 leading-tight">{user.name}</p>
          <p className="text-xs text-gray-500 leading-tight">{user.role}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {/* Profile info */}
          <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{user.avatar}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <BadgeCheck className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={() => { setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">View Profile</span>
            </button>

            <div className="my-1 border-t border-gray-100" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-left group"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
