const Request = require('../entity/Request');

class ViewHistoryController {
    constructor() {
        this.entity = new Request();
    }

    async viewHistory(data) {
        const { userId } = data;
        
        console.log(`ViewHistoryController: Getting completed requests for user ${userId}`);
        
        // Use Request entity to get completed requests (no filters)
        return await this.entity.getCompletedRequestsByUser(userId);
    }
}

module.exports = ViewHistoryController;

