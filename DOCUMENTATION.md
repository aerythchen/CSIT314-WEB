# 📚 CSIT314-Web Documentation

## 🏗️ Architecture Overview

This application follows the **Boundary-Controller-Entity (BCE)** architecture pattern, providing clear separation of concerns and maintainable code structure.

### 📋 BCE Pattern Components

- **Boundary**: Handles user input validation and UI interactions
- **Controller**: Orchestrates business logic and coordinates between layers
- **Entity**: Manages data persistence and core business operations

---

## 🔐 Feature Documentation: CSR Login

### 📖 Feature Description
The CSR Login feature allows Customer Service Representatives to authenticate and access the system dashboard.

### 🎯 User Story
> **As a** CSR Representative  
> **I want to** log into the system  
> **So that I can** access the dashboard and manage requests

### 🔄 Complete Lifecycle

#### 1. **User Interface (EJS Template)**
**File**: `views/auth/login.ejs`

```html
<form action="/bce/csrrepresentative_login/login" method="POST">
    <input type="email" name="email" required>
    <input type="password" name="password" required>
    <input type="hidden" name="userType" value="csrrepresentative">
    <button type="submit">Login</button>
</form>
```

**Responsibilities:**
- Collect user credentials (email, password)
- Set user type to identify CSR role
- Submit form data to BCE endpoint

---

#### 2. **Server Route Handler**
**File**: `server.js`

```javascript
app.post('/bce/:boundary/:action', async (req, res) => {
    const { boundary, action } = req.params;
    const data = req.body;
    
    // Dynamic Boundary instantiation
    const BoundaryClass = require(`./boundary/${boundary}`);
    const boundaryInstance = new BoundaryClass();
    
    // Call the appropriate method
    const methodName = `handle${action.charAt(0).toUpperCase() + action.slice(1)}`;
    const result = await boundaryInstance[methodName](data);
    
    // Handle response...
});
```

**Responsibilities:**
- Route POST requests to BCE endpoints
- Dynamically instantiate boundary classes
- Call appropriate boundary methods
- Handle responses and redirects

---

#### 3. **Boundary Layer**
**File**: `boundary/csrrepresentative_login.js`

```javascript
const csrrepresentative_login = require('../controller/csrrepresentative_login');

class Csrrepresentative_loginBoundary {
    constructor() {
        this.controller = new csrrepresentative_login();
    }

    async handleLogin(data) {
        const { email, password, userType } = data;
        
        // Input validation
        if (!email || !password) {
            return {
                success: false,
                error: "Email and password are required"
            };
        }
        
        if (!email.includes('@')) {
            return {
                success: false,
                error: "Invalid email format"
            };
        }
        
        // Call controller
        return await this.controller.login(data);
    }
}
```

**Responsibilities:**
- **Input Validation**: Check required fields, email format
- **Data Sanitization**: Clean and validate user input
- **Error Handling**: Return user-friendly error messages
- **Controller Coordination**: Pass validated data to controller

---

#### 4. **Controller Layer**
**File**: `controller/csrrepresentative_login.js`

```javascript
const UserAccount = require('../entity/UserAccount');

class LoginController {
    constructor() {
        this.userAccount = new UserAccount();
    }

    login(data) {
        const { email, password, userType } = data;
        
        // Controller orchestrates - all business logic is in the entity
        const result = this.userAccount.login(email, password, userType);
        return result;
    }
}
```

**Responsibilities:**
- **Business Logic Orchestration**: Coordinate between boundary and entity
- **Data Transformation**: Prepare data for entity layer
- **Response Handling**: Process entity responses
- **No Business Rules**: Pure orchestration layer

---

#### 5. **Entity Layer**
**File**: `entity/UserAccount.js`

```javascript
class UserAccount {
    constructor() {
        this.db = require('../database');
    }

    login(email, password, userType) {
        try {
            // Database query to find user
            const user = this.db.find('userAccounts', {
                email: email,
                userType: userType,
                isActive: true
            });
            
            if (!user) {
                return { success: false, error: "User not found" };
            }
            
            // Password verification
            if (!this.verifyPassword(password, user.password)) {
                return { success: false, error: "Invalid credentials" };
            }
            
            // Generate session token
            const sessionToken = this.generateSessionToken();
            
            // Update last login
            this.updateLastLogin(user.id);
            
            return {
                success: true,
                data: {
                    userId: user.id,
                    email: user.email,
                    userType: user.userType,
                    sessionToken: sessionToken
                },
                message: "Login successful"
            };
            
        } catch (error) {
            return { success: false, error: "Login failed" };
        }
    }
}
```

**Responsibilities:**
- **Data Persistence**: Database operations
- **Business Rules**: Authentication logic, password verification
- **Security**: Session management, token generation
- **Data Integrity**: User validation, account status checks

---

#### 6. **Server Response Handling**
**File**: `server.js` (continued)

```javascript
// Success - redirect to dashboard
if (result.success) {
    // Store user data in session
    req.session.user = {
        id: result.data.userId,
        email: result.data.email,
        userType: result.data.userType
    };
    
    res.redirect(`/csrrepresentative/dashboard?success=${encodeURIComponent(result.message)}`);
} else {
    // Error - redirect back to login with error message
    res.redirect(`/auth/login?error=${encodeURIComponent(result.error)}`);
}
```

**Responsibilities:**
- **Session Management**: Store user data in session
- **Response Routing**: Redirect based on success/failure
- **Error Handling**: Pass error messages to UI
- **State Management**: Maintain user session state

---

### 🔄 Complete Data Flow

