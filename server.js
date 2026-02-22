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

// Route to add a new license key
app.post('/admin/add', (req, res) => {
    const { key } = req.body;
    const db = require('./utils/db');

    if (!key) {
        return res.status(400).json({ success: false, msg: "Key is required" });
    }

    const added = db.addLicense(key.toUpperCase());
    if (added) {
        res.json({ success: true, msg: `License ${key} added successfully` });
    } else {
        res.status(400).json({ success: false, msg: "License key already exists" });
    }
});

app.listen(config.PORT, () => {
    console.log(`License Activation Server running on port ${config.PORT}`);
    console.log(`Endpoint ready: POST /activate`);
});
