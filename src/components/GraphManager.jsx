
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NodeManager from './NodeManager';
import GraphVisualizer from './GraphVisualizer';
import ShortestPathManager from './ShortestPathManager';
import TopoSortManager from './TopoSortManager';
import CycleManager from './CycleManager';
import LoadManager from './LoadManager';

const GraphManager = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('graph');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nodesRes = await axios.get('https://graphide-backend.onrender.com/nodes');
        const edgesRes = await axios.get('https://graphide-backend.onrender.com/edges');
        setNodes(nodesRes.data);
        setEdges(edgesRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: 'graph', name: 'Graph' },
    { id: 'manage', name: 'Manage' },
    { id: 'shortest', name: 'Shortest Path' },
    { id: 'topo', name: 'Topo Sort' },
    { id: 'cycles', name: 'Find Cycles' }
  ];

  if (loading) return <LoadManager />;

  return (
    <div>
      <h1>Graphide</h1>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'graph' && (
          <GraphVisualizer nodes={nodes} edges={edges} />
        )}
        {activeTab === 'manage' && (
          <NodeManager 
            nodes={nodes} 
            setNodes={setNodes} 
            edges={edges} 
            setEdges={setEdges} 
          />
        )}
        {activeTab === 'shortest' && (
          <ShortestPathManager nodes={nodes} edges={edges} />
        )}
        {activeTab === 'topo' && (
          <TopoSortManager nodes={nodes} edges={edges} />
        )}
        {activeTab === 'cycles' && (
          <CycleManager nodes={nodes} edges={edges} />
        )}
      </div>
    </div>
  );
};

export default GraphManager;
