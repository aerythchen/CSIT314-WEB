const csrrepresentative_viewshortlist = require('../controller/csrrepresentative_viewshortlist');

class Csrrepresentative_viewshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewshortlist();
    }

    async handleViewShortlist(data) {
        return await this.controller.viewShortlist(data);
    }
}

module.exports = Csrrepresentative_viewshortlistBoundary;