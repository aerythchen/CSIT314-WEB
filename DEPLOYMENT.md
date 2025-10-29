# Deployment Guide for CSR Volunteering Platform

## 🚀 Render.com Deployment

### Prerequisites
- GitHub repository with your code
- Render.com account (free)

### Step 1: Connect Repository
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select your repository

### Step 2: Configure Service
- **Name**: `csr-volunteering-platform`
- **Environment**: `Node`
- **Plan**: `Free`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/`

### Step 3: Environment Variables
Set these in Render dashboard under "Environment":

```
NODE_ENV=production
PORT=10000
DB_HOST=your-render-db-host
DB_PORT=5432
DB_NAME=csr_volunteering_platform
DB_USER=your-db-user
DB_PASSWORD=your-db-password
SESSION_SECRET=your-super-secure-session-secret-here
```

### Step 4: Add Database (Optional)
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name: `csr-volunteering-db`
3. Plan: `Free`
4. Copy the connection details to your environment variables

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Your app will be available at: `https://your-app-name.onrender.com`

## 🔄 Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Build logs are available in Render dashboard
- Rollback to previous versions is possible

## 📊 Monitoring
- View logs in real-time
- Monitor performance metrics
- Set up alerts for downtime

## 🆓 Free Tier Limits
- 750 hours/month (enough for most projects)
- Sleeps after 15 minutes of inactivity
- 1GB RAM
- 1GB disk space
