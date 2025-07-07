const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConfig');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
const nodeRoutes = require('./routes/nodeRoutes');
const edgeRoutes = require('./routes/edgeRoutes');

app.use('/nodes', nodeRoutes);
app.use('/edges', edgeRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
