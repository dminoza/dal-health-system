import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Prediction } from './components/Prediction';
import { History } from './components/History';
import { Patients } from './components/Patients';
import { Consultation } from './components/Consultation';
import { HealthWorkers } from './components/HealthWorkers';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'prediction':
        return <Prediction />;
      case 'history':
        return <History />;
      case 'patients':
        return <Patients />;
      case 'consultation':
        return <Consultation />;
      case 'health-workers':
        return <HealthWorkers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}