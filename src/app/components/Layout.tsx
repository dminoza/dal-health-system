import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="size-full flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}