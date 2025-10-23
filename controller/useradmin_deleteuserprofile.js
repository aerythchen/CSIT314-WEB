const UserProfile = require('../entity/UserProfile');

class DeleteUserProfileController {
    constructor() {
        this.entity = new UserProfile();
    }

    async deleteUserProfile(data) {
        console.log("DeleteUserProfileController: Processing profile deletion...");
        
        // Call entity's deleteProfile method
        return await this.entity.deleteProfile(data.profileId);
    }
}

module.exports = DeleteUserProfileController;

