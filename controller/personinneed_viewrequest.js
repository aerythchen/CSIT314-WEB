const ViewRequestEntity = require('../entity/PersonInNeed');

class ViewRequestController {
    constructor() {
        this.entity = new PersonInNeed();
        this.entity.initialize();
    }

    viewRequest(data) {
        console.log(`ViewRequestController: Fetching request ${requestId}...`);
        
        if (!requestId) {
            return {
                success: false,
                error: "Request ID is required",
                data: null
            };
        }
        
        // Use Entity to fetch and track view
        const entityResult = this.entity.process({ requestId: requestId });
        
        return this.processViewRequest(entityResult);
    }

    getAllRequests(userId) {
        console.log(`Fetching all requests for user ${userId}...`);
        
        if (!userId) {
            return {
                success: false,
                error: "User ID is required",
                data: []
            };
        }
        
        // Use Entity to fetch all user requests
        const entityResult = this.entity.process({ userId: userId, fetchAll: true });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                data: []
            };
        }
        
        const requestsData = this.entity.getData();
        
        return {
            success: true,
            data: requestsData.data,
            count: requestsData.data?.length || 0
        };
    }

    processViewRequest(requestData) {
        console.log("Processing view request...");
        
        if (!requestData || !requestData.success) {
            return {
                success: false,
                error: "Request not found",
                data: null
            };
        }
        
        // Get stored data from entity
        const storedData = this.entity.getData();
        
        console.log(`Request "${requestData.data?.title}" viewed`);
        
        return {
            success: true,
            data: storedData.data
        };
    }
}

module.exports = ViewRequestController;

