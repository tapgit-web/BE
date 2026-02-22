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

// Secret Admin Route to view licenses (Protect this URL!)
app.get('/admin/licenses', (req, res) => {
    const db = require('./utils/db');
    const licenses = db.readLicenses();
    res.json({
        total: licenses.length,
        available: licenses.filter(l => l.status === 'new').length,
        activated: licenses.filter(l => l.status === 'active').length,
        data: licenses
    });
});

app.listen(config.PORT, () => {
    console.log(`License Activation Server running on port ${config.PORT}`);
    console.log(`Endpoint ready: POST /activate`);
});
