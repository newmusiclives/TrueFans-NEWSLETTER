import React from 'react';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CogIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  ShieldCheckIcon,
  SpeakerWaveIcon 
} from './Icons';

const Navigation = ({ activeTab, setActiveTab }) => (
  <nav className="bg-white shadow-sm border-r border-gray-200 w-64 flex flex-col">
    <div className="p-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <SpeakerWaveIcon className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">TrueFans</h1>
          <p className="text-sm text-gray-500">Newsletter Platform</p>
        </div>
      </div>
    </div>

    <div className="flex-1 px-4 space-y-2">
      {[
        { id: 'home', label: 'Home', icon: HomeIcon },
        { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
        { id: 'newsletters', label: 'Newsletters', icon: DocumentTextIcon },
        { id: 'automation', label: 'Automation', icon: CogIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
        { id: 'artists', label: 'Artist Intel', icon: UserGroupIcon },
        { id: 'discovery', label: 'Discovery', icon: MagnifyingGlassIcon },
        { id: 'admin', label: 'Admin Portal', icon: ShieldCheckIcon }
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === item.id
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <item.icon />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default Navigation;
