const { db } = require('../database');
const { ShortlistHelpers } = require('../database/helpers');

class RemoveFromShortlistEntity {
    constructor() {
        this.result = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("RemoveFromShortlistEntity: Initializing...");
        this.result = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("RemoveFromShortlistEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.requestId || typeof data.requestId !== 'string') {
            return { isValid: false, error: "Valid request ID is required" };
        }

        if (!data.userId || typeof data.userId !== 'string') {
            return { isValid: false, error: "Valid user ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("RemoveFromShortlistEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Remove from shortlist using helper
        const result = ShortlistHelpers.removeFromShortlist(data.requestId, data.userId);

        if (!result.success) {
            return result;
        }

        this.result = result.data;

        console.log("Removed from shortlist successfully");
        return {
            success: true,
            message: "Removed from shortlist",
            data: {
                requestId: data.requestId
            }
        };
    }

    getData() {
        console.log("RemoveFromShortlistEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.result
        };
    }
}

module.exports = RemoveFromShortlistEntity;

