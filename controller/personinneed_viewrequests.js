const Request = require('../entity/Request');

class ViewRequestsController {
    constructor() {
        this.entity = new Request();
    }

    // Get all requests for a user (for dashboard)
    async viewRequests(data) {
        console.log("ViewRequestsController: Processing view requests...");
        
        // Use Entity to get user's requests and return result directly
        return await this.entity.getRequestsByUser(data.userId);
    }

}

module.exports = ViewRequestsController;
