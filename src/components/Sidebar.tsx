import { LayoutDashboard, TrendingUp, History, Users, Stethoscope, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const [isPatientsExpanded, setIsPatientsExpanded] = useState(true);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prediction', label: 'Prediction', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
    { 
      id: 'patients', 
      label: 'Patients', 
      icon: Users,
      subItems: [
        { id: 'patients', label: 'Patient Records' },
        { id: 'consultation', label: 'Consultation' },
      ]
    },
    { id: 'health-workers', label: 'Health Workers', icon: Stethoscope },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-blue-600">CDO Health Monitor</h1>
        <p className="text-gray-500 text-sm mt-1">Morbidity Dashboard</p>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = 'subItems' in item;
          const isActive = currentView === item.id || (hasSubItems && item.subItems?.some(sub => sub.id === currentView));
          
          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasSubItems) {
                    setIsPatientsExpanded(!isPatientsExpanded);
                  } else {
                    setCurrentView(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {hasSubItems && (
                  isPatientsExpanded ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {hasSubItems && isPatientsExpanded && (
                <div className="ml-4 mb-2">
                  {item.subItems?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setCurrentView(subItem.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-1 text-sm transition-colors ${
                        currentView === subItem.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Cagayan de Oro City</p>
        <p className="text-xs text-gray-500">Health Department</p>
      </div>
    </div>
  );
}