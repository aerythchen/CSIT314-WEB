const UpdateRequestEntity = require('../entity/personinneed_updaterequest');

class UpdateRequestController {
    constructor() {
        this.entity = new UpdateRequestEntity();
        this.entity.initialize();
    }

    updateRequest(requestId, title, description, status) {
        console.log(`UpdateRequestController: Updating request ${requestId}...`);
        
        // Validate update data
        const validationResult = this.validateRequestUpdate(requestId, title, description, status);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                request: null
            };
        }
        
        // Process the update
        return this.processRequestUpdate(requestId, title, description, status);
    }

    validateRequestUpdate(requestId, title, description, status) {
        console.log("Validating request update...");
        
        // Validate request ID
        if (!requestId) {
            return {
                isValid: false,
                error: "Request ID is required"
            };
        }
        
        // Validate title if provided
        if (title !== undefined && title !== null) {
            if (title.trim() === "") {
                return {
                    isValid: false,
                    error: "Title cannot be empty"
                };
            }
            
            if (title.trim().length < 5) {
                return {
                    isValid: false,
                    error: "Title must be at least 5 characters"
                };
            }
            
            if (title.length > 200) {
                return {
                    isValid: false,
                    error: "Title cannot exceed 200 characters"
                };
            }
        }
        
        // Validate description if provided
        if (description !== undefined && description !== null) {
            if (description.trim().length < 20) {
                return {
                    isValid: false,
                    error: "Description must be at least 20 characters"
                };
            }
        }
        
        // Validate status if provided
        if (status) {
            const validStatuses = ["Pending", "In Progress", "Fulfilled", "Cancelled"];
            if (!validStatuses.includes(status)) {
                return {
                    isValid: false,
                    error: "Invalid status value"
                };
            }
        }
        
        return { isValid: true };
    }

    processRequestUpdate(requestId, title, description, status) {
        console.log("Processing request update...");
        
        // Use Entity to update request
        const entityResult = this.entity.process({
            id: requestId,
            title: title,
            description: description,
            status: status
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                request: null
            };
        }
        
        // Get stored data
        const requestData = this.entity.getData();
        
        console.log("Request updated successfully");
        
        return {
            success: true,
            request: requestData.data,
            message: "Request updated successfully"
        };
    }
}

module.exports = UpdateRequestController;

