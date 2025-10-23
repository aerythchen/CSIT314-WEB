const UserAccount = require('../entity/UserAccount');

class ViewUserAccountController {
    constructor() {
        this.entity = new UserAccount();
    }

    viewUserAccount(data) {
        console.log("ViewUserAccountController: Processing view account request...");
        
        // Get all accounts using searchAccounts method
        return this.entity.searchAccounts(null, null);
    }
}

module.exports = ViewUserAccountController;

