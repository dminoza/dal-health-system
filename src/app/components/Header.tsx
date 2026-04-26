import { useLocation } from 'react-router';
import { ProfileMenu } from './ProfileMenu';

export function Header() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/history':
        return 'History';
      case '/prediction':
        return 'Prediction';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Cagayan de Oro City TB Monitoring</p>
      </div>

      <div className="flex items-center gap-3">
        <ProfileMenu />
      </div>
    </header>
  );
}