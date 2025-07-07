import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';
import { DataSet } from 'vis-data';

const GraphVisualizer = ({ nodes, edges }) => {
  const networkRef = useRef(null);
  const visNetworkRef = useRef(null);

  useEffect(() => {
    if (networkRef.current && nodes.length) {
      const nodesData = new DataSet(
        nodes.map(node => ({
          id: node.name,
          label: node.name,
          color: '#4a90e2',
        }))
      );

      const edgesData = new DataSet(
        edges.map(edge => ({
          from: edge.from,
          to: edge.to,
          arrows: 'to',
        }))
      );

      const data = { nodes: nodesData, edges: edgesData };
      const options = {
        nodes: {
          shape: 'circle',
          size: 24,
          font: { size: 16, color: 'white'},
        },
        edges: { color: '#666', width: 2 },
        // physics: { stabilization: { iterations: 400 } },
      };

      visNetworkRef.current = new Network(networkRef.current, data, options);
    }
  }, [nodes, edges]);

  // Export graph as PNG
  const handleExportPNG = () => {
    if (!visNetworkRef.current) {
      alert('No graph to export. Please add some nodes first.');
      return;
    }

    try {
      // Show alert immediately
      alert('Your download of graph.png has started.');

      const canvas = visNetworkRef.current.canvas.frame.canvas;
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'graph.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to start PNG download. Please try again.');
    }
  };

  // Export graph data as JSON
  const handleExportJSON = () => {
    if (nodes.length === 0) {
      alert('No data to export. Please add some nodes first.');
      return;
    }

    try {
      // Show alert immediately
      alert('Your download of graph_data.json has started.');

      // Clean nodes and edges
      const cleanedNodes = nodes.map(node => node.name);
      const cleanedEdges = edges.map(edge => ({
        from: edge.from,
        to: edge.to,
      }));

      const graphData = {
        nodes: cleanedNodes,
        edges: cleanedEdges,
        exportDate: new Date().toISOString(),
        version: '1.0',
      };

      const jsonString = JSON.stringify(graphData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'graph_data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Failed to start JSON download. Please try again.');
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="graph-empty-state">
        <h3>No nodes to display</h3>
        <p>Add some nodes in the Manage tab to see your graph</p>
      </div>
    );
  }

  return (
    <div className="graph-visualizer">
      <div ref={networkRef} className="graph" />
      <div className="export-controls">
        <button className="export-btn" onClick={handleExportPNG}>
          Export as PNG
        </button>
        <button className="export-btn" onClick={handleExportJSON}>
          Export as JSON
        </button>
      </div>
    </div>
  );
};

export default GraphVisualizer;
