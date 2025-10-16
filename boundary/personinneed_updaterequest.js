const UpdateRequestController = require('../controller/personinneed_updaterequest');

class UpdateRequestBoundary {
    constructor() {
        this.controller = new UpdateRequestController();
    }
    onClick() {
        console.log('PersoninneedUpdaterequestBoundary: User clicked action button');
        this.displayForm();
    }

    displayUpdateRequestForm() {
        console.log('=== Update Request ===');
        console.log('Please enter the request ID and updated details:');
    }

    handleUpdateRequest(requestId, updateData) {
        console.log('UpdateRequestBoundary: Handling update request...');
        return this.controller.updateRequest(requestId, updateData);
    }

    displayUpdateRequestResult(result) {
        if (result.success) {
            console.log('✓ Request updated successfully!');
            console.log(`Request ID: ${result.data.request.id}`);
            console.log(`Updated Title: ${result.data.request.title}`);
        } else {
            console.log('✗ Failed to update request!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = UpdateRequestBoundary;
