const personinneed_updaterequest = require('../controller/personinneed_updaterequest');

class Personinneed_updaterequestBoundary {
    constructor() {
        this.controller = new personinneed_updaterequest();
    }

    async handleUpdateRequest(data) {
        const result = await this.controller.updateRequest(data);
        
        // If successful, redirect back to dashboard
        if (result.success) {
            return {
                ...result,
                redirectUrl: '/personinneed/dashboard?success=' + encodeURIComponent(result.message || 'Request updated successfully')
            };
        }
        
        return result;
    }
}

module.exports = Personinneed_updaterequestBoundary;