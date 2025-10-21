const personinneed_deleterequest = require('../controller/personinneed_deleterequest');

class Personinneed_deleterequestBoundary {
    constructor() {
        this.controller = new personinneed_deleterequest();
    }

    async handleDeleteRequest(data) {
        // Call controller and return result directly
        return await this.controller.deleteRequest(data);
    }
}

module.exports = Personinneed_deleterequestBoundary;