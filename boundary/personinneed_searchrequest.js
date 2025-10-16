const SearchRequestController = require('../controller/personinneed_searchrequest');

class SearchRequestBoundary {
    constructor() {
        this.controller = new SearchRequestController();
    }
    onClick() {
        console.log('PersoninneedSearchrequestBoundary: User clicked action button');
        this.displayForm();
    }

    displaySearchRequestForm() {
        console.log('=== Search Request ===');
        console.log('Please enter search criteria:');
    }

    handleSearchRequest(searchCriteria) {
        console.log('SearchRequestBoundary: Handling search request...');
        return this.controller.searchRequest(searchCriteria);
    }

    displaySearchRequestResult(result) {
        if (result.success) {
            console.log('✓ Search completed successfully!');
            console.log(`Found ${result.data.requests.length} requests:`);
            result.data.requests.forEach(request => {
                console.log(`- ${request.title} (${request.status})`);
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

module.exports = SearchRequestBoundary;
