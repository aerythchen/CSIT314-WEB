const TrackViewsController = require('../controller/personinneed_trackviews');

class TrackViewsBoundary {
    constructor() {
        this.controller = new TrackViewsController();
    }
    onClick() {
        console.log('PersoninneedTrackviewsBoundary: User clicked action button');
        this.displayForm();
    }

    displayTrackViewsForm() {
        console.log('=== Track Views ===');
        console.log('View tracking information:');
    }

    handleTrackViews(requestId) {
        console.log('TrackViewsBoundary: Handling track views...');
        return this.controller.trackViews(requestId);
    }

    displayTrackViewsResult(result) {
        if (result.success) {
            console.log('✓ View tracking retrieved successfully!');
            console.log(`Request ID: ${result.data.requestId}`);
            console.log(`View Count: ${result.data.viewCount}`);
        } else {
            console.log('✗ Failed to track views!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = TrackViewsBoundary;
