const ViewOpportunityEntity = require('../entity/csrrepresentative_viewopportunity');

class ViewOpportunityController {
    constructor() {
        this.entity = new ViewOpportunityEntity();
        this.entity.initialize();
    }

    viewOpportunity(opportunityId) {
        console.log(`ViewOpportunityController: Fetching opportunity ${opportunityId}...`);
        
        if (!opportunityId) {
            return {
                success: false,
                error: "Opportunity ID is required",
                data: null
            };
        }
        
        // Use Entity to fetch and track view
        const entityResult = this.entity.process({ opportunityId: opportunityId });
        
        return this.processViewRequest(entityResult);
    }

    getAllOpportunities() {
        console.log("Fetching all available opportunities...");
        
        // Use Entity to fetch all opportunities
        const entityResult = this.entity.process({ fetchAll: true });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                data: []
            };
        }
        
        const opportunitiesData = this.entity.getData();
        
        return {
            success: true,
            data: opportunitiesData.data,
            count: opportunitiesData.data?.length || 0
        };
    }

    processViewRequest(entityResult) {
        console.log("Processing view request...");
        
        if (!entityResult || !entityResult.success) {
            return {
                success: false,
                error: "Opportunity not found",
                data: null
            };
        }
        
        // Get stored data from entity
        const storedData = this.entity.getData();
        
        console.log("Opportunity viewed");
        
        return {
            success: true,
            data: storedData.data
        };
    }
}

module.exports = ViewOpportunityController;

