# 🐳 CSIT314-Web Docker Setup

This document explains how to run the CSIT314-Web application using Docker.

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose installed
- Git (to clone the repository)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**For Linux/Mac:**
```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

**For Windows:**
```cmd
docker-setup.bat
```

### Option 2: Manual Setup

1. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

2. **Initialize database:**
   ```bash
   docker-compose exec app node add-test-data.js
   ```

## 🌐 Access the Application

- **Application:** http://localhost:3000
- **Database:** localhost:5432
- **Database Credentials:**
  - Username: `postgres`
  - Password: `postgres123`
  - Database: `csit314_db`

## 📋 Useful Commands

### Service Management
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up --build -d
```

### Database Access
```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d csit314_db

# View database tables
docker-compose exec postgres psql -U postgres -d csit314_db -c "\dt"

# Backup database
docker-compose exec postgres pg_dump -U postgres csit314_db > backup.sql
```

### Application Management
```bash
# Access application container
docker-compose exec app sh

# View application logs
docker-compose logs app

# Restart application only
docker-compose restart app
```

## 🏗️ Architecture

The Docker setup includes:

- **Application Container**: Node.js application
- **Database Container**: PostgreSQL database
- **Database Initialization**: Automatic schema and data setup
- **Health Checks**: Container health monitoring
- **Networking**: Isolated network for services

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Application environment (production)
- `PORT`: Application port (3000)
- `DB_HOST`: Database host (postgres)
- `DB_PORT`: Database port (5432)
- `DB_NAME`: Database name (csit314_db)
- `DB_USER`: Database user (postgres)
- `DB_PASSWORD`: Database password (postgres123)

### Volumes

- `postgres_data`: Persistent database storage
- `./logs`: Application logs directory

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   netstat -tulpn | grep :3000
   
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database connection issues:**
   ```bash
   # Check database container status
   docker-compose ps postgres
   
   # View database logs
   docker-compose logs postgres
   ```

3. **Application not starting:**
   ```bash
   # Check application logs
   docker-compose logs app
   
   # Rebuild application
   docker-compose build app
   docker-compose up -d app
   ```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up --build -d
```

## 📊 Monitoring

### Health Checks

- **Application**: http://localhost:3000/health
- **Database**: Automatic PostgreSQL health checks

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f
```

## 🔒 Security Notes

- Database password is set to `postgres123` for development
- Change passwords for production deployment
- Application runs as non-root user in container
- Network is isolated between containers

## 🚀 Production Deployment

For production deployment:

1. Change database passwords
2. Use environment-specific configuration
3. Set up proper logging
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure monitoring and alerting

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Image](https://hub.docker.com/_/node)
