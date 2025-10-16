const SearchUserAccountController = require('../controller/useradmin_searchuseraccount');

class SearchUserAccountBoundary {
    constructor() {
        this.controller = new SearchUserAccountController();
    }
    onClick() {
        console.log('UseradminSearchuseraccountBoundary: User clicked action button');
        this.displayForm();
    }

    displaySearchUserAccountForm() {
        console.log('=== Search User Account ===');
        console.log('Please enter search criteria:');
    }

    handleSearchUserAccount(searchCriteria) {
        console.log('SearchUserAccountBoundary: Handling search user account request...');
        return this.controller.searchUserAccount(searchCriteria);
    }

    displaySearchUserAccountResult(result) {
        if (result.success) {
            console.log('✓ Search completed successfully!');
            console.log(`Found ${result.data.accounts.length} accounts:`);
            result.data.accounts.forEach(account => {
                console.log(`- ${account.username} (${account.status})`);
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

module.exports = SearchUserAccountBoundary;
