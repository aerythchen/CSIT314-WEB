const UserAccount = require('../entity/UserAccount');

class LogoutController {
    constructor() {
        this.userAccount = new UserAccount();
    }

    async logout(data) {
        const { userId, sessionToken } = data;
        
        // Controller only orchestrates - all business logic is in the entity
        const result = await this.userAccount.logout(userId, sessionToken);
        return result;
    }
}

module.exports = LogoutController;