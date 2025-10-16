const CreateUserAccountController = require('../controller/useradmin_createuseraccount');

class CreateUserAccountBoundary {
    constructor() {
        this.controller = new CreateUserAccountController();
    }
    onClick() {
        console.log('UseradminCreateuseraccountBoundary: User clicked action button');
        this.displayForm();
    }

    displayCreateUserAccountForm() {
        console.log('=== Create User Account ===');
        console.log('Please enter the user account details:');
    }

    handleCreateUserAccount(accountData) {
        console.log('CreateUserAccountBoundary: Handling create user account request...');
        return this.controller.createUserAccount(accountData);
    }

    displayCreateUserAccountResult(result) {
        if (result.success) {
            console.log('✓ User account created successfully!');
            console.log(`Account ID: ${result.data.account.id}`);
            console.log(`Username: ${result.data.account.username}`);
        } else {
            console.log('✗ Failed to create user account!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = CreateUserAccountBoundary;
