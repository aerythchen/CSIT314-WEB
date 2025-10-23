const useradmin_viewuserprofile = require('../controller/useradmin_viewuserprofile');

class Useradmin_viewuserprofileBoundary {
    constructor() {
        this.controller = new useradmin_viewuserprofile();
    }

    handleViewUserProfile(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            ...data,
            userType: 'useradmin'
        };
        
        return this.controller.viewUserProfile(formattedData);
    }
}

module.exports = Useradmin_viewuserprofileBoundary;