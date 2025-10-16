const { db } = require('../database');
const { ShortlistHelpers } = require('../database/helpers');

class ViewShortlistEntity {
    constructor() {
        this.shortlist = [];
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewShortlistEntity: Initializing...");
        this.shortlist = [];
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewShortlistEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.userId || typeof data.userId !== 'string') {
            return { isValid: false, error: "Valid user ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewShortlistEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Get user's shortlist using helper
        this.shortlist = ShortlistHelpers.getUserShortlist(data.userId);

        console.log(`Retrieved ${this.shortlist.length} shortlisted items`);
        return {
            success: true,
            message: "Shortlist retrieved",
            count: this.shortlist.length
        };
    }

    getData() {
        console.log("ViewShortlistEntity: Retrieving data...");
        
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
                shortlist: this.shortlist,
                count: this.shortlist.length
            }
        };
    }
}

module.exports = ViewShortlistEntity;
