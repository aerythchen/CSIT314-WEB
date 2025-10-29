const Request = require('../entity/Request');

class SearchHistoryController {
    constructor() {
        this.entity = new Request();
    }

    async searchHistory(data) {
        const { userId, category, urgency, status, dateFrom, dateTo } = data;
        
        console.log(`SearchHistoryController: Searching completed requests for user ${userId}`);
        
        // Build filters object
        const filters = {};
        if (category) {
            filters.category = category;
        }
        if (urgency) {
            filters.urgency = urgency;
        }
        if (status) {
            filters.status = status;
        }
        if (dateFrom || dateTo) {
            filters.dateRange = { from: dateFrom, to: dateTo };
        }
        
        // Use Request entity to search completed requests with filters
        return await this.entity.getCompletedRequestsByUser(userId, filters);
    }
}

module.exports = SearchHistoryController;

