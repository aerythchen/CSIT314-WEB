const csrrepresentative_removeshortlist = require('../controller/csrrepresentative_removeshortlist');

class Csrrepresentative_removeshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_removeshortlist();
    }

    async handleRemoveFromShortlist(data) {
        // Call controller directly
        return await this.controller.removeFromShortlist(data);
    }
}

module.exports = Csrrepresentative_removeshortlistBoundary;
