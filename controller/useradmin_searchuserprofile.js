const UserProfile = require('../entity/UserProfile');

class SearchUserProfileController {
    constructor() {
        this.entity = new UserProfile();
    }

    async searchUserProfile(data) {
        console.log("SearchUserProfileController: Processing search request...");
        
        // Call entity's searchProfiles method
        return await this.entity.searchProfiles(data.searchTerm, data.userType, data.status);
    }
}

module.exports = SearchUserProfileController;

