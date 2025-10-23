const useradmin_viewuseraccount = require('../controller/useradmin_viewuseraccount');

class Useradmin_viewuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_viewuseraccount();
    }

    handleViewUserAccount(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            ...data,
            userType: 'useradmin'
        };
        
        return this.controller.viewUserAccount(formattedData);
    }
}

module.exports = Useradmin_viewuseraccountBoundary;