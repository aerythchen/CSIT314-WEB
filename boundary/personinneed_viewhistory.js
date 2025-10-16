const ViewHistoryController = require('../controller/personinneed_viewhistory');

class ViewHistoryBoundary {
    constructor() {
        this.controller = new ViewHistoryController();
    }
    onClick() {
        console.log('PersoninneedViewhistoryBoundary: User clicked action button');
        this.displayForm();
    }

    displayViewHistoryForm() {
        console.log('=== View History ===');
        console.log('Displaying your request history:');
    }

    handleViewHistory(userId) {
        console.log('ViewHistoryBoundary: Handling view history...');
        return this.controller.viewHistory(userId);
    }

    displayViewHistoryResult(result) {
        if (result.success) {
            console.log('✓ History retrieved successfully!');
            console.log(`Total requests: ${result.data.totalRequests}`);
            console.log(`Total views: ${result.data.totalViews}`);
            console.log(`Total shortlists: ${result.data.totalShortlists}`);
        } else {
            console.log('✗ Failed to retrieve history!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ViewHistoryBoundary;
