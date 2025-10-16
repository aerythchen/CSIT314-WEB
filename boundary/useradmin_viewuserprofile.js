const ViewUserProfileController = require('../controller/useradmin_viewuserprofile');

class ViewUserProfileBoundary {
    constructor() {
        this.controller = new ViewUserProfileController();
    }
    onClick() {
        console.log('UseradminViewuserprofileBoundary: User clicked action button');
        this.displayForm();
    }

    displayViewUserProfileForm() {
        console.log('=== View User Profile ===');
        console.log('Please enter the profile ID to view:');
    }

    handleViewUserProfile(profileId) {
        console.log('ViewUserProfileBoundary: Handling view user profile request...');
        return this.controller.viewUserProfile(profileId);
    }

    displayViewUserProfileResult(result) {
        if (result.success) {
            console.log('✓ User profile retrieved successfully!');
            console.log(`Profile ID: ${result.data.profile.id}`);
            console.log(`Name: ${result.data.profile.firstName} ${result.data.profile.lastName}`);
            console.log(`Email: ${result.data.profile.email}`);
            console.log(`User Type: ${result.data.profile.userType}`);
            console.log(`Status: ${result.data.profile.status}`);
        } else {
            console.log('✗ Failed to retrieve user profile!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ViewUserProfileBoundary;
