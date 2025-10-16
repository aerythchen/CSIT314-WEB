const ViewHistoryEntity = require('../entity/PersonInNeed');

class ViewHistoryController {
    constructor() {
        this.entity = new PersonInNeed();
        this.entity.initialize();
    }

    viewHistory(data) {
        console.log(`ViewHistoryController: Fetching history record ${historyId}...`);
        
        if (!historyId) {
            return {
                success: false,
                error: "History ID is required",
                data: null
            };
        }
        
        // Use Entity to fetch single history record
        const entityResult = this.entity.process({
            historyId: historyId,
            userId: userId,
            fetchSingle: true
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                data: null
            };
        }
        
        return this.processViewHistory(entityResult);
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

