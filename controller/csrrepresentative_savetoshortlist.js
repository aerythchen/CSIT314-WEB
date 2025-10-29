const Request = require('../entity/Request');

class SaveToShortlistController {
    constructor() {
        this.entity = new Request();
    }

    async saveToShortlist(data) {
        const { requestId, userId } = data;
        console.log(`SaveToShortlistController: Saving request ${requestId} to shortlist for user ${userId}...`);
        
        // Add to shortlist using Request entity (this already tracks shortlist count)
        return await this.entity.addToShortlist(userId, requestId);
    }
}

module.exports = SaveToShortlistController;

