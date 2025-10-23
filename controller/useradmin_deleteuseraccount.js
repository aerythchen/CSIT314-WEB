const UserAccount = require('../entity/UserAccount');

class DeleteUserAccountController {
    constructor() {
        this.entity = new UserAccount();
    }

    async deleteUserAccount(data) {
        console.log("DeleteUserAccountController: Processing account deletion...");
        
        // Call entity's deleteAccount method
        return await this.entity.deleteAccount(data.accountId);
    }
}

module.exports = DeleteUserAccountController;

