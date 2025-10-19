const csrrepresentative_savetoshortlist = require('../controller/csrrepresentative_savetoshortlist');

class Csrrepresentative_savetoshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_savetoshortlist();
    }

    async handleSaveToShortlist(data) {
        // Call controller directly
        return await this.controller.saveToShortlist(data);
    }

    async handleFormSubmission(formData) {
        return this.handleSaveToShortlist(formData);
    }
}

module.exports = Csrrepresentative_savetoshortlistBoundary;