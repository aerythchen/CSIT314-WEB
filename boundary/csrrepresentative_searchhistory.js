const csrrepresentative_searchhistory = require('../controller/csrrepresentative_searchhistory');

class Csrrepresentative_searchhistoryBoundary {
    constructor() {
        this.controller = new csrrepresentative_searchhistory();
    }

    async handleSearchHistory(data) {
        const { userId, searchTerm, category, urgency, status } = data;
        
        // Validate search criteria
        if (searchTerm && searchTerm.trim().length < 2) {
            return {
                success: false,
                error: "Search term must be at least 2 characters",
                results: []
            };
        }
        
        // Call controller for business logic
        const result = await this.controller.searchHistory(data);
        
        // If successful and has history items, render view
        if (result.success && result.data && result.data.historyItems) {
            return {
                success: true,
                renderView: 'csrrepresentative/history_results',
                viewData: {
                    historyItems: result.data.historyItems,
                    success: result.message,
                    error: null,
                    viewAll: data.viewAll || (!data.searchTerm && !data.category && !data.urgency && !data.status),
                    searchTerm: data.searchTerm || '',
                    category: data.category || '',
                    urgency: data.urgency || '',
                    status: data.status || ''
                }
            };
        }
        
        return result;
    }
}

module.exports = Csrrepresentative_searchhistoryBoundary;