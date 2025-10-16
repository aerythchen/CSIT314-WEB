const { db } = require('../database');

class UpdateRequestEntity {
    constructor() {
        this.request = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("UpdateRequestEntity: Initializing...");
        this.request = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("UpdateRequestEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.requestId || typeof data.requestId !== 'string') {
            return { isValid: false, error: "Valid request ID is required" };
        }

        if (!data.title && !data.description && !data.location && !data.urgency && !data.categoryId) {
            return { isValid: false, error: "At least one field must be provided for update" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("UpdateRequestEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if request exists
        const existing = db.findById('requests', data.requestId);
        if (!existing || existing.isDeleted) {
            return {
                success: false,
                error: "Request not found"
            };
        }

        // Only allow update if request is in pending status
        if (existing.status !== 'pending') {
            return {
                success: false,
                error: `Cannot update request with status '${existing.status}'`
            };
        }

        // Check if user owns this request
        if (data.userId && existing.createdBy !== data.userId) {
            return {
                success: false,
                error: "You can only update your own requests"
            };
        }

        // Prepare update object
        const updateData = {};
        if (data.title) updateData.title = data.title;
        if (data.description) updateData.description = data.description;
        if (data.location) updateData.location = data.location;
        if (data.urgency) updateData.urgency = data.urgency;
        
        if (data.categoryId) {
            const category = db.findById('categories', data.categoryId);
            if (!category || category.isDeleted) {
                return {
                    success: false,
                    error: "Category not found"
                };
            }
            updateData.categoryId = data.categoryId;
            updateData.categoryName = category.name;
        }
        
        updateData.updatedBy = data.userId || existing.createdBy;

        // Update request in database
        const result = db.update('requests', data.requestId, updateData);

        if (!result.success) {
            return result;
        }

        this.request = result.data;

        console.log("Request updated successfully");
        return {
            success: true,
            message: "Request updated",
            data: {
                id: this.request.id,
                title: this.request.title,
                updatedAt: this.request.updatedAt
            }
        };
    }

    getData() {
        console.log("UpdateRequestEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.request
        };
    }
}

module.exports = UpdateRequestEntity;
