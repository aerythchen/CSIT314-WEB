const SearchUserProfileController = require('../controller/useradmin_searchuserprofile');

class SearchUserProfileBoundary {
    constructor() {
        this.controller = new SearchUserProfileController();
    }
    onClick() {
        console.log('UseradminSearchuserprofileBoundary: User clicked action button');
        this.displayForm();
    }

    displaySearchUserProfileForm() {
        console.log('=== Search User Profile ===');
        console.log('Please enter search criteria:');
    }

    handleSearchUserProfile(searchCriteria) {
        console.log('SearchUserProfileBoundary: Handling search user profile request...');
        return this.controller.searchUserProfile(searchCriteria);
    }

    displaySearchUserProfileResult(result) {
        if (result.success) {
            console.log('✓ Search completed successfully!');
            console.log(`Found ${result.data.profiles.length} profiles:`);
            result.data.profiles.forEach(profile => {
                console.log(`- ${profile.firstName} ${profile.lastName} (${profile.email}) - ${profile.userType}`);
            });
        } else {
            console.log('✗ Search failed!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = SearchUserProfileBoundary;
