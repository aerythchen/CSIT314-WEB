const useradmin_searchuseraccount = require('../controller/useradmin_searchuseraccount');

class Useradmin_searchuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_searchuseraccount();
    }

    handleSearchUserAccount(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            ...data,
            userType: 'useradmin'
        };
        
        return this.controller.searchUserAccount(formattedData);
    }
}

module.exports = Useradmin_searchuseraccountBoundary;