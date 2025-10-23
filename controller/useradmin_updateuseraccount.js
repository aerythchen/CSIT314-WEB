const UserAccount = require('../entity/UserAccount');

class UpdateUserAccountController {
    constructor() {
        this.entity = new UserAccount();
    }

    updateUserAccount(data) {
        console.log("UpdateUserAccountController: Processing account update...");
        
        // Call entity's updateAccount method
        return this.entity.updateAccount(data.accountId, data);
    }
}

module.exports = UpdateUserAccountController;

