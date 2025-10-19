const Request = require('../entity/Request');

class SearchOpportunityController {
    constructor() {
        this.entity = new Request();
        // Entity ready to use
    }

    async searchOpportunity(data) {
        console.log("SearchOpportunityController: Processing search request...");
        
        const { searchTerm, category, urgency, userId } = data;
        
        // Call entity directly
        return await this.entity.searchOpportunities(searchTerm, category, urgency);
    }
}

module.exports = SearchOpportunityController;

