const SuspendUserProfileController = require('../controller/useradmin_suspenduserprofile');

class SuspendUserProfileBoundary {
    constructor() {
        this.controller = new SuspendUserProfileController();
    }
    onClick() {
        console.log('UseradminSuspenduserprofileBoundary: User clicked action button');
        this.displayForm();
    }

    displaySuspendUserProfileForm() {
        console.log('=== Suspend User Profile ===');
        console.log('Please enter the profile ID to suspend:');
    }

    handleSuspendUserProfile(profileId, reason) {
        console.log('SuspendUserProfileBoundary: Handling suspend user profile request...');
        return this.controller.suspendUserProfile(profileId, reason);
    }

    displaySuspendUserProfileResult(result) {
        if (result.success) {
            console.log('✓ User profile suspended successfully!');
            console.log(`Profile ID: ${result.data.profile.id}`);
            console.log(`Status: ${result.data.profile.status}`);
        } else {
            console.log('✗ Failed to suspend user profile!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = SuspendUserProfileBoundary;
