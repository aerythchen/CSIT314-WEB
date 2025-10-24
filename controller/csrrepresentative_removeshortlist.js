const Request = require('../entity/Request');

class RemoveShortlistController {
    constructor() {
        this.entity = new Request();
    }

    async removeFromShortlist(data) {
        console.log("RemoveShortlistController: Processing remove from shortlist...");
        // Correct parameter order: userId, requestId
        return await this.entity.removeFromShortlist(data.userId, data.requestId);
    }
}

module.exports = RemoveShortlistController;
