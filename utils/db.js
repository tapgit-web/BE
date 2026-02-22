const fs = require('fs');
const path = require('path');
const config = require('../config/settings');

const dbPath = path.isAbsolute(config.DB_FILE)
    ? config.DB_FILE
    : path.join(__dirname, '..', config.DB_FILE);

const db = {
    /**
     * Reads all licenses from the JSON file.
     * @returns {Array} List of license objects.
     */
    readLicenses: () => {
        try {
            if (!fs.existsSync(dbPath)) {
                fs.writeFileSync(dbPath, JSON.stringify([], null, 4));
                return [];
            }
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading database:', error);
            return [];
        }
    },

    /**
     * Writes licenses back to the JSON file.
     * @param {Array} licenses - The list of licenses to save.
     */
    writeLicenses: (licenses) => {
        try {
            fs.writeFileSync(dbPath, JSON.stringify(licenses, null, 4));
        } catch (error) {
            console.error('Error writing to database:', error);
        }
    },

    /**
     * Finds a license by key.
     * @param {string} key - The license key to search for.
     */
    findLicense: (key) => {
        const licenses = db.readLicenses();
        return licenses.find(l => l.key === key);
    },

    /**
     * Updates an existing license.
     * @param {string} key - The license key to update.
     * @param {object} updates - The data to update.
     */
    updateLicense: (key, updates) => {
        const licenses = db.readLicenses();
        const index = licenses.findIndex(l => l.key === key);
        if (index !== -1) {
            licenses[index] = { ...licenses[index], ...updates };
            db.writeLicenses(licenses);
            return true;
        }
        return false;
    },

    /**
     * Adds a new license key to the database.
     * @param {string} key - The new license key.
     */
    addLicense: (key) => {
        const licenses = db.readLicenses();
        if (licenses.find(l => l.key === key)) return false; // Already exists

        licenses.push({
            key: key,
            status: 'new',
            hwid: "null"
        });
        db.writeLicenses(licenses);
        return true;
    }
};

module.exports = db;
