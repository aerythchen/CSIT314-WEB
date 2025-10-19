const Request = require('../entity/Request');

class SaveToShortlistController {
    constructor() {
        this.entity = new Request();
        // Entity ready to use
    }

    async saveToShortlist(data) {
        const { opportunityId, userId } = data;
        console.log(`SaveToShortlistController: Saving opportunity ${opportunityId} for user ${userId}...`);
        
        // Call entity directly and return result
        return await this.entity.saveToShortlist(userId, opportunityId);
    }
}

module.exports = SaveToShortlistController;

