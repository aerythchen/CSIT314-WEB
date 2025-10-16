const CSRRepresentative = require('../entity/CSRRepresentative');

class ViewHistoryController {
    constructor() {
        this.entity = new CSRRepresentative();
        // Entity ready to use
    }

    viewHistory(data) {
        const { userId } = data;
        
        console.log(`ViewHistoryController: Fetching all history for user ${userId}...`);
        
        if (!userId) {
            return {
                success: false,
                error: "User ID is required",
                data: []
            };
        }
        
        // Use consolidated entity method directly
        const result = this.entity.viewHistory();
        
        if (!result.success) {
            return {
                success: false,
                error: result.error,
                data: []
            };
        }
        
        return {
            success: true,
            message: 'History retrieved successfully',
            data: result.data,
            count: result.count
        };
    }

    getAllHistory(userId) {
        console.log(`Fetching all history for user ${userId}...`);
        
        if (!userId) {
            return {
                success: false,
                error: "User ID is required",
                data: []
            };
        }
        
        // Use Entity to fetch all history records
        const entityResult = this.entity.process({
            userId: userId,
            fetchAll: true
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                data: []
            };
        }
        
        const historyData = this.entity.getData();
        
        return {
            success: true,
            data: historyData.data.historyRecords,
            count: historyData.data.historyRecords?.length || 0
        };
    }

    processViewHistory(entityResult) {
        console.log("Processing view history request...");
        
        if (!entityResult || !entityResult.success) {
            return {
                success: false,
                error: "History record not found",
                data: null
            };
        }
        
        // Get stored data
        const storedData = this.entity.getData();
        
        console.log("Retrieved history record");
        
        return {
            success: true,
            data: storedData.data.historyRecords?.[0] || storedData.data
        };
    }
}

module.exports = ViewHistoryController;

