const Request = require('../entity/Request');

class ViewHistoryController {
    constructor() {
        this.entity = new Request();
        // Entity ready to use
    }

    async viewHistory(data) {
        const { userId } = data;
        
        // Get user's match history
        const result = await this.entity.getUserHistory(userId);
        return result;
    }

    async completeMatch(data) {
        const { userId, matchId, notes } = data;
        
        console.log(`ViewHistoryController: Completing match ${matchId} for user ${userId}`);
        
        // Call entity to complete match
        const result = await this.entity.completeMatch(userId, matchId, notes);
        return result;
    }
}

module.exports = ViewHistoryController;