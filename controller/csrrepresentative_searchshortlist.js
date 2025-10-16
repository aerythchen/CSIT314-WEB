const CSRRepresentative = require('../entity/CSRRepresentative');

class SearchShortlistController {
    constructor() {
        this.entity = new CSRRepresentative();
        // Entity ready to use
    }

    searchShortlist(data) {
        console.log(`SearchShortlistController: Searching shortlist for user ${userId}...`);
        
        
        const { userId, searchTerm } = data;
        // Validate the search parameters
        const validationResult = this.validateShortlistSearch(userId, searchTerm, category);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                results: []
            };
        }
        
        // Process the search
        return this.processShortlistSearch(userId, searchTerm, category);
    }

    validateShortlistSearch(userId, searchTerm, category) {
        console.log("Validating shortlist search parameters...");
        
        if (!userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }
        
        // At least one search criterion should be provided
        if (!searchTerm && !category) {
            return {
                isValid: false,
                error: "Please provide at least one search criterion"
            };
        }
        
        return { isValid: true };
    }

    processShortlistSearch(userId, searchTerm, category) {
        console.log("Processing shortlist search...");
        
        // Use Entity to search shortlist
        const entityResult = this.entity.process({
            userId: userId,
            searchTerm: searchTerm,
            category: category
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                results: []
            };
        }
        
        // Get stored data
        const searchData = this.entity.getData();
        
        return {
            success: true,
            results: searchData.data.results,
            count: searchData.data.resultCount
        };
    }
}

module.exports = SearchShortlistController;

