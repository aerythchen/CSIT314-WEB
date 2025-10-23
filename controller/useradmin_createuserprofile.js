const UserProfile = require('../entity/UserProfile');

class CreateUserProfileController {
    constructor() {
        this.entity = new UserProfile();
    }

    async createUserProfile(data) {
        console.log("CreateUserProfileController: Processing profile creation...");
        
        // Call entity's createProfile method
        return await this.entity.createProfile(data);
    }

}

module.exports = CreateUserProfileController;

