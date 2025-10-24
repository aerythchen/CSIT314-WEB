const personinneed_updaterequest = require('../controller/personinneed_updaterequest');

class Personinneed_updaterequestBoundary {
    constructor() {
        this.controller = new personinneed_updaterequest();
    }

    async handleUpdateRequest(data) {
        const result = await this.controller.updateRequest(data);
        
        // Return JSON response
        return result;
    }
}

module.exports = Personinneed_updaterequestBoundary;