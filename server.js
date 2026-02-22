const express = require('express');
const cors = require('cors');
const config = require('./config/settings');
const activateRoute = require('./routes/activate');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', activateRoute);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'running' });
});

app.listen(config.PORT, () => {
    console.log(`License Activation Server running on port ${config.PORT}`);
    console.log(`Endpoint ready: POST /activate`);
});
