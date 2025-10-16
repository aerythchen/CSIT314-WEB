const SuspendUserAccountController = require('../controller/useradmin_suspenduseraccount');

class SuspendUserAccountBoundary {
    constructor() {
        this.controller = new SuspendUserAccountController();
    }
    onClick() {
        console.log('UseradminSuspenduseraccountBoundary: User clicked action button');
        this.displayForm();
    }

    displaySuspendUserAccountForm() {
        console.log('=== Suspend User Account ===');
        console.log('Please enter the account ID to suspend:');
    }

    handleSuspendUserAccount(accountId, reason) {
        console.log('SuspendUserAccountBoundary: Handling suspend user account request...');
        return this.controller.suspendUserAccount(accountId, reason);
    }

    displaySuspendUserAccountResult(result) {
        if (result.success) {
            console.log('✓ User account suspended successfully!');
            console.log(`Account ID: ${result.data.account.id}`);
            console.log(`Status: ${result.data.account.status}`);
        } else {
            console.log('✗ Failed to suspend user account!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = SuspendUserAccountBoundary;
