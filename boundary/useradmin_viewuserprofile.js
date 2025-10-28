const useradmin_viewuserprofile = require('../controller/useradmin_viewuserprofile');

class Useradmin_viewuserprofileBoundary {
    constructor() {
        this.controller = new useradmin_viewuserprofile();
    }

    async handleViewUserProfile(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'useradmin'
            };
            
            return await this.controller.viewUserProfile(formattedData);
        } catch (error) {
            console.error('Error in handleViewUserProfile boundary:', error);
            return {
                success: false,
                error: 'Failed to view user profile: ' + error.message
            };
        }
    }
}

module.exports = Useradmin_viewuserprofileBoundary;