import React, { useState } from "react";
import { Graph } from "graphlib";

const TopoSortManager = ({ nodes, edges }) => {
  const [sortResult, setSortResult] = useState([]);

  const performSort = () => {
    const g = new Graph();
    nodes.forEach((node) => g.setNode(node.name));
    edges.forEach((edge) => g.setEdge(edge.from, edge.to));

    const visited = new Set();
    const stack = [];

    const dfs = (node) => {
      if (visited.has(node)) return;
      visited.add(node);

      const neighbors = g.neighbors(node) || [];
      neighbors.forEach((neighbor) => dfs(neighbor));

      stack.push(node);
    };

    nodes.forEach((node) => {
      if (!visited.has(node.name)) {
        dfs(node.name);
      }
    });

    setSortResult(stack.reverse());
  };

  return (
    <div>
      <div className="topo-title">
        <h3>Topological Sort</h3>
        <button onClick={performSort}>Sort Nodes</button>
      </div>

      {sortResult.length > 0 && (
        <div className="result">
          <h4>Topological Order:</h4>
          <div className="path">
            {sortResult.map((node, index) => (
              <React.Fragment key={node}>
                <span className="path-node">{node}</span>
                {index < sortResult.length - 1 && (
                  <span className="path-arrow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopoSortManager;
