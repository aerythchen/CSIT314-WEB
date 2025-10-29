const personinneed_trackviews = require('../controller/personinneed_trackviews');

class Personinneed_trackviewsBoundary {
    constructor() {
        this.controller = new personinneed_trackviews();
    }

    // Handle getting view count for person's requests
    async handleGetViewCount(data) {
        return await this.controller.getViewCount(data);
    }
}

module.exports = Personinneed_trackviewsBoundary;
