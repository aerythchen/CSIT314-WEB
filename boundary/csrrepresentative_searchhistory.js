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
        return await this.controller.searchHistory(data);
    }
}

module.exports = Csrrepresentative_searchhistoryBoundary;