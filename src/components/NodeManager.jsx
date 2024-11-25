import React, { useState } from 'react';
import axios from 'axios';

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

    const addEdgeHandler = async () => {
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

    return (
        <div>
            <div className="nodes-container">
                <div>
                    <input
                        type="text"
                        value={nodeInput}
                        onChange={(e) => setNodeInput(e.target.value)}
                        placeholder="Add Node"
                    />
                    <button onClick={addNodeHandler}>Add Node</button>
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
                    <button onClick={addEdgeHandler}>Add Edge</button>
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
    )
}

export default NodeManager
