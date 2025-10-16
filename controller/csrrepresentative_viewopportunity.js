const CSRRepresentative = require('../entity/CSRRepresentative');

class ViewOpportunityController {
    constructor() {
        this.entity = new CSRRepresentative();
        // Entity ready to use
    }

    viewOpportunity(data) {
        const { opportunityId } = data;
        
        if (!opportunityId) {
            return {
                success: false,
                error: "Opportunity ID is required",
                data: null
            };
        }
        
        // Use consolidated entity method directly
        const result = this.entity.viewOpportunity(opportunityId);
        return result;
    }
}

module.exports = ViewOpportunityController;

