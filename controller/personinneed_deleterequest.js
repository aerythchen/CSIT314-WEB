const DeleteRequestEntity = require('../entity/PersonInNeed');

class DeleteRequestController {
    constructor() {
        this.entity = new PersonInNeed();
        this.entity.initialize();
    }

    deleteRequest(data) {
        console.log(`DeleteRequestController: Deleting request ${requestId}...`);
        
        // Validate delete action
        const validationResult = this.validateDeleteAction(requestId, userId);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }
        
        // Process the deletion
        return this.processDeleteAction(requestId, userId);
    }

    validateDeleteAction(requestId, userId) {
        console.log("Validating delete action...");
        
        if (!requestId) {
            return {
                isValid: false,
                error: "Request ID is required"
            };
        }
        
        if (!userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }
        
        return { isValid: true };
    }

    processDeleteAction(requestId, userId) {
        console.log(`Processing deletion of request ${requestId}...`);
        
        // Use Entity to delete request
        const entityResult = this.entity.process({
            requestId: requestId,
            userId: userId
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error
            };
        }
        
        console.log("Request deleted successfully");
        
        return {
            success: true,
            message: "Request deleted successfully",
            requestId: requestId
        };
    }
}

module.exports = DeleteRequestController;

