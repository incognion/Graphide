import React, { useState } from 'react'
import { Graph } from 'graphlib';

const CycleManager = ({ nodes, edges }) => {
    const [cycles, setCycles] = useState([]);

    const detectCycleHandler = () => {
        const g = new Graph();
        nodes.forEach(node => g.setNode(node.name));
        edges.forEach(edge => g.setEdge(edge.from, edge.to));

        const visited = new Set();
        const foundCycles = [];
        const stack = [];

        const hasCycleDFS = (node, parent) => {
            if (stack.includes(node)) {
                const cycleStartIndex = stack.indexOf(node);
                foundCycles.push(stack.slice(cycleStartIndex));
                return;
            }

            if (visited.has(node)) return;

            visited.add(node);
            stack.push(node);

            const neighbors = g.neighbors(node);
            for (const neighbor of neighbors) {
                if (neighbor !== parent) {
                    hasCycleDFS(neighbor, node);
                }
            }

            stack.pop();
        };

        nodes.forEach(node => {
            if (!visited.has(node.name)) {
                hasCycleDFS(node.name, null);
            }
        });

        setCycles(foundCycles);
    };

    return (
        <div className="cycles-container">
            <h3>Cycles</h3>

            <button onClick={detectCycleHandler}>Check</button>

            {cycles.length > 0 ? (
                <div className='cycles'>
                    <ul>
                        {cycles.map((cycle, index) => (
                            <li key={index}>
                                {Array.isArray(cycle) ? (
                                    <div className="cycle">
                                        {cycle.map((node, index) => (
                                            <React.Fragment key={index}>
                                                <div className="cycle-node">{node}</div>
                                                {index < cycle.length - 1 && <div className="cycle-connector"></div>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    cycle
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>There are no cycles present in the graph or haven't checked yet.</p>
            )}
        </div>
    )
}

export default CycleManager
