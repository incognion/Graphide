const Edge = require('../models/edgeModel');

// Get all edges
exports.getEdges = async (req, res) => {
    try {
        const edges = await Edge.find();
        res.json(edges);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new edge
exports.createEdge = async (req, res) => {
    try {
        const newEdge = new Edge(req.body);
        await newEdge.save();
        res.status(201).json(newEdge);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete an edge
exports.deleteEdge = async (req, res) => {
    try {
        await Edge.deleteOne({ from: req.params.from, to: req.params.to });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
