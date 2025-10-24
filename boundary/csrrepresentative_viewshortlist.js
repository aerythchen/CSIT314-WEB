const csrrepresentative_viewshortlist = require('../controller/csrrepresentative_viewshortlist');

class Csrrepresentative_viewshortlistBoundary {
    constructor() {
        this.controller = new csrrepresentative_viewshortlist();
    }

    async handleViewShortlist(data) {
        const result = await this.controller.viewShortlist(data);
        
        // If successful and has shortlist items, render view
        if (result.success && result.data && result.data.shortlistItems) {
            return {
                success: true,
                renderView: 'csrrepresentative/shortlist_results',
                viewData: {
                    shortlistItems: result.data.shortlistItems,
                    success: result.message,
                    error: null,
                    viewAll: true,
                    searchTerm: '',
                    category: '',
                    urgency: ''
                }
            };
        }
        
        return result;
    }
}

module.exports = Csrrepresentative_viewshortlistBoundary;