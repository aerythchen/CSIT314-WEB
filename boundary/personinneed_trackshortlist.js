const TrackShortlistController = require('../controller/personinneed_trackshortlist');

class TrackShortlistBoundary {
    constructor() {
        this.controller = new TrackShortlistController();
    }
    onClick() {
        console.log('PersoninneedTrackshortlistBoundary: User clicked action button');
        this.displayForm();
    }

    displayTrackShortlistForm() {
        console.log('=== Track Shortlist ===');
        console.log('Shortlist tracking information:');
    }

    handleTrackShortlist(requestId) {
        console.log('TrackShortlistBoundary: Handling track shortlist...');
        return this.controller.trackShortlist(requestId);
    }

    displayTrackShortlistResult(result) {
        if (result.success) {
            console.log('✓ Shortlist tracking retrieved successfully!');
            console.log(`Request ID: ${result.data.requestId}`);
            console.log(`Shortlist Count: ${result.data.shortlistCount}`);
        } else {
            console.log('✗ Failed to track shortlist!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = TrackShortlistBoundary;
