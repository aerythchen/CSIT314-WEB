const { db } = require('../database');
const { RequestHelpers } = require('../database/helpers');

class SearchRequestEntity {
    constructor() {
        this.requests = [];
        this.searchCriteria = {};
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchRequestEntity: Initializing...");
        this.requests = [];
        this.searchCriteria = {};
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchRequestEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SearchRequestEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        this.searchCriteria = {
            searchTerm: data.searchTerm || "",
            categoryId: data.categoryId || null,
            urgency: data.urgency || null,
            status: data.status || null
        };

        // Build search criteria
        let criteria = { isDeleted: false };
        
        if (data.categoryId) {
            criteria.categoryId = data.categoryId;
        }
        
        if (data.urgency) {
            criteria.urgency = data.urgency;
        }
        
        if (data.status) {
            criteria.status = data.status;
        }

        // Perform search using helper
        this.requests = RequestHelpers.searchRequests(data.searchTerm, criteria);

        // Record search history if userId provided
        if (data.userId) {
            db.insert('searchHistory', {
                userId: data.userId,
                searchTerm: data.searchTerm || "",
                filters: this.searchCriteria,
                resultCount: this.requests.length
            });
        }

        console.log(`Search executed: ${this.requests.length} results`);
        return {
            success: true,
            message: "Search completed",
            count: this.requests.length
        };
    }

    getData() {
        console.log("SearchRequestEntity: Retrieving data...");
        
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
                requests: this.requests,
                count: this.requests.length,
                searchCriteria: this.searchCriteria
            }
        };
    }
}

module.exports = SearchRequestEntity;
