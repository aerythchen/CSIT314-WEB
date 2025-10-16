const UpdateUserAccountController = require('../controller/useradmin_updateuseraccount');

class UpdateUserAccountBoundary {
    constructor() {
        this.controller = new UpdateUserAccountController();
    }
    onClick() {
        console.log('UseradminUpdateuseraccountBoundary: User clicked action button');
        this.displayForm();
    }

    displayUpdateUserAccountForm() {
        console.log('=== Update User Account ===');
        console.log('Please enter the account ID and updated details:');
    }

    handleUpdateUserAccount(accountId, updateData) {
        console.log('UpdateUserAccountBoundary: Handling update user account request...');
        return this.controller.updateUserAccount(accountId, updateData);
    }

    displayUpdateUserAccountResult(result) {
        if (result.success) {
            console.log('✓ User account updated successfully!');
            console.log(`Account ID: ${result.data.account.id}`);
            console.log(`Updated Username: ${result.data.account.username}`);
        } else {
            console.log('✗ Failed to update user account!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = UpdateUserAccountBoundary;
