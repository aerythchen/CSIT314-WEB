const Request = require('../entity/Request');

class SearchHistoryController {
    constructor() {
        this.entity = new Request();
        // Entity ready to use
    }

    async searchHistory(data) {
        console.log("SearchHistoryController: Processing search request...");
        
        const { userId, searchTerm, category, urgency, status } = data;
        
        // Call entity directly
        return await this.entity.searchUserHistory(userId, searchTerm, category, urgency, status);
    }
}

module.exports = SearchHistoryController;