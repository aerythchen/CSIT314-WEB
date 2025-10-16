const CSRRepresentative = require('../entity/CSRRepresentative');

class SearchOpportunityController {
    constructor() {
        this.entity = new CSRRepresentative();
        // Entity ready to use
    }

    searchOpportunity(data) {
        console.log("SearchOpportunityController: Processing search request...");
        
        const { searchTerm, category, urgency, userId } = data;
        
        // Validate search criteria
        const validationResult = this.validateSearchCriteria(searchTerm, category, urgency);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                results: []
            };
        }
        
        // Process the search request
        return this.processSearchRequest(searchTerm, category, urgency, userId);
    }

    validateSearchCriteria(searchTerm, category, urgency) {
        console.log("Validating search criteria...");
        
        // Allow empty criteria for "View All" functionality
        // Only validate search term length if provided
        if (searchTerm && searchTerm.trim().length < 2) {
            return {
                isValid: false,
                error: "Search term must be at least 2 characters"
            };
        }
        
        return { isValid: true };
    }

    processSearchRequest(searchTerm, category, urgency, userId) {
        console.log("Processing search with filters:", { searchTerm, category, urgency });
        
        // Use consolidated entity method directly
        const result = this.entity.searchOpportunities(searchTerm, category, urgency);
        
        if (!result.success) {
            return {
                success: false,
                error: result.error,
                results: []
            };
        }
        
        return {
            success: true,
            data: result.data,
            count: result.count
        };
    }
}

module.exports = SearchOpportunityController;

