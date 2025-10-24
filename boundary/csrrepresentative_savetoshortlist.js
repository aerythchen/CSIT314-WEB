const csrrepresentative_savetoshortlist = require('../controller/csrrepresentative_savetoshortlist');

class Csrrepresentative_savetoshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_savetoshortlist();
    }

    async handleSaveToShortlist(data) {
        const result = await this.controller.saveToShortlist(data);
        return result;
    }

}

module.exports = Csrrepresentative_savetoshortlistBoundary;