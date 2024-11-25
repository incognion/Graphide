import React, { useState } from 'react'
import { Graph } from 'graphlib'
import PriorityQueue from './PriorityQueue';

const ShortestPathManager = ({ nodes, edges }) => {
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [shortestPath, setShortestPath] = useState([]);

    const getShortestPathHandler = () => {
        setShortestPath([]);

        const g = new Graph();
        nodes.forEach(node => g.setNode(node.name));
        edges.forEach(edge => g.setEdge(edge.from, edge.to));

        if (source && target) {
            if (!g.hasNode(source) || !g.hasNode(target)) {
                alert('Source or target node does not exist in the graph.');
                return;
            }

            const distances = {};
            const previous = {};
            const queue = new PriorityQueue();

            nodes.forEach(node => {
                distances[node.name] = Infinity;
                previous[node.name] = null;
                queue.enqueue(node.name, Infinity);
            });

            distances[source] = 0;
            queue.enqueue(source, 0);

            while (!queue.isEmpty()) {
                const currentNode = queue.dequeue().element;

                if (currentNode === target && distances[target] != Infinity) {
                    const path = [];
                    let temp = currentNode;
                    while (temp) {
                        path.push(temp);
                        temp = previous[temp];
                    }
                    setShortestPath(path.reverse());
                    return;
                }

                const neighbors = g.neighbors(currentNode);
                neighbors.forEach(neighbor => {
                    const alt = distances[currentNode] + 1;
                    if (alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previous[neighbor] = currentNode;
                        queue.enqueue(neighbor, alt);
                    }
                });
            }

            if (shortestPath.length === 0) {
                alert(`No path found connecting the nodes ${source} and ${target}.`);
                return;
            }
        } else {
            alert('Please specify source and target both.');
            return;
        }
    };

    return (
        <div className="shortest-path-container">
            <div>
                <h3>Shortest Path</h3>

                <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Source Node"
                />
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Target Node"
                />
                <button onClick={getShortestPathHandler}>Get</button>
            </div>

            {shortestPath.length > 0 && <div className="shortest-path">
                {shortestPath.map((node, index) => (
                    <React.Fragment key={index}>
                        <div className="path-node">{node}</div>
                        {index < shortestPath.length - 1 && <div className="path-connector"></div>}
                    </React.Fragment>
                ))}
            </div>}

        </div>
    )
}

export default ShortestPathManager
