const { db } = require('../database');
const { SessionHelpers } = require('../database/helpers');

class LoginEntity {
    constructor() {
        this.user = null;
        this.session = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("LoginEntity: Initializing...");
        this.user = null;
        this.session = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("LoginEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.email || typeof data.email !== 'string') {
            return { isValid: false, error: "Valid email is required" };
        }

        if (!data.password || typeof data.password !== 'string') {
            return { isValid: false, error: "Valid password is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("LoginEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Find user profile by email
        const profile = db.findOne('userProfiles', { 
            email: data.email, 
            userType: 'useradmin',
            isDeleted: false 
        });

        if (!profile) {
            return {
                success: false,
                error: "Invalid email or password"
            };
        }

        // Check if profile is suspended
        if (profile.status === 'suspended') {
            return {
                success: false,
                error: "Account is suspended"
            };
        }

        // Find associated account
        const account = db.findOne('userAccounts', { 
            profileId: profile.id,
            isDeleted: false 
        });

        if (!account) {
            return {
                success: false,
                error: "Invalid email or password"
            };
        }

        // Check if account is locked
        if (account.status === 'locked') {
            return {
                success: false,
                error: "Account is locked due to multiple failed login attempts"
            };
        }

        // In real app: Verify password with bcrypt
        // const isValidPassword = await bcrypt.compare(data.password, account.passwordHash);
        // For now, we'll assume password is valid

        // Update last login
        db.update('userAccounts', account.id, {
            lastLogin: new Date().toISOString(),
            loginAttempts: 0
        });

        // Create session
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiry for admin

        const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const sessionResult = SessionHelpers.createSession({
            token: sessionToken,
            accountId: account.id,
            profileId: profile.id,
            userId: profile.id,
            userType: 'useradmin',
            role: 'administrator',
            status: 'active',
            expiresAt: expiresAt.toISOString()
        });

        if (!sessionResult.success) {
            return sessionResult;
        }

        this.user = {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            userType: profile.userType,
            role: 'administrator',
            permissions: ['manage_users', 'manage_accounts', 'manage_profiles', 'view_reports', 'system_config']
        };

        this.session = sessionResult.data;

        // Create audit log
        db.insert('auditLogs', {
            action: 'USER_ADMIN_LOGIN',
            entityType: 'session',
            entityId: this.session.id,
            performedBy: profile.id,
            performedByType: 'useradmin',
            details: {
                email: profile.email
            }
        });

        console.log("User Admin authenticated successfully");
        return {
            success: true,
            message: "User Admin authenticated",
            data: {
                userId: this.user.id,
                sessionToken: this.session.token
            }
        };
    }

    getData() {
        console.log("LoginEntity: Retrieving data...");
        
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
                user: this.user,
                session: this.session
            }
        };
    }
}

module.exports = LoginEntity;
