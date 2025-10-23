const useradmin_updateuseraccount = require('../controller/useradmin_updateuseraccount');

class Useradmin_updateuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_updateuseraccount();
    }

    handleUpdateUserAccount(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            ...data,
            userType: 'useradmin'
        };
        
        return this.controller.updateUserAccount(formattedData);
    }
}

module.exports = Useradmin_updateuseraccountBoundary;