const ManageShortlistController = require('../controller/csrrepresentative_manageshortlist');

class ManageShortlistBoundary {
    constructor() {
        this.controller = new ManageShortlistController();
    }
    onClick() {
        console.log('CsrrepresentativeManageshortlistBoundary: User clicked action button');
        this.displayForm();
    }

    displayManageShortlistForm() {
        console.log('=== Manage Shortlist ===');
        console.log('Shortlist management options:');
    }

    handleManageShortlist(action, data) {
        console.log('ManageShortlistBoundary: Handling manage shortlist...');
        return this.controller.manageShortlist(action, data);
    }

    displayManageShortlistResult(result) {
        if (result.success) {
            console.log('✓ Shortlist managed successfully!');
            console.log(`Action: ${result.data.action} completed`);
        } else {
            console.log('✗ Failed to manage shortlist!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ManageShortlistBoundary;
