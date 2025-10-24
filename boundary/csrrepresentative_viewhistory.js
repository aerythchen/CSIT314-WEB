const csrrepresentative_viewhistory = require('../controller/csrrepresentative_viewhistory');

class Csrrepresentative_viewhistoryBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewhistory();
    }

    async handleViewHistory(data) {
        const result = await this.controller.viewHistory(data);
        
        // Add formatted data for frontend
        if (result.success && result.data?.historyItems) {
            result.data.historyItems = result.data.historyItems.map(item => ({
                ...item,
                status: item.requestStatus, // Add status field for frontend compatibility
                formattedDate: new Date(item.matchCreatedAt || item.requestCreatedAt).toLocaleDateString(),
                statusBadge: `bg-${({ 'pending': 'warning', 'assigned': 'info', 'completed': 'success' }[item.requestStatus] || 'secondary')}`,
                urgencyBadge: `bg-${({ 'critical': 'danger', 'high': 'warning', 'medium': 'info', 'low': 'success' }[item.urgency] || 'secondary')}`,
                canComplete: item.requestStatus === 'assigned'
            }));
        }
        
        return result;
    }

    // additional function to complete match
    async handleCompleteMatch(data) {
        const { matchId } = data;
        
        if (!matchId) {
            return {
                success: false,
                error: "Match ID is required",
                data: null
            };
        }
        
        return await this.controller.completeMatch(data);
    }
}

module.exports = Csrrepresentative_viewhistoryBoundary;