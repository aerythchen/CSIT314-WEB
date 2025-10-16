const SaveToShortlistController = require('../controller/csrrepresentative_savetoshortlist');

class SaveToShortlistBoundary {
    constructor() {
        this.controller = new SaveToShortlistController();
    }
    onClick() {
        console.log('CsrrepresentativeSavetoshortlistBoundary: User clicked action button');
        this.displayForm();
    }

    displaySaveToShortlistForm() {
        console.log('=== Save to Shortlist ===');
        console.log('Please enter the opportunity ID to save:');
    }

    handleSaveToShortlist(opportunityId, userId) {
        console.log('SaveToShortlistBoundary: Handling save to shortlist...');
        return this.controller.saveToShortlist(opportunityId, userId);
    }

    displaySaveToShortlistResult(result) {
        if (result.success) {
            console.log('✓ Opportunity saved to shortlist successfully!');
            console.log(`Opportunity ID: ${result.data.opportunityId}`);
            console.log(`Shortlist ID: ${result.data.shortlistId}`);
        } else {
            console.log('✗ Failed to save to shortlist!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = SaveToShortlistBoundary;
