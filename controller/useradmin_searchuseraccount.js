const UserAccount = require('../entity/UserAccount');

class SearchUserAccountController {
    constructor() {
        this.entity = new UserAccount();
    }

    searchUserAccount(data) {
        console.log("SearchUserAccountController: Processing search request...");
        
        // Call entity's searchAccounts method
        return this.entity.searchAccounts(data.searchTerm, data.status);
    }
}

module.exports = SearchUserAccountController;

