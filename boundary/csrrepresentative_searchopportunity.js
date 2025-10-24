const csrrepresentative_searchopportunity = require('../controller/csrrepresentative_searchopportunity');

class Csrrepresentative_searchopportunityBoundary {
    constructor() {
        this.controller = new csrrepresentative_searchopportunity();
    }

    async handleSearchOpportunity(data) {
        const result = await this.controller.searchOpportunity(data);
        
        // Add formatted data for frontend
        if (result.success && result.data?.opportunities) {
            result.data.opportunities = result.data.opportunities.map(item => ({
                ...item,
                formattedDate: new Date(item.createdAt).toLocaleDateString(),
                statusBadge: `bg-${({ 'pending': 'warning', 'assigned': 'info', 'completed': 'success' }[item.status] || 'secondary')}`,
                urgencyBadge: `bg-${({ 'critical': 'danger', 'high': 'warning', 'medium': 'info', 'low': 'success' }[item.urgency] || 'secondary')}`,
                canSave: true,
                canAccept: item.status === 'pending'
            }));
        }
        
        return result;
    }
}

module.exports = Csrrepresentative_searchopportunityBoundary;