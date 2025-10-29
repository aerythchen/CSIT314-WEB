const Request = require('../entity/Request');

class TrackShortlistController {
    constructor() {
        this.entity = new Request();
    }

    // Get shortlist count for person's requests
    async getShortlistCount(data) {
        const { requestId } = data;
        return this.entity.getShortlistCount(requestId);
    }
}

module.exports = TrackShortlistController;
