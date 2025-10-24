const csrrepresentative_viewshortlist = require('../controller/csrrepresentative_viewshortlist');

class Csrrepresentative_viewshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewshortlist();
    }

    async handleViewShortlist(data) {
        const result = await this.controller.viewShortlist(data);
        
        // Add formatted data for frontend
        if (result.success && result.data?.shortlistItems) {
            result.data.shortlistItems = result.data.shortlistItems.map(item => ({
                ...item,
                formattedDate: new Date(item.createdAt).toLocaleDateString(),
                statusBadge: `bg-${({ 'pending': 'warning', 'assigned': 'info', 'completed': 'success' }[item.status] || 'secondary')}`,
                urgencyBadge: `bg-${({ 'critical': 'danger', 'high': 'warning', 'medium': 'info', 'low': 'success' }[item.urgency] || 'secondary')}`
            }));
        }
        
        return result;
    }
}

module.exports = Csrrepresentative_viewshortlistBoundary;