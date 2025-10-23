/**
 * Database Configuration
 * Update these values to match your PostgreSQL setup
 */
module.exports = {
    // PostgreSQL connection settings
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'csr_volunteering_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Hashbrown123',
    
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};
