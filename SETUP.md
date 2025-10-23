# Project Setup Guide

This guide helps you set up the project on a new PC or environment.

## Quick Setup (New PC)

### 1. Prerequisites
- Node.js (v14 or higher)
- Docker Desktop (for PostgreSQL database)
- Git

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd CSIT314-Web
npm install
```

### 3. Start Database
```bash
docker-compose up -d
```

### 4. Start Server (Migrations run automatically)
```bash
npm start
```

That's it! The server will automatically:
- ✅ Run database migrations
- ✅ Add tracking columns (`viewcount`, `shortlistcount`)
- ✅ Update request status schema
- ✅ Create test data

## What Happens Automatically

When you start the server, it automatically:

1. **Runs Database Migrations**
   - Adds `viewcount` and `shortlistcount` columns to `requests` table
   - Updates existing records with default values
   - Safe to run multiple times

2. **Updates Request Status Schema**
   - Changes from 4-status to 3-status system
   - Updates existing data: `approved` → `assigned`, `rejected` → `pending`

3. **Creates Test Data**
   - Sample requests for testing
   - CSR shortlist test data

## Manual Migration (if needed)

If you need to run migrations manually:

```bash
# Run all migrations
node migrations/run-migrations.js

# Run specific migration
node migrations/add-tracking-columns.js
```

## Database Schema

The `requests` table now includes:
- `viewcount` - INTEGER DEFAULT 0 (tracks views)
- `shortlistcount` - INTEGER DEFAULT 0 (tracks shortlists)
- `status` - VARCHAR with values: 'pending', 'assigned', 'completed'

## Troubleshooting

### Migration Errors
If migrations fail, check:
- Database is running: `docker-compose ps`
- Database connection in `database/config.js`
- PostgreSQL logs: `docker-compose logs postgres`

### Column Already Exists
This is normal! The migration checks if columns exist and skips them if they do.

### Fresh Database
To start completely fresh:
```bash
docker-compose down -v  # Removes all data
docker-compose up -d    # Creates fresh database
npm start              # Runs migrations
```

## Environment Differences

| Environment | Database | Migrations |
|-------------|----------|------------|
| **Current PC** | ✅ Columns exist | ✅ Skips existing |
| **New PC** | ❌ No columns | ✅ Adds columns |
| **Fresh Database** | ❌ No columns | ✅ Adds columns |
| **Production** | ❌ No columns | ✅ Adds columns |

The migration system handles all scenarios automatically!
