const Request = require('../entity/Request');

class DeleteRequestController {
    constructor() {
        this.entity = new Request();
    }

    async deleteRequest(data) {
        const { requestId, userId } = data;
        console.log(`DeleteRequestController: Deleting request ${requestId}...`);
        
        // Use Entity to delete request
        return await this.entity.deleteRequest(requestId, userId);
    }

}

module.exports = DeleteRequestController;

