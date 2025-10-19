const Request = require('../entity/Request');

class SearchShortlistController {
    constructor() {
        this.entity = new Request();
        // Entity ready to use
    }

    async searchShortlist(data) {
        console.log("SearchShortlistController: Processing search request...");
        
        const { userId, searchTerm, category, urgency } = data;
        
        // Call entity directly
        return await this.entity.searchUserShortlist(userId, searchTerm, category, urgency);
    }
}

module.exports = SearchShortlistController;