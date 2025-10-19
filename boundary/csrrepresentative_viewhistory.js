const csrrepresentative_viewhistory = require('../controller/csrrepresentative_viewhistory');

class Csrrepresentative_viewhistoryBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewhistory();
    }

    async handleViewHistory(data) {
        return await this.controller.viewHistory(data);
    }

    async handleCompleteMatch(data) {
        const { matchId } = data;
        
        if (!matchId) {
            return {
                success: false,
                error: "Match ID is required",
                data: null
            };
        }
        
        return await this.controller.completeMatch(data);
    }
}

module.exports = Csrrepresentative_viewhistoryBoundary;