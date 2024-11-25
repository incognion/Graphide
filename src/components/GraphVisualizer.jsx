import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';

const GraphVisualizer = ({ nodes, edges }) => {
    const networkRef = useRef(null);

    useEffect(() => {
        if (networkRef.current && nodes.length && edges.length) {
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
            };

            new Network(networkRef.current, data, options);
        }
    }, [nodes, edges]);

    return (
        <div className="graph-container">
            <div className="graph-content">
                <h3>Graph Visualization:</h3>
                <div ref={networkRef} className="graph"></div>
            </div>
        </div>
    );
};

export default GraphVisualizer;
