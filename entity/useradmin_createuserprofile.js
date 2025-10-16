const { db } = require('../database');

class CreateUserProfileEntity {
    constructor() {
        this.profile = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("CreateUserProfileEntity: Initializing...");
        this.profile = {
            id: null,
            firstName: "",
            lastName: "",
            email: "",
            userType: "",
            status: "active",
            createdAt: null,
            updatedAt: null,
            createdBy: "useradmin"
        };
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("CreateUserProfileEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.firstName || typeof data.firstName !== 'string') {
            return { isValid: false, error: "Valid first name is required" };
        }

        if (!data.lastName || typeof data.lastName !== 'string') {
            return { isValid: false, error: "Valid last name is required" };
        }

        if (!data.email || typeof data.email !== 'string') {
            return { isValid: false, error: "Valid email is required" };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { isValid: false, error: "Invalid email format" };
        }

        if (!data.userType || typeof data.userType !== 'string') {
            return { isValid: false, error: "Valid user type is required" };
        }

        const validUserTypes = ["csrrepresentative", "personinneed", "platformmanager", "useradmin"];
        if (!validUserTypes.includes(data.userType)) {
            return { isValid: false, error: "Invalid user type" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("CreateUserProfileEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check for duplicate email
        const existing = db.findOne('userProfiles', { 
            email: data.email, 
            isDeleted: false 
        });
        
        if (existing) {
            return {
                success: false,
                error: "Email already exists"
            };
        }

        // Insert new profile into database
        const result = db.insert('userProfiles', {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            userType: data.userType,
            status: "active",
            createdBy: data.createdBy || "useradmin"
        });

        if (!result.success) {
            return result;
        }

        this.profile = result.data;

        // Create audit log entry
        db.insert('auditLogs', {
            action: 'CREATE_USER_PROFILE',
            entityType: 'userProfile',
            entityId: this.profile.id,
            performedBy: data.createdBy || 'useradmin',
            performedByType: 'useradmin',
            details: {
                email: this.profile.email,
                userType: this.profile.userType
            }
        });

        console.log("Profile data processed successfully");
        return {
            success: true,
            message: "User profile created",
            data: {
                id: this.profile.id,
                email: this.profile.email
            }
        };
    }

    getData() {
        console.log("CreateUserProfileEntity: Retrieving data...");
        
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
                id: this.profile.id,
                firstName: this.profile.firstName,
                lastName: this.profile.lastName,
                email: this.profile.email,
                userType: this.profile.userType,
                status: this.profile.status,
                createdAt: this.profile.createdAt,
                updatedAt: this.profile.updatedAt,
                createdBy: this.profile.createdBy
            }
        };
    }
}

module.exports = CreateUserProfileEntity;

