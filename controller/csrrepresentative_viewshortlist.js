const Request = require('../entity/Request');

class ViewShortlistController {
    constructor() {
        this.entity = new Request();
        // Entity ready to use
    }

    async viewShortlist(data) {
        const { userId } = data;
        
        // Get user's shortlist
        const result = await this.entity.getUserShortlist(userId);
        return result;
    }
}

module.exports = ViewShortlistController;