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

### 4. Create Database Tables

First, create the database tables by running the schema file:

```bash
# Connect to PostgreSQL and run schema.sql
# You can use pgAdmin, psql, or any PostgreSQL client
# The schema file is located at: database/schema.sql
```

### 5. Start Server
```bash
npm start
```

That's it! The server will automatically:
- ✅ Update request status schema
- ✅ Create test data

## What Happens Automatically

When you start the server, it automatically:

1. **Updates Request Status Schema**
   - Changes from 4-status to 3-status system
   - Updates existing data: `approved` → `assigned`, `rejected` → `pending`

2. **Creates Test Data**
   - Sample requests for testing
   - CSR shortlist test data

## Database Schema

The `requests` table includes:
- `viewcount` - INTEGER DEFAULT 0 (tracks views)
- `shortlistcount` - INTEGER DEFAULT 0 (tracks shortlists)
- `status` - VARCHAR with values: 'pending', 'assigned', 'completed'

All columns are defined in `database/schema.sql` and are created when you set up the database.

## Troubleshooting

### Database Connection Issues
If the server can't connect to the database:
- Check database is running: `docker-compose ps`
- Verify database connection in `database/config.js`
- Check PostgreSQL logs: `docker-compose logs postgres`

### Fresh Database
To start completely fresh:
```bash
docker-compose down -v  # Removes all data
docker-compose up -d    # Creates fresh database
# Then run database/schema.sql to create tables
npm start              # Starts the server
```
