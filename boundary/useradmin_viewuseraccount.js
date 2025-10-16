const ViewUserAccountController = require('../controller/useradmin_viewuseraccount');

class ViewUserAccountBoundary {
    constructor() {
        this.controller = new ViewUserAccountController();
    }
    onClick() {
        console.log('UseradminViewuseraccountBoundary: User clicked action button');
        this.displayForm();
    }

    displayViewUserAccountForm() {
        console.log('=== View User Account ===');
        console.log('Please enter the account ID to view:');
    }

    handleViewUserAccount(accountId) {
        console.log('ViewUserAccountBoundary: Handling view user account request...');
        return this.controller.viewUserAccount(accountId);
    }

    displayViewUserAccountResult(result) {
        if (result.success) {
            console.log('✓ User account retrieved successfully!');
            console.log(`Account ID: ${result.data.account.id}`);
            console.log(`Username: ${result.data.account.username}`);
            console.log(`Status: ${result.data.account.status}`);
        } else {
            console.log('✗ Failed to retrieve user account!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ViewUserAccountBoundary;
