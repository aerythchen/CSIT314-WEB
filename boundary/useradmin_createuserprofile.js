const CreateUserProfileController = require('../controller/useradmin_createuserprofile');

class CreateUserProfileBoundary {
    constructor() {
        this.controller = new CreateUserProfileController();
    }
    onClick() {
        console.log('UseradminCreateuserprofileBoundary: User clicked action button');
        this.displayForm();
    }

    displayCreateUserProfileForm() {
        console.log('=== Create User Profile ===');
        console.log('Please enter the user profile details:');
    }

    handleCreateUserProfile(profileData) {
        console.log('CreateUserProfileBoundary: Handling create user profile request...');
        return this.controller.createUserProfile(profileData);
    }

    displayCreateUserProfileResult(result) {
        if (result.success) {
            console.log('✓ User profile created successfully!');
            console.log(`Profile ID: ${result.data.profile.id}`);
            console.log(`Name: ${result.data.profile.firstName} ${result.data.profile.lastName}`);
        } else {
            console.log('✗ Failed to create user profile!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = CreateUserProfileBoundary;
