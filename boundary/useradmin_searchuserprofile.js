const useradmin_searchuserprofile = require('../controller/useradmin_searchuserprofile');

class Useradmin_searchuserprofileBoundary {
    constructor() {
        this.controller = new useradmin_searchuserprofile();
    }

    async handleSearchUserProfile(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data
                // Don't override userType - use what's passed from frontend
            };
            
            return await this.controller.searchUserProfile(formattedData);
        } catch (error) {
            console.error('Error in handleSearchUserProfile boundary:', error);
            return {
                success: false,
                error: 'Failed to search user profiles: ' + error.message
            };
        }
    }
}

module.exports = Useradmin_searchuserprofileBoundary;