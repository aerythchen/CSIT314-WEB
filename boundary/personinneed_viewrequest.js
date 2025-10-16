const ViewRequestController = require('../controller/personinneed_viewrequest');

class ViewRequestBoundary {
    constructor() {
        this.controller = new ViewRequestController();
    }
    onClick() {
        console.log('PersoninneedViewrequestBoundary: User clicked action button');
        this.displayForm();
    }

    displayViewRequestForm() {
        console.log('=== View Request ===');
        console.log('Please enter the request ID to view:');
    }

    handleViewRequest(requestId) {
        console.log('ViewRequestBoundary: Handling view request...');
        return this.controller.viewRequest(requestId);
    }

    displayViewRequestResult(result) {
        if (result.success) {
            console.log('✓ Request retrieved successfully!');
            console.log(`Request ID: ${result.data.request.id}`);
            console.log(`Title: ${result.data.request.title}`);
            console.log(`Status: ${result.data.request.status}`);
        } else {
            console.log('✗ Failed to retrieve request!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ViewRequestBoundary;
