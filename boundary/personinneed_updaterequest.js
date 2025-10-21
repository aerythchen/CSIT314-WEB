const personinneed_updaterequest = require('../controller/personinneed_updaterequest');

class Personinneed_updaterequestBoundary {
    constructor() {
        this.controller = new personinneed_updaterequest();
    }

    async handleUpdateRequest(data) {
        // Call controller and return result directly
        return await this.controller.updateRequest(data);
    }
}

module.exports = Personinneed_updaterequestBoundary;