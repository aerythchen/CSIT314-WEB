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
        const result = await this.controller.searchOpportunity(data);
        
        // If successful and has opportunities, render view
        if (result.success && result.data && result.data.opportunities) {
            return {
                success: true,
                renderView: 'csrrepresentative/search_results',
                viewData: {
                    opportunities: result.data.opportunities,
                    success: result.message,
                    error: null,
                    viewAll: data.viewAll || (!data.searchTerm && !data.category && !data.urgency),
                    searchTerm: data.searchTerm || '',
                    category: data.category || '',
                    urgency: data.urgency || ''
                }
            };
        }
        
        return result;
    }
}

module.exports = Csrrepresentative_searchopportunityBoundary;