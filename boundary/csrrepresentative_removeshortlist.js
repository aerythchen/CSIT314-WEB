const RemoveShortlistController = require('../controller/csrrepresentative_removeshortlist');

class RemoveShortlistBoundary {
    constructor() {
        this.controller = new RemoveShortlistController();
    }
    onClick() {
        console.log('CsrrepresentativeRemoveshortlistBoundary: User clicked action button');
        this.displayForm();
    }

    displayRemoveShortlistForm() {
        console.log('=== Remove from Shortlist ===');
        console.log('Please enter the shortlist ID to remove:');
    }

    handleRemoveShortlist(shortlistId) {
        console.log('RemoveShortlistBoundary: Handling remove shortlist...');
        return this.controller.removeShortlist(shortlistId);
    }

    displayRemoveShortlistResult(result) {
        if (result.success) {
            console.log('✓ Shortlist entry removed successfully!');
            console.log(`Shortlist ID: ${result.data.shortlistId} has been removed`);
        } else {
            console.log('✗ Failed to remove shortlist entry!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = RemoveShortlistBoundary;
