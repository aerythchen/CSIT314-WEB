const UserAccount = require('../entity/UserAccount');

class LoginController {
    constructor() {
        this.userAccount = new UserAccount();
    }

    async login(data) {
        const { email, password, userType } = data;
        
        // Controller only orchestrates - all business logic is in the entity
        const result = await this.userAccount.login(email, password, userType);
        return result;
    }
}

module.exports = LoginController;