#!/bin/bash

# CSIT314-Web Docker Setup Script
echo "🐳 Setting up CSIT314-Web with Docker..."

# Create environment file for Docker
cat > .env.docker << EOF
# Docker Environment Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=csit314_db
DB_USER=postgres
DB_PASSWORD=postgres123

# Session Configuration
SESSION_SECRET=docker-session-secret-key-2024

# Application Configuration
APP_NAME=CSIT314-Web
APP_VERSION=1.0.0
EOF

echo "✅ Environment file created"

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🌱 Initializing database..."
docker-compose exec app node add-test-data.js

echo "✅ Setup complete!"
echo ""
echo "🌐 Application is running at: http://localhost:3000"
echo "🗄️  Database is running at: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Access database: docker-compose exec postgres psql -U postgres -d csit314_db"
