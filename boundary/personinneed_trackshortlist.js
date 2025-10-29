const personinneed_trackshortlist = require('../controller/personinneed_trackshortlist');

class Personinneed_trackshortlistBoundary {
    constructor() {
        this.controller = new personinneed_trackshortlist();
    }

    // Handle getting shortlist count for person's requests
    async handleGetShortlistCount(data) {
        return await this.controller.getShortlistCount(data);
    }
}

module.exports = Personinneed_trackshortlistBoundary;
