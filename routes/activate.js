const express = require('express');
const router = express.Router();
const db = require('../utils/db');

/**
 * POST /activate
 * @body {string} key - The license key.
 * @body {string} hwid - The hardware ID of the machine.
 */
router.post('/activate', (req, res) => {
    const { key, hwid } = req.body;

    if (!key || !hwid) {
        return res.json({
            valid: false,
            msg: "License key and HWID are required"
        });
    }

    const license = db.findLicense(key);

    if (!license) {
        return res.json({
            valid: false,
            msg: "Invalid license key"
        });
    }

    // Handing first activation (status: new)
    if (license.status === 'new') {
        db.updateLicense(key, {
            hwid: hwid,
            status: 'active',
            activatedAt: new Date().toISOString()
        });

        return res.json({
            valid: true
        });
    }

    // Handling already active license
    if (license.status === 'active') {
        if (license.hwid === hwid) {
            return res.json({
                valid: true
            });
        } else {
            return res.json({
                valid: false,
                msg: "License already activated on another PC"
            });
        }
    }

    // Handling other statuses (e.g., expired, suspended)
    return res.json({
        valid: false,
        msg: `License is ${license.status}`
    });
});

module.exports = router;
