const { db } = require('../database');

class SearchHistoryEntity {
    constructor() {
        this.searchHistory = [];
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchHistoryEntity: Initializing...");
        this.searchHistory = [];
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchHistoryEntity: Validating data...");
        
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
        console.log("SearchHistoryEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Get all search history for this user
        let history = db.find('searchHistory', { userId: data.userId });

        // Sort by most recent first
        history.sort((a, b) => 
            new Date(b.searchedAt) - new Date(a.searchedAt)
        );

        // Limit to most recent searches if limit provided
        if (data.limit && typeof data.limit === 'number') {
            history = history.slice(0, data.limit);
        }

        // Format history
        this.searchHistory = history.map(search => ({
            id: search.id,
            searchTerm: search.searchTerm,
            filters: search.filters || {},
            resultCount: search.resultCount || 0,
            searchedAt: search.searchedAt
        }));

        console.log(`Retrieved ${this.searchHistory.length} search history items`);
        return {
            success: true,
            message: "Search history retrieved",
            count: this.searchHistory.length
        };
    }

    getData() {
        console.log("SearchHistoryEntity: Retrieving data...");
        
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
                searchHistory: this.searchHistory,
                count: this.searchHistory.length
            }
        };
    }
}

module.exports = SearchHistoryEntity;
