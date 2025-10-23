const UserAccount = require('../entity/UserAccount');

class CreateUserAccountController {
    constructor() {
        this.entity = new UserAccount();
    }

    async createUserAccount(data) {
        console.log("CreateUserAccountController: Processing account creation...");
        
        // Call entity's createAccount method
        return await this.entity.createAccount(data);
    }

}

module.exports = CreateUserAccountController;

