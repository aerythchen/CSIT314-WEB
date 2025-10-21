const personinneed_searchrequest = require('../controller/personinneed_searchrequest');

class Personinneed_searchrequestBoundary {
    constructor() {
        this.controller = new personinneed_searchrequest();
    }

    async handleSearchRequest(data) {
        // Call controller and return result directly
        return await this.controller.searchRequest(data);
    }
}

module.exports = Personinneed_searchrequestBoundary;