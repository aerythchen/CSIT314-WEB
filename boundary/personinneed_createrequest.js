const CreateRequestController = require('../controller/personinneed_createrequest');

class CreateRequestBoundary {
    constructor() {
        this.controller = new CreateRequestController();
    }
    onClick() {
        console.log('PersoninneedCreaterequestBoundary: User clicked action button');
        this.displayForm();
    }

    displayCreateRequestForm() {
        console.log('=== Create Request ===');
        console.log('Please enter your request details:');
    }

    handleCreateRequest(requestData) {
        console.log('CreateRequestBoundary: Handling create request...');
        return this.controller.createRequest(requestData);
    }

    displayCreateRequestResult(result) {
        if (result.success) {
            console.log('✓ Request created successfully!');
            console.log(`Request ID: ${result.data.request.id}`);
            console.log(`Title: ${result.data.request.title}`);
        } else {
            console.log('✗ Failed to create request!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = CreateRequestBoundary;
