const { db } = require('../database');

class CreateUserAccountEntity {
    constructor() {
        this.account = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("CreateUserAccountEntity: Initializing...");
        this.account = {
            id: null,
            profileId: null,
            username: "",
            passwordHash: "",
            status: "active",
            lastLogin: null,
            loginAttempts: 0,
            createdAt: null,
            createdBy: "useradmin"
        };
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("CreateUserAccountEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.profileId || typeof data.profileId !== 'string') {
            return { isValid: false, error: "Valid profile ID is required" };
        }

        if (!data.username || typeof data.username !== 'string' || data.username.length < 3) {
            return { isValid: false, error: "Valid username required (min 3 chars)" };
        }

        if (!data.password || typeof data.password !== 'string' || data.password.length < 8) {
            return { isValid: false, error: "Valid password required (min 8 chars)" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("CreateUserAccountEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if profile exists
        const profile = db.findById('userProfiles', data.profileId);
        if (!profile || profile.isDeleted) {
            return {
                success: false,
                error: "Profile not found"
            };
        }

        // Check if profile already has an account
        const existingAccount = db.findOne('userAccounts', { 
            profileId: data.profileId, 
            isDeleted: false 
        });
        
        if (existingAccount) {
            return {
                success: false,
                error: "Profile already has an account"
            };
        }

        // Check for duplicate username
        const duplicateUsername = db.findOne('userAccounts', { 
            username: data.username, 
            isDeleted: false 
        });
        
        if (duplicateUsername) {
            return {
                success: false,
                error: "Username already exists"
            };
        }

        // In real app: Hash password with bcrypt
        // const passwordHash = await bcrypt.hash(data.password, 10);
        const passwordHash = "[HASHED_PASSWORD]"; // Placeholder

        // Insert new account
        const result = db.insert('userAccounts', {
            profileId: data.profileId,
            username: data.username,
            passwordHash: passwordHash,
            status: "active",
            lastLogin: null,
            loginAttempts: 0,
            createdBy: data.createdBy || "useradmin"
        });

        if (!result.success) {
            return result;
        }

        this.account = result.data;

        // Create audit log
        db.insert('auditLogs', {
            action: 'CREATE_USER_ACCOUNT',
            entityType: 'userAccount',
            entityId: this.account.id,
            performedBy: data.createdBy || 'useradmin',
            performedByType: 'useradmin',
            details: {
                username: this.account.username,
                profileId: this.account.profileId
            }
        });

        console.log("Account created successfully");
        return {
            success: true,
            message: "User account created",
            data: {
                id: this.account.id,
                username: this.account.username
            }
        };
    }

    getData() {
        console.log("CreateUserAccountEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: {
                id: this.account.id,
                profileId: this.account.profileId,
                username: this.account.username,
                status: this.account.status,
                lastLogin: this.account.lastLogin,
                loginAttempts: this.account.loginAttempts,
                createdAt: this.account.createdAt,
                createdBy: this.account.createdBy
            }
        };
    }
}

module.exports = CreateUserAccountEntity;
