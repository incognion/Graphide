import React, { useState } from 'react'
import { Graph } from 'graphlib';

const CycleManager = ({ nodes, edges }) => {
    const [cycles, setCycles] = useState([]);

    const detectCycleHandler = () => {
        setCycles([]);

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

        if (foundCycles.length === 0) {
            alert('There is no cycle present in the graph');
            return;
        }

        setCycles(foundCycles);
    };

    return (
        <div className="cycles-container">
            <h3>Cycles</h3>

            <button onClick={detectCycleHandler}>Check</button>

            <div className='cycles'>
                <ul>
                    {cycles.map((cycle, index) => (
                        <li key={index}>
                            <div className="cycle">
                                {cycle.map((node, index) => (
                                    <React.Fragment key={index}>
                                        <div className="cycle-node">{node}</div>
                                        {index < cycle.length - 1 && <div className="cycle-connector"></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    )
}

export default CycleManager
