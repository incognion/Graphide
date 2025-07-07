const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({ from: String, to: String });

const Edge = mongoose.model('Edge', edgeSchema);

module.exports = Edge;
