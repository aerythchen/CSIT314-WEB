const UserProfile = require('../entity/UserProfile');

class ViewUserProfileController {
    constructor() {
        this.entity = new UserProfile();
    }

    viewUserProfile(data) {
        console.log("ViewUserProfileController: Processing view profile request...");
        
        // Get all profiles using searchProfiles method
        return this.entity.searchProfiles(null, null, null);
    }
}

module.exports = ViewUserProfileController;

