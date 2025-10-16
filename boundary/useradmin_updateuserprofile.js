const UpdateUserProfileController = require('../controller/useradmin_updateuserprofile');

class UpdateUserProfileBoundary {
    constructor() {
        this.controller = new UpdateUserProfileController();
    }
    onClick() {
        console.log('UseradminUpdateuserprofileBoundary: User clicked action button');
        this.displayForm();
    }

    displayUpdateUserProfileForm() {
        console.log('=== Update User Profile ===');
        console.log('Please enter the profile ID and updated details:');
    }

    handleUpdateUserProfile(profileId, updateData) {
        console.log('UpdateUserProfileBoundary: Handling update user profile request...');
        return this.controller.updateUserProfile(profileId, updateData);
    }

    displayUpdateUserProfileResult(result) {
        if (result.success) {
            console.log('✓ User profile updated successfully!');
            console.log(`Profile ID: ${result.data.profile.id}`);
            console.log(`Updated Name: ${result.data.profile.firstName} ${result.data.profile.lastName}`);
        } else {
            console.log('✗ Failed to update user profile!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = UpdateUserProfileBoundary;
