const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri);

const nodeSchema = new mongoose.Schema({ name: String });
const edgeSchema = new mongoose.Schema({ from: String, to: String });

const Node = mongoose.model('Node', nodeSchema);
const Edge = mongoose.model('Edge', edgeSchema);

app.get('/nodes', async (req, res) => {
    const nodes = await Node.find();
    res.json(nodes);
});

app.post('/nodes', async (req, res) => {
    const newNode = new Node(req.body);
    await newNode.save();
    res.status(201).json(newNode);
});

app.delete('/nodes/:name', async (req, res) => {
    await Node.deleteOne({ name: req.params.name });
    await Edge.deleteMany({ $or: [{ from: req.params.name }, { to: req.params.name }] });
    res.status(204).end();
});

app.get('/edges', async (req, res) => {
    const edges = await Edge.find();
    res.json(edges);
});

app.post('/edges', async (req, res) => {
    const newEdge = new Edge(req.body);
    await newEdge.save();
    res.status(201).json(newEdge);
});

app.delete('/edges/:from/:to', async (req, res) => {
    await Edge.deleteOne({ from: req.params.from, to: req.params.to });
    res.status(204).end();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
