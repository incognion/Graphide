import React from 'react';
import { Menu, Home, Plus, GitBranch, RotateCcw, Target } from 'lucide-react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const iconMap = {
    'graph': <Home size={18} />,
    'manage': <Plus size={18} />,
    'shortest-path': <Target size={18} />,
    'topo-sort': <GitBranch size={18} />,
    'find-cycles': <RotateCcw size={18} />,
    'default': <Menu size={18} />
  };

  return (
    <nav className="tabs" role="tablist" aria-label="Graph management tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
          role="tab"
          aria-selected={activeTab === tab.key}
          aria-controls={`panel-${tab.key}`}
          tabIndex={activeTab === tab.key ? 0 : -1}
        >
          <span className="tab-icon" aria-hidden="true">
            {iconMap[tab.key] || iconMap.default}
          </span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;