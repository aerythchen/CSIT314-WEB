const useradmin_searchuserprofile = require('../controller/useradmin_searchuserprofile');

class Useradmin_searchuserprofileBoundary {
    constructor() {
        this.controller = new useradmin_searchuserprofile();
    }

    handleSearchUserProfile(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            ...data,
            userType: 'useradmin'
        };
        
        return this.controller.searchUserProfile(formattedData);
    }
}

module.exports = Useradmin_searchuserprofileBoundary;