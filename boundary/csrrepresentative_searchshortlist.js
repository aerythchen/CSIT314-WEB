const SearchShortlistController = require('../controller/csrrepresentative_searchshortlist');

class SearchShortlistBoundary {
    constructor() {
        this.controller = new SearchShortlistController();
    }
    onClick() {
        console.log('CsrrepresentativeSearchshortlistBoundary: User clicked action button');
        this.displayForm();
    }

    displaySearchShortlistForm() {
        console.log('=== Search Shortlist ===');
        console.log('Please enter search criteria for shortlist:');
    }

    handleSearchShortlist(searchCriteria) {
        console.log('SearchShortlistBoundary: Handling search shortlist...');
        return this.controller.searchShortlist(searchCriteria);
    }

    displaySearchShortlistResult(result) {
        if (result.success) {
            console.log('✓ Shortlist search completed successfully!');
            console.log(`Found ${result.data.shortlist.length} shortlist entries:`);
            result.data.shortlist.forEach(entry => {
                console.log(`- ${entry.opportunityTitle} (${entry.category})`);
            });
        } else {
            console.log('✗ Shortlist search failed!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = SearchShortlistBoundary;
