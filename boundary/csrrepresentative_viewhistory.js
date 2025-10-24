const csrrepresentative_viewhistory = require('../controller/csrrepresentative_viewhistory');

class Csrrepresentative_viewhistoryBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewhistory();
    }

    async handleViewHistory(data) {
        const result = await this.controller.viewHistory(data);
        
        // If successful and has history items, render view
        if (result.success && result.data && result.data.historyItems) {
            return {
                success: true,
                renderView: 'csrrepresentative/history_results',
                viewData: {
                    historyItems: result.data.historyItems,
                    success: result.message,
                    error: null,
                    viewAll: true,
                    searchTerm: '',
                    category: '',
                    urgency: '',
                    status: ''
                }
            };
        }
        
        return result;
    }

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