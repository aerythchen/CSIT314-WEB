#  CSR Volunteering Website

A Corporate Social Responsibility (CSR) volunteering platform built with **BCE (Boundary-Controller-Entity) Architecture** using Node.js, Express, and EJS.

## Features

### Multi-Role Authentication System
- **Person in Need**: Create and manage assistance requests
- **CSR Representative**: Search and shortlist opportunities
- **Platform Manager**: Manage categories and generate reports
- **User Admin**: Manage user accounts and profiles

### BCE Architecture Implementation
- **47 Entity Files** covering all use cases
- **42+ Controller Files** for business logic
- **42+ Boundary Files** for user interface
- **Complete separation of concerns**

###  Key Functionalities
- Request creation and management
- Advanced search and filtering
- Shortlist management
- Report generation (daily, weekly, monthly)
- User account management
- Session management
- Audit logging

##  Architecture

### BCE Pattern Implementation

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   BOUNDARY      │───▶│   CONTROLLER    │───▶│    ENTITY       │
│   (UI Layer)    │    │ (Business Logic)│    │ (Data Layer)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Boundary**: Handles user interface, form display, and result presentation
- **Controller**: Contains business logic, validation, and orchestration
- **Entity**: Manages data persistence, database operations, and data validation

### File Structure
```
CSIT314-WEB/
├── boundary/           # 42+ UI boundary classes
├── controller/         # 42+ business logic controllers  
├── entity/            # 47 data layer entities
├── database/          # Database models and helpers
├── routes/            # Express route handlers
├── views/             # EJS templates
├── middleware/        # Authentication middleware
└── public/            # Static assets
```

##  Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

# Install dependencies
npm install

# Start the server
npm start
```

## Quick Start

### 1. Start the Server
```bash
npm start
```

### 2. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Login with Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Person in Need** | emma.johnson@email.com | password123 |
| **CSR Representative** | carol.williams@company.com | password123 |
| **Platform Manager** | alice.manager@csrplatform.com | password123 |
| **User Admin** | bob.admin@csrplatform.com | password123 |

## Project Structure

```
CSIT314-WEB/
├── boundary/                    # UI Layer (42+ files)
│   ├── personinneed_*.js       # Person in Need boundaries
│   ├── csrrepresentative_*.js   # CSR Representative boundaries
│   ├── platformmanager_*.js    # Platform Manager boundaries
│   └── useradmin_*.js          # User Admin boundaries
├── controller/                  # Business Logic Layer (42+ files)
│   ├── personinneed_*.js       # Person in Need controllers
│   ├── csrrepresentative_*.js  # CSR Representative controllers
│   ├── platformmanager_*.js   # Platform Manager controllers
│   └── useradmin_*.js          # User Admin controllers
├── entity/                     # Data Layer (47 files)
│   ├── personinneed_*.js       # Person in Need entities
│   ├── csrrepresentative_*.js  # CSR Representative entities
│   ├── platformmanager_*.js   # Platform Manager entities
│   └── useradmin_*.js          # User Admin entities
├── database/                   # Database Layer
│   ├── index.js               # Database initialization
│   ├── models.js              # Data models
│   ├── helpers.js             # Database helpers
│   └── seedData.js            # Sample data
├── routes/                     # Express Routes
│   ├── auth.js                # Authentication routes
│   ├── personinneed.js        # Person in Need routes
│   ├── csrrepresentative.js    # CSR Representative routes
│   ├── platformmanager.js     # Platform Manager routes
│   └── useradmin.js           # User Admin routes
├── views/                      # EJS Templates
│   ├── auth/                  # Authentication views
│   ├── personinneed/          # Person in Need views
│   ├── csrrepresentative/     # CSR Representative views
│   ├── platformmanager/       # Platform Manager views
│   ├── useradmin/             # User Admin views
│   └── partials/              # Shared components
├── middleware/                 # Middleware
│   └── auth.js                # Authentication middleware
├── public/                     # Static Assets
│   ├── css/                   # Stylesheets
│   └── js/                    # Client-side JavaScript
├── server.js                   # Main server file
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔧 API Documentation

### Authentication Endpoints
```
POST /auth/login              # User login
POST /auth/logout             # User logout
```

### Person in Need Endpoints
```
GET  /personinneed/dashboard           # Dashboard
GET  /personinneed/create-request      # Create request form
POST /personinneed/create-request      # Submit request
GET  /personinneed/requests           # View requests
GET  /personinneed/history           # View history
```

### CSR Representative Endpoints
```
GET  /csrrepresentative/dashboard     # Dashboard
GET  /csrrepresentative/search-requests # Search requests
GET  /csrrepresentative/shortlist    # View shortlist
```

### Platform Manager Endpoints
```
GET  /platformmanager/dashboard      # Dashboard
GET  /platformmanager/categories      # Manage categories
GET  /platformmanager/reports        # Generate reports
```

### User Admin Endpoints
```
GET  /useradmin/dashboard            # Dashboard
GET  /useradmin/accounts             # Manage accounts
GET  /useradmin/profiles             # Manage profiles
```


### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite

##  Database Schema

The application uses an in-memory database with the following main entities:

- **userProfiles** - User profile information
- **userAccounts** - User authentication accounts
- **requests** - Assistance requests
- **categories** - Request categories
- **shortlists** - CSR representative shortlists
- **sessions** - User sessions
- **auditLogs** - System audit logs

##  Security Features

- Session-based authentication
- Role-based access control
- Input validation and sanitization
- Audit logging for all actions
- Secure password handling

##  Key Features by Role

### Person in Need
-  Create detailed assistance requests
-  Track request status and views
-  Monitor shortlist activity
-  Search and filter requests
-  Update/delete own requests

### CSR Representative  
-  Search and filter opportunities
-  View detailed request information
-  Manage personal shortlist
-  Track shortlist activity
-  Advanced search capabilities

### Platform Manager
-  Manage request categories
-  Generate comprehensive reports
-  View platform statistics
-  Search and filter reports
-  Category analytics

### User Admin
-  Manage user accounts and profiles
-  Suspend/activate accounts
-  Search and filter users
-  View user statistics
-  Audit user activities


##  License

This project is licensed under the ISC License.
