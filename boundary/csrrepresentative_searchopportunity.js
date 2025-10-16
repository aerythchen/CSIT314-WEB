const SearchOpportunityController = require('../controller/csrrepresentative_searchopportunity');

class SearchOpportunityBoundary {
    constructor() {
        this.controller = new SearchOpportunityController();
    }
    onClick() {
        console.log('CsrrepresentativeSearchopportunityBoundary: User clicked action button');
        this.displayForm();
    }

    displaySearchOpportunityForm() {
        console.log('=== Search Opportunity ===');
        console.log('Please enter search criteria for opportunities:');
    }

    handleSearchOpportunity(searchCriteria) {
        console.log('SearchOpportunityBoundary: Handling search opportunity...');
        return this.controller.searchOpportunity(searchCriteria);
    }

    displaySearchOpportunityResult(result) {
        if (result.success) {
            console.log('✓ Search completed successfully!');
            console.log(`Found ${result.data.opportunities.length} opportunities:`);
            result.data.opportunities.forEach(opportunity => {
                console.log(`- ${opportunity.title} (${opportunity.category})`);
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

module.exports = SearchOpportunityBoundary;
