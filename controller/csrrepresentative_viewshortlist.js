const ViewShortlistEntity = require('../entity/csrrepresentative_viewshortlist');

class ViewShortlistController {
    constructor() {
        this.entity = new ViewShortlistEntity();
        this.entity.initialize();
    }

    viewShortlist(userId) {
        console.log(`ViewShortlistController: Fetching shortlist for user ${userId}...`);
        
        if (!userId) {
            return {
                success: false,
                error: "User ID is required",
                data: []
            };
        }
        
        // Get all shortlist items for the user
        const shortlistItems = this.getAllShortlistItems(userId);
        
        // Process the view request
        return this.processViewShortlist(shortlistItems);
    }

    getAllShortlistItems(userId) {
        console.log(`Fetching all shortlist items for user ${userId}...`);
        
        // Use Entity to fetch shortlist items
        const entityResult = this.entity.process({ userId: userId, fetchAll: true });
        
        if (!entityResult.success) {
            return [];
        }
        
        const shortlistData = this.entity.getData();
        return shortlistData.data.shortlistItems || [];
    }

    processViewShortlist(shortlistItems) {
        console.log("Processing shortlist view request...");
        
        if (!shortlistItems || shortlistItems.length === 0) {
            console.log("No items in shortlist");
            return {
                success: true,
                data: [],
                count: 0,
                message: "Your shortlist is empty"
            };
        }
        
        // Use Entity to store shortlist data
        const entityResult = this.entity.process({
            userId: shortlistItems[0]?.userId,
            items: shortlistItems
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                data: []
            };
        }
        
        // Get stored data
        const shortlistData = this.entity.getData();
        
        console.log(`Retrieved ${shortlistItems.length} shortlist item(s)`);
        
        return {
            success: true,
            data: shortlistData.data.shortlistItems,
            count: shortlistData.data.totalItems
        };
    }
}

module.exports = ViewShortlistController;

