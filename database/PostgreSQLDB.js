const { Pool } = require('pg');
const config = require('./config');

/**
 * PostgreSQL Database Adapter
 * Provides the same interface as InMemoryDB but uses PostgreSQL
 */
class PostgreSQLDB {
    constructor() {
        if (PostgreSQLDB.instance) {
            return PostgreSQLDB.instance;
        }

        // Database connection configuration
        this.pool = new Pool(config);

        PostgreSQLDB.instance = this;
    }

    static getInstance() {
        if (!PostgreSQLDB.instance) {
            PostgreSQLDB.instance = new PostgreSQLDB();
        }
        return PostgreSQLDB.instance;
    }

    // ========================================
    // TABLE MANAGEMENT
    // ========================================

    async createTable(tableName) {
        // Tables are created via schema.sql, this method is for compatibility
        console.log(`Table ${tableName} should already exist (created via schema.sql)`);
        return { success: true };
    }

    // ========================================
    // INSERT OPERATIONS
    // ========================================

    async insert(tableName, data) {
        try {
            const columns = Object.keys(data).join(', ');
            const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
            const values = Object.values(data);

            const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
            
            const result = await this.pool.query(query, values);
            return { success: true, data: result.rows[0] };
        } catch (error) {
            console.error(`Error inserting into ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // FIND OPERATIONS
    // ========================================

    async find(tableName, conditions = {}) {
        try {
            let query = `SELECT * FROM ${tableName} WHERE isDeleted = false`;
            const values = [];
            let paramCount = 0;

            for (const [key, value] of Object.entries(conditions)) {
                if (value !== undefined && value !== null) {
                    paramCount++;
                    
                    // Handle MongoDB-style operators
                    if (typeof value === 'object' && value !== null) {
                        if (value.$ne !== undefined) {
                            query += ` AND ${key} != $${paramCount}`;
                            values.push(value.$ne);
                        } else if (value.$gte !== undefined) {
                            query += ` AND ${key} >= $${paramCount}`;
                            values.push(value.$gte);
                        } else if (value.$lte !== undefined) {
                            query += ` AND ${key} <= $${paramCount}`;
                            values.push(value.$lte);
                        } else {
                            // Default to equality for other object types
                            query += ` AND ${key} = $${paramCount}`;
                            values.push(value);
                        }
                    } else {
                        // Simple equality
                        query += ` AND ${key} = $${paramCount}`;
                        values.push(value);
                    }
                }
            }

            const result = await this.pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error(`Error finding in ${tableName}:`, error);
            return [];
        }
    }

    async findOne(tableName, conditions = {}) {
        try {
            let query = `SELECT * FROM ${tableName} WHERE isDeleted = false`;
            const values = [];
            let paramCount = 0;

            for (const [key, value] of Object.entries(conditions)) {
                if (value !== undefined && value !== null) {
                    paramCount++;
                    query += ` AND ${key} = $${paramCount}`;
                    values.push(value);
                }
            }

            query += ' LIMIT 1';

            const result = await this.pool.query(query, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error(`Error finding one in ${tableName}:`, error);
            return null;
        }
    }

    async findById(tableName, id) {
        try {
            const query = `SELECT * FROM ${tableName} WHERE id = $1 AND isDeleted = false`;
            const result = await this.pool.query(query, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error(`Error finding by ID in ${tableName}:`, error);
            return null;
        }
    }

    // ========================================
    // UPDATE OPERATIONS
    // ========================================

    async update(tableName, id, updateData) {
        try {
            const columns = Object.keys(updateData);
            const setClause = columns.map((col, index) => `${col} = $${index + 2}`).join(', ');
            const values = [id, ...Object.values(updateData)];

            const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $1 AND isDeleted = false RETURNING *`;
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                return { success: false, error: `Item with id '${id}' not found in table '${tableName}'` };
            }

            return { success: true, data: result.rows[0] };
        } catch (error) {
            console.error(`Error updating ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // DELETE OPERATIONS
    // ========================================

    async softDelete(tableName, id) {
        return this.update(tableName, id, { isDeleted: true });
    }

    async hardDelete(tableName, id) {
        try {
            const query = `DELETE FROM ${tableName} WHERE id = $1`;
            const result = await this.pool.query(query, [id]);

            if (result.rowCount === 0) {
                return { success: false, error: `Item with id '${id}' not found in table '${tableName}'` };
            }

            return { success: true };
        } catch (error) {
            console.error(`Error hard deleting from ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // UTILITY OPERATIONS
    // ========================================

    async count(tableName, conditions = {}) {
        try {
            let query = `SELECT COUNT(*) FROM ${tableName} WHERE isDeleted = false`;
            const values = [];
            let paramCount = 0;

            for (const [key, value] of Object.entries(conditions)) {
                if (value !== undefined && value !== null) {
                    paramCount++;
                    query += ` AND ${key} = $${paramCount}`;
                    values.push(value);
                }
            }

            const result = await this.pool.query(query, values);
            return parseInt(result.rows[0].count);
        } catch (error) {
            console.error(`Error counting in ${tableName}:`, error);
            return 0;
        }
    }

    async searchMultipleFields(tableName, searchTerm, fields) {
        try {
            const term = `%${searchTerm.toLowerCase()}%`;
            const fieldConditions = fields.map((field, index) => 
                `LOWER(${field}) LIKE $${index + 1}`
            ).join(' OR ');

            const query = `SELECT * FROM ${tableName} WHERE isDeleted = false AND (${fieldConditions})`;
            const values = fields.map(() => term);

            const result = await this.pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error(`Error searching in ${tableName}:`, error);
            return [];
        }
    }

    // ========================================
    // CONNECTION MANAGEMENT
    // ========================================

    async close() {
        await this.pool.end();
    }

    async executeQuery(query, values = []) {
        try {
            const result = await this.pool.query(query, values);
            return { success: true, data: result.rows, rowCount: result.rowCount };
        } catch (error) {
            console.error('Error executing query:', error);
            return { success: false, error: error.message };
        }
    }

    async testConnection() {
        try {
            const result = await this.pool.query('SELECT NOW()');
            console.log('✅ PostgreSQL connection successful:', result.rows[0]);
            return true;
        } catch (error) {
            console.error('❌ PostgreSQL connection failed:', error);
            return false;
        }
    }
}

module.exports = PostgreSQLDB;
