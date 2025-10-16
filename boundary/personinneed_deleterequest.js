const DeleteRequestController = require('../controller/personinneed_deleterequest');

class DeleteRequestBoundary {
    constructor() {
        this.controller = new DeleteRequestController();
    }
    onClick() {
        console.log('PersoninneedDeleterequestBoundary: User clicked action button');
        this.displayForm();
    }

    displayDeleteRequestForm() {
        console.log('=== Delete Request ===');
        console.log('Please enter the request ID to delete:');
    }

    handleDeleteRequest(requestId) {
        console.log('DeleteRequestBoundary: Handling delete request...');
        return this.controller.deleteRequest(requestId);
    }

    displayDeleteRequestResult(result) {
        if (result.success) {
            console.log('✓ Request deleted successfully!');
            console.log(`Request ID: ${result.data.requestId} has been deleted`);
        } else {
            console.log('✗ Failed to delete request!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = DeleteRequestBoundary;
