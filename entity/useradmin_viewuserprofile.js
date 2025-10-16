const { db } = require('../database');

class ViewUserProfileEntity {
    constructor() {
        this.profiles = [];
        this.selectedProfile = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewUserProfileEntity: Initializing...");
        this.profiles = [];
        this.selectedProfile = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewUserProfileEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        const validActions = ["getAll", "getById"];
        if (!data.action || !validActions.includes(data.action)) {
            return { isValid: false, error: "Valid action is required (getAll or getById)" };
        }

        if (data.action === "getById") {
            if (!data.userId || typeof data.userId !== 'string') {
                return { isValid: false, error: "Valid user ID is required for getById action" };
            }
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewUserProfileEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        if (data.action === "getAll") {
            // Get all active profiles from database
            this.profiles = db.find('userProfiles', { isDeleted: false });
            this.selectedProfile = null;
            
            console.log(`Fetched ${this.profiles.length} profiles`);
            return {
                success: true,
                message: "Profiles retrieved",
                count: this.profiles.length
            };
        }
        
        if (data.action === "getById") {
            // Get specific profile from database
            this.selectedProfile = db.findById('userProfiles', data.userId);
            this.profiles = [];
            
            if (!this.selectedProfile || this.selectedProfile.isDeleted) {
                this.selectedProfile = null;
                return {
                    success: false,
                    error: `Profile with ID ${data.userId} not found`
                };
            }
            
            console.log(`Profile found: ${this.selectedProfile.email}`);
            return {
                success: true,
                message: "Profile retrieved"
            };
        }

        return {
            success: false,
            error: "Unknown action"
        };
    }

    getData() {
        console.log("ViewUserProfileEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        if (this.selectedProfile === null && this.profiles !== null) {
            return {
                success: true,
                data: {
                    profiles: this.profiles,
                    count: this.profiles.length
                }
            };
        }

        return {
            success: true,
            data: {
                profile: this.selectedProfile,
                profiles: []
            }
        };
    }
}

module.exports = ViewUserProfileEntity;

