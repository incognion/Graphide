import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

import NodeManager from './NodeManager';
import TopoSortManager from './TopoSortManager';
import ShortestPathManager from './ShortestPathManager';
import CycleManager from './CycleManager';
import LoadManager from './LoadManager';
import GraphVisualizer from './GraphVisualizer';

const GraphManager = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const nodesRes = await axios.get('https://graphide-backend.onrender.com/nodes');
                const edgesRes = await axios.get('https://graphide-backend.onrender.com/edges');
                
                setNodes(nodesRes.data);
                setEdges(edgesRes.data);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="title">
                <h1>Graphide</h1>
            </div>

            {loading ? (
                <LoadManager />
            ) : (
                <>
                    <NodeManager nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />

                    <br /><hr /><br />

                    <TopoSortManager nodes={nodes} edges={edges} />

                    <br /><hr /><br />

                    <ShortestPathManager nodes={nodes} edges={edges} />

                    <br /><hr /><br />

                    <CycleManager nodes={nodes} edges={edges} />

                    <br /><hr /><br />

                    <GraphVisualizer nodes={nodes} edges={edges} />
                </>
            )}
        </div>
    );
};

export default GraphManager;
