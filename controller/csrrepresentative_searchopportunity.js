const SearchOpportunityEntity = require('../entity/csrrepresentative_searchopportunity');

class SearchOpportunityController {
    constructor() {
        this.entity = new SearchOpportunityEntity();
        this.entity.initialize();
    }

    searchOpportunity(searchTerm, category, location) {
        console.log("SearchOpportunityController: Processing search request...");
        
        // Validate search criteria
        const validationResult = this.validateSearchCriteria(searchTerm, category, location);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                results: []
            };
        }
        
        // Process the search request
        return this.processSearchRequest(searchTerm, category, location);
    }

    validateSearchCriteria(searchTerm, category, location) {
        console.log("Validating search criteria...");
        
        // At least one search criterion must be provided
        if (!searchTerm && !category && !location) {
            return {
                isValid: false,
                error: "Please provide at least one search criterion"
            };
        }
        
        // Validate search term length if provided
        if (searchTerm && searchTerm.trim().length < 2) {
            return {
                isValid: false,
                error: "Search term must be at least 2 characters"
            };
        }
        
        return { isValid: true };
    }

    processSearchRequest(searchTerm, category, location) {
        console.log("Processing search with filters:", { searchTerm, category, location });
        
        // Use Entity to search opportunities
        const entityResult = this.entity.process({
            searchTerm: searchTerm,
            category: category,
            location: location
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                results: []
            };
        }
        
        // Get stored data from entity
        const searchData = this.entity.getData();
        
        return {
            success: true,
            results: searchData.data.results,
            count: searchData.data.resultCount
        };
    }
}

module.exports = SearchOpportunityController;

