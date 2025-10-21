const Request = require('../entity/Request');

class UpdateRequestController {
    constructor() {
        this.entity = new Request();
    }

    async updateRequest(data) {
        const { requestId, userId, title, description, urgency } = data;
        console.log(`UpdateRequestController: Updating request ${requestId}...`);
        
        // Use Entity to update request
        return await this.entity.updateRequest(requestId, userId, { title, description, urgency });
    }

}

module.exports = UpdateRequestController;

