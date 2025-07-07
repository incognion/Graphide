const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({ name: String });

const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
