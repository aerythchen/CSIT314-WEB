const personinneed_viewhistory = require('../controller/personinneed_viewhistory');

class Personinneed_viewhistoryBoundary {
    constructor() {
        this.controller = new personinneed_viewhistory();
    }

    async handleViewHistory(data) {
        // Format data and call controller
        const formattedData = {
            ...data,
            userType: 'personinneed'
        };
        
        // Call controller - entity already returns proper response format
        return await this.controller.viewHistory(formattedData);
    }
}

module.exports = Personinneed_viewhistoryBoundary;