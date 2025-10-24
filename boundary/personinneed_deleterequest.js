const personinneed_deleterequest = require('../controller/personinneed_deleterequest');

class Personinneed_deleterequestBoundary {
    constructor() {
        this.controller = new personinneed_deleterequest();
    }

    async handleDeleteRequest(data) {
        const result = await this.controller.deleteRequest(data);
        
        // Return JSON response
        return result;
    }
}

module.exports = Personinneed_deleterequestBoundary;