const { db } = require('../database');

class SearchUserProfileEntity {
    constructor() {
        this.profiles = [];
        this.searchCriteria = {};
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchUserProfileEntity: Initializing...");
        this.profiles = [];
        this.searchCriteria = {};
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchUserProfileEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        const validUserTypes = ["all", "csrrepresentative", "personinneed", "platformmanager", "useradmin"];
        if (data.userType && !validUserTypes.includes(data.userType)) {
            return { isValid: false, error: "Invalid user type" };
        }

        const validStatuses = ["all", "active", "suspended", "inactive"];
        if (data.status && !validStatuses.includes(data.status)) {
            return { isValid: false, error: "Invalid status" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SearchUserProfileEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        this.searchCriteria = {
            searchTerm: data.searchTerm || "",
            userType: data.userType || "all",
            status: data.status || "all"
        };

        // Build search criteria
        let criteria = { isDeleted: false };
        
        if (data.userType && data.userType !== 'all') {
            criteria.userType = data.userType;
        }
        
        if (data.status && data.status !== 'all') {
            criteria.status = data.status;
        }

        // Perform search
        if (data.searchTerm && data.searchTerm.trim()) {
            this.profiles = db.searchMultipleFields('userProfiles',
                ['firstName', 'lastName', 'email'],
                data.searchTerm,
                criteria
            );
        } else {
            this.profiles = db.find('userProfiles', criteria);
        }

        console.log(`Search executed: ${this.profiles.length} results`);
        return {
            success: true,
            message: "Search completed",
            count: this.profiles.length
        };
    }

    getData() {
        console.log("SearchUserProfileEntity: Retrieving data...");
        
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
                profiles: this.profiles,
                count: this.profiles.length,
                searchCriteria: this.searchCriteria
            }
        };
    }
}

module.exports = SearchUserProfileEntity;