```
1. User submits login form
   ↓
2. Server routes to BCE endpoint
   ↓
3. Boundary validates input
   ↓
4. Controller orchestrates
   ↓
5. Entity performs authentication
   ↓
6. Server handles response
   ↓
7. User redirected to dashboard
```

### 🏗️ BCE Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER INTERFACE │    │     SERVER      │    │   DATABASE      │
│   (EJS Views)     │    │   (Express)     │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Form Submit        │                       │
         ├──────────────────────►│                       │
         │                       │                       │
         │                       │ 2. Route to BCE       │
         │                       ├──────────────────────►│
         │                       │                       │
         │                       │ 3. Boundary Layer     │
         │                       │    (Validation)       │
         │                       │                       │
         │                       │ 4. Controller Layer   │
         │                       │    (Orchestration)    │
         │                       │                       │
         │                       │ 5. Entity Layer       │
         │                       │    (Business Logic)   │
         │                       │                       │
         │                       │ 6. Database Query      │
         │                       ├──────────────────────►│
         │                       │                       │
         │                       │ 7. Response           │
         │                       │◄──────────────────────┤
         │                       │                       │
         │ 8. Redirect           │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
```

### 📋 Layer Responsibilities

| Layer | File | Responsibility | Example |
|-------|------|----------------|---------|
| **UI** | `views/auth/login.ejs` | User interaction | Form submission |
| **Server** | `server.js` | Routing & sessions | POST `/bce/csrrepresentative_login/login` |
| **Boundary** | `boundary/csrrepresentative_login.js` | Input validation | Email format, required fields |
| **Controller** | `controller/csrrepresentative_login.js` | Orchestration | Coordinate boundary ↔ entity |
| **Entity** | `entity/UserAccount.js` | Business logic | Authentication, password verification |
| **Database** | `database/` | Data persistence | User lookup, session storage |

### 📊 Data Transformation

| Layer | Input | Output | Purpose |
|-------|-------|--------|---------|
| **UI** | User credentials | Form data | Data collection |
| **Boundary** | Form data | Validated data | Input validation |
| **Controller** | Validated data | Entity parameters | Orchestration |
| **Entity** | Parameters | Authentication result | Business logic |
| **Server** | Result | Session + redirect | Response handling |

### 🎯 Key Benefits

#### **🔒 Security**
- Input validation at boundary layer
- Password verification in entity
- Session management in server
- Error handling throughout

#### **🧩 Maintainability**
- Clear separation of concerns
- Single responsibility per layer
- Easy to test individual components
- Modular architecture

#### **🔄 Scalability**
- Easy to add new features
- Reusable components
- Consistent patterns
- Clear data flow

### 🧪 Testing Strategy

#### **Unit Tests**
- **Boundary**: Test input validation
- **Controller**: Test orchestration logic
- **Entity**: Test business rules
- **Server**: Test routing and responses

#### **Integration Tests**
- **End-to-end**: Complete login flow
- **Database**: Authentication with real data
- **Session**: Session management
- **Error**: Error handling scenarios

### 📝 Future Enhancements

1. **Two-Factor Authentication**: Add 2FA to entity layer
2. **Password Reset**: New BCE for password recovery
3. **Account Lockout**: Security enhancement in entity
4. **Audit Logging**: Track login attempts in entity
5. **Remember Me**: Extended session management

---

## 🚀 Adding New Features

### 📝 Step-by-Step Guide

To add a new feature (e.g., "Update Profile"), follow this pattern:

#### 1. **Create Entity Method**
```javascript
// entity/UserProfile.js
async updateProfile(userId, profileData) {
    // Business logic here
    return { success: true, data: updatedProfile };
}
```

#### 2. **Create Controller**
```javascript
// controller/csrrepresentative_updateprofile.js
const UserProfile = require('../entity/UserProfile');

class UpdateProfileController {
    constructor() {
        this.entity = new UserProfile();
    }
    
    async updateProfile(data) {
        return await this.entity.updateProfile(data.userId, data);
    }
}
```

#### 3. **Create Boundary**
```javascript
// boundary/csrrepresentative_updateprofile.js
const csrrepresentative_updateprofile = require('../controller/csrrepresentative_updateprofile');

class Csrrepresentative_updateprofileBoundary {
    constructor() {
        this.controller = new csrrepresentative_updateprofile();
    }
    
    async handleUpdateProfile(data) {
        // Validation logic
        return await this.controller.updateProfile(data);
    }
}
```

#### 4. **Create UI Form**
```html
<!-- views/csrrepresentative/update_profile.ejs -->
<form action="/bce/csrrepresentative_updateprofile/updateProfile" method="POST">
    <input type="text" name="firstName" value="<%= user.firstName %>">
    <input type="text" name="lastName" value="<%= user.lastName %>">
    <button type="submit">Update Profile</button>
</form>
```

#### 5. **Server Route (Automatic)**
The existing server route handles it automatically:
```javascript
// server.js - Already handles all BCE endpoints
app.post('/bce/:boundary/:action', async (req, res) => {
    // Dynamic routing works for any boundary/action
});
```

### 🎯 Benefits of This Pattern

- **Consistency**: All features follow the same structure
- **Maintainability**: Easy to understand and modify
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new features
- **Separation of Concerns**: Clear responsibilities

---

## 🎯 Other Features Available

- **Request Management**: Create, view, search requests
- **Shortlist Management**: Save, view, search shortlists
- **Match Management**: Accept requests, complete matches
- **User Management**: Account and profile management
- **Reporting**: Generate various reports

Each feature follows the same BCE pattern for consistency and maintainability.
