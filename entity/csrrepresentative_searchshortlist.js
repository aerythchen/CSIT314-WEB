const { db } = require('../database');

class SearchShortlistEntity {
    constructor() {
        this.shortlist = [];
        this.searchCriteria = {};
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchShortlistEntity: Initializing...");
        this.shortlist = [];
        this.searchCriteria = {};
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchShortlistEntity: Validating data...");
        
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
        console.log("SearchShortlistEntity: Processing data...");
        
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
            urgency: data.urgency || null
        };

        // Get user's shortlist
        const userShortlists = db.find('shortlists', { 
            userId: data.userId, 
            isActive: true 
        });

        // Get all shortlisted requests
        let shortlistedRequests = userShortlists.map(shortlist => {
            const request = db.findById('requests', shortlist.requestId);
            if (request && !request.isDeleted) {
                return {
                    ...shortlist,
                    request: request
                };
            }
            return null;
        }).filter(item => item !== null);

        // Apply filters
        if (data.categoryId) {
            shortlistedRequests = shortlistedRequests.filter(item => 
                item.request.categoryId === data.categoryId
            );
        }

        if (data.urgency) {
            shortlistedRequests = shortlistedRequests.filter(item => 
                item.request.urgency === data.urgency
            );
        }

        // Apply search term
        if (data.searchTerm && data.searchTerm.trim()) {
            const term = data.searchTerm.toLowerCase();
            shortlistedRequests = shortlistedRequests.filter(item => {
                const request = item.request;
                return (
                    (request.title && request.title.toLowerCase().includes(term)) ||
                    (request.description && request.description.toLowerCase().includes(term)) ||
                    (request.location && request.location.toLowerCase().includes(term))
                );
            });
        }

        this.shortlist = shortlistedRequests;

        console.log(`Search executed: ${this.shortlist.length} results`);
        return {
            success: true,
            message: "Search completed",
            count: this.shortlist.length
        };
    }

    getData() {
        console.log("SearchShortlistEntity: Retrieving data...");
        
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
                count: this.shortlist.length,
                searchCriteria: this.searchCriteria
            }
        };
    }
}

module.exports = SearchShortlistEntity;
