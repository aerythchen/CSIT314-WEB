const Request = require('../entity/Request');

class SearchRequestController {
    constructor() {
        this.entity = new Request();
    }

    async searchRequest(data) {
        const { userId, searchTerm, status, category, urgency, dateRange } = data;
        console.log("SearchRequestController: Processing search request...");
        
        // Use Entity to search user's requests
        return await this.entity.searchUserRequests(userId, { searchTerm, status, category, urgency, dateRange });
    }

}

module.exports = SearchRequestController;

