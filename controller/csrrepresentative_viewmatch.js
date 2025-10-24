const Request = require('../entity/Request');

class ViewMatchController {
    constructor() {
        this.entity = new Request();
    }

    async viewMatch(data) {
        const { matchId } = data;
        
        console.log(`ViewMatchController: Getting match details for ${matchId}`);
        
        // Get specific match details
        const result = await this.entity.viewMatchDetails(matchId);
        return result;
    }
}

module.exports = ViewMatchController;
