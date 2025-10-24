const csrrepresentative_viewshortlist = require('../controller/csrrepresentative_viewshortlist');

class Csrrepresentative_viewshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewshortlist();
    }

    async handleViewShortlist(data) {
        const result = await this.controller.viewShortlist(data);
        
        // Return JSON response
        return result;
    }
}

module.exports = Csrrepresentative_viewshortlistBoundary;