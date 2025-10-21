const Request = require('../entity/Request');

class SearchHistoryController {
    constructor() {
        this.entity = new Request();
    }

    async searchHistory(data) {
        const { userId, category, dateRange } = data;
        
        console.log(`SearchHistoryController: Searching completed requests for user ${userId}`);
        
        // Build filters object
        const filters = {};
        if (category) {
            filters.category = category;
        }
        if (dateRange) {
            filters.dateRange = dateRange;
        }
        
        // Use Request entity to search completed requests with filters
        return await this.entity.getCompletedRequestsByUser(userId, filters);
    }
}

module.exports = SearchHistoryController;

