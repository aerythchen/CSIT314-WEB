const SearchHistoryController = require('../controller/personinneed_searchhistory');

class SearchHistoryBoundary {
    constructor() {
        this.controller = new SearchHistoryController();
    }
    onClick() {
        console.log('PersoninneedSearchhistoryBoundary: User clicked action button');
        this.displayForm();
    }

    displaySearchHistoryForm() {
        console.log('=== Search History ===');
        console.log('Please enter search criteria for history:');
    }

    handleSearchHistory(searchCriteria) {
        console.log('SearchHistoryBoundary: Handling search history...');
        return this.controller.searchHistory(searchCriteria);
    }

    displaySearchHistoryResult(result) {
        if (result.success) {
            console.log('✓ History search completed successfully!');
            console.log(`Found ${result.data.history.length} history entries:`);
            result.data.history.forEach(entry => {
                console.log(`- ${entry.action} on ${entry.date}`);
            });
        } else {
            console.log('✗ History search failed!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = SearchHistoryBoundary;
