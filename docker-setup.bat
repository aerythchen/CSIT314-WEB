@echo off
echo 🐳 Setting up CSIT314-Web with Docker...

REM Create environment file for Docker
(
echo # Docker Environment Configuration
echo NODE_ENV=production
echo PORT=3000
echo.
echo # Database Configuration
echo DB_HOST=postgres
echo DB_PORT=5432
echo DB_NAME=csit314_db
echo DB_USER=postgres
echo DB_PASSWORD=postgres123
echo.
echo # Session Configuration
echo SESSION_SECRET=docker-session-secret-key-2024
echo.
echo # Application Configuration
echo APP_NAME=CSIT314-Web
echo APP_VERSION=1.0.0
) > .env.docker

echo ✅ Environment file created

echo 🔨 Building Docker images...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d

echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo 🌱 Initializing database...
docker-compose exec app node add-test-data.js

echo ✅ Setup complete!
echo.
echo 🌐 Application is running at: http://localhost:3000
echo 🗄️  Database is running at: localhost:5432
echo.
echo 📋 Useful commands:
echo   - View logs: docker-compose logs -f
echo   - Stop services: docker-compose down
echo   - Restart services: docker-compose restart
echo   - Access database: docker-compose exec postgres psql -U postgres -d csit314_db

pause
