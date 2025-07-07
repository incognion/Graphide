import React, { useState } from 'react';
import axios from 'axios';
const BACKEND_URL = `https://graphide-backend.onrender.com`;

const NodeManager = ({ nodes, setNodes, edges, setEdges }) => {
  const [nodeInput, setNodeInput] = useState('');
  const [edgeInput, setEdgeInput] = useState({ from: '', to: '' });

  const addNodeHandler = async () => {
    if (nodeInput) {
      const nodeExists = nodes.some(node => node.name === nodeInput);
      if (nodeExists) {
        alert('Node already exists.');
        return;
      }
      await axios.post(`${BACKEND_URL}/nodes`, { name: nodeInput });
      setNodeInput('');
      const nodesRes = await axios.get(`${BACKEND_URL}/nodes`);
      setNodes(nodesRes.data);
    }
  };

  const removeNode = async (node) => {
    await axios.delete(`${BACKEND_URL}/nodes/${node}`);
    const nodesRes = await axios.get(`${BACKEND_URL}/nodes`);
    const edgesRes = await axios.get(`${BACKEND_URL}/edges`);
    setNodes(nodesRes.data);
    setEdges(edgesRes.data);
  };

  const removeNodeHandler = (node) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete node "${node}"?`);
    if (confirmDelete) {
      removeNode(node);
    }
  };

  const addEdgeHandler = async () => {
    // Check if both from and to are selected
    if (!edgeInput.from || !edgeInput.to) {
      alert('Please select both source and destination nodes.');
      return;
    }

    // NEW VALIDATION: Check if from and to nodes are the same
    if (edgeInput.from === edgeInput.to) {
      alert('Cannot create an edge from a node to itself. Please select different nodes.');
      return;
    }

    // Check if edge already exists
    const edgeExists = edges.some(edge => 
      edge.from === edgeInput.from && edge.to === edgeInput.to
    );
    if (edgeExists) {
      alert('This edge already exists.');
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/edges`, edgeInput);
      setEdgeInput({ from: '', to: '' });
      const edgesRes = await axios.get(`${BACKEND_URL}/edges`);
      setEdges(edgesRes.data);
    } catch (error) {
      alert('Error adding edge. Please try again.');
    }
  };

  const removeEdge = async (from, to) => {
    await axios.delete(`${BACKEND_URL}/edges/${from}/${to}`);
    const edgesRes = await axios.get(`${BACKEND_URL}/edges`);
    setEdges(edgesRes.data);
  };

  const removeEdgeHandler = (from, to) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete edge from "${from}" to "${to}"?`);
    if (confirmDelete) {
      removeEdge(from, to);
    }
  };

  return (
    <div>
      <h3>Add Node</h3>
      <input
        type="text"
        placeholder="Node name"
        value={nodeInput}
        onChange={(e) => setNodeInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addNodeHandler()}
      />
      <button onClick={addNodeHandler}>Add Node</button>

      <h3>Add Edge</h3>
      <select
        value={edgeInput.from}
        onChange={(e) => setEdgeInput({ ...edgeInput, from: e.target.value })}
      >
        <option value="">From</option>
        {nodes.map(node => (
          <option key={node.name} value={node.name}>{node.name}</option>
        ))}
      </select>
      <select
        value={edgeInput.to}
        onChange={(e) => setEdgeInput({ ...edgeInput, to: e.target.value })}
      >
        <option value="">To</option>
        {nodes.map(node => (
          <option key={node.name} value={node.name}>{node.name}</option>
        ))}
      </select>
      <button onClick={addEdgeHandler}>Add Edge</button>

      <h3>Nodes ({nodes.length})</h3>
      <div className="chip-container">
        {nodes.map(node => (
          <div key={node.name} className="chip node-chip">
            <span className="chip-text">{node.name}</span>
            <span 
              className="chip-close" 
              onClick={() => removeNodeHandler(node.name)}
              title="Remove node"
            >
              ×
            </span>
          </div>
        ))}
      </div>

      <h3>Edges ({edges.length})</h3>
      <div className="chip-container">
        {edges.map((edge, index) => (
          <div key={index} className="chip edge-chip">
            <span className="chip-text">{edge.from} → {edge.to}</span>
            <span 
              className="chip-close" 
              onClick={() => removeEdgeHandler(edge.from, edge.to)}
              title="Remove edge"
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeManager;
