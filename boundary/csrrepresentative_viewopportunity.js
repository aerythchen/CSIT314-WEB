const ViewOpportunityController = require('../controller/csrrepresentative_viewopportunity');

class ViewOpportunityBoundary {
    constructor() {
        this.controller = new ViewOpportunityController();
    }
    onClick() {
        console.log('CsrrepresentativeViewopportunityBoundary: User clicked action button');
        this.displayForm();
    }

    displayViewOpportunityForm() {
        console.log('=== View Opportunity ===');
        console.log('Please enter the opportunity ID to view:');
    }

    handleViewOpportunity(opportunityId) {
        console.log('ViewOpportunityBoundary: Handling view opportunity...');
        return this.controller.viewOpportunity(opportunityId);
    }

    displayViewOpportunityResult(result) {
        if (result.success) {
            console.log('✓ Opportunity retrieved successfully!');
            console.log(`Opportunity ID: ${result.data.opportunity.id}`);
            console.log(`Title: ${result.data.opportunity.title}`);
            console.log(`Category: ${result.data.opportunity.category}`);
        } else {
            console.log('✗ Failed to retrieve opportunity!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ViewOpportunityBoundary;
