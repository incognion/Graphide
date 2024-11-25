import React, { useState } from 'react'
import { Graph } from 'graphlib'

const TopoSortManager = ({ nodes, edges }) => {
    const [topoSort, setTopoSort] = useState([]);

    const getTopoSortHandler = () => {
        const g = new Graph();
        nodes.forEach(node => g.setNode(node.name));
        edges.forEach(edge => g.setEdge(edge.from, edge.to));

        const visited = new Set();
        const stack = [];

        const topoSortDFS = (node) => {
            if (visited.has(node)) return;

            visited.add(node);
            const neighbors = g.neighbors(node);

            neighbors.forEach(neighbor => {
                topoSortDFS(neighbor);
            });

            stack.push(node);
        };

        nodes.forEach(node => {
            if (!visited.has(node.name)) {
                topoSortDFS(node.name);
            }
        });

        stack.reverse(); // The stack has the elements in reverse topological order
        setTopoSort(stack); // Update state with the result
    };

    return (
        <div>
            <div className='topological-sort-container'>
                <h3>Topological Sort</h3>
                <button onClick={getTopoSortHandler}>Get</button>
                <div className="topological-sort-result">
                    {topoSort.map((node, index) => (
                        <div key={index} className="topological-sort-item">
                            {node}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TopoSortManager
