import React, { useState } from "react";
import { Graph } from "graphlib";

const CycleManager = ({ nodes, edges }) => {
  const [cycles, setCycles] = useState([]);

  const detectCycles = () => {
    const g = new Graph();
    nodes.forEach((node) => g.setNode(node.name));
    edges.forEach((edge) => g.setEdge(edge.from, edge.to));

    const visited = new Set();
    const foundCycles = [];
    const stack = [];

    const dfs = (node, parent) => {
      if (stack.includes(node)) {
        const cycleStart = stack.indexOf(node);
        foundCycles.push(stack.slice(cycleStart));
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      stack.push(node);

      const neighbors = g.neighbors(node) || [];
      neighbors.forEach((neighbor) => {
        if (neighbor !== parent) {
          dfs(neighbor, node);
        }
      });

      stack.pop();
    };

    nodes.forEach((node) => {
      if (!visited.has(node.name)) {
        dfs(node.name, null);
      }
    });

    if (foundCycles.length === 0) {
      alert("No cycles found in the graph");
    }

    setCycles(foundCycles);
  };

  return (
    <div>
      <div className="cycle-title">
        <h3>Cycle Detection</h3>
        <button onClick={detectCycles}>Find Cycles</button>
      </div>

      {cycles.length > 0 && (
        <div className="result">
          <h4>Found {cycles.length} cycle(s):</h4>
          {cycles.map((cycle, index) => (
            <div key={index} style={{ marginUp: "10px" }}>
              <h5>Cycle {index + 1}:</h5>
              <div className="path">
                {cycle.map((node, nodeIndex) => (
                  <React.Fragment key={node}>
                    <span className="path-node">{node}</span>
                    {nodeIndex < cycle.length - 1 && (
                      <span className="path-arrow">→</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="path-arrow">→</span>
                <span className="path-node">{cycle[0]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CycleManager;
