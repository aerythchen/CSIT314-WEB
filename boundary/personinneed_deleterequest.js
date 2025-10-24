const personinneed_deleterequest = require('../controller/personinneed_deleterequest');

class Personinneed_deleterequestBoundary {
    constructor() {
        this.controller = new personinneed_deleterequest();
    }

    async handleDeleteRequest(data) {
        const result = await this.controller.deleteRequest(data);
        
        // If successful, redirect back to dashboard
        if (result.success) {
            return {
                ...result,
                redirectUrl: '/personinneed/dashboard?success=' + encodeURIComponent(result.message || 'Request deleted successfully')
            };
        }
        
        return result;
    }
}

module.exports = Personinneed_deleterequestBoundary;