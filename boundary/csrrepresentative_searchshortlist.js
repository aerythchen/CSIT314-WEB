const csrrepresentative_searchshortlist = require('../controller/csrrepresentative_searchshortlist');

class Csrrepresentative_searchshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_searchshortlist();
    }

    async handleSearchShortlist(data) {
        const { userId, searchTerm, category, urgency } = data;
        
        // Validate search criteria
        if (searchTerm && searchTerm.trim().length < 2) {
            return {
                success: false,
                error: "Search term must be at least 2 characters",
                results: []
            };
        }
        
        // Call controller for business logic
        const result = await this.controller.searchShortlist(data);
        
        // If successful and has shortlist items, render view
        if (result.success && result.data && result.data.shortlistItems) {
            return {
                success: true,
                renderView: 'csrrepresentative/shortlist_results',
                viewData: {
                    shortlistItems: result.data.shortlistItems,
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

module.exports = Csrrepresentative_searchshortlistBoundary;