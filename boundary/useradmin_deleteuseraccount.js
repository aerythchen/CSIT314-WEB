const useradmin_deleteuseraccount = require('../controller/useradmin_deleteuseraccount');

class Useradmin_deleteuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_deleteuseraccount();
    }

    handleDeleteUserAccount(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            ...data,
            userType: 'useradmin'
        };
        
        return this.controller.deleteUserAccount(formattedData);
    }
}

module.exports = Useradmin_deleteuseraccountBoundary;