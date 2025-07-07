const Node = require('../models/nodeModel');
const Edge = require('../models/edgeModel');

// Get all nodes
exports.getNodes = async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new node
exports.createNode = async (req, res) => {
    try {
        const newNode = new Node(req.body);
        await newNode.save();
        res.status(201).json(newNode);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a node
exports.deleteNode = async (req, res) => {
    try {
        await Node.deleteOne({ name: req.params.name });
        await Edge.deleteMany({ $or: [{ from: req.params.name }, { to: req.params.name }] });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
