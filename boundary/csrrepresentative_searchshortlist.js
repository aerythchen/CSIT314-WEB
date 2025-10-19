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
        return await this.controller.searchShortlist(data);
    }
}

module.exports = Csrrepresentative_searchshortlistBoundary;