# Database Migrations

This directory contains database migration scripts that ensure the database schema is up to date across different environments.

## What are Migrations?

Migrations are scripts that modify the database schema (add columns, tables, constraints, etc.) in a controlled and repeatable way. They ensure that:

- ✅ **New environments** get the same database structure
- ✅ **Existing environments** are updated safely
- ✅ **Team members** can sync their databases
- ✅ **Production deployments** are consistent

## Current Migrations

### 1. Add Tracking Columns (`add-tracking-columns.js`)
- **Purpose**: Adds `viewcount` and `shortlistcount` columns to the `requests` table
- **Columns Added**:
  - `viewcount` - INTEGER DEFAULT 0 (tracks how many times a request was viewed)
  - `shortlistcount` - INTEGER DEFAULT 0 (tracks how many times a request was shortlisted)
- **Safe to run multiple times** - Checks if columns exist before adding

## How to Use

### Automatic (Recommended)
Migrations run automatically when you start the server:
```bash
npm start
# or
node server.js
```

### Manual
You can run migrations manually:
```bash
# Run all migrations
node migrations/run-migrations.js

# Run specific migration
node migrations/add-tracking-columns.js
```

## For New Environments

When setting up the project on a new PC/environment:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up database** (PostgreSQL with Docker):
   ```bash
   docker-compose up -d
   ```

3. **Start server** (migrations run automatically):
   ```bash
   npm start
   ```

4. **Verify** - Check that the tracking columns exist in your database

## Migration Safety

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Checks existing columns** - Won't duplicate columns
- ✅ **Preserves data** - Existing records are updated with default values
- ✅ **Error handling** - Fails gracefully with clear error messages

## Adding New Migrations

When you need to add new database changes:

1. Create a new migration file: `migrations/your-migration-name.js`
2. Add it to `migrations/run-migrations.js`
3. Test it on a fresh database
4. Commit the migration files

Example migration structure:
```javascript
async function yourMigration() {
    const db = PostgreSQLDB.getInstance();
    
    try {
        // Check if change already exists
        // Apply the change
        // Update existing data if needed
        console.log('✅ Migration completed');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

module.exports = yourMigration;
```
