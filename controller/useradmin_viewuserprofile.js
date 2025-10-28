const UserProfile = require('../entity/UserProfile');

class ViewUserProfileController {
    constructor() {
        this.entity = new UserProfile();
    }

    async viewUserProfile(data) {
        console.log("ViewUserProfileController: Processing view profile request...");
        
        // Get specific profile by ID
        return await this.entity.getUserProfile(data.profileId);
    }
}

module.exports = ViewUserProfileController;

