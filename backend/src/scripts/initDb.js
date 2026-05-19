const mysql = require('mysql2/promise');

async function initializeDatabase() {
    const dbName = 'platinum_luxria';

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or already exists.`);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
}

initializeDatabase();
