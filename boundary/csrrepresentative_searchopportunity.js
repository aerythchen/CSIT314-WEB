const csrrepresentative_searchopportunity = require('../controller/csrrepresentative_searchopportunity');

class Csrrepresentative_searchopportunityBoundary {
    constructor() {
        this.controller = new csrrepresentative_searchopportunity();
    }

    async handleSearchOpportunity(data) {
        const { searchTerm, category, urgency } = data;
        
        // Validate search criteria
        if (searchTerm && searchTerm.trim().length < 2) {
            return {
                success: false,
                error: "Search term must be at least 2 characters",
                results: []
            };
        }
        
        // Call controller for business logic
        return await this.controller.searchOpportunity(data);
    }
}

module.exports = Csrrepresentative_searchopportunityBoundary;