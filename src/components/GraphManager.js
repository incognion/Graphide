import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';
import { Graph } from 'graphlib';
import './styles.css';


const GraphManager = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [nodeInput, setNodeInput] = useState('');
    const [edgeInput, setEdgeInput] = useState({ from: '', to: '' });
    const [topoSort, setTopoSort] = useState([]);
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [shortestPath, setShortestPath] = useState([]);
    const [cycles, setCycles] = useState([]);

    const networkRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const nodesRes = await axios.get('https://graphide-backend.onrender.com/nodes');
            const edgesRes = await axios.get('https://graphide-backend.onrender.com/edges');
            setNodes(nodesRes.data);
            setEdges(edgesRes.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (networkRef.current) {
            const nodesData = new DataSet(nodes.map(node => ({ id: node.name, label: node.name })));
            const edgesData = new DataSet(edges.map(edge => ({ from: edge.from, to: edge.to })));

            const data = {
                nodes: nodesData,
                edges: edgesData,
            };

            const options = {
                nodes: {
                    shape: 'dot',
                },
                edges: {
                    smooth: false,
                },
                physics: {
                    enabled: true,
                },
            };

            new Network(networkRef.current, data, options);
        }
    }, [nodes, edges]);

    const addNode = async () => {
        if (nodeInput) {
            const nodeExists = nodes.some(node => node.name === nodeInput);
            if (nodeExists) {
                alert('Node already exists.');
                return;
            }
            await axios.post('https://graphide-backend.onrender.com/nodes', { name: nodeInput });
            setNodeInput('');
            const nodesRes = await axios.get('https://graphide-backend.onrender.com/nodes');
            setNodes(nodesRes.data);
        }
    };

    const removeNode = async (node) => {
        await axios.delete(`https://graphide-backend.onrender.com/nodes/${node}`);
        const nodesRes = await axios.get('https://graphide-backend.onrender.com/nodes');
        const edgesRes = await axios.get('https://graphide-backend.onrender.com/edges');
        setNodes(nodesRes.data);
        setEdges(edgesRes.data);
    };

    const removeNodeHandler = (node) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete node "${node}"?`);
        if (confirmDelete) {
            removeNode(node);
        }
    };

    const addEdge = async () => {
        if (edgeInput.from && edgeInput.to) {
            await axios.post('https://graphide-backend.onrender.com/edges', edgeInput);
            setEdgeInput({ from: '', to: '' });
            const edgesRes = await axios.get('https://graphide-backend.onrender.com/edges');
            setEdges(edgesRes.data);
        }
    };

    const removeEdge = async (from, to) => {
        await axios.delete(`https://graphide-backend.onrender.com/edges/${from}/${to}`);
        const edgesRes = await axios.get('https://graphide-backend.onrender.com/edges');
        setEdges(edgesRes.data);
    };

    const removeEdgeHandler = (from, to) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete edge from "${from}" to "${to}"?`);
        if (confirmDelete) {
            removeEdge(from, to);
        }
    };

    const getTopoSort = () => {
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

    const getShortestPath = () => {
        const g = new Graph();
        nodes.forEach(node => g.setNode(node.name));
        edges.forEach(edge => g.setEdge(edge.from, edge.to));

        if (source && target) {
            if (!g.hasNode(source) || !g.hasNode(target)) {
                setShortestPath([]); // Clear the path if nodes are not present
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

                if (currentNode === target) {
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
        } else {
            setShortestPath([]);
        }
    };


    class PriorityQueue {
        constructor() {
            this.items = [];
        }

        enqueue(element, priority) {
            const queueElement = { element, priority };
            this.items.push(queueElement);
            this.items.sort((a, b) => a.priority - b.priority);
        }

        dequeue() {
            return this.items.shift();
        }

        isEmpty() {
            return this.items.length === 0;
        }
    }

    const detectCycle = () => {
        const g = new Graph();
        nodes.forEach(node => g.setNode(node.name));
        edges.forEach(edge => g.setEdge(edge.from, edge.to));

        const visited = new Set();
        const foundCycles = [];
        const stack = [];

        const hasCycleDFS = (node, parent) => {
            if (stack.includes(node)) {
                // Cycle detected; find the position of the current node in the stack to record the cycle
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
        <div>
            <div className="title">
                <h1>Graphide</h1>
            </div>
            <div>

                <div className="nodes-container">
                    <div>
                        <input
                            type="text"
                            value={nodeInput}
                            onChange={(e) => setNodeInput(e.target.value)}
                            placeholder="Add Node"
                        />
                        <button onClick={addNode}>Add Node</button>
                    </div>
                    <h3>Existing Nodes</h3>
                    <div className="node-boxes">
                        {nodes.map((node) => (
                            <div className="node-box" key={node.name}>
                                <div>{node.name}</div>
                                <button onClick={() => removeNodeHandler(node.name)}>Delete Node</button>
                            </div>
                        ))}
                    </div>
                </div>
                <br /><hr /><br />

                <div className="edges-container">
                    <div>
                        <input
                            type="text"
                            value={edgeInput.from}
                            onChange={(e) => setEdgeInput({ ...edgeInput, from: e.target.value })}
                            placeholder="From"
                        />
                        <input
                            type="text"
                            value={edgeInput.to}
                            onChange={(e) => setEdgeInput({ ...edgeInput, to: e.target.value })}
                            placeholder="To"
                        />
                        <button onClick={addEdge}>Add Edge</button>
                    </div>
                    <h3>Existing Edges</h3>
                    <div className="edge-boxes">
                        {edges.map((edge, index) => (
                            <div className="edge-box" key={index}>
                                <div>{edge.from} — {edge.to}</div>
                                <button onClick={() => removeEdgeHandler(edge.from, edge.to)}>Delete Edge</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <br /><hr /><br />
            <div className='topological-sort-container'>
                <h3>Topological Sort</h3>
                <button onClick={getTopoSort}>Get</button>
                <div className="topological-sort-result">
                    {topoSort.map((node, index) => (
                        <div key={index} className="topological-sort-item">
                            {node}
                        </div>
                    ))}
                </div>
            </div>
            <br /><hr /><br />

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
                    <button onClick={getShortestPath}>Get</button>
                </div>
                {shortestPath.length > 0 ? (
                    <div className="shortest-path">
                        {shortestPath.map((node, index) => (
                            <React.Fragment key={index}>
                                <div className="path-node">{node}</div>
                                {index < shortestPath.length - 1 && <div className="path-connector"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <p>No path found or source/target not specified.</p>
                )}
            </div>

            <br /><hr /><br />

            <div className="cycles-container">
                <h3>Cycles</h3>
                <button onClick={detectCycle}>Check</button>
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

            <br /><hr /><br />
            <div className="graph-container">
                <div className="graph-content">
                    <h3>Graph Visualization:</h3>
                    <div ref={networkRef} className="graph"></div>
                </div>
            </div>
        </div>
    );
};

export default GraphManager;
