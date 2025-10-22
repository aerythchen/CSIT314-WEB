const personinneed_searchhistory = require('../controller/personinneed_searchhistory');

class Personinneed_searchhistoryBoundary {
    constructor() {
        this.controller = new personinneed_searchhistory();
    }

    async handleSearchHistory(data) {
        // Format data and call controller
        const formattedData = {
            ...data,
            userType: 'personinneed'
        };
        
        // Call controller - entity already returns proper response format
        return await this.controller.searchHistory(formattedData);
    }
}

module.exports = Personinneed_searchhistoryBoundary;