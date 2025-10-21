const Request = require('../entity/Request');

class CreateRequestController {
    constructor() {
        this.entity = new Request();
    }

    createRequest(data) {
        console.log("CreateRequestController: Processing request creation...");
        
        // Use Entity to create request and return result directly
        return this.entity.createRequest(data);
    }
}

module.exports = CreateRequestController;

