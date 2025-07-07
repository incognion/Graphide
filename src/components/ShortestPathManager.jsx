
import React, { useState } from 'react';
import { Graph } from 'graphlib';
import PriorityQueue from '../utils/PriorityQueue';

const ShortestPathManager = ({ nodes, edges }) => {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [path, setPath] = useState([]);

  const findPath = () => {
    if (!source || !target) {
      alert('Please select both source and target');
      return;
    }

    const g = new Graph();
    nodes.forEach(node => g.setNode(node.name));
    edges.forEach(edge => g.setEdge(edge.from, edge.to));

    if (!g.hasNode(source) || !g.hasNode(target)) {
      alert('Invalid nodes selected');
      return;
    }

    const distances = {};
    const previous = {};
    const queue = new PriorityQueue();

    nodes.forEach(node => {
      distances[node.name] = Infinity;
      previous[node.name] = null;
    });

    distances[source] = 0;
    queue.enqueue(source, 0);

    while (!queue.isEmpty()) {
      const current = queue.dequeue().element;

      if (current === target) {
        const result = [];
        let temp = current;
        while (temp) {
          result.push(temp);
          temp = previous[temp];
        }
        setPath(result.reverse());
        return;
      }

      const neighbors = g.neighbors(current) || [];
      neighbors.forEach(neighbor => {
        const alt = distances[current] + 1;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
          queue.enqueue(neighbor, alt);
        }
      });
    }

    alert('No path found');
    setPath([]);
  };

  return (
    <div>
      <h3>Find Shortest Path</h3>

      <select value={source} onChange={(e) => setSource(e.target.value)}>
        <option value="">Select source</option>
        {nodes.map(node => (
          <option key={node.name} value={node.name}>{node.name}</option>
        ))}
      </select>

      <select value={target} onChange={(e) => setTarget(e.target.value)}>
        <option value="">Select target</option>
        {nodes.map(node => (
          <option key={node.name} value={node.name}>{node.name}</option>
        ))}
      </select>

      <button onClick={findPath}>Find Path</button>

      {path.length > 0 && (
        <div className="result">
          <h4>Shortest Path:</h4>
          <div className="path">
            {path.map((node, index) => (
              <React.Fragment key={node}>
                <span className="path-node">{node}</span>
                {index < path.length - 1 && <span className="path-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p>Path length: {path.length - 1} edges</p>
        </div>
      )}
    </div>
  );
};

export default ShortestPathManager;
