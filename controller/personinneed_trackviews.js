const Request = require('../entity/Request');

class TrackViewsController {
    constructor() {
        this.entity = new Request();
    }

    // Get view count for person's requests
    async getViewCount(data) {
        const { requestId } = data;
        return this.entity.getViewCount(requestId);
    }
}

module.exports = TrackViewsController;
