const useradmin_updateuserprofile = require('../controller/useradmin_updateuserprofile');

class Useradmin_updateuserprofileBoundary {
    constructor() {
        this.controller = new useradmin_updateuserprofile();
    }

    async handleUpdateUserProfile(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            ...data
        };
        
        return await this.controller.updateUserProfile(formattedData);
    }
}

module.exports = Useradmin_updateuserprofileBoundary;