const { Sequelize } = require('sequelize');
const sequelize = require('../src/config/database');

async function cleanupOrphanedNotes() {
    try {
        console.log('Starting cleanup of orphaned quotation notes...');

        // Verify connection
        await sequelize.authenticate();
        console.log('Database connection established.');

        // Delete orphaned records
        const query = `
            DELETE FROM quotation_notes 
            WHERE quotationId NOT IN (SELECT id FROM quotations)
        `;

        const [results, metadata] = await sequelize.query(query);
        console.log(`Cleanup complete. Deleted orphaned rows.`);
        console.log('Metadata:', metadata);

        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

cleanupOrphanedNotes();
