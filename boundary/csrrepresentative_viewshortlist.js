const ViewShortlistController = require('../controller/csrrepresentative_viewshortlist');

class ViewShortlistBoundary {
    constructor() {
        this.controller = new ViewShortlistController();
    }
    onClick() {
        console.log('CsrrepresentativeViewshortlistBoundary: User clicked action button');
        this.displayForm();
    }

    displayViewShortlistForm() {
        console.log('=== View Shortlist ===');
        console.log('Displaying your shortlist:');
    }

    handleViewShortlist(userId) {
        console.log('ViewShortlistBoundary: Handling view shortlist...');
        return this.controller.viewShortlist(userId);
    }

    displayViewShortlistResult(result) {
        if (result.success) {
            console.log('✓ Shortlist retrieved successfully!');
            console.log(`Total shortlist entries: ${result.data.shortlist.length}`);
            result.data.shortlist.forEach(entry => {
                console.log(`- ${entry.opportunityTitle} (${entry.category})`);
            });
        } else {
            console.log('✗ Failed to retrieve shortlist!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ViewShortlistBoundary;
